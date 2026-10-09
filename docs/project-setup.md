---
sidebar_position: 2
title: Project Setup
---

# Project Setup

This page records how the backend started and how its **current working location** differs from the original folder.

## 1. Original backend folder

The backend originally started in:

```text
C:\Users\ACER\tactiki-backend
```

That folder was where the first FastAPI/database/authentication work was built.

## 2. Current project location

The project was later moved into the shared GitHub monorepo:

```text
C:\Users\ACER\tactiki\backend
```

Current source-control repository:

```text
Lina-M3/tactiki
```

The old `tactiki-backend` folder should now be treated only as a temporary backup; new development belongs in the monorepo copy.

## 3. Virtual environment

Inside the current backend folder:

```powershell
cd C:\Users\ACER\tactiki\backend
python -m venv venv
```

Activate on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation for that session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

### Why use `venv`?

It isolates Tactiki's Python dependencies from global packages and other projects.

:::tip تذكري
إذا ظهر `(venv)` في بداية سطر PowerShell فهذا يعني أن البيئة الافتراضية مفعلة.
:::

## 4. Install dependencies

The backend started with:

```powershell
pip install fastapi uvicorn sqlalchemy
```

Authentication later added packages such as:

```powershell
pip install email-validator
pip install "passlib[bcrypt]"
pip install pyjwt python-dotenv
```

A Passlib/bcrypt compatibility issue was fixed with:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

In the monorepo, the normal reproducible setup is now:

```powershell
pip install -r requirements.txt
```

## 5. First `main.py`

The first working FastAPI app was intentionally minimal:

```python
from fastapi import FastAPI

app = FastAPI(
    title="Tactiki API",
    description="Backend API for Tactiki football decision support system",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Tactiki Backend is running successfully"
    }
```

That small endpoint proved Python imports, FastAPI, Uvicorn, and browser access before database complexity was added.

## 6. Run the current backend

From:

```text
C:\Users\ACER\tactiki\backend
```

run:

```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Breakdown:

```text
uvicorn       → run ASGI server
app.main      → import backend/app/main.py as module app.main
:app          → use the FastAPI object named app
--reload      → restart server when Python source changes
```

To stop it, actually press:

```text
Ctrl+C
```

## 7. Swagger

Local Swagger UI:

```text
http://127.0.0.1:8000/docs
```

Swagger is our main manual backend-testing tool before frontend integration.

## 8. Dependency snapshot

After authentication packages and the bcrypt fix, we refreshed the dependency file with:

```powershell
pip freeze > requirements.txt
```

The new monorepo virtual environment was then successfully reconstructed using:

```powershell
pip install -r requirements.txt
```

and Uvicorn started successfully from the new `tactiki/backend` location.

## 9. Source-control safety

The repository-root `.gitignore` excludes local/private files including:

```text
backend/.env
backend/venv/
backend/tactiki.db
__pycache__/
*.pyc
```

and future frontend generated folders such as `node_modules` and build output.

We explicitly verified ignored files before the first backend push.

## Current checkpoint

```text
Original standalone backend ✅ migrated
Shared tactiki monorepo ✅
Fresh backend venv ✅
requirements install ✅
Uvicorn from new path ✅
Swagger from new path ✅
Initial backend GitHub push ✅
Feature-branch workflow ✅
```
