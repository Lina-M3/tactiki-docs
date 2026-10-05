---
sidebar_position: 1
title: Start Here
description: Your living notebook for the Tactiki CPIT499 backend.
---

# Tactiki — Development Notebook

> هذا الموقع مو تقرير رسمي فقط. اعتبريه **دفتر ملاحظات تقني حي** لمشروع Tactiki: ماذا عملنا؟ لماذا؟ أين الكود؟ كيف اختبرناه؟ وما الذي يجب أن أتذكره وقت المناقشة؟

Tactiki is an AI-powered decision-support system for university football trainers. These notes currently focus on the FastAPI backend that will later connect to the React frontend and AI modules.

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
| API testing | Swagger UI | Backend testing before React |

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
Lineup models ✅
Lineup API ⏭️ NEXT
AI algorithms ⬜ later
React integration ⬜ later
```

## Big picture — current request flow

```text
Swagger / future React
        ↓ HTTP request
FastAPI Router
        ↓
Pydantic Schema
        ↓
FastAPI Dependencies
   ├── get_db()
   └── get_current_coach() for protected routes
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
Signup
  → validate data
  → check duplicate email
  → hash password
  → save Coach

Login
  → find Coach
  → verify password
  → create JWT
  → return access token

Protected request
  → Bearer token
  → validate JWT
  → get current Coach
  → verify data ownership
  → run Team/Player operation
```

## What is already worth demonstrating in a meeting?

You can open Swagger and show this sequence:

```text
POST /auth/signup
POST /auth/login
Authorize 🔒
GET /auth/me
POST /teams
GET /teams
POST /teams/{team_id}/players
PATCH /teams/{team_id}/players/{player_id}
GET /teams/{team_id}/players/{player_id}/progress
```

That demonstration shows authentication, ownership, CRUD, calculated data, and historical progress tracking working together.

## Current design choices to remember

### OverallScore

The report says it is calculated but does not define a formula. Current implementation uses the average of the six stored skill ratings and rounds to two decimals.

### Player history

A skill update creates a `PlayerProgress` record containing old score, new score, status, and timestamp.

### Player deletion

If a player has saved-lineup history, the code preserves that record and deactivates the player instead of permanently deleting it.

## Important rule for these notes

Pages marked as current implementation describe code we actually built. Planned work is labeled clearly so we do not study a roadmap item as if it were already finished.
