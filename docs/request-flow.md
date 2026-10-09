---
sidebar_position: 6
title: Request Flow
---

# Request Flow — How the Backend Thinks

This page explains the main request paths we have implemented.

## Signup flow

```text
POST /auth/signup
   ↓
CoachCreate validates body
   ↓
get_db() provides SQLAlchemy Session
   ↓
Check duplicate email
   ↓
hash_password()
   ↓
Create Coach ORM object
   ↓
db.add → db.commit → db.refresh
   ↓
CoachResponse
   ↓
201 Created
```

## Login + JWT flow

```text
POST /auth/login
   ↓
CoachLogin validates email/password
   ↓
Find Coach by email
   ↓
verify_password()
   ↓
invalid → 401 Unauthorized
valid
   ↓
create_access_token({"sub": coach_id})
   ↓
TokenResponse
   ↓
access_token + bearer
```

## Protected request flow

```text
Swagger / future frontend
      ↓
Authorization: Bearer <JWT>
      ↓
HTTPBearer()
      ↓
get_current_coach()
      ↓
decode_access_token()
      ↓
read sub → coach_id
      ↓
query Coach
      ↓
protected endpoint continues
```

Quick proof:

```text
GET /auth/me
```

## Team creation flow

```text
POST /teams
   ↓
JWT → current_coach
   ↓
TeamCreate validates team_name + university
   ↓
check duplicate team name for same coach
   ↓
create Team with coach_id = current_coach.coach_id
   ↓
commit
   ↓
TeamResponse
```

The client never chooses `coach_id` directly.

## Read one owned team

```text
GET /teams/{team_id}
   ↓
JWT identifies coach
   ↓
query where:
team_id matches
AND coach_id matches current coach
   ↓
return Team
or 404
```

## Player creation flow

```text
POST /teams/{team_id}/players
   ↓
JWT identifies coach
   ↓
verify team belongs to coach
   ↓
PlayerCreate validates body
   ↓
check duplicate player_name inside team
   ↓
calculate overall_score from six skills
   ↓
create Player
   ↓
commit
   ↓
PlayerResponse
```

## Player update + progress flow

```text
PATCH /teams/{team_id}/players/{player_id}
      ↓
verify team ownership
      ↓
verify player belongs to team
      ↓
remember previous overall_score
      ↓
apply only provided fields
      ↓
Did any skill change?
   ┌───────────┴───────────┐
   No                      Yes
   │                        │
commit normal fields     recalculate overall
                            ↓
                     compare old/new score
                            ↓
             improved / declined / stable
                            ↓
                 add PlayerProgress row
                            ↓
                         commit
```

## Progress-history read flow

```text
GET /teams/{team_id}/players/{player_id}/progress
      ↓
verify current coach owns team
      ↓
verify player belongs to team
      ↓
query PlayerProgress by player_id
      ↓
order by last_update ascending
      ↓
return timeline list
```

## Create Lineup flow

```text
POST /teams/{team_id}/lineups
      ↓
JWT → current coach
      ↓
verify team ownership
      ↓
LineupCreate validates formation + players[]
      ↓
player list must not be empty
      ↓
prevent duplicate player_id
      ↓
for each player:
  verify belongs to same team
  verify is_active = True
      ↓
create Lineup row
      ↓
db.flush()
      ↓
obtain generated lineup_id
      ↓
create LineupPlayer rows
with assigned_position
      ↓
db.commit()
      ↓
LineupResponse
```

## Why Lineup uses `flush()` before `commit()`

The child `LineupPlayer` rows need the new `lineup_id`.

```text
flush  → make pending Lineup insert/ID available
commit → finalize Lineup + assignment rows together
```

## Read Lineups flow

List:

```text
GET /teams/{team_id}/lineups
→ verify owned team
→ query Lineup by team_id
→ newest first
→ return list
```

Read one:

```text
GET /teams/{team_id}/lineups/{lineup_id}
→ verify owned team
→ verify lineup_id + team_id match
→ return lineup
or 404
```

## Update Lineup flow

```text
PATCH /teams/{team_id}/lineups/{lineup_id}
      ↓
verify team + lineup
      ↓
formation provided? → update it
      ↓
players provided?
   ┌───────────┴───────────┐
   No                      Yes
   │                        │
keep assignments      validate complete new list
                            ↓
                     delete old assignments
                            ↓
                     add new assignments
                            ↓
                          commit
```

Current rule: when `players` is sent in PATCH, that list becomes the complete replacement assignment list.

## Delete Lineup flow

```text
DELETE /teams/{team_id}/lineups/{lineup_id}
      ↓
verify ownership/context
      ↓
delete LineupPlayer rows
      ↓
delete Lineup row
      ↓
commit
```

## Player deletion decision flow

```text
DELETE /teams/{team_id}/players/{player_id}
      ↓
verify ownership
      ↓
Does LineupPlayer contain this player?
   ┌───────────────┴───────────────┐
   No                              Yes
   │                                │
permanent delete              is_active = False
                               preserve history
```

The code path exists. Now that saved LineupPlayer records can be created, the remaining task is to run the real-history deactivation test end-to-end.

## Main mental model

```text
Request
  ↓
Router
  ↓
Schema validation
  ↓
Dependencies (DB + auth)
  ↓
Ownership/business rules
  ↓
SQLAlchemy operation
  ↓
Database
  ↓
Response schema
  ↓
JSON
```

:::tip تذكري
في المناقشة لا تحتاجين تحفظين كل syntax. اشرحي **رحلة الطلب**: من دخل البيانات، مين تحقق منها، كيف عرفنا المستخدم، كيف تحققنا من الملكية، ثم كيف حفظنا أو قرأنا من قاعدة البيانات.
:::
