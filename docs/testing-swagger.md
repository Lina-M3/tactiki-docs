---
sidebar_position: 7
title: Testing & Swagger
---

# Testing & Swagger

We use Swagger to test the backend independently before React depends on it.

## Open Swagger

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

## Why test here first?

If an endpoint fails in Swagger, the problem is probably in the backend/API layer.

If it works in Swagger but later fails from React, we can investigate frontend integration separately.

## Authentication testing

### Signup

```text
POST /auth/signup
```

Fresh email → expected:

```text
201 Created
```

Repeated email → expected:

```text
400 Bad Request
```

```json
{
  "detail": "Email already registered"
}
```

### Login

```text
POST /auth/login
```

Successful login now returns:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

Wrong password → expected:

```text
401 Unauthorized
```

```json
{
  "detail": "Invalid email or password"
}
```

## Swagger Authorize 🔒

Protected endpoints require the JWT.

Steps:

```text
1. Run POST /auth/login
2. Copy access_token only
3. Click Authorize 🔒
4. Paste the token value
5. Authorize
6. Close
7. Execute protected endpoint
```

The outgoing request should contain:

```text
Authorization: Bearer eyJ...
```

If Swagger lost authorization, a protected route returns:

```text
401 Unauthorized
```

```json
{
  "detail": "Not authenticated"
}
```

We saw this when testing `POST /teams`; logging in and authorizing again fixed it.

## `/auth/me` test

```text
GET /auth/me
```

Expected:

```text
200 OK
```

and current-coach data. This is our quick test that the token still works.

## Team tests

### Create

```text
POST /teams
```

Example:

```json
{
  "team_name": "Tactiki FC",
  "university": "King Abdulaziz University"
}
```

Expected:

```text
201 Created
```

The returned `coach_id` should come from the JWT, not the request body.

### Duplicate name

Executing the same team name for the same coach should now return:

```text
400 Bad Request
```

```json
{
  "detail": "Team name already exists"
}
```

### List teams

```text
GET /teams
```

Expected response is a JSON **list**, so it starts with `[` and ends with `]`.

### Read one

```text
GET /teams/{team_id}
```

Known owned team → `200`.
Unknown/not-owned team → `404 Team not found`.

### Update

```text
PATCH /teams/{team_id}
```

Example partial body:

```json
{
  "team_name": "Tactiki United"
}
```

### Delete

```text
DELETE /teams/{team_id}
```

We used this to clean duplicate test teams created before the duplicate-name rule was added.

## Player tests

### Add player

```text
POST /teams/{team_id}/players
```

Example:

```json
{
  "player_name": "Ahmed Ali",
  "position": "CM",
  "height": 178,
  "weight": 72,
  "speed": 82,
  "passing": 86,
  "shooting": 76,
  "defending": 70,
  "stamina": 88,
  "dribbling": 84
}
```

Expected:

```text
201 Created
```

`overall_score` is calculated by the backend and returned in the response.

### Duplicate player

Same name inside the same team → expected:

```text
400 Player already exists in this team
```

### List players

```text
GET /teams/{team_id}/players
```

Returns a list.

### Get one player

```text
GET /teams/{team_id}/players/{player_id}
```

Unknown player → `404 Player not found`.

### Update skills

```text
PATCH /teams/{team_id}/players/{player_id}
```

Example:

```json
{
  "speed": 90,
  "stamina": 91
}
```

Expected:

- those fields change;
- `overall_score` is recalculated automatically;
- a progress record is created because a skill changed.

## Progress-history test

```text
GET /teams/{team_id}/players/{player_id}/progress
```

Expected response:

```json
[
  {
    "progress_id": 1,
    "player_id": 1,
    "previous_score": 82.83,
    "current_score": 86.83,
    "progress_status": "improved",
    "last_update": "2026-10-01T06:38:03.217011"
  }
]
```

## Player delete/deactivate test

```text
DELETE /teams/{team_id}/players/{player_id}
```

Current logic:

```text
no lineup history → permanent delete
has lineup history → is_active = False
```

The second branch will be fully testable after Lineup API creates `LineupPlayer` history.

## Useful status codes

| Status | Meaning in our work |
|---|---|
| `200` | Successful read/update/login |
| `201` | New resource created |
| `204` | Successful delete with no body where used |
| `400` | Business-rule validation such as duplicate email/team/player |
| `401` | Missing/invalid authentication |
| `404` | Resource not found or not owned by current coach |
| `422` | Pydantic/request validation problem |
| `500` | Server-side failure; inspect Uvicorn traceback |

## Testing habit

For every new endpoint:

```text
1. Test valid request.
2. Test missing/invalid data.
3. Test duplicate/not-found case.
4. Test without authorization if protected.
5. Verify response shape.
6. Verify database side effect.
7. Re-test related endpoints after the change.
```
