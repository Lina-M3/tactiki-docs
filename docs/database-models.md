---
sidebar_position: 4
title: Database & Models
---

# Database & Models

This section explains the current database layer and how it is now used by implemented APIs.

## 1. Database configuration

File:

```text
app/database.py
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
db.add(new_team)
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

Key points:

- `email` is unique and indexed.
- the plain password is never stored;
- `teams` is a one-to-many ORM relationship.

Relationship:

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

Foreign key:

```python
coach_id = Column(
    Integer,
    ForeignKey("coaches.coach_id"),
    nullable=False
)
```

Relationships:

```text
Team → Coach
Team → Players
Team → Lineups
```

The Team API is now implemented and every Team query is constrained by the authenticated coach.

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

The report describes this as a calculated overall performance score.

Current implementation decision:

```text
OverallScore = average of the six skill ratings
```

Formula:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

The user no longer sends `overall_score` in create/update requests. The backend calculates it automatically.

:::note
The report does not define the exact mathematical formula, so the simple six-skill average is our current implementation choice and can later be replaced by a weighted formula if required.
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

Progress records are now created automatically when player skill ratings change.

Current status logic:

```text
new > old  → improved
new < old  → declined
new = old  → stable
```

Changing only name/position/height/weight/activity does not create a false progress record.

`last_update` currently uses:

```python
datetime.utcnow
```

and is returned by the API in an ISO-style datetime string.

## 8. Lineup

Fields include:

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

The database model is ready; Lineup API implementation is the next major milestone.

## 9. LineupPlayer

This associative model connects players to lineups:

```text
lineup_id
player_id
assigned_position
```

Both IDs form a composite primary key:

```text
(lineup_id, player_id)
```

This models the many-to-many history between Player and Lineup while storing the assigned position for that specific lineup.

## 10. Why LineupPlayer already matters before Lineup CRUD

Player deletion logic now checks this table.

```text
Player has no LineupPlayer record
    → safe to delete permanently

Player has LineupPlayer history
    → keep record and set is_active = False
```

This preserves historical saved lineups.

## 11. ForeignKey vs relationship

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
PlayerProgress model + automatic history ✅
Progress history endpoint ✅
Lineup model ✅ database only
LineupPlayer model ✅ database only / deletion history check
Lineup API ⏭️ next
```
