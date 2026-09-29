---
sidebar_position: 2
title: Project Setup
---

# Project Setup

This page records how the backend started from an empty folder until FastAPI was running successfully.

## 1. Project folder

The backend project folder is:

```text
tactiki-backend
```

We opened this folder in VS Code and built the backend inside it.

## 2. Create a virtual environment

We created a Python virtual environment:

```powershell
python -m venv venv
```

### Why?

Without a virtual environment, Python packages may be installed globally and conflict with packages from other projects.

With `venv`, Tactiki has its own isolated Python environment.

:::tip تذكري
إذا ظهر `(venv)` في بداية سطر PowerShell فهذا غالبًا يعني أن البيئة الافتراضية مفعلة.
:::

A typical activation command on Windows PowerShell is:

```powershell
.\venv\Scripts\Activate.ps1
```

## 3. Install the initial backend packages

The first packages installed were:

```powershell
pip install fastapi uvicorn sqlalchemy
```

### What does each package do?

| Package | Job |
|---|---|
| `fastapi` | Builds API routes and handles requests/responses |
| `uvicorn` | Runs the FastAPI application |
| `sqlalchemy` | Connects Python objects to the database |

Later, authentication required additional packages such as:

```powershell
pip install email-validator
pip install "passlib[bcrypt]"
```

We later pinned bcrypt to a compatible version:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

## 4. First `main.py`

The first working FastAPI application was intentionally small:

```python title="app/main.py — first working version"
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

### Why begin with one simple endpoint?

Because it proves several things at once:

- Python can import the project.
- FastAPI starts correctly.
- Uvicorn can run the app.
- The browser can reach the backend.
- We have a known-good checkpoint before adding the database.

## 5. Run the backend

```powershell
uvicorn app.main:app --reload
```

Breakdown:

```text
uvicorn       → run the ASGI server
app.main      → open app/main.py as a Python module
:app          → use the FastAPI object named "app"
--reload      → restart automatically when source files change
```

:::warning
To stop Uvicorn, **press Ctrl+C on the keyboard**. Do not type the literal words `Ctrl + C` into PowerShell.
:::

## 6. Verify the root endpoint

The root endpoint returned HTTP `200 OK` with:

```json
{
  "message": "Tactiki Backend is running successfully"
}
```

That was our first successful backend checkpoint.

## 7. Open Swagger UI

FastAPI generates interactive API documentation automatically.

Local URL:

```text
http://127.0.0.1:8000/docs
```

Swagger became our main way to test backend endpoints before connecting the React frontend.

## 8. Save dependencies

We initially generated `requirements.txt` with:

```powershell
pip freeze > requirements.txt
```

⚠️ **Current reminder:** additional packages were installed later and bcrypt was downgraded after that first freeze.

Before the next major checkpoint, run again:

```powershell
pip freeze > requirements.txt
```

This keeps the dependency file consistent with the environment that actually works.

## Checkpoint

At the end of this stage:

```text
FastAPI app ✅
Uvicorn ✅
Root endpoint ✅
Swagger UI ✅
Ready for database setup ✅
```
