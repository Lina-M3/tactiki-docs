---
sidebar_position: 11
title: Progress Log
---

# Progress Log

Use this page when we need to remember **exactly where development stopped**.

## Backend status

| Area | Status | Notes |
|---|---|---|
| FastAPI / Uvicorn | ✅ | Backend starts successfully |
| SQLite / SQLAlchemy | ✅ | Local development persistence |
| Authentication | ✅ | Signup, login, JWT, `/auth/me` |
| Authorization | ✅ | Coach ownership checks |
| Team CRUD | ✅ | Complete |
| Player CRUD | ✅ | Complete |
| OverallScore | ✅ | Six-skill average |
| PlayerProgress | ✅ | Automatic history |
| Player delete history | ✅ Verified | Saved-lineup player becomes inactive instead of hard-deleted |
| Lineup CRUD | ✅ | Complete |
| Exactly 11 players | ✅ Verified | Final saved lineup rule |
| Formation required | ✅ Verified | Empty formation rejected |
| Substitute Recommendation | ✅ | Cosine Similarity feature |
| Recommendation tests | ✅ | 38 tests passing |
| K-Means Position Analysis | ⏭️ Next | Requirements being finalized |
| Genetic Algorithm | ⬜ | After K-Means |
| Frontend integration | ⬜ | Parallel/future work |

## Repository status

```text
Repository: Lina-M3/tactiki
main: current stable code
AGENTS.md: AI/repository implementation rules
```

Merged feature work:

```text
PR #1 — Lineup CRUD ✅
PR #2 — Lineup rules ✅
PR #3 — Substitute Recommendation ✅
```

## Current AI stack

```text
Python 3.13
scikit-learn 1.9.1
NumPy 2.5.4
SciPy 1.18.1
pytest 9.2.0
httpx 0.28.1
```

## Implemented AI Feature 1

Endpoint:

```text
POST /teams/{team_id}/recommendations/substitute
```

Flow:

```text
JWT current coach
→ verify owned team
→ load selected unavailable player
→ load active same-team candidates
→ exclude selected player
→ validate six-skill vectors
→ cosine_similarity()
→ round similarity
→ deterministic descending ranking
→ generate data-derived reason
→ JSON response
```

Canonical vector:

```text
[speed, passing, shooting, defending, stamina, dribbling]
```

Important behavior:

```text
Selected target may be inactive ✅
Candidate must be active ✅
No same-position restriction ✅
No database mutation ✅
Incomplete candidates are excluded ✅
Incomplete selected-player skills → 400 ✅
No candidates → empty successful result ✅
```

Real Swagger test was completed successfully using local Test Player data.

## Automated testing

Recommendation work introduced isolated tests using an in-memory test database rather than `tactiki.db`.

Final run:

```text
38 passed
```

Coverage includes authentication, ownership, filtering, cosine math, stable ranking, response schema, read-only SQL behavior, and startup/OpenAPI smoke checks.

## Current stopping point

> **Core backend CRUD, final 11-player saved-lineup validation, player-history preservation, and Cosine Similarity substitute recommendations are complete. The next AI feature is K-Means Position Analysis.**

## Next checklist

```text
[x] Authentication + JWT
[x] Team CRUD
[x] Player CRUD
[x] OverallScore
[x] PlayerProgress
[x] Lineup CRUD
[x] Exactly 11 saved-lineup rule
[x] Player deactivation with real lineup history
[x] Cosine Similarity substitute recommendations
[x] Automated recommendation tests
[x] PR #3 merged into main
[ ] Define K-Means contract and role mapping
[ ] Implement K-Means Position Analysis
[ ] Add K-Means automated tests
[ ] Swagger verify K-Means
[ ] Define Genetic Algorithm fitness/constraints
[ ] Implement Genetic Algorithm
[ ] Frontend API integration
[ ] Deployment
[ ] Final report/demo/defense sync
```
