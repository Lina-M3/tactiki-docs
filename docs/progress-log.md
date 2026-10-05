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
| Root endpoint | ✅ Done | `GET /` |
| Swagger UI | ✅ Done | Main API testing tool |
| SQLite | ✅ Done | `tactiki.db` |
| SQLAlchemy setup | ✅ Done | Engine, sessions, Base, `get_db()` |
| Coach model | ✅ Done | Account data + teams relation |
| Team model | ✅ Done | Linked to Coach |
| Player model | ✅ Done | Six skill ratings + overall score |
| PlayerProgress model | ✅ Done | Historical score records |
| Lineup model | ✅ Done | Database model ready |
| LineupPlayer model | ✅ Done | Composite key + player history relation |
| Coach schemas | ✅ Done | Create/Login/Response/TokenResponse |
| Password hashing | ✅ Done | Passlib + bcrypt |
| bcrypt issue | ✅ Fixed | Pinned to bcrypt 4.0.1 |
| Signup | ✅ Done | Duplicate email protection |
| Login | ✅ Done | Returns JWT |
| JWT creation | ✅ Done | `sub` + `exp` |
| JWT decoding | ✅ Done | Invalid/expired handling |
| Current coach dependency | ✅ Done | `get_current_coach()` |
| `/auth/me` | ✅ Done | First protected endpoint |
| Swagger Authorize | ✅ Verified | Bearer token used successfully |
| Team CRUD | ✅ Done | Create/list/read/update/delete |
| Team ownership | ✅ Done | Restricted to authenticated coach |
| Team duplicate names | ✅ Done | Same coach cannot repeat team name |
| Player CRUD | ✅ Done | Create/list/read/update + delete/deactivate logic |
| Player ownership | ✅ Done | Team ownership checked first |
| Player duplicate names | ✅ Done | Name checked inside same team |
| Overall score | ✅ Done | Auto-calculated from six skills |
| Progress tracking | ✅ Done | Skill update creates history record |
| Progress status | ✅ Done | improved / declined / stable |
| Progress endpoint | ✅ Done | GET player progress history |
| Player delete history branch | 🟡 Implemented | Full lineup-history test waits for Lineup API |
| Lineup API | ⏭️ Next | Next coding milestone |
| AI algorithms | ⬜ Upcoming | K-Means, similarity, genetic algorithm |
| React integration | ⬜ Upcoming | Frontend ↔ FastAPI |

## Documentation site status

| Area | Status |
|---|---|
| GitHub repository | ✅ Created |
| Docusaurus | ✅ Configured |
| GitHub Actions | ✅ Configured |
| GitHub Pages | ✅ Enabled |
| Live site | ✅ Working |
| Authentication notes | ✅ Updated |
| Team API notes | ✅ Added |
| Player API notes | ✅ Added |
| Player Progress notes | ✅ Added |
| Errors/debugging diary | ✅ Updated |
| Notebook content | 🟡 Continuously expanding |

## Current stopping point

> **Authentication, Team CRUD, Player CRUD, automatic OverallScore, and PlayerProgress history are implemented. The next major feature is the Lineup API.**

## Important current behavior

### Overall score

The backend calculates:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

The client does not submit `overall_score` anymore.

### Progress tracking

When any of the six skills changes:

```text
old overall
→ update skills
→ new overall
→ improved / declined / stable
→ PlayerProgress row
```

### Delete player

```text
No saved-lineup usage → delete permanently
Has saved-lineup usage → set is_active = False
```

The second branch is ready in code but needs saved LineupPlayer data for a complete test.

## Before coding next feature

```text
[ ] Confirm (venv) is active
[ ] Run uvicorn app.main:app --reload
[ ] Open /docs
[ ] Login and Authorize if protected-route testing is needed
[ ] Check GET /auth/me if token behavior is uncertain
[ ] Check GET /teams and player list before changing Lineup code
[ ] Refresh requirements.txt if dependencies changed
```

## Next coding session checklist

```text
[x] Signup + hashing
[x] Login + password verification
[x] JWT token response
[x] JWT validation
[x] Current coach dependency
[x] /auth/me
[x] Team CRUD
[x] Team duplicate protection
[x] Player CRUD
[x] Automatic OverallScore
[x] Automatic PlayerProgress records
[x] Progress history API
[x] Delete/deactivate player logic
[ ] Build Lineup schemas
[ ] Build Lineup router/endpoints
[ ] Create saved lineup records
[ ] Create LineupPlayer assignments
[ ] Test player deactivation branch with real lineup history
[ ] Continue toward optimized lineup generation
```

:::tip
كل ما نخلص Feature حقيقي، نحدث هذا الجدول فورًا. الهدف إن هذا الملف يكون مرجع "وين وقفنا؟" بدون ما نرجع للمحادثات القديمة.
:::
