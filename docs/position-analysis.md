---
sidebar_position: 2
title: Position Analysis
---

# Position Analysis — FIFA 23 Reference K-Means

This page documents Tactiki's second AI feature: **player role analysis using a fixed FIFA 23 K-Means reference model**.

:::info Current integration status
The revised FIFA-reference implementation is **implemented, tested, committed, and pushed** on `backend/position-analysis`.

The earlier roster-relative K-Means version was merged in PR #4. The newer FIFA-reference revision was committed afterward, so it still requires a follow-up PR before it becomes part of `main`.
:::

## Why the design changed

The first implementation fitted K-Means again on the players of each university team.

That worked technically, but it meant the meaning of a role was **relative to the current roster**:

```text
Team A players → fit K-Means → Team A centroids
Team B players → fit K-Means → Team B centroids
```

So the same player profile could theoretically receive a different role after moving to another team because the centroids themselves changed.

The revised design fixes that.

```text
FIFA 23 reference data
→ train K-Means once
→ save fixed centroids
→ classify university players against those same centroids
```

The result is **roster-independent classification**.

## Training architecture

![FIFA 23 reference K-Means training](/tactiki-docs/img/ai/kmeans-training-reference.svg)

Training is offline. Runtime API requests never need the large FIFA CSV.

### Training data

Local input:

```text
backend/data/raw/fifa23_male_players_legacy.csv
```

The raw file is intentionally ignored by Git.

The training script:

```text
backend/scripts/train_position_reference.py
```

The real training run used:

```text
16,467 valid FIFA 23 outfield player profiles
```

### FIFA → Tactiki feature mapping

| Tactiki feature | FIFA 23 column |
|---|---|
| speed | pace |
| passing | passing |
| shooting | shooting |
| defending | defending |
| stamina | power_stamina |
| dribbling | dribbling |

The runtime order remains the canonical Tactiki order:

```text
[
  speed,
  passing,
  shooting,
  defending,
  stamina,
  dribbling
]
```

### K-Means configuration

```python
KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)
```

The model learns **three anonymous centroids**.

K-Means itself does not know that a cluster means Defender, Attacker, or Midfielder.

## Learned FIFA reference centroids

The current artifact contains these learned profiles:

| Cluster | Role | Speed | Passing | Shooting | Defending | Stamina | Dribbling |
|---|---|---:|---:|---:|---:|---:|---:|
| 0 | Defender | 61.517935 | 49.305873 | 36.415451 | 60.865589 | 63.429050 | 52.993693 |
| 1 | Attacker | 72.658096 | 56.968089 | 62.079139 | 32.234500 | 62.160649 | 65.931984 |
| 2 | Midfielder | 70.169910 | 65.047893 | 57.840413 | 62.658318 | 75.282450 | 68.108309 |

The tracked runtime artifact is:

```text
backend/app/data/position_reference.json
```

It contains centroids and metadata, not the raw training dataset.

## How anonymous clusters become football roles

Raw K-Means output is only:

```text
cluster 0
cluster 1
cluster 2
```

Those numbers have no built-in football meaning.

Tactiki calculates a role score for each centroid.

### Attacker score

```text
mean(speed, shooting, dribbling)
```

### Midfielder score

```text
mean(passing, stamina, dribbling)
```

### Defender score

```text
mean(defending, stamina, speed)
```

There are only three clusters and three roles, so Tactiki evaluates all:

```text
3! = 6
```

one-to-one assignments and chooses the assignment with the highest total role score.

This is **global mapping**, not greedy mapping.

:::warning Implementation decision
The Final Report states that K-Means clusters correspond to roles such as Attacker, Midfielder, and Defender, but it does not define the exact mathematical formula for naming anonymous clusters.

The centroid role-score formulas above are therefore a documented Tactiki implementation decision.
:::

## Runtime classification

Endpoint:

```http
POST /teams/{team_id}/analysis/positions
```

![Runtime player classification and goalkeeper handling](/tactiki-docs/img/ai/kmeans-runtime-gk.svg)

At runtime the API does **not** call `fit()` on team players.

For every valid outfield player:

```text
player six-skill vector
→ calculate Euclidean distance to each fixed FIFA centroid
→ choose nearest centroid
→ return mapped football role
```

Conceptually:

```text
distance(player, Defender centroid)
distance(player, Attacker centroid)
distance(player, Midfielder centroid)

smallest distance → recommended role
```

This is equivalent to the nearest-center prediction step used by K-Means.

