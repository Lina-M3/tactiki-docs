---
sidebar_position: 1
title: Start Here
description: Your living notebook for the Tactiki CPIT499 project.
---

# Tactiki — Development Notebook

> هذا الموقع **دفتر ملاحظات تقني حي** لمشروع Tactiki: ماذا بنينا؟ لماذا؟ أين الكود؟ كيف اختبرناه؟ وما الذي يجب تذكره وقت المناقشة؟

Tactiki is an AI-powered decision-support system for university football coaches. The project uses a shared application repository and this separate documentation repository.

## Repository map

Application:

```text
Lina-M3/tactiki
├── AGENTS.md
├── backend/
└── frontend/
```

Documentation:

```text
Lina-M3/tactiki-docs
```

## Current backend stack

| Layer | Technology |
|---|---|
| API | FastAPI |
| Server | Uvicorn |
| ORM | SQLAlchemy |
| Local DB | SQLite |
| Validation | Pydantic |
| Auth | JWT + HTTPBearer |
| Passwords | Passlib + bcrypt |
| AI/ML | scikit-learn + NumPy + SciPy |
| Tests | pytest + httpx |
| API testing | Swagger UI |
| Source control | Git + GitHub |

## Current project status

```text
Backend foundation ✅
Authentication/JWT ✅
Team CRUD ✅
Player CRUD ✅
Automatic OverallScore ✅
Automatic PlayerProgress ✅
Player historical deactivation rule ✅ verified
Lineup CRUD ✅
Exactly 11-player Lineup rule ✅
Formation required ✅
Cosine Similarity Substitute Recommendation ✅
38 automated tests ✅
K-Means Position Analysis ⏭️ NEXT
Genetic Algorithm Optimized Lineup ⬜
Frontend integration ⬜
Deployment ⬜
```

## Current request flow

```text
Frontend / Swagger
      ↓
FastAPI Router
      ↓
Auth + ownership dependencies
      ↓
Service/business logic
      ↓
SQLAlchemy
      ↓
SQLite
      ↓
Pydantic response
      ↓
JSON
```

The AI features add a service layer so algorithm logic is not mixed into HTTP routing.

## Authentication flow

```text
Login
→ verify Coach password
→ create JWT
→ return access token

Protected request
→ Bearer token
→ decode JWT
→ current Coach
→ ownership check
→ feature logic
```

## Substitute recommendation flow

```text
Unavailable player
→ six-skill vector
→ active same-team candidates
→ candidate vectors
→ Cosine Similarity
→ descending ranking
→ explainable reasons
→ response
```

Endpoint:

```text
POST /teams/{team_id}/recommendations/substitute
```

The recommendation operation is read-only and does not change player or lineup records.

## Strong Swagger demo now

```text
POST /auth/login
Authorize
GET  /auth/me
GET  /teams
GET  /teams/{team_id}/players
PATCH /teams/{team_id}/players/{player_id}
GET  /teams/{team_id}/players/{player_id}/progress
POST /teams/{team_id}/lineups
GET  /teams/{team_id}/lineups
POST /teams/{team_id}/recommendations/substitute
```

This demonstrates authentication, ownership, CRUD, performance history, tactical history, and the first implemented AI feature.

## Key design choices

### OverallScore

Current implementation averages the six skill ratings and rounds to two decimals. The report describes a calculated score but does not define the exact formula.

### Player deletion

No saved LineupPlayer history → hard delete.

Saved lineup history → preserve record and set `is_active = False`.

This behavior has now been verified with real saved lineup history.

### Saved Lineup

A final saved lineup currently requires exactly 11 players and a non-empty formation.

### Substitute recommendation

The selected unavailable player can be inactive. Substitute candidates must be active players from the same owned team. The algorithm uses all six skills, not `overall_score`, and does not silently impose a same-position restriction.

## Current stopping point

> **Next: define and implement K-Means Position Analysis carefully, especially the K value and the mapping between anonymous K-Means cluster IDs and football-role names.**
