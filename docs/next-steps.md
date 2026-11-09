---
sidebar_position: 13
title: Roadmap & Next Steps
---

# Roadmap & Next Steps

This page separates what is **finished**, what is currently **next**, and what remains for final delivery.

## Phase 1 — Backend foundation ✅

```text
FastAPI ✅
Uvicorn ✅
SQLite ✅
SQLAlchemy ✅
Pydantic ✅
Swagger/OpenAPI ✅
Monorepo backend structure ✅
```

## Phase 2 — Authentication & authorization ✅

```text
Signup ✅
Password hashing ✅
Login ✅
JWT creation/validation ✅
Token expiration ✅
GET /auth/me ✅
Swagger Authorize ✅
Coach/team ownership protection ✅
```

## Phase 3 — Team management ✅

```text
Create/List/Read/Update/Delete ✅
Duplicate-name prevention ✅
Coach ownership checks ✅
```

## Phase 4 — Player management & progress ✅

```text
Player CRUD ✅
Duplicate-name prevention ✅
Automatic OverallScore ✅
Automatic PlayerProgress ✅
Progress-history endpoint ✅
Delete without history → permanent delete ✅
Delete with Lineup history → deactivate ✅ verified
Historical lineup data preserved ✅ verified
```

OverallScore currently uses:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

## Phase 5 — Saved Lineups & rules ✅

```text
Lineup schemas ✅
Create/List/Read/Update/Delete ✅
LineupPlayer assignments ✅
Assigned position per lineup ✅
Owned-team validation ✅
Same-team validation ✅
Active-player validation ✅
Duplicate player prevention ✅
Exactly 11 players ✅
Non-empty formation ✅
11-player Swagger success test ✅
```

Still future tactical detail, only when explicitly required by the final design:

```text
[ ] Final formation catalogue
[ ] Detailed position-count validation
[ ] Goalkeeper-specific rule if finalized
[ ] Decide archive/edit policy for historical lineups
```

## Phase 6 — GitHub collaboration ✅ ongoing

Main application repository:

```text
Lina-M3/tactiki
```

Completed workflow:

```text
Private monorepo ✅
backend/ + frontend/ structure ✅
Root .gitignore ✅
Feature branches ✅
Pull Requests ✅
Lineup CRUD PR merged ✅
Lineup rules PR merged ✅
Substitute recommendation PR merged ✅
AGENTS.md repository rules ✅
```

## Phase 7 — Intelligence features 🧠

### 7.1 Substitute recommendation — Cosine Similarity ✅

Endpoint:

```text
POST /teams/{team_id}/recommendations/substitute
```

Completed:

```text
Canonical six-skill vectors ✅
Active same-team candidates ✅
Unavailable/inactive target supported ✅
Cosine Similarity ✅
Descending deterministic ranking ✅
Explainable recommendation reasons ✅
Incomplete-data handling ✅
Read-only behavior ✅
38 automated tests ✅
Real Swagger verification ✅
PR #3 merged into main ✅
```

See **Substitute Recommendation** for the implementation details.

### 7.2 Position analysis — K-Means ⏭️ NEXT

The Final Report requires K-Means to classify player skill profiles into suitable positional roles.

Report-supported facts:

```text
Uses all six skill attributes
Unsupervised K-Means clustering
Small university rosters around 15–30 players
Clusters correspond to football-role profiles
Examples in the report: Attacker, Midfielder, Defender
```

Before implementation we must explicitly define the parts the report leaves ambiguous:

```text
K value
How cluster IDs map to human-readable roles
Whether only active players are analyzed
Minimum number of complete players
Whether analysis is read-only or persisted
How Goalkeeper is handled
Whether feature scaling is used
API response contract
```

We should not invent these silently.

### 7.3 Optimized lineup generation — Genetic Algorithm ⬜

Final goal:

```text
Available candidate players
+ selected formation
→ Genetic Algorithm
→ optimized Starting XI
→ Synergy Score
→ recommendation reason
→ save Lineup + LineupPlayer
```

Before coding we still need the final fitness/constraint definition.

## Phase 8 — Frontend integration ⬜ / parallel

```text
[ ] Confirm frontend framework
[ ] Add frontend API base URL
[ ] Configure FastAPI CORS
[ ] Connect login/JWT
[ ] Teams UI
[ ] Players UI
[ ] Progress charts
[ ] Saved Lineups UI
[ ] Substitute Recommendation UI
[ ] Position Analysis UI
[ ] Optimized Lineup UI
```

## Phase 9 — Validation & testing 🟡

Already added:

```text
pytest ✅
httpx/TestClient ✅
Isolated in-memory test database ✅
Recommendation security/algorithm tests ✅
Backend/OpenAPI smoke tests ✅
38 tests passing ✅
```

Still needed:

```text
[ ] Broader tests for existing CRUD
[ ] Pydantic ranges for skill values
[ ] Positive height/weight validation
[ ] Transaction rollback hardening
[ ] K-Means tests
[ ] Genetic Algorithm tests
[ ] Frontend integration tests
```

## Phase 10 — Database & deployment ⬜

```text
[ ] Production database decision
[ ] Migration strategy if required
[ ] Backend deployment
[ ] Frontend deployment
[ ] Production environment variables
[ ] Production CORS
[ ] HTTPS/API URL
[ ] End-to-end testing
```

## Phase 11 — Final project preparation ⬜

```text
[ ] Synchronize final report with implemented system
[ ] Architecture/sequence/class diagram review
[ ] Final demo scenario
[ ] Defense questions
[ ] Screenshots/results
[ ] README setup instructions
[ ] Final repository cleanup
[ ] Final documentation review
```

## Immediate next actions

```text
1. Define K-Means requirements precisely from the final report
2. Implement Position Analysis on a dedicated branch
3. Test + Swagger verify + PR/merge K-Means
4. Define Genetic Algorithm fitness and tactical constraints
5. Implement optimized lineup generation
6. Integrate frontend in parallel
7. Broaden tests and deploy
8. Final report/demo/defense preparation
```

:::warning
A report algorithm name is not considered complete until its actual endpoint/service behavior is implemented, tested, and merged.
:::
