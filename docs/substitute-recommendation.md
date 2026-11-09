---
sidebar_position: 1
title: Substitute Recommendation
---

# Substitute Recommendation — Cosine Similarity

This page documents Tactiki's first completed AI feature: **finding substitute players using Cosine Similarity**.

## Status

```text
Implementation ✅
Automated tests ✅ 38 passed
Swagger real-data verification ✅
Pull Request #3 ✅ merged into main
```

## What problem does it solve?

The coach selects an unavailable player.

Tactiki then asks:

> Which active teammate has the most similar **shape of strengths and weaknesses** across the six recorded skills?

The answer is produced with **Cosine Similarity**.

## Canonical player vector

Each player is converted to the same six-dimensional vector:

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

Example:

```text
Player A
Speed      90
Passing    86
Shooting   90
Defending  80
Stamina    91
Dribbling  84

Vector A =
[90, 86, 90, 80, 91, 84]
```

`overall_score` is not used instead of the six-dimensional vector.

## Visual intuition

![Cosine Similarity vector angle](/tactiki-docs/img/ai/cosine-vector-angle.svg)

Cosine Similarity is based on the **angle between two vectors**.

Conceptually:

```text
similarity(A, B) = cos(angle between A and B)
```

The full mathematical form is:

```text
                  A · B
similarity = ----------------
             ||A|| × ||B||
```

Where:

- `A · B` is the dot product.
- `||A||` is the magnitude of player A's vector.
- `||B||` is the magnitude of player B's vector.

### Interpretation

For the non-negative skill data used in Tactiki:

```text
score close to 1
→ very similar skill-profile direction

lower score
→ less similar balance of strengths
```

## Why direction matters

Consider a simplified two-skill example:

```text
Player A = [2, 1]
Player B = [4, 2]
```

Player B has larger numbers, but both vectors have the same proportion:

```text
2 : 1
4 : 2
```

Their directions are identical, so Cosine Similarity is:

```text
1.0
```

This demonstrates an important point:

> A Cosine score of 1 does **not** necessarily mean the raw skill numbers are identical. It means the vectors point in the same direction and therefore have the same relative profile shape.

That is useful for Tactiki because the goal is to find a substitute whose **balance of abilities** resembles the unavailable player.

## Runtime flow

![Tactiki Cosine Similarity recommendation flow](/tactiki-docs/img/ai/cosine-tactiki-flow.svg)

Endpoint:

```http
POST /teams/{team_id}/recommendations/substitute
```

Request:

```json
{
  "player_id": 2
}
```

Flow:

```text
authenticated coach
→ verify team ownership
→ load unavailable player
→ build target six-skill vector
→ load active same-team candidates
→ exclude selected player
→ validate candidate vectors
→ cosine_similarity(target, candidates)
→ rank descending
→ generate deterministic reasons
→ return response
```

## Candidate eligibility

The selected unavailable player:

```text
may be active or inactive
```

Candidate substitutes must:

```text
belong to the same team
be active
not be the selected player
have complete finite skill values
```

There is intentionally **no same-position filter** in the current implementation because the source requirement did not define one.

## Actual implementation

Tactiki uses:

```python
from sklearn.metrics.pairwise import cosine_similarity
```

The service calculates the similarity between the target vector and every eligible candidate vector.

Then results are sorted by:

```text
1. similarity_score descending
2. player_id ascending when rounded scores tie
```

Scores are rounded to six decimal places for the API.

## Why some test scores were almost 1

During development we created synthetic Test Players whose skills increased together in a very similar pattern.

For example, conceptually:

```text
Player 1 = [71, 73, 69, 66, 76, 72]
Player 2 = [72, 74, 70, 67, 77, 73]
Player 3 = [73, 75, 71, 68, 78, 74]
```

Their raw values differ, but the **shape** of each profile is almost the same.

So scores such as:

```text
1.000000
0.999999
0.999998
```

are expected.

This is not evidence that every real football player will have a near-perfect similarity score. Real, more diverse profiles should produce clearer differences.

## Recommendation reason

Cosine Similarity gives the ranking score, but a number alone is difficult for a coach to explain.

Tactiki adds a deterministic explanation.

For a target and one candidate, the service calculates the absolute difference for each skill:

```text
|target speed - candidate speed|
|target passing - candidate passing|
|target shooting - candidate shooting|
|target defending - candidate defending|
|target stamina - candidate stamina|
|target dribbling - candidate dribbling|
```

The two smallest differences are used in the reason.

Example:

```text
Closest skill matches are in passing and stamina.
```

This explanation is generated from data only.

No generative AI model writes the reason.

## Example response

```json
{
  "selected_player_id": 2,
  "selected_player_name": "Test Player 01",
  "recommendations": [
    {
      "player_id": 3,
      "player_name": "Test Player 02",
      "position": "RB",
      "overall_score": 72.17,
      "similarity_score": 1.0,
      "recommendation_reason": "Closest skill matches are in speed and passing."
    }
  ],
  "message": "Substitute recommendations generated successfully."
}
```

If no eligible candidate exists:

```text
HTTP success
recommendations = []
clear no-substitute message
```

## Cosine Similarity vs K-Means

They solve different problems.

| Question | Cosine Similarity | K-Means Position Analysis |
|---|---|---|
| Main question | Who resembles this unavailable player? | Which reference role profile is this outfield player closest to? |
| Input | One target + active candidates | One player + fixed FIFA centroids |
| Output | Ranked substitute list | Recommended role |
| Runtime reference | Other team players | FIFA 23 centroids |
| Main distance idea | Vector angle | Euclidean distance to centroid |

## Read-only behavior

Generating recommendations does not modify:

```text
Coach
Team
Player
PlayerProgress
Lineup
LineupPlayer
```

Automated testing records SQL statements during the request and confirms that only `SELECT` operations occur.

## Code structure

```text
backend/app/
├── routers/
│   └── recommendation.py
├── schemas/
│   └── recommendation.py
└── services/
    └── recommendations.py

backend/tests/
├── conftest.py
└── test_recommendations.py
```

Responsibilities:

- Router → authentication, ownership, data retrieval, HTTP errors.
- Schema → request/response contract.
- Service → vector validation, similarity, ranking, reasons.
- Tests → security, algorithm correctness, determinism, read-only behavior.

## Automated verification

Coverage includes:

```text
Authentication ✅
Invalid token ✅
Team ownership ✅
Cross-team protection ✅
Inactive target allowed ✅
Inactive candidates excluded ✅
Selected player excluded ✅
Canonical vector order ✅
Known cosine calculation ✅
Descending ranking ✅
Stable rounded ties ✅
Invalid candidate exclusion ✅
Invalid target validation ✅
Zero-vector behavior ✅
Empty candidate result ✅
Response schema ✅
No database mutation ✅
Backend/OpenAPI smoke test ✅
```

Final feature-specific baseline:

```text
38 tests passed
```

These tests continue to pass as later AI features are added.

## Defense explanation

Short version:

> We represent the unavailable player and eligible teammates as six-dimensional skill vectors. Cosine Similarity compares the direction of those vectors, so it measures how similar the balance of skills is. We rank active teammates by that score and add a deterministic explanation using the two closest skill values.

### Important defense distinction

Do not say:

> Cosine checks which player has the same total score.

Instead say:

> Cosine checks similarity in the shape or direction of the six-skill profile.

That distinction is the reason this method is useful for substitute matching.
