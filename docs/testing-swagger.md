---
sidebar_position: 7
title: Testing & Swagger
---

# Testing & Swagger

We use Swagger to test the backend independently before frontend integration.

## Open Swagger

Start the backend from:

```text
C:\Users\ACER\tactiki\backend
```

```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

## Why test here first?

If an endpoint fails in Swagger, the problem is probably in the backend/API layer.

If it works in Swagger but later fails from the frontend, we can investigate integration separately.

## Authentication testing

### Signup

```text
POST /auth/signup
```

Fresh email → `201 Created`.
Repeated email → `400 Bad Request` with `Email already registered`.

### Login

```text
POST /auth/login
```

Successful login returns:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

Wrong password → `401 Unauthorized`.

## Swagger Authorize 🔒

```text
1. POST /auth/login
2. Copy access_token only
3. Click Authorize 🔒
4. Paste token
5. Authorize
6. Execute protected endpoints
```

Protected request header:

```text
Authorization: Bearer eyJ...
```

If Swagger loses the token, protected routes may return:

```text
401 Not authenticated
```

Quick token check:

```text
GET /auth/me
```

## Team tests

```text
POST   /teams
GET    /teams
GET    /teams/{team_id}
PATCH  /teams/{team_id}
DELETE /teams/{team_id}
```

Important verified behaviors:

- create returns `201`;
- coach ID comes from authentication, not request body;
- duplicate team name for same coach returns `400`;
- GET list returns JSON `[]`;
- unknown/not-owned team returns `404`;
- PATCH supports partial updates.

## Player tests

```text
POST   /teams/{team_id}/players
GET    /teams/{team_id}/players
GET    /teams/{team_id}/players/{player_id}
PATCH  /teams/{team_id}/players/{player_id}
DELETE /teams/{team_id}/players/{player_id}
GET    /teams/{team_id}/players/{player_id}/progress
```

Create example:

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

Verified behaviors:

- `overall_score` is calculated by backend;
- duplicate player name inside same team returns `400`;
- skill PATCH recalculates overall score;
- skill PATCH creates PlayerProgress row;
- progress endpoint returns historical list.

## Lineup tests

### Create lineup

```text
POST /teams/{team_id}/lineups
```

Verified example:

```json
{
  "formation": "4-3-3",
  "players": [
    {
      "player_id": 1,
      "assigned_position": "CM"
    }
  ]
}
```

Observed result:

```text
201 Created
```

Response included:

```text
lineup_id
team_id
formation
create_date
lineup_players[]
```

### Create validation rules

Current code rejects:

```text
team not owned by current coach
empty player list
duplicate player_id in same lineup
player not found in same team
inactive player
```

### List saved lineups

```text
GET /teams/{team_id}/lineups
```

Returns a JSON list ordered newest first.

### Read one lineup

```text
GET /teams/{team_id}/lineups/{lineup_id}
```

Known nested lineup → `200`.
Unknown/wrong-team lineup → `404 Lineup not found`.

### Update lineup

```text
PATCH /teams/{team_id}/lineups/{lineup_id}
```

Formation-only test:

```json
{
  "formation": "4-2-3-1"
}
```

verified `200 OK`.

If `players` is submitted, it replaces the complete current assignment list after validation.

### Delete lineup

```text
DELETE /teams/{team_id}/lineups/{lineup_id}
```

Verified behavior:

```text
delete LineupPlayer rows
→ delete Lineup row
→ commit
```

After deletion, GET for that lineup should return `404`.

## Player delete/deactivate test — next verification

Player logic is:

```text
no lineup history → permanent delete
has lineup history → is_active = False
```

Now that the Lineup API can create real `LineupPlayer` records, the next test should be:

```text
1. Create/save a lineup containing a player.
2. Confirm the LineupPlayer history exists through the saved lineup response.
3. Call DELETE player.
4. Verify player remains in DB/API state with is_active = false rather than being deleted.
5. Verify historical saved lineup remains readable.
```

## Deliberate temporary Lineup testing choice

Basic CRUD was tested with fewer than 11 players to verify relationships and API behavior first.

This does **not** mean final football rules are complete. Exact starter count, goalkeeper, formation, and positional constraints remain roadmap items.

## Useful status codes

| Status | Meaning in our work |
|---|---|
| `200` | Successful read/update/login/delete-with-body |
| `201` | New resource created |
| `204` | Successful delete with no response body where configured |
| `400` | Business-rule validation |
| `401` | Missing/invalid authentication |
| `404` | Resource missing or not accessible in requested ownership context |
| `422` | Pydantic/request validation problem |
| `500` | Backend failure; inspect Uvicorn traceback |

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