## What roster-independent means

Suppose one university player has:

```text
speed      = 90
passing    = 70
shooting   = 92
defending  = 35
stamina    = 80
dribbling  = 88
```

In the old roster-relative design:

```text
player + Team A → Team A centroids → result
player + Team B → Team B centroids → possibly different result
```

In the final reference design:

```text
player → same fixed FIFA centroids → same result
```

The teammates no longer move the reference points.

That means the recommended role describes the player's profile relative to a **fixed external reference**, not merely relative to whoever happens to be in the current squad.

## Goalkeeper handling

Goalkeepers are intentionally **outside the outfield K-Means model**.

Why?

The six current Tactiki skills are:

```text
speed
passing
shooting
defending
stamina
dribbling
```

They do not contain specialist goalkeeper measures such as diving, handling, reflexes, or goalkeeper positioning.

Therefore:

```text
position == GK / Goalkeeper
→ recommended_role = Goalkeeper
→ cluster_id = null
→ do not compare to outfield centroids
```

We do **not** add a fourth K-Means cluster.

Adding `K=4` without goalkeeper-specific features would only force the algorithm to create a fourth mathematical group; it would not guarantee that the group represents real goalkeeper ability.

## Runtime response

Conceptually:

```json
{
  "team_id": 1,
  "k": 3,
  "players": [
    {
      "player_id": 2,
      "player_name": "Goalkeeper",
      "current_position": "GK",
      "is_active": true,
      "cluster_id": null,
      "recommended_role": "Goalkeeper"
    },
    {
      "player_id": 7,
      "player_name": "Outfield Player",
      "current_position": "CM",
      "is_active": true,
      "cluster_id": 2,
      "recommended_role": "Midfielder"
    }
  ],
  "clusters": [],
  "excluded_player_ids": [],
  "message": "..."
}
```

The actual response also includes the three fixed reference cluster centroids.

## Active vs inactive players

Position Analysis is about a player's skill profile, not match availability.

Therefore both:

```text
is_active = true
is_active = false
```

may be analyzed.

This differs from Substitute Recommendation, where substitute **candidates** must be active.

## Invalid outfield data

For a non-goalkeeper, all six required skills must be complete and finite.

Invalid outfield profiles are excluded and their IDs are returned in:

```text
excluded_player_ids
```

Because training is already complete, runtime no longer needs:

```text
3 players minimum
3 distinct team vectors minimum
```

Even one valid outfield university player can be classified against the fixed FIFA reference.

## Read-only behavior

Position Analysis does not overwrite:

```text
Player.position
Player.is_active
Player skills
OverallScore
PlayerProgress
Team
Lineup
LineupPlayer
```

The result is a recommendation/analysis only.

Tests verify that runtime analysis issues only `SELECT` statements and that database records remain unchanged.

## Determinism

The system is designed so identical inputs and the same reference artifact produce identical output.

Training uses:

```text
random_state = 42
n_init = 10
```

Runtime also uses deterministic nearest-centroid classification.

Distance ties choose the lowest cluster ID.

## Testing status

The revised feature passed:

```text
102 backend tests ✅
38 existing Cosine Similarity tests still pass ✅
reverse-order suite ✅
startup/OpenAPI smoke tests ✅
synthetic training-pipeline tests ✅
real FIFA-reference smoke check ✅
git diff --check ✅
```

Tests validate training without requiring the real large CSV by creating small synthetic temporary FIFA-style CSV files.

## Code structure

```text
backend/
├── app/
│   ├── data/
│   │   └── position_reference.json
│   ├── routers/
│   │   └── position_analysis.py
│   ├── schemas/
│   │   └── position_analysis.py
│   └── services/
│       └── position_analysis.py
├── scripts/
│   └── train_position_reference.py
└── tests/
    └── test_position_analysis.py
```

## Defense explanation

A concise explanation:

> We train K-Means offline on FIFA 23 outfield profiles using six mapped skill dimensions. The training produces three fixed centroids. At runtime, a university outfield player's skill vector is assigned to the nearest fixed centroid, so the classification does not depend on the current team roster. Goalkeepers are handled separately because our current outfield feature vector does not contain goalkeeper-specific attributes.

## Important limitation

This system produces **skill-profile role recommendations**, not validated professional scouting predictions.

The current implementation assumes the FIFA and Tactiki skill values are comparable on their rating scales.

Goalkeeper quality is not evaluated; goalkeepers are recognized as a separate role only.
