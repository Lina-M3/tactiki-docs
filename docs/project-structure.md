---
sidebar_position: 3
title: Project Structure
---

# Project Structure

Tactiki now uses a shared **monorepo** for the application code and a separate repository for this documentation site.

## Repository structure

Main project repository:

```text
tactiki/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   │
│   │   ├── dependencies/
│   │   │   ├── __init__.py
│   │   │   └── auth.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── coach.py
│   │   │   ├── team.py
│   │   │   ├── player.py
│   │   │   ├── player_progress.py
│   │   │   ├── lineup.py
│   │   │   └── lineup_player.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── coach.py
│   │   │   ├── team.py
│   │   │   ├── player.py
│   │   │   ├── player_progress.py
│   │   │   └── lineup.py
│   │   │
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── team.py
│   │   │   ├── player.py
│   │   │   └── lineup.py
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── security.py
│   │
│   ├── .env              # local only / ignored
│   ├── requirements.txt
│   ├── tactiki.db        # local only / ignored
│   └── venv/             # local only / ignored
│
├── frontend/             # teammate frontend will live here
├── .gitignore
└── README.md
```

Documentation repository:

```text
Lina-M3/tactiki-docs
```

This Docusaurus site stays separate from the application source code.

## Responsibility of each backend area

| File / folder | Responsibility |
|---|---|
| `backend/app/main.py` | Creates FastAPI app, creates tables, registers routers |
| `backend/app/database.py` | SQLAlchemy engine, sessions, Base, `get_db()` |
| `backend/app/dependencies/` | Reusable FastAPI dependencies such as `get_current_coach` |
| `backend/app/models/` | Database table definitions using SQLAlchemy ORM |
| `backend/app/schemas/` | Request/response shapes using Pydantic |
| `backend/app/routers/` | API endpoints grouped by feature |
| `backend/app/utils/` | Shared helpers such as hashing and JWT functions |
| `backend/.env` | Local/private JWT configuration; never committed |
| `backend/tactiki.db` | Local SQLite database; never committed |
| `backend/requirements.txt` | Reproducible Python dependencies |
| root `.gitignore` | Protects backend secrets/runtime files and future frontend generated files |

## Router map

```text
backend/app/routers/auth.py
  ├── POST /auth/signup
  ├── POST /auth/login
  └── GET  /auth/me

backend/app/routers/team.py
  ├── POST   /teams
  ├── GET    /teams
  ├── GET    /teams/{team_id}
  ├── PATCH  /teams/{team_id}
  └── DELETE /teams/{team_id}

backend/app/routers/player.py
  ├── POST   /teams/{team_id}/players
  ├── GET    /teams/{team_id}/players
  ├── GET    /teams/{team_id}/players/{player_id}
  ├── PATCH  /teams/{team_id}/players/{player_id}
  ├── DELETE /teams/{team_id}/players/{player_id}
  └── GET    /teams/{team_id}/players/{player_id}/progress

backend/app/routers/lineup.py
  ├── POST   /teams/{team_id}/lineups
  ├── GET    /teams/{team_id}/lineups
  ├── GET    /teams/{team_id}/lineups/{lineup_id}
  ├── PATCH  /teams/{team_id}/lineups/{lineup_id}
  └── DELETE /teams/{team_id}/lineups/{lineup_id}
```

## Model vs Schema

### SQLAlchemy Model

Represents how data is stored in the **database**.

```python
class Lineup(Base):
    __tablename__ = "lineups"
```

### Pydantic Schema

Represents what data is accepted or returned by the **API**.

```python
class LineupCreate(BaseModel):
    formation: str
    players: list[LineupPlayerCreate]
```

:::tip بالعربي
**Model = شكل الجدول في قاعدة البيانات**  
**Schema = شكل البيانات في الـrequest أو response**
:::

## Why `dependencies/` exists

Authentication logic such as identifying the logged-in coach is needed by Team, Player, and Lineup routers.

Instead of repeating JWT decoding everywhere, we use:

```text
backend/app/dependencies/auth.py
```

with:

```python
get_current_coach()
```

Protected routes declare:

```python
current_coach: Coach = Depends(get_current_coach)
```

## Router vs Main

`main.py` stays focused on setup and router registration:

```python
app.include_router(auth_router)
app.include_router(team_router)
app.include_router(player_router)
app.include_router(lineup_router)
```

If a router file exists but is not included, its endpoints do not appear in Swagger.

## Request mental model

```text
HTTP request
   ↓
Router
   ↓
Pydantic schema
   ↓
Dependencies: DB + current coach
   ↓
SQLAlchemy ORM
   ↓
SQLite
   ↓
Response schema
   ↓
JSON
```

For Lineup creation there is also an associative-table step:

```text
Team
 ↓
Lineup
 ↓
LineupPlayer
 ↓
Player
```

## Git workflow structure

The code repository uses feature branches instead of daily work directly on `main`.

Example:

```text
main
 ├── backend/lineup-api
 └── frontend/setup
```

See **GitHub Team Workflow** for the exact commands and collaboration rules.

## Generated/local files

`__pycache__`, `.pyc`, `venv`, `.env`, local `.db` files, and future frontend dependency/build folders are not part of source control and are excluded through the repository-root `.gitignore`.
