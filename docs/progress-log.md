---
sidebar_position: 11
title: Progress Log
---

# Progress Log

This is the page to check when we forget **exactly where we stopped**.

## Backend status

| Area | Status | Notes |
|---|---|---|
| Project folder + venv | ✅ Done | Backend environment created |
| FastAPI app | ✅ Done | App starts successfully |
| Uvicorn | ✅ Done | Development server works |
| Root endpoint | ✅ Done | `GET /` tested |
| Swagger UI | ✅ Done | Used for API testing |
| SQLite | ✅ Done | `tactiki.db` created |
| SQLAlchemy setup | ✅ Done | Engine, sessions, Base, `get_db()` |
| Coach model | ✅ Done | Includes relationship to teams |
| Team model | ✅ Done | Linked to Coach |
| Player model | ✅ Done | Six performance attributes included |
| PlayerProgress model | ✅ Done | Linked to Player |
| Lineup model | ✅ Done | Linked to Team |
| LineupPlayer model | ✅ Done | Composite primary key |
| Coach schemas | ✅ Done | `CoachCreate`, `CoachResponse` |
| Password hashing | ✅ Done | Passlib + bcrypt |
| bcrypt issue | ✅ Fixed | bcrypt pinned to 4.0.1 |
| Auth router | ✅ Done | Prefix `/auth` |
| Signup endpoint | ✅ Done | `POST /auth/signup` |
| Duplicate email test | ✅ Verified | Returns 400 |
| Login | ✅ Done | `POST /auth/login` tested successfully |
| Password verification | ✅ Done | Direct `True / False` test + login test |
| JWT | 🟡 In progress | `.env` + `create_access_token()` written; generation test pending |
| Protected routes | ⏭️ Next | Not implemented yet |
| Team CRUD | ⬜ Upcoming | After authentication |
| Player CRUD | ⬜ Upcoming | After Team CRUD |
| Progress API | ⬜ Upcoming | Later backend milestone |
| AI algorithms | ⬜ Upcoming | K-Means, similarity, genetic algorithm |
| React integration | ⬜ Upcoming | Frontend ↔ backend |

## Documentation site status

| Area | Status |
|---|---|
| GitHub repository | ✅ Created |
| Docusaurus | ✅ Configured |
| GitHub Actions | ✅ Configured |
| GitHub Pages | ✅ Enabled |
| Live site | ✅ Working |
| Notebook content | 🟡 Continuously expanding |

## Current stopping point

> **Authentication: Login and password verification are verified. JWT setup is written; we stopped before the first token-generation test and before wiring JWT into `/auth/login`.**

## Before writing the next feature

Two housekeeping reminders:

### 1. Refresh requirements

```powershell
pip freeze > requirements.txt
```

Reason: authentication packages and the bcrypt version change happened after our first dependency export.

### 2. Backend `.gitignore`

This is now created at the project root and includes:

```text
.env
venv/
__pycache__/
*.pyc
tactiki.db
*.db
.DS_Store
```

✅ Completed.

## Next coding session checklist

When we continue backend implementation:

```text
[ ] Confirm (venv) is active
[ ] Run uvicorn app.main:app --reload
[ ] Open /docs
[ ] Re-test signup with a fresh test email if needed
[ ] Refresh requirements.txt
[x] Implement password verification
[x] Create Login schema/endpoint
[x] Test valid login
[x] Test invalid password
[x] Create root .gitignore and protect .env
[x] Add JWT configuration + create_access_token()
[ ] Test create_access_token() directly
[ ] Make login return a JWT
[ ] Add token validation
[ ] Add /auth/me protected endpoint
[ ] Test Swagger Authorize 🔒
[ ] Test unknown email if not already verified separately
[ ] Update this notebook
```

:::tip
كل ما نخلص Feature حقيقي، نحدث هذا الجدول فورًا. كذا ما نرجع بعد أسبوع ونحتار: "إحنا وين وقفنا؟"
:::
