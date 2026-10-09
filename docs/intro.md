---
sidebar_position: 1
title: Start Here
description: Your living notebook for the Tactiki CPIT499 project.
---

# Tactiki — Development Notebook

> هذا الموقع مو تقرير رسمي فقط. اعتبريه **دفتر ملاحظات تقني حي** لمشروع Tactiki: ماذا عملنا؟ لماذا؟ أين الكود؟ كيف اختبرناه؟ وما الذي يجب أن أتذكره وقت المناقشة؟

Tactiki is an AI-powered decision-support system for university football trainers. The project now has a shared application repository for backend/frontend collaboration and this separate documentation repository.

## How to read this notebook

Each page tries to answer:

1. **What did we build?**
2. **Why did we need it?**
3. **Which file contains it?**
4. **How does the code work?**
5. **How did we test it?**
6. **What went wrong and how did we fix it?**
7. **What might I be asked in the defense?**

:::tip تذكري
لا تحفظين الكود حرفيًا. افهمي **Request Flow** ومسؤولية كل ملف. إذا فهمتي ليش كل جزء موجود، تقدرين تشرحين المشروع حتى لو تغيرت بعض الأسطر لاحقًا.
:::

## Repository map

Application code:

```text
Lina-M3/tactiki
├── backend/
└── frontend/   ← teammate work will live here
```

Documentation site:

```text
Lina-M3/tactiki-docs
```

## Status legend

| Symbol | Meaning |
|---|---|
| ✅ | Implemented and/or verified |
| 🟡 | Implemented but still being expanded/retested |
| ⏭️ | Next planned step |
| ⬜ | Not implemented yet |
| 🧠 | Important idea to remember |
| ⚠️ | Common mistake/debugging note |

## Current backend stack

| Layer | Technology | Why it exists |
|---|---|---|
| API framework | FastAPI | Endpoints + OpenAPI/Swagger |
| Development server | Uvicorn | Runs the ASGI app |
| ORM | SQLAlchemy | Python models ↔ database tables |
| Database | SQLite | Local development database |
| Validation | Pydantic | Request/response validation |
| Password hashing | Passlib + bcrypt | Never store plain passwords |
| Authentication | PyJWT + HTTPBearer | Signed access tokens + protected routes |
| Config | python-dotenv | Loads private `.env` settings |
| API testing | Swagger UI | Backend testing before frontend integration |
| Source control | Git + GitHub | Shared code, branches, collaboration, history |

## Current stopping point

```text
Backend foundation ✅
Database/models ✅
Signup/login ✅
JWT authentication ✅
Protected /auth/me ✅
Team CRUD ✅
Player CRUD ✅
Automatic OverallScore ✅
Automatic PlayerProgress ✅
Progress-history endpoint ✅
Lineup CRUD ✅
LineupPlayer assignments ✅
Shared GitHub monorepo ✅
Frontend repository area ✅ prepared
Player delete/deactivate real-history test ⏭️ next verification
AI algorithms ⬜
Frontend ↔ backend integration ⬜
Deployment/production hardening ⬜
```

## Big picture — current request flow

```text
Swagger / future Frontend
        ↓ HTTP request
FastAPI Router
        ↓
Pydantic Schema
        ↓
FastAPI Dependencies
   ├── get_db()
   └── get_current_coach()
        ↓
SQLAlchemy ORM
        ↓
SQLite
        ↓
Response Schema
        ↓ JSON
Client
```

Authentication flow:

```text
Login
  → find Coach
  → verify password
  → create JWT
  → return access token

Protected request
  → Bearer token
  → validate JWT
  → get current Coach
  → verify ownership
  → run Team / Player / Lineup operation
```

Lineup flow:

```text
Current Coach
   ↓
Owned Team
   ↓
Validate active team players
   ↓
Create Lineup
   ↓
Create LineupPlayer assignments
   ↓
Saved tactical history
```

## What is already worth demonstrating in a meeting?

A strong Swagger demo is now:

```text
POST /auth/login
Authorize 🔒
GET /auth/me
GET /teams
GET /teams/{team_id}/players
PATCH /teams/{team_id}/players/{player_id}
GET /teams/{team_id}/players/{player_id}/progress
POST /teams/{team_id}/lineups
GET /teams/{team_id}/lineups
PATCH /teams/{team_id}/lineups/{lineup_id}
```

This demonstrates authentication, ownership, CRUD, calculated performance, historical progress, and saved tactical lineups.

## Current design choices to remember

### OverallScore

The report says it is calculated but does not define a formula. Current implementation uses the average of the six skill ratings and rounds to two decimals.

### Player history

A skill update creates a `PlayerProgress` record containing old score, new score, status, and timestamp.

### Player deletion

If a player has saved-lineup history, the code preserves the player and deactivates them instead of permanently deleting them. The real-history branch is the next verification now that LineupPlayer records can be created.

### Lineup size

Basic Lineup CRUD is verified. During API construction we temporarily allow fewer than 11 players so we can test the data model first. Formation/11-player tactical validation is still future work.

## Important rule for these notes

Pages marked as current implementation describe code we actually built. Planned work is labeled clearly so we do not study a roadmap item as if it were already finished.
