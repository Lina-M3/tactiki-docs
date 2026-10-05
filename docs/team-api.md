---
sidebar_position: 8
title: Team API
---

# Team API

This page documents the Team feature as it is implemented now.

## Goal

A logged-in coach can manage **only that coach's teams**.

The important design rule is:

```text
JWT token
   ↓
get_current_coach()
   ↓
current_coach.coach_id
   ↓
Team operations are filtered by that coach_id
```

We do **not** trust a `coach_id` sent by the client when creating a team.

## Files

```text
app/schemas/team.py
app/routers/team.py
app/models/team.py
```

## Team schemas

### `TeamCreate`

Used when creating a team:

```python
class TeamCreate(BaseModel):
    team_name: str
    university: str
```

Notice that it does not contain `coach_id`. The backend gets the coach identity from the JWT.

### `TeamUpdate`

Used for partial updates:

```python
class TeamUpdate(BaseModel):
    team_name: str | None = None
    university: str | None = None
```

### `TeamResponse`

```python
class TeamResponse(BaseModel):
    team_id: int
    coach_id: int
    team_name: str
    university: str

    class Config:
        from_attributes = True
```

## Implemented endpoints

| Method | Endpoint | Purpose | Protected? |
|---|---|---|---|
| `POST` | `/teams` | Create a team | ✅ |
| `GET` | `/teams` | List current coach's teams | ✅ |
| `GET` | `/teams/{team_id}` | Get one owned team | ✅ |
| `PATCH` | `/teams/{team_id}` | Update an owned team | ✅ |
| `DELETE` | `/teams/{team_id}` | Delete an owned team | ✅ |

## Create team

Endpoint:

```text
POST /teams
```

Example request:

```json
{
  "team_name": "Tactiki FC",
  "university": "King Abdulaziz University"
}
```

The server creates the record using:

```python
coach_id=current_coach.coach_id
```

So the response can contain:

```json
{
  "team_id": 1,
  "coach_id": 1,
  "team_name": "Tactiki FC",
  "university": "King Abdulaziz University"
}
```

The client did not send `coach_id = 1`; authentication supplied it.

## Prevent duplicate team names

We accidentally created repeated teams while learning the difference between `POST` and `GET`.

Every time we execute:

```text
POST /teams
```

we are asking the server to create a new resource. That behavior was correct, but for this project we do not want the same coach to create the same team name repeatedly.

Before insertion we now check:

```python
existing_team = db.query(Team).filter(
    Team.coach_id == current_coach.coach_id,
    Team.team_name == team_name
).first()
```

If found:

```text
400 Bad Request
```

```json
{
  "detail": "Team name already exists"
}
```

We also use `.strip()` so leading/trailing spaces are removed before storing the name.

## List only my teams

Endpoint:

```text
GET /teams
```

Core filter:

```python
Team.coach_id == current_coach.coach_id
```

This means Coach 1 cannot simply list Coach 2's teams.

A list response uses square brackets because it returns multiple resources:

```json
[
  {
    "team_id": 1,
    "coach_id": 1,
    "team_name": "Tactiki FC",
    "university": "King Abdulaziz University"
  }
]
```

## Get one team safely

Endpoint:

```text
GET /teams/{team_id}
```

We search using both:

```python
Team.team_id == team_id,
Team.coach_id == current_coach.coach_id
```

This is important. Checking only `team_id` would allow an authenticated coach to request another coach's team if the ID was known.

If the team is missing or not owned by the current coach:

```text
404 Team not found
```

## Update team

Endpoint:

```text
PATCH /teams/{team_id}
```

We chose `PATCH` because the coach may change only one field.

Example:

```json
{
  "team_name": "Tactiki United"
}
```

The university can remain unchanged.

The duplicate-name rule is also applied during rename, excluding the current team itself.

## Delete team

Endpoint:

```text
DELETE /teams/{team_id}
```

Before deletion, ownership is checked using the authenticated coach.

We used this endpoint to clean up duplicate test teams that had been created by repeatedly executing `POST /teams`.

## Swagger lesson: POST vs GET

This caused useful confusion during testing:

```text
POST /teams
```

creates a new team every time it succeeds.

```text
GET /teams
```

only reads the existing teams and does not create anything.

:::tip تذكري
`POST` = أنشئ شيء جديد  
`GET` = اعرض الموجود فقط
:::

## Current Team checkpoint

Team CRUD is complete:

```text
Create ✅
List ✅
Read one ✅
Update ✅
Delete ✅
Ownership protection ✅
Duplicate-name protection ✅
```
