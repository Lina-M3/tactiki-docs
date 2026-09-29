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
│   │   └── coach.py
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   └── auth.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── security.py
│
├── venv/
├── requirements.txt
└── tactiki.db
```

## Responsibility of each area

| File / folder | Responsibility |
|---|---|
| `app/main.py` | Creates FastAPI app, creates tables, registers routers |
| `app/database.py` | Engine, sessions, Base, `get_db()` |
| `app/models/` | Database table definitions using SQLAlchemy ORM |
| `app/schemas/` | Request/response shapes using Pydantic |
| `app/routers/` | API endpoints grouped by feature |
| `app/utils/` | Shared helpers such as password hashing |
| `tactiki.db` | Local SQLite database file |
| `requirements.txt` | Python dependencies for reproducing the environment |

## Model vs Schema — very important

This distinction is easy to mix up:

### SQLAlchemy Model

Represents how data is stored in the **database**.

Example:

```python
class Coach(Base):
    __tablename__ = "coaches"
    ...
```

### Pydantic Schema

Represents the shape of data entering or leaving the **API**.

Example:

```python
class CoachCreate(BaseModel):
    full_name: str
    email: EmailStr
    university: str
    password: str
```

:::tip بالعربي
**Model = شكل الجدول في قاعدة البيانات**  
**Schema = شكل البيانات في الـ request أو response**
:::

This is why the signup request contains `password`, while the database model stores `password_hash`.

## Router vs Main

`main.py` should stay focused on application setup.

Feature endpoints live in routers such as:

```text
app/routers/auth.py
```

and are connected to the main app with:

```python
app.include_router(auth_router)
```

If we forget this line, the router file may exist but its endpoints will not appear in Swagger.

## Why all the `__init__.py` files?

An `__init__.py` file helps Python treat a directory as a package that can be imported.

For example:

```python
from app.models.coach import Coach
```

## What is `__pycache__`?

Python may automatically create folders named:

```text
__pycache__
```

They store compiled bytecode files such as `.pyc`.

They are normal and **not part of the application design**.

Later, we should keep them out of Git using a backend `.gitignore` entry:

```text
__pycache__/
*.pyc
venv/
```

## Mental model

Think of the backend like this:

```text
main.py
  └── includes router
        └── receives schema
              └── works with model
                    └── uses database session
                          └── saves/reads database
```

🧠 If you can explain that chain clearly, you understand most of the backend architecture we have built so far.
