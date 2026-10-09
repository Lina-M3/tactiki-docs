---
sidebar_position: 4
title: Database & Models
---

# Database & Models

This section explains the current database layer and how it is used by the implemented APIs.

## 1. Database configuration

File:

```text
backend/app/database.py
```

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./tactiki.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 2. Database session

A SQLAlchemy `Session` is what endpoints use to query and modify SQLite.

Examples:

```python
db.query(Coach)
db.add(new_lineup)
db.flush()
db.commit()
db.refresh(player)
db.delete(team)
```

`get_db()` uses `yield` so FastAPI can inject the session and still close it in `finally` after the request.

## 3. Table creation

`main.py` calls:

```python
Base.metadata.create_all(bind=engine)
```

SQLAlchemy must know about model classes before this call so their metadata is registered.

## 4. Coach

Important fields:

```text
coach_id
full_name
email
university
password_hash
```

- `email` is unique and indexed.
- the plain password is never stored.
- one Coach can own many Teams.

```text
Coach 1 ───── many Team
```

## 5. Team

Important fields:

```text
team_id
coach_id
team_name
university
```

Relationships:

```text
Team → Coach
Team → Players
Team → Lineups
```

The Team API is implemented and protected by authenticated-coach ownership checks.

## 6. Player

Important fields:

```text
player_id
team_id
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
overall_score
```

The six skill attributes are:

```text
Speed
Passing
Shooting
Defending
Stamina
Dribbling
```

### `overall_score`

Current implementation:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

The API client does not submit `overall_score`; the backend calculates it and rounds to two decimals.

:::note
The project report describes OverallScore as calculated but does not define the exact mathematical formula. The simple average is our current implementation decision and can later be replaced by a weighted formula if project requirements define one.
:::

Relationships:

```text
Player → Team
Player → many PlayerProgress
Player → many LineupPlayer
```

## 7. PlayerProgress

Fields:

```text
progress_id
player_id
previous_score
current_score
progress_status
last_update
```

Relationship:

```text
Player 1 ───── many PlayerProgress
```

Progress records are created automatically when one of the six skill ratings changes.

```text
new > old  → improved
new < old  → declined
new = old  → stable
```

Changing only name, position, height, weight, or activity does not create a performance-change record.

`last_update` currently uses `datetime.utcnow` and is returned as an ISO-style datetime string.

## 8. Lineup

Fields:

```text
lineup_id
team_id
formation
create_date
```

Relationship:

```text
Team 1 ───── many Lineup
```

The Lineup model is now actively used by the implemented Lineup CRUD API.

A saved lineup belongs to one team and can contain several player assignments through `LineupPlayer`.

## 9. LineupPlayer

Associative model:

```text
lineup_id
player_id
assigned_position
```

Both IDs form a composite primary key:

```text
(lineup_id, player_id)
```

This prevents the same player from having two rows for the same saved lineup at the database-key level and lets each lineup store its own assigned position for the player.

Relationship idea:

```text
Lineup 1 ── many LineupPlayer ── many Player
```

## 10. Why `assigned_position` belongs in LineupPlayer

A player's normal position and a tactical assignment are not always the same.

Example:

```text
Player.position = "CM"
LineupPlayer.assigned_position = "CAM"
```

This means the same player can have different tactical assignments in different saved lineups without changing the player's base profile.

## 11. Why Lineup creation uses `flush()`

Creating a lineup needs the generated `lineup_id` before its `LineupPlayer` rows can be created.

```python
db.add(new_lineup)
db.flush()
```

`flush()` sends pending SQL work and makes the generated ID available, but the transaction is not finalized yet.

After adding all `LineupPlayer` rows:

```python
db.commit()
```

saves the full operation.

## 12. Player deletion and history preservation

Player deletion checks `LineupPlayer` history:

```text
No saved-lineup usage
→ permanent delete

Has saved-lineup usage
→ keep Player row
→ is_active = False
```

Now that Lineup creation is implemented, we can create real `LineupPlayer` history and perform the remaining end-to-end test of this deactivation branch.

## 13. ForeignKey vs relationship

### ForeignKey

Database-level rule:

```python
team_id = Column(Integer, ForeignKey("teams.team_id"))
```

### relationship

Python ORM navigation:

```python
team = relationship("Team", back_populates="players")
```

:::tip بالعربي
`ForeignKey` = الربط داخل قاعدة البيانات  
`relationship` = طريقة مريحة للتعامل مع الربط كـPython objects
:::

## Relationship map

```text
Coach
  └── Team
        ├── Player
        │     ├── PlayerProgress
        │     └── LineupPlayer
        │
        └── Lineup
              └── LineupPlayer
```

## Current database/API checkpoint

```text
Database foundation ✅
Coach model ✅
Team model + CRUD ✅
Player model + CRUD ✅
Automatic OverallScore ✅
PlayerProgress + automatic history ✅
Progress history endpoint ✅
Lineup model + CRUD ✅
LineupPlayer assignments ✅
Lineup ownership/player validation ✅
Player-deactivation-with-real-history test ⏭️ next verification
```
