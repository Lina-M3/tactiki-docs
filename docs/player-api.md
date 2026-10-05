---
sidebar_position: 9
title: Player API
---

# Player API

The Player API is implemented under a specific team:

```text
/teams/{team_id}/players
```

The backend always checks that the requested team belongs to the authenticated coach before reading or changing player data.

## Files

```text
app/schemas/player.py
app/routers/player.py
app/models/player.py
app/models/lineup_player.py
```

## Player schemas

### `PlayerCreate`

Used when adding a player.

Current input includes:

```text
player_name
position
height
weight
speed
passing
shooting
defending
stamina
dribbling
```

`team_id` is not sent in the body because it comes from the URL.

`overall_score` is also **not** sent by the user anymore. The backend calculates it.

### `PlayerUpdate`

All update fields are optional so `PATCH` can change only what is needed.

It includes fields such as:

```text
player_name
position
is_active
height
weight
speed
passing
shooting
defending
stamina
dribbling
```

Again, `overall_score` is intentionally excluded from input.

### `PlayerResponse`

The response contains stored player data including:

```text
player_id
team_id
player_name
position
is_active
height
weight
six skill ratings
overall_score
```

## Implemented endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/teams/{team_id}/players` | Add player |
| `GET` | `/teams/{team_id}/players` | List team players |
| `GET` | `/teams/{team_id}/players/{player_id}` | Get one player |
| `PATCH` | `/teams/{team_id}/players/{player_id}` | Update player |
| `DELETE` | `/teams/{team_id}/players/{player_id}` | Delete or deactivate player |

All are protected by JWT authentication.

## Ownership check

Every player operation starts by checking the team:

```python
team = db.query(Team).filter(
    Team.team_id == team_id,
    Team.coach_id == current_coach.coach_id
).first()
```

If this fails:

```text
404 Team not found
```

This prevents a logged-in coach from using a known `team_id` to manage another coach's players.

## Add player

Endpoint:

```text
POST /teams/{team_id}/players
```

Example body:

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

The player is connected to the team using the URL `team_id`.

## Duplicate-player rule

Before insertion, we check the combination:

```text
team_id + player_name
```

So the same player name cannot be added twice inside the same team.

Current failure response:

```text
400 Bad Request
```

```json
{
  "detail": "Player already exists in this team"
}
```

## Automatic Overall Score

Originally `overall_score` was treated as an ordinary input field. During testing we noticed that changing `speed` or `stamina` did not update the overall value.

We fixed the design so the **server owns the calculation**.

Current formula:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

Implementation helper:

```python
def calculate_overall_score(
    speed: float,
    passing: float,
    shooting: float,
    defending: float,
    stamina: float,
    dribbling: float
):
    overall_score = (
        speed
        + passing
        + shooting
        + defending
        + stamina
        + dribbling
    ) / 6

    return round(overall_score, 2)
```

:::note Design decision
The project report describes `OverallScore` as a calculated overall performance score, but it does not define the exact formula. For the current implementation we chose the simple average of the six stored skill ratings. This can be replaced later if the final project requires a weighted formula.
:::

Example after updating Ahmed:

```text
Speed      = 90
Passing    = 86
Shooting   = 76
Defending  = 70
Stamina    = 91
Dribbling  = 84
```

Calculation:

```text
(90 + 86 + 76 + 70 + 91 + 84) / 6 = 82.83
```

So the API returns:

```json
{
  "overall_score": 82.83
}
```

The coach does not manually submit that value.

## List players

Endpoint:

```text
GET /teams/{team_id}/players
```

Returns a JSON list:

```json
[
  {
    "player_id": 1,
    "team_id": 1,
    "player_name": "Ahmed Ali"
  }
]
```

## Get one player

Endpoint:

```text
GET /teams/{team_id}/players/{player_id}
```

The backend verifies both:

```text
team ownership
player belongs to that team
```

Unknown player:

```text
404 Player not found
```

## Update player

Endpoint:

```text
PATCH /teams/{team_id}/players/{player_id}
```

Example partial update:

```json
{
  "speed": 90,
  "stamina": 91
}
```

Only supplied fields are changed.

If any of the six skills changes, the backend recalculates `overall_score` automatically.

If the name changes, duplicate-name validation is also applied.

## Delete vs deactivate player

The project requirement says historical lineup data should be preserved.

So deletion first checks `LineupPlayer`:

```python
lineup_usage = db.query(LineupPlayer).filter(
    LineupPlayer.player_id == player_id
).first()
```

### No lineup history

The player is deleted permanently.

### Has lineup history

The player is preserved but changed to:

```python
is_active = False
```

This allows old saved lineups to keep referring to that player while preventing the player from being treated as active for future recommendations.

:::note Testing checkpoint
The delete/deactivate logic is implemented. The lineup-history branch can be tested end-to-end once we create saved lineups and `LineupPlayer` records in the next milestone.
:::

## Player CRUD checkpoint

```text
Create ✅
List ✅
Read one ✅
Update ✅
Automatic overall calculation ✅
Duplicate protection ✅
Delete/deactivate logic ✅ implemented
Ownership protection ✅
```
