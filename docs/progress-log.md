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
| SQLite | ✅ Done | `tactiki.db` local dev DB |
| SQLAlchemy setup | ✅ Done | Engine, sessions, Base, `get_db()` |
| Coach model | ✅ Done | Account data + teams relation |
| Team model | ✅ Done | Linked to Coach |
| Player model | ✅ Done | Six skill ratings + overall score |
| PlayerProgress model | ✅ Done | Historical score records |
| Lineup model | ✅ Done | Linked to Team |
| LineupPlayer model | ✅ Done | Composite key + assigned position |
| Password hashing | ✅ Done | Passlib + bcrypt |
| bcrypt issue | ✅ Fixed | Pinned to bcrypt 4.0.1 |
| Signup | ✅ Done | Duplicate email protection |
| Login | ✅ Done | Returns JWT |
| JWT creation | ✅ Done | `sub` + `exp` |
| JWT decoding | ✅ Done | Invalid/expired handling |
| Current coach dependency | ✅ Done | `get_current_coach()` |
| `/auth/me` | ✅ Done | Protected current profile |
| Swagger Authorize | ✅ Verified | Bearer token used successfully |
| Team CRUD | ✅ Done | Create/list/read/update/delete |
| Team ownership | ✅ Done | Restricted to authenticated coach |
| Team duplicate names | ✅ Done | Same coach cannot repeat name |
| Player CRUD | ✅ Done | Create/list/read/update + delete/deactivate logic |
| Player ownership | ✅ Done | Team ownership checked first |
| Player duplicate names | ✅ Done | Name checked inside same team |
| Overall score | ✅ Done | Auto-calculated from six skills |
| Progress tracking | ✅ Done | Skill update creates history record |
| Progress status | ✅ Done | improved / declined / stable |
| Progress endpoint | ✅ Done | GET player progress history |
| Lineup schemas | ✅ Done | Create/update/response + nested player assignments |
| Lineup create | ✅ Verified | POST saved Lineup + LineupPlayer rows |
| Lineup list | ✅ Verified | GET team lineups |
| Lineup read one | ✅ Verified | GET one nested lineup |
| Lineup update | ✅ Verified | PATCH formation / replace assignments |
| Lineup delete | ✅ Verified | Deletes assignments then lineup |
| Lineup ownership | ✅ Done | Team must belong to current coach |
| Lineup player validation | ✅ Done | Same team + active + no duplicate IDs |
| Player delete history branch | 🟡 Needs real-history test | Code exists; now Lineup API can create the needed history |
| Exact 11-player/formation validation | ⬜ Upcoming | Basic CRUD intentionally allowed smaller test lineups |
| AI algorithms | ⬜ Upcoming | K-Means, similarity, genetic algorithm |
| Frontend integration | ⬜ Upcoming | Frontend ↔ FastAPI |

## Repository / collaboration status

| Area | Status | Notes |
|---|---|---|
| Main code repository | ✅ Created | `Lina-M3/tactiki` |
| Repository visibility | ✅ Private | teammate invited as collaborator |
| Monorepo structure | ✅ Set | `backend/` + future `frontend/` |
| Root `.gitignore` | ✅ Verified | `.env`, DB, venv, node_modules/build output ignored |
| Backend initial push | ✅ Done | Initial backend snapshot on `main` |
| Feature branch workflow | ✅ Started | current feature branch: `backend/lineup-api` |
| Frontend branch workflow | ⏭️ When teammate accepts | recommended `frontend/...` branches |
| Pull Request habit | ⏭️ Next | merge stable features into `main` through PRs |

## Documentation site status

| Area | Status |
|---|---|
| Docusaurus + GitHub Pages | ✅ Working |
| Authentication notes | ✅ Updated |
| Team API notes | ✅ Added |
| Player API notes | ✅ Added |
| Player Progress notes | ✅ Added |
| Lineup API notes | ✅ Added |
| GitHub team workflow notes | ✅ Added |
| Project structure | ✅ Updated for monorepo |
| Roadmap | ✅ Updated |
| Errors/debugging diary | ✅ Updated |
| Notebook content | 🟡 Continuously expanding |

## Current stopping point

> **Core manual backend CRUD is now complete through saved Lineups. The immediate next work is to save the Lineup feature branch in Git, verify player deactivation with real LineupPlayer history, strengthen lineup rules, then begin the intelligence/integration stages.**

## Important implemented flows

### Overall score

```text
six skill values
→ average
→ round to 2 decimals
→ save overall_score
```

### Progress tracking

```text
old overall
→ update one or more skills
→ new overall
→ improved / declined / stable
→ PlayerProgress row
```

### Create lineup

```text
JWT current coach
→ owned team
→ validate players
→ create Lineup
→ db.flush() to obtain lineup_id
→ create LineupPlayer rows
→ commit
```

### Delete player rule

```text
No LineupPlayer history → permanent delete
Has LineupPlayer history → set is_active = False
```

## Next coding/session checklist

```text
[x] Authentication + JWT
[x] Team CRUD
[x] Player CRUD
[x] Automatic OverallScore
[x] Automatic PlayerProgress
[x] Progress history API
[x] Lineup schemas
[x] Lineup Create/List/Read/Update/Delete
[x] Shared GitHub monorepo setup
[ ] Commit + push completed Lineup work on backend/lineup-api
[ ] Open/merge Lineup Pull Request after review
[ ] Test delete-player deactivation using real saved lineup history
[ ] Decide/enforce final lineup rules (11 starters / formations / positions)
[ ] Define and implement substitute recommendation
[ ] Define and implement AI lineup generation
[ ] Coordinate frontend API contract with teammate
[ ] Add CORS + frontend API base URL strategy
[ ] Connect frontend to authentication/teams/players/progress/lineups
[ ] Add automated tests and stronger validation
[ ] Decide deployment/production DB strategy
```

:::tip
كل ما نخلص Feature حقيقي، نحدث هذا الملف فورًا. الهدف إن هذا الملف يكون مرجع "وين وقفنا؟" بدون ما نرجع للمحادثات القديمة.
:::
