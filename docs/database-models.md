---
sidebar_position: 4
title: Database & Models
---

# Database & Models

## Database configuration

Tactiki currently uses SQLite with SQLAlchemy.

The database file is:

```text
tactiki.db
```

The configuration lives in:

```text
app/database.py
```

Important pieces are:

- `create_engine(...)` — creates the SQLAlchemy engine.
- `sessionmaker(...)` — creates database sessions.
- `declarative_base()` — creates the Base inherited by ORM models.
- `get_db()` — provides a database session to FastAPI endpoints and closes it afterward.

## Current ORM models

### Coach

Stores coach account information including full name, email, university, and password hash.

### Team

Belongs to a coach through `coach_id`.

### Player

Belongs to a team through `team_id`.

Player attributes currently include:

```text
speed
passing
shooting
defending
stamina
dribbling
```

The model also includes player identity, position, active status, height, weight, and an optional overall score.

### PlayerProgress

Stores score changes and progress status over time.

### Lineup

Stores a formation for a team.

### LineupPlayer

Associates a player with a lineup and stores the player's assigned position.

## Relationships

We use both foreign keys and SQLAlchemy `relationship(...)`.

A foreign key expresses the database-level link. `relationship(...)` gives us a convenient object-oriented way to navigate related ORM objects.

When both model sides use `back_populates`, SQLAlchemy knows that they represent the two directions of the same relationship.
