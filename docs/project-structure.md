---
sidebar_position: 3
title: Project Structure
---

# Project Structure

The backend is being divided by responsibility rather than placing everything inside `main.py`.

```text
tactiki-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── coach.py
│   │   ├── team.py
│   │   ├── player.py
│   │   ├── player_progress.py
│   │   ├── lineup.py
│   │   └── lineup_player.py
│   ├── routers/
│   ├── schemas/
│   └── utils/
├── venv/
├── requirements.txt
└── tactiki.db
```

## Main responsibilities

| Location | Responsibility |
|---|---|
| `main.py` | Creates the FastAPI app and registers routers |
| `database.py` | Database engine, session, and Base |
| `models/` | SQLAlchemy ORM models |
| `schemas/` | Pydantic request/response models |
| `routers/` | API endpoint groups |
| `utils/` | Shared helper logic such as security |

## What is `__pycache__`?

Python creates `__pycache__` automatically to store compiled bytecode files.

It is normal, it is not a feature of Tactiki, and we do not manually edit it.
