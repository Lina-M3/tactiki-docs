---
sidebar_position: 10
title: Lineup API
---

# Lineup API

The Lineup feature connects a team, its players, and saved tactical formations.

Current status: **basic protected Lineup CRUD is implemented and verified in Swagger.**

## Files

```text
backend/app/models/lineup.py
backend/app/models/lineup_player.py
backend/app/schemas/lineup.py
backend/app/routers/lineup.py
```

The router is registered in:

```text
backend/app/main.py
```

## Data model

`Lineup` stores:

```text
lineup_id
team_id
formation
create_date
```

`LineupPlayer` stores the player assignment inside a saved lineup:

```text
lineup_id
player_id
assigned_position
```

The pair:

```text
(lineup_id, player_id)
```

is the composite primary key.

:::tip تذكري
`Player.position` is the player's general/base position.  
`LineupPlayer.assigned_position` is the position assigned to that player in one specific saved lineup.
:::

## Schemas

`LineupPlayerCreate` accepts:

```text
player_id
assigned_position
```

`LineupCreate` accepts:

```text
formation
players[]
```

`LineupUpdate` allows partial updates to:

```text
formation
players[]
```

The client does not submit `team_id`, `lineup_id`, or `create_date` when creating a lineup.

## Endpoint map

```text
POST   /teams/{team_id}/lineups
GET    /teams/{team_id}/lineups
GET    /teams/{team_id}/lineups/{lineup_id}
PATCH  /teams/{team_id}/lineups/{lineup_id}
DELETE /teams/{team_id}/lineups/{lineup_id}
```

All Lineup endpoints are protected by JWT authentication.

## Create lineup

```text
POST /teams/{team_id}/lineups
```

Example request:

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

Verified result:

```text
201 Created
```

The response includes the generated `lineup_id`, `team_id`, `formation`, `create_date`, and nested `lineup_players`.

## Create validation flow

Before saving the lineup, the backend checks:

```text
JWT identifies current coach
        ↓
team_id belongs to current coach
        ↓
player list is not empty
        ↓
no duplicate player_id in same lineup
        ↓
each player belongs to the same team
        ↓
each player is active
        ↓
create Lineup
        ↓
create LineupPlayer assignments
        ↓
commit transaction
```

This prevents another coach's players or inactive players from being added accidentally.

## Why `db.flush()` is used

When creating a lineup, we need the generated `lineup_id` before we can create its `LineupPlayer` rows.

We use:

```python
db.add(new_lineup)
db.flush()
```

`flush()` sends pending SQL changes to the database so SQLAlchemy can populate `new_lineup.lineup_id`, but it does **not** finish the transaction.

Then we create the player assignments and finally call:

```python
db.commit()
```

Easy memory:

```text
flush  = send pending work / get generated ID
commit = permanently finish the transaction
```

## List lineups

```text
GET /teams/{team_id}/lineups
```

Returns all saved lineups for the owned team.

Current implementation orders them by:

```text
create_date descending
```

so the newest lineup appears first.

## Read one lineup

```text
GET /teams/{team_id}/lineups/{lineup_id}
```

The backend checks both:

```text
lineup_id
team_id
```

so a lineup from another team cannot be fetched through the wrong nested URL.

Unknown/not-owned lineup returns:

```text
404 Lineup not found
```

## Update lineup

```text
PATCH /teams/{team_id}/lineups/{lineup_id}
```

We use PATCH because the client may update only the formation or only the assigned players.

Example formation-only update:

```json
{
  "formation": "4-2-3-1"
}
```

If `players` is included, the current behavior is:

> the submitted list becomes the **new complete player-assignment list** for that lineup.

The backend validates all new player assignments first, then removes the old `LineupPlayer` rows and inserts the new ones.

## Delete lineup

```text
DELETE /teams/{team_id}/lineups/{lineup_id}
```

Current deletion order:

```text
Delete LineupPlayer assignments
        ↓
Delete Lineup
        ↓
Commit
```

Verified result returns a success message and deleted lineup ID.

## Important relationship with Player deletion

Player deletion already uses `LineupPlayer` as historical evidence:

```text
No LineupPlayer history
→ player may be permanently deleted

Has LineupPlayer history
→ preserve player record
→ set is_active = False
```

Now that real lineups can be saved, the remaining test is to verify this deactivation branch end-to-end with a player that has actual saved lineup history.

## Current limitation / deliberate temporary choice

During initial API verification we allowed a lineup with fewer than 11 players so we could test the data structure and relationships first.

We have **not yet finalized formation rules** such as:

```text
exactly 11 starters
required goalkeeper count
position counts that match formation
valid formation catalogue
```

Those rules should be added before AI-generated competitive lineups are considered finished.
