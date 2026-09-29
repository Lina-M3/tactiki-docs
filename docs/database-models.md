---
sidebar_position: 4
title: Database & Models
---

# Database & Models

This section explains the database layer exactly as we currently built it.

## 1. Database configuration

File:

```text
app/database.py
```

Current code with study comments:

```python title="app/database.py"
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file in the project root.
DATABASE_URL = "sqlite:///./tactiki.db"

# Engine = SQLAlchemy's connection interface to the database.
engine = create_engine(
    DATABASE_URL,

    # SQLite-specific option needed for this FastAPI setup.
    connect_args={"check_same_thread": False}
)

# Factory used to create database sessions.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# All ORM models inherit from this Base.
Base = declarative_base()

# FastAPI dependency that gives an endpoint a DB session.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        # Always close the session when the request is finished.
        db.close()
```

## 2. What is a database session?

A SQLAlchemy `Session` is the object we use to talk to the database during a request.

Example operations:

```python
db.query(Coach)
db.add(new_coach)
db.commit()
db.refresh(new_coach)
```

### Why does `get_db()` use `yield`?

`yield` gives the session to the endpoint.

After the endpoint finishes, execution continues into `finally`, which closes the session.

:::tip تذكري
`get_db()` = افتح Session للـrequest → استخدمها → اقفلها مهما كانت النتيجة.
:::

## 3. Creating tables

In `main.py` we import the models, then call:

```python
Base.metadata.create_all(bind=engine)
```

Important detail: SQLAlchemy must know about a model before it can create that model's table.

That is why our `main.py` imports the model classes before `create_all`.

## 4. Coach model

```python title="app/models/coach.py"
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Coach(Base):
    __tablename__ = "coaches"

    coach_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    university = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

    teams = relationship("Team", back_populates="coach")
```

Important fields:

- `primary_key=True` → unique row identifier.
- `unique=True` on email → database-level uniqueness.
- `nullable=False` → value is required.
- `index=True` → creates an index useful for lookups.
- `password_hash` → we do **not** store the plain password.

## 5. Team model

```python title="app/models/team.py"
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Team(Base):
    __tablename__ = "teams"

    team_id = Column(Integer, primary_key=True, index=True)
    coach_id = Column(Integer, ForeignKey("coaches.coach_id"), nullable=False)
    team_name = Column(String, nullable=False)
    university = Column(String, nullable=False)

    coach = relationship("Coach", back_populates="teams")
    players = relationship("Player", back_populates="team")
    lineups = relationship("Lineup", back_populates="team")
```

The key relationship is:

```text
Coach 1 ───── many Team
```

The foreign key lives in `Team`:

```python
coach_id = Column(Integer, ForeignKey("coaches.coach_id"), nullable=False)
```

## 6. Player model

```python title="app/models/player.py"
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Player(Base):
    __tablename__ = "players"

    player_id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.team_id"), nullable=False)

    player_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

    speed = Column(Float, nullable=False)
    passing = Column(Float, nullable=False)
    shooting = Column(Float, nullable=False)
    defending = Column(Float, nullable=False)
    stamina = Column(Float, nullable=False)
    dribbling = Column(Float, nullable=False)

    overall_score = Column(Float, nullable=True)

    team = relationship("Team", back_populates="players")
    progress_records = relationship(
        "PlayerProgress",
        back_populates="player"
    )
    lineup_entries = relationship(
        "LineupPlayer",
        back_populates="player"
    )
```

The six football attributes currently used are:

```text
Speed
Passing
Shooting
Defending
Stamina
Dribbling
```

:::note
These attributes are important because later AI/recommendation features will use player data. The API endpoints for managing players are **not implemented yet**.
:::

## 7. PlayerProgress model

```python title="app/models/player_progress.py"
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class PlayerProgress(Base):
    __tablename__ = "player_progress"

    progress_id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.player_id"), nullable=False)
    previous_score = Column(Float, nullable=False)
    current_score = Column(Float, nullable=False)
    progress_status = Column(String, nullable=False)
    last_update = Column(DateTime, default=datetime.utcnow)

    player = relationship("Player", back_populates="progress_records")
```

Relationship:

```text
Player 1 ───── many PlayerProgress
```

## 8. Lineup model

```python title="app/models/lineup.py"
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Lineup(Base):
    __tablename__ = "lineups"

    lineup_id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.team_id"), nullable=False)
    formation = Column(String, nullable=False)
    create_date = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="lineups")
    lineup_players = relationship(
        "LineupPlayer",
        back_populates="lineup"
    )
```

## 9. LineupPlayer associative model

```python title="app/models/lineup_player.py"
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class LineupPlayer(Base):
    __tablename__ = "lineup_players"

    lineup_id = Column(
        Integer,
        ForeignKey("lineups.lineup_id"),
        primary_key=True
    )

    player_id = Column(
        Integer,
        ForeignKey("players.player_id"),
        primary_key=True
    )

    assigned_position = Column(String, nullable=False)

    lineup = relationship(
        "Lineup",
        back_populates="lineup_players"
    )

    player = relationship(
        "Player",
        back_populates="lineup_entries"
    )
```

### Why are both IDs primary keys?

Together they form a **composite primary key**:

```text
(lineup_id, player_id)
```

This represents the association between a specific lineup and a specific player.

It also allows `assigned_position` to belong to that particular lineup-player assignment.

## 10. ForeignKey vs relationship

This is a common defense question.

### `ForeignKey`

Database-level connection:

```python
team_id = Column(Integer, ForeignKey("teams.team_id"))
```

### `relationship`

Python ORM convenience:

```python
team = relationship("Team", back_populates="players")
```

:::tip بالعربي
`ForeignKey` يقول لقاعدة البيانات **مين مرتبط بمين**.  
`relationship` يسهل علينا التعامل مع العلاقة كـPython objects.
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

## Database checkpoint

At this point we created the data structure, but **CRUD endpoints for Team, Player, Progress, and Lineup are still upcoming**.
