---
sidebar_position: 3
title: Optimized Lineup
---

# Optimized Lineup — Genetic Algorithm

This page documents Tactiki's third AI feature: **generating and saving an optimized Starting XI using a Genetic Algorithm**.

## Status

```text
Implementation ✅
Dynamic formations ✅
Exactly-one-GK rule ✅
Synergy Score ✅
Atomic database save ✅
Swagger real-data verification ✅
195 backend tests ✅
30-player benchmark: 1.271s ✅
PR #6 ✅ merged into main
```

## What problem does the GA solve?

A university squad may contain 15–30 players.

The coach selects a pool of available players and chooses a tactical formation.

Tactiki must then decide:

```text
Which 11 players should start?
+
Which tactical slot should each player occupy?
```

For larger pools, the number of possible lineups and assignments grows quickly.

The Genetic Algorithm searches this space efficiently rather than checking every possible combination exhaustively.

## Endpoint

```http
POST /teams/{team_id}/lineups/generate
```

Example request:

```json
{
  "formation": "4-2-3-1",
  "player_ids": [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12
  ]
}
```

The authenticated coach comes from JWT.

No coach ID is trusted from the request.

## Eligible player pool

Every selected player must:

```text
belong to the requested team
belong to the authenticated coach's team
be explicitly selected
be active
have complete six-skill data
have finite ratings
have ratings within 0–100
```

Selected IDs must be unique.

Invalid selected players are rejected rather than silently removed.

The coach must select at least 11 valid players.

## Dynamic formation parser

The backend does **not** use a fixed formation whitelist.

A formation string describes the ten outfield players.

Goalkeeper is implicit.

Valid examples:

```text
4-3-3
4-4-2
3-5-2
4-2-3-1
4-1-4-1
4-3-2-1
4-1-2-1-2
3-4-3
3-4-2-1
3-2-4-1
3-1-4-2
5-3-2
5-4-1
5-2-3
4-2-4
2-3-5
```

The examples are not a whitelist.

A valid formation must:

```text
contain 3–5 tactical bands
contain positive integers only
use hyphens between bands
sum to exactly 10 outfield players
```

Examples:

```text
4-3-3       → 10 → valid
4-2-3-1     → 10 → valid
4-1-2-1-2   → 10 → valid

4-4-3       → 11 → invalid
4-3         → only 2 bands → invalid
4-0-6       → zero band → invalid
1-4-3-3     → goalkeeper incorrectly included → invalid
```

## Formation → chromosome

![Dynamic formation to chromosome](/tactiki-docs/img/ai/ga-chromosome-formation.svg)

For `4-2-3-1`, Tactiki generates:

```text
GK

DEF band:
DEF-1
DEF-2
DEF-3
DEF-4

MID band 1:
MID1-1
MID1-2

MID band 2:
MID2-1
MID2-2
MID2-3

ATT band:
ATT-1
```

The chromosome is an ordered list of exactly 11 unique player IDs.

Conceptually:

```text
[
  GK,
  DEF-1, DEF-2, DEF-3, DEF-4,
  MID1-1, MID1-2,
  MID2-1, MID2-2, MID2-3,
  ATT-1
]
```

The chromosome therefore represents both:

```text
Starting XI selection
+
player-to-slot assignment
```

If exactly 11 players are selected, the GA optimizes assignment.

If more than 11 are selected, the GA optimizes both selection and assignment.

## Goalkeeper rule

Every generated Starting XI must contain:

```text
exactly 1 goalkeeper
```

Recognized stored positions:

```text
GK
Goalkeeper
```

Matching is trimmed and case-insensitive.

Goalkeepers:

```text
may occupy only the GK chromosome slot
must never occupy outfield slots
```

Outfield players:

```text
must never occupy the GK slot
```

If multiple goalkeepers are selected, the GA may choose one.

If no eligible goalkeeper is selected, generation is rejected.

## Why stored Player.position is not a hard outfield constraint

For outfield slots, Tactiki does not force:

```text
stored position = assigned tactical role
```

Instead, the GA evaluates the player's actual skill profile.

This allows the system to discover that a player stored as one position may fit another tactical role better based on the six recorded skills.

This is intentional.

## Role-fit formulas

The following formulas are documented Tactiki implementation decisions.

