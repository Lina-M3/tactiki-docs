---
sidebar_position: 3
title: Project Structure
---

# Project Structure

We separated the backend by responsibility instead of putting everything inside one large `main.py`.

## Current structure

```text
tactiki-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   │
│   ├── dependencies/
│   │   ├── __init__.py
│   │   └── auth.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── coach.py
│   │   ├── team.py
│   │   ├── player.py
│   │   ├── player_progress.py
│   │   ├── lineup.py
│   │   └── lineup_player.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── coach.py
│   │   ├── team.py
│   │   ├── player.py
│   │   └── player_progress.py
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── team.py
│   │   └── player.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── security.py
│
├── .env
├── .gitignore
├── requirements.txt
├── tactiki.db
└── venv/
```

## Responsibility of each area

| File / folder | Responsibility |
|---|---|
| `app/main.py` | Creates FastAPI app, creates tables, registers routers |
| `app/database.py` | SQLAlchemy engine, sessions, Base, `get_db()` |
| `app/dependencies/` | Reusable FastAPI dependencies such as `get_current_coach` |
| `app/models/` | Database table definitions using SQLAlchemy ORM |
| `app/schemas/` | Request/response shapes using Pydantic |
| `app/routers/` | API endpoints grouped by feature |
| `app/utils/` | Shared helpers such as hashing and JWT functions |
| `.env` | Local/private configuration such as JWT secret |
| `.gitignore` | Prevents secrets/local runtime files from being committed |
| `tactiki.db` | Local SQLite database file |
| `requirements.txt` | Python dependencies for reproducing the environment |

## Router map

```text
app/routers/auth.py
  ├── POST /auth/signup
  ├── POST /auth/login
  └── GET  /auth/me

app/routers/team.py
  ├── POST   /teams
  ├── GET    /teams
  ├── GET    /teams/{team_id}
  ├── PATCH  /teams/{team_id}
  └── DELETE /teams/{team_id}

app/routers/player.py
  ├── POST   /teams/{team_id}/players
  ├── GET    /teams/{team_id}/players
  ├── GET    /teams/{team_id}/players/{player_id}
  ├── PATCH  /teams/{team_id}/players/{player_id}
  ├── DELETE /teams/{team_id}/players/{player_id}
  └── GET    /teams/{team_id}/players/{player_id}/progress
```

## Model vs Schema

### SQLAlchemy Model

Represents how data is stored in the **database**.

```python
class Player(Base):
    __tablename__ = "players"
```

### Pydantic Schema

Represents what data is accepted or returned by the **API**.

```python
class PlayerCreate(BaseModel):
    player_name: str
    ...
```

:::tip بالعربي
**Model = شكل الجدول في قاعدة البيانات**  
**Schema = شكل البيانات في الـrequest أو response**
:::

## Why `dependencies/` exists now

Authentication logic such as identifying the logged-in coach is needed by many routers.

Instead of repeating JWT decoding inside every Team/Player endpoint, we created:

```text
app/dependencies/auth.py
```

with:

```python
get_current_coach()
```

Then protected endpoints can declare:

```python
current_coach: Coach = Depends(get_current_coach)
```

This keeps authorization logic reusable and consistent.

## Router vs Main

`main.py` stays focused on setup.

Routers are imported and registered with lines such as:

```python
app.include_router(auth_router)
app.include_router(team_router)
app.include_router(player_router)
```

If a router exists but is not included, its endpoints will not appear in Swagger.

## Request mental model

The backend now looks like:

```text
HTTP request
   ↓
Router
   ↓
Pydantic schema validates input
   ↓
Dependencies provide DB + current coach
   ↓
SQLAlchemy model/query
   ↓
SQLite
   ↓
Response schema
   ↓
JSON response
```

For protected routes there is an extra authentication path:

```text
Bearer JWT
   ↓
get_current_coach
   ↓
Coach ORM object
   ↓
Team/Player ownership check
```

## `__init__.py` and `__pycache__`

`__init__.py` helps Python treat directories as importable packages.

`__pycache__` is generated Python bytecode cache and is not part of our architecture. It is excluded through `.gitignore` together with `.pyc`, `venv`, `.env`, and the local database.
