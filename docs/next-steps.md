---
sidebar_position: 13
title: Roadmap & Next Steps
---

# Roadmap & Next Steps

This page separates what is **finished**, what needs **verification/hardening**, and what is still **future work**.

## Phase 1 — Backend foundation ✅

```text
FastAPI app ✅
Uvicorn ✅
SQLite ✅
SQLAlchemy ✅
Pydantic schemas ✅
Project structure ✅
Swagger testing workflow ✅
```

## Phase 2 — Authentication & authorization ✅

```text
Coach signup ✅
Password hashing ✅
Duplicate-email protection ✅
Login/password verification ✅
JWT creation ✅
JWT validation ✅
Token expiration ✅
get_current_coach() ✅
GET /auth/me ✅
Swagger Authorize 🔒 ✅
Ownership checks ✅
```

## Phase 3 — Team management ✅

```text
Create team ✅
List current coach teams ✅
Read one team ✅
Update team ✅
Delete team ✅
Duplicate-name prevention ✅
Coach ownership protection ✅
```

## Phase 4 — Player management & progress ✅

```text
Create player ✅
List team players ✅
Read one player ✅
Update player ✅
Delete/deactivate logic ✅ implemented
Duplicate player-name prevention ✅
Automatic OverallScore ✅
Automatic PlayerProgress history ✅
GET progress history ✅
```

Current OverallScore implementation:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

This is an implementation decision because the report describes a calculated score but does not define the exact formula.

## Phase 5 — Saved Lineups ✅ basic CRUD

```text
Lineup schemas ✅
Lineup router ✅
POST create lineup ✅
GET list lineups ✅
GET one lineup ✅
PATCH lineup ✅
DELETE lineup ✅
LineupPlayer assignments ✅
Assigned position per saved lineup ✅
Owned-team validation ✅
Same-team player validation ✅
Inactive-player rejection ✅
Duplicate player_id prevention ✅
```

Basic API CRUD is complete and verified in Swagger.

### Still needed around Lineups

```text
[ ] Test player deactivation with real saved LineupPlayer history
[ ] Decide final rule for exactly 11 starters
[ ] Validate goalkeeper requirement if required
[ ] Validate formation / position counts
[ ] Decide allowed formation catalogue
[ ] Decide whether archived lineups should be immutable or editable
```

During early API verification, smaller lineups were intentionally allowed so we could validate the database relationships before enforcing tactical rules.

## Phase 6 — GitHub collaboration ✅ foundation / 🟡 ongoing

Main code repository:

```text
Lina-M3/tactiki
```

Structure:

```text
backend/
frontend/
```

Completed:

```text
Private repo ✅
Teammate invited ✅
Root .gitignore ✅
Backend initial push ✅
Feature-branch workflow ✅
```

Immediate Git task:

```text
[ ] Commit current Lineup code on backend/lineup-api
[ ] Push branch
[ ] Review/open Pull Request
[ ] Merge stable Lineup work into main
```

Frontend teammate should work in `frontend/...` branches after accepting the repository invitation.

## Phase 7 — Intelligence features ⬜

This is the major next backend/product stage.

### 7.1 Substitute recommendation

Roadmap algorithm:

```text
Cosine Similarity
```

Likely player feature vector:

```text
[speed, passing, shooting, defending, stamina, dribbling]
```

Before implementation we still need to define:

```text
which player is being replaced?
should position be mandatory?
which players are eligible?
how many recommendations?
how is similarity shown/explained?
```

### 7.2 Position / player profile analysis

Roadmap includes:

```text
K-Means clustering
```

Potential goal: group similar player skill profiles and support role/position analysis.

We should not implement this blindly; first define the dataset, feature scaling, cluster meaning, and how the result is used in the application.

### 7.3 Optimized lineup generation

Roadmap includes:

```text
Genetic Algorithm
```

Before coding, define:

```text
formation constraints
starter count
position eligibility
fitness function
OverallScore / skill weights
inactive-player exclusion
whether previous lineups affect fitness
```

Output should eventually be saveable through the Lineup/LineupPlayer structure already implemented.

## Phase 8 — Frontend integration ⬜

The frontend and backend do **not** connect because they share a repository; they connect through HTTP requests.

Planned work:

```text
[ ] Confirm teammate's frontend framework/tools
[ ] Create frontend folder/project in shared repo
[ ] Agree API service structure
[ ] Add frontend .env API base URL
[ ] Configure FastAPI CORS
[ ] Connect login to POST /auth/login
[ ] Handle JWT on protected requests
[ ] Team screens
[ ] Player screens
[ ] Progress visualization
[ ] Saved Lineup screens
[ ] AI lineup/recommendation screens
```

During development, each teammate can run the backend locally from the shared repository. Later, a deployed backend can provide one shared API URL.

## Phase 9 — Validation, testing & hardening ⬜

Current manual Swagger testing is strong for development, but the project still needs broader quality work:

```text
[ ] Pydantic ranges for skill values
[ ] Validate positive height/weight
[ ] Validate non-empty trimmed names/positions
[ ] Better transaction rollback on failures
[ ] Automated API tests
[ ] Authentication edge-case tests
[ ] Cross-coach authorization tests
[ ] Lineup constraint tests
[ ] AI algorithm tests/evaluation
[ ] Frontend integration tests
```

## Phase 10 — Database & deployment ⬜

Before final delivery:

```text
[ ] Decide production database
[ ] Add migration strategy (for example Alembic) if needed
[ ] Deploy backend
[ ] Deploy frontend
[ ] Secure production environment variables
[ ] Configure production CORS
[ ] Confirm HTTPS/API URL
[ ] Final end-to-end testing
```

## Phase 11 — Final project preparation ⬜

```text
[ ] Update report to match final implementation
[ ] Final architecture diagrams
[ ] Final class/data diagrams if changed
[ ] API/demo scenario
[ ] Defense questions
[ ] Screenshots/results
[ ] README setup instructions
[ ] Clean GitHub repositories
[ ] Final documentation-site review
```

## Immediate next actions

The recommended order from our current checkpoint is:

```text
1. Save Lineup work to Git branch / PR
2. Verify delete-player deactivation with real lineup history
3. Finalize tactical Lineup rules
4. Define substitute recommendation requirements
5. Implement/evaluate Cosine Similarity feature
6. Define AI lineup fitness/constraints
7. Implement Genetic Algorithm generation
8. Coordinate frontend API integration in parallel
9. Add automated tests + deployment
10. Final report/demo/defense preparation
```

:::warning Keep implementation and roadmap separate
Only mark a feature ✅ after it has actually been coded and tested. Algorithm names from the project plan are not the same thing as a finished AI feature.
:::
