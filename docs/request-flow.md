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

This is now implemented:

```text
Swagger / future React client
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

The first proof was:

```text
GET /auth/me
```

which returned the current coach from the token.

## Team creation flow

```text
POST /teams
   ↓
JWT → current_coach
   ↓
TeamCreate validates team_name + university
   ↓
Check same coach does not already have same team name
   ↓
Create Team with coach_id = current_coach.coach_id
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

That second condition is the authorization check.

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

The history branch will become fully testable after saved lineups are implemented.

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
