---
sidebar_position: 1
title: Substitute Recommendation
---

# Substitute Recommendation — Cosine Similarity

This page documents the first completed AI feature in Tactiki.

## Status

```text
Implementation ✅
Automated tests ✅ 38 passed
Swagger real-data verification ✅
Pull Request #3 ✅ merged into main
```

## Requirement

The feature follows the Final Report UC-10 **Find Substitute Player**.

The coach selects an unavailable player. Tactiki compares that player's skill profile with eligible active teammates and returns a ranked list of substitute recommendations.

## Endpoint

```http
POST /teams/{team_id}/recommendations/substitute
```

Request:

```json
{
  "player_id": 2
}
```

The coach identity is taken from the JWT. The request does not accept a coach ID.

## Security and eligibility

Before generating recommendations, the API verifies:

```text
Authenticated coach
→ owns requested team
→ selected player belongs to that team
→ candidate belongs to same team
→ candidate is active
→ candidate is not the selected player
→ candidate has complete finite skill data
```

The selected unavailable player may itself be inactive. This is intentional because the feature is specifically designed to replace an unavailable player.

## Canonical skill vector

All AI features use the same six stored skill attributes:

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

`overall_score` is not used as a replacement for this vector.

## Cosine Similarity

Implementation:

```python
from sklearn.metrics.pairwise import cosine_similarity
```

The service compares the selected player's vector against every eligible candidate vector.

A score closer to `1` means the shape of the skill profiles is more similar.

API scores are rounded to six decimal places.

## Ranking

Recommendations are sorted by:

```text
1. similarity_score descending
2. player_id ascending for deterministic ties
```

This makes identical inputs produce stable output.

## Recommendation reason

The reason is deterministic and based only on player data.

For every candidate, the service finds the two skills with the smallest absolute differences from the selected player.

Example:

```text
Closest skill matches are in passing and stamina.
```

No generative AI model is used to write the reason.

## Response shape

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

If there are no eligible substitutes, the API returns a successful response with an empty `recommendations` list and a clear message.

## Code structure

```text
backend/app/
├── routers/
│   └── recommendation.py
├── schemas/
│   └── recommendation.py
└── services/
    ├── __init__.py
    └── recommendations.py

backend/tests/
├── conftest.py
└── test_recommendations.py
```

Responsibilities:

- Router: authentication, ownership, database retrieval, HTTP errors.
- Schema: request/response contract.
- Service: vector validation, cosine similarity, ranking, reasons.
- Tests: isolated API and algorithm verification.

## Read-only behavior

Generating substitute recommendations does **not** modify:

```text
Coach
Team
Player
PlayerProgress
Lineup
LineupPlayer
```

An automated test records SQL statements during the recommendation request and verifies that only `SELECT` statements are issued.

## Automated verification

The test suite covers:

```text
Authentication ✅
Invalid token ✅
Team ownership ✅
Cross-team player protection ✅
Inactive target allowed ✅
Inactive candidates excluded ✅
Selected player excluded ✅
Canonical vector ✅
Known cosine values ✅
Descending ranking ✅
Stable rounded ties ✅
Incomplete candidate exclusion ✅
Incomplete target validation ✅
Zero-vector behavior ✅
Empty candidate result ✅
Response schema ✅
No database mutation ✅
Backend/OpenAPI smoke test ✅
```

Final result:

```text
38 passed
```

Tests use an isolated in-memory database and never touch the developer's real `tactiki.db`.

## Important implementation decisions

These were implementation decisions where the report did not specify an exact API-level rule:

- Return all eligible candidates; the frontend can later choose how many to display.
- Do not require the candidate to have the same stored position.
- Round similarity to six decimals.
- Break rounded similarity ties by `player_id`.
- Generate reasons from the two closest skill values.
- Reject incomplete/non-finite selected-player skills.
- Exclude incomplete/non-finite candidates.
- Follow scikit-learn behavior for zero vectors.

## Defense summary

A concise explanation:

> Tactiki converts the unavailable player and active teammates into six-dimensional skill vectors. It uses Cosine Similarity to measure profile similarity, sorts candidates from most similar to least similar, and gives an explainable reason based on the closest skill attributes. The operation is protected by JWT ownership checks and is read-only.