### Defender Fit

```text
DefenderFit =
mean(
  defending,
  stamina,
  speed
)
```

### Midfielder Fit

```text
MidfielderFit =
mean(
  passing,
  stamina,
  dribbling
)
```

### Attacker Fit

```text
AttackerFit =
mean(
  speed,
  shooting,
  dribbling
)
```

For formation interpretation:

```text
first band → Defender Fit
last band → Attacker Fit
all intermediate bands → Midfielder Fit
```

Separate intermediate bands are preserved even though they currently use the same Midfielder formula.

This leaves room for future DM / CM / AM refinements without redesigning the chromosome.

## Synergy Score

![Synergy Score breakdown](/tactiki-docs/img/ai/ga-synergy-score.svg)

The Final Report requires a Synergy Score but does not define its exact formula.

Tactiki therefore uses the following explainable implementation:

```text
Synergy Score =
0.50 × Positional Fit
+
0.30 × Overall Quality
+
0.20 × Balance Score
```

All public score components are on a 0–100 scale.

### Positional Fit — 50%

For the ten outfield slots:

```text
DEF slot → Defender Fit
MID slot → Midfielder Fit
ATT slot → Attacker Fit
```

Then:

```text
PositionalFit =
average of all 10 outfield role-fit scores
```

Goalkeeper is excluded because Tactiki currently lacks specialist goalkeeper attributes.

### Overall Quality — 30%

For each of the 11 starters:

```text
PlayerOverall =
mean(
  speed,
  passing,
  shooting,
  defending,
  stamina,
  dribbling
)
```

Then:

```text
OverallQuality =
average PlayerOverall across the Starting XI
```

Goalkeeper is included here.

### Team Balance — 20%

Calculate:

```text
DefenseStrength =
average DefenderFit of assigned defenders

MidfieldStrength =
average MidfielderFit of all assigned midfield players

AttackStrength =
average AttackerFit of assigned attackers
```

Then:

```text
BalanceScore =
100 - (
  max(DefenseStrength, MidfieldStrength, AttackStrength)
  -
  min(DefenseStrength, MidfieldStrength, AttackStrength)
)
```

A smaller difference between the three units produces a higher balance score.

## Example real Swagger result

For a real development test using `4-2-3-1`:

```text
Synergy Score      82.82
Positional Fit     79.30
Overall Quality    77.50
Balance Score      99.58

Defense Strength   79.25
Midfield Strength  79.27
Attack Strength    79.67
```

The system selected 11 starters from 12 submitted players and saved the result.

## Genetic Algorithm cycle

![Genetic Algorithm evolution cycle](/tactiki-docs/img/ai/ga-evolution-cycle.svg)

Tactiki uses DEAP.

Configuration:

| Setting | Value |
|---|---:|
| Population | 100 |
| Generations | 100 |
| Random seed | 42 |
| Selection | Tournament |
| Tournament size | 3 |
| Crossover | Uniform |
| Crossover probability | 0.8 |
| Mutation probability | 0.2 |
| Elitism | Best 2 |

These values are implementation decisions.

## Initial population

Tactiki creates valid candidate chromosomes.

Every individual must already respect:

```text
11 unique players
1 goalkeeper
goalkeeper in GK slot
selected players only
active same-team players only
correct formation slot count
```

## Fitness evaluation

Each chromosome receives its Synergy Score.

Higher score means the lineup has:

```text
better role fit
stronger overall player quality
better attack/midfield/defense balance
```

The GA maximizes this score.

## Tournament selection

Small groups of individuals are compared.

The stronger individual from each tournament is more likely to reproduce.

This gives better solutions more influence without immediately eliminating all diversity.

## Uniform crossover

Two parent chromosomes exchange genes.

Because crossover can create duplicate player IDs, Tactiki performs deterministic repair afterward.

Repair restores:

```text
uniqueness
selected-pool membership
GK/outfield separation
valid chromosome structure
```

## Slot-aware mutation

Outfield mutation may:

```text
swap two outfield genes
OR
replace one outfield gene with an unused selected outfield player
```

GK mutation may replace the goalkeeper only with another eligible goalkeeper.

Mutation must preserve all hard constraints.

## Elitism

The best two individuals survive unchanged into the next generation.

