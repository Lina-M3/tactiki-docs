---
sidebar_position: 1
title: Start Here
description: Your living notebook for the Tactiki CPIT499 project.
---

# Tactiki — Development Notebook

> هذا الموقع **دفتر ملاحظات تقني حي** لمشروع Tactiki: ماذا بنينا؟ لماذا؟ أين الكود؟ كيف اختبرناه؟ وما الذي يجب تذكره وقت المناقشة؟

Tactiki is an AI-powered decision-support system for university football coaches.

## Current project status

```text
Backend foundation ✅
Authentication/JWT ✅
Team CRUD ✅
Player CRUD ✅
PlayerProgress ✅
Lineup CRUD + 11-player rule ✅

AI Feature 1 — Cosine Similarity ✅ merged
AI Feature 2 — FIFA-reference K-Means ✅ merged
AI Feature 3 — Genetic Algorithm ✅ merged

Dynamic formations ✅
Exactly-one-goalkeeper GA rule ✅
Synergy Score ✅
Atomic generated-lineup saving ✅
195 backend tests ✅
30-player GA benchmark: 1.271s ✅

Frontend ↔ Backend integration ⏭️ NEXT
Integration / End-to-End testing ⬜
Deployment ⬜
Final report/demo/defense sync ⬜
```

:::info Current Git checkpoint
PR #6 merged the Genetic Algorithm optimized-lineup feature into `main`.

The three planned AI algorithms are now implemented in the backend.
:::

## Repository map

```text
Lina-M3/tactiki
├── AGENTS.md
├── backend/
└── frontend/

Lina-M3/tactiki-docs
└── living technical documentation
```

## Current backend stack

| Layer | Technology |
|---|---|
| API | FastAPI |
| Server | Uvicorn |
| ORM | SQLAlchemy |
| Local DB | SQLite |
| Validation | Pydantic |
| Authentication | JWT + HTTPBearer |
| AI/ML | scikit-learn + NumPy + SciPy + DEAP |
| Tests | pytest + httpx |
| API testing | Swagger UI |
| Source control | Git + GitHub |

## AI architecture at a glance

### 1. Substitute recommendation

```text
Unavailable player
→ six-skill vector
→ active same-team candidates
→ Cosine Similarity
→ ranked substitutes
→ deterministic reasons
```

### 2. Position analysis

```text
FIFA 23 outfield data
→ offline K-Means training
→ 3 fixed reference centroids
→ university outfield player
→ nearest centroid
→ Defender / Attacker / Midfielder

GK / Goalkeeper
→ Goalkeeper directly
→ outside outfield K-Means
```

### 3. Optimized lineup

```text
selected active players
+ dynamic formation
→ 11-gene chromosome
→ Genetic Algorithm
→ maximize Synergy Score
→ best Starting XI + assignments
→ atomic Lineup save
```

See the detailed AI pages for diagrams and defense-ready explanations.

## Strong Swagger demo now

```text
POST /auth/login
Authorize

GET  /auth/me
GET  /teams
GET  /teams/{team_id}/players
PATCH /teams/{team_id}/players/{player_id}
GET  /teams/{team_id}/players/{player_id}/progress

POST /teams/{team_id}/recommendations/substitute
POST /teams/{team_id}/analysis/positions
POST /teams/{team_id}/lineups/generate

GET  /teams/{team_id}/lineups
GET  /teams/{team_id}/lineups/{lineup_id}
```

This can demonstrate authentication, ownership, player management, progress tracking, all three AI algorithms, and saved tactical history.

## Current stopping point

> **The backend AI scope is complete. Next: connect the frontend to the stable backend APIs, then run integration and end-to-end testing before deployment and final defense preparation.**
