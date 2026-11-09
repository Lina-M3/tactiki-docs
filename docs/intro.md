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
Cosine Similarity Substitute Recommendation ✅ merged
K-Means Position Analysis ✅ merged
FIFA 23 fixed reference centroids ✅
Goalkeeper separated from outfield K-Means ✅
FIFA-reference K-Means revision ✅ merged
Genetic Algorithm Optimized Lineup ⬜ next major AI stage
Frontend integration ⬜
Deployment ⬜
```

:::info Current Git checkpoint
PR #5 merged the FIFA-reference Position Analysis revision into `main`. Local `main` is up to date and the working tree is clean.
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
| AI/ML | scikit-learn + NumPy + SciPy |
| Tests | pytest + httpx |
| API testing | Swagger UI |
| Source control | Git + GitHub |

## AI architecture at a glance

### Substitute recommendation

```text
Unavailable player
→ 6-skill vector
→ active same-team candidates
→ Cosine Similarity
→ ranked substitutes
→ deterministic reasons
```

### Position analysis

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

See the detailed **Substitute Recommendation** and **Position Analysis** pages for diagrams and defense-ready explanations.

## Strong Swagger demo

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
POST /teams/{team_id}/analysis/positions
```

## Current stopping point

> **Cosine Similarity and the revised FIFA-reference K-Means Position Analysis are now merged. Next: define the Genetic Algorithm fitness function, Synergy Score, formation constraints, and goalkeeper rule before implementation.**