This prevents the strongest solutions from being lost accidentally through crossover or mutation.

## Determinism

Tactiki uses seed 42.

The implementation isolates DEAP randomness so one GA request does not modify Python's global random state.

Tests verify:

```text
same request + same database state
→ same result
```

Repeated imports and test-order changes are also covered.

## Invalid chromosomes

Invalid individuals include:

```text
duplicate players
wrong chromosome length
zero or multiple goalkeepers
GK in outfield slot
outfield player in GK slot
unselected player
inactive player
cross-team player
wrong formation slot count
```

Invalid lineups are never saved.

## Atomic database save

A successful generated result creates:

```text
1 Lineup
+
11 LineupPlayer records
```

The existing schema is reused.

No new database columns were added.

Stored:

```text
Lineup:
team_id
formation

LineupPlayer:
lineup_id
player_id
assigned_position
```

The immediate API response additionally returns:

```text
synergy_score
score_breakdown
recommendation_reason
```

These are not persisted as new columns.

If any database saving step fails:

```text
rollback
→ no partial generated lineup remains
```

## Recommendation reason

The explanation is deterministic and data-derived.

Example:

```text
Optimized for 4-2-3-1 with positional fit 79.30,
overall quality 77.50, and balanced unit strengths:
defense 79.25, midfield 79.27, attack 79.67.
```

No generative AI model writes the reason.

## Response shape

Conceptually:

```json
{
  "lineup_id": 5,
  "team_id": 1,
  "formation": "4-2-3-1",
  "synergy_score": 82.82,
  "score_breakdown": {
    "positional_fit": 79.3,
    "overall_quality": 77.5,
    "balance_score": 99.58,
    "defense_strength": 79.25,
    "midfield_strength": 79.27,
    "attack_strength": 79.67
  },
  "recommendation_reason": "Optimized for 4-2-3-1 ...",
  "players": [
    {
      "player_id": 2,
      "player_name": "Test Player 01",
      "current_position": "GK",
      "assigned_position": "GK"
    }
  ],
  "message": "Optimized lineup generated and saved successfully."
}
```

Players are returned in formation-slot order.

## Testing status

Final merged validation:

```text
86 GA feature tests ✅
7 Lineup PATCH regression tests ✅
195 full backend tests ✅
195 reversed-order tests ✅
startup/OpenAPI/CRUD smoke tests ✅
Cosine Similarity regressions ✅
FIFA-reference K-Means regressions ✅
git diff --check ✅
```

## Performance

Separate 30-player endpoint benchmark:

```text
1.271 seconds
```

Project target:

```text
under 5 seconds
```

The development benchmark therefore passed comfortably.

## Code structure

```text
backend/app/
├── routers/
│   └── lineup_generation.py
├── schemas/
│   └── lineup_generation.py
└── services/
    └── lineup_optimizer.py

backend/scripts/
└── benchmark_lineup_generation.py

backend/tests/
├── test_lineup_crud.py
├── test_lineup_generation.py
└── test_lineup_optimizer.py
```

## Related PATCH fix

During final GA regression testing, an older Lineup PATCH bug was discovered.

Previously, a players-only PATCH could attempt:

```text
None.strip()
```

when formation was omitted.

The fix ensures:

```text
formation omitted → preserve existing formation
valid formation supplied → update it
blank formation supplied → 400
players-only PATCH → works
formation-only PATCH → works
combined PATCH → works
```

Seven isolated regression tests cover this behavior.

## Defense explanation

A concise explanation:

> Tactiki represents a candidate Starting XI as an ordered 11-player chromosome tied to formation slots. The Genetic Algorithm evaluates each lineup with an explainable Synergy Score based on positional fit, overall player quality, and balance between defense, midfield, and attack. Selection, crossover, mutation, repair, and elitism evolve the population over 100 generations. The best valid lineup is then saved atomically.

## Important limitations

The current Synergy Score is an explainable heuristic, not a scientifically validated real-world chemistry model.

Goalkeeper quality is not evaluated using specialist goalkeeper metrics because the current data model does not contain attributes such as diving, handling, reflexes, or goalkeeper positioning.

Stored outfield positions are not hard constraints. Skill-based assignment is intentional and may produce surprising assignments when synthetic player skill profiles are very similar.
