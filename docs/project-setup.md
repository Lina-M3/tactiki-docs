---
sidebar_position: 2
title: Project Setup
---

# Project Setup

This section records how the Tactiki backend was created and verified before adding application features.

## 1. Create the project environment

A Python virtual environment was created:

```powershell
python -m venv venv
```

Then it was activated before installing project dependencies.

### Why use a virtual environment?

A virtual environment isolates Tactiki's Python packages from the rest of the computer. This avoids version conflicts with unrelated Python projects and makes the project easier to reproduce.

## 2. Install the backend foundation

The initial packages included:

```powershell
pip install fastapi uvicorn sqlalchemy
```

- **FastAPI** provides the API framework.
- **Uvicorn** runs the ASGI application.
- **SQLAlchemy** handles ORM/database interaction.

## 3. Create the FastAPI application

The application lives in:

```text
app/main.py
```

The first root endpoint returned:

```json
{
  "message": "Tactiki Backend is running successfully"
}
```

## 4. Run the server

```powershell
uvicorn app.main:app --reload
```

The `--reload` flag is useful during development because Uvicorn reloads the app when source files change.

## 5. Verify through Swagger

FastAPI automatically exposes interactive API documentation at:

```text
/docs
```

We verified the backend there before moving to database and authentication work.

:::info Why this order matters
We first prove that the smallest version of the application runs. Then, if a later step breaks, we can isolate which new layer introduced the problem.
:::
