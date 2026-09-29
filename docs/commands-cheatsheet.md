---
sidebar_position: 8
title: Commands Cheat Sheet
---

# Commands Cheat Sheet

هذه الصفحة سريعة جدًا — للأوامر اللي نحتاج نرجع لها بدون ما ندور في كل التوثيق.

## Environment

Create virtual environment:

```powershell
python -m venv venv
```

Activate on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

## Install current foundation

```powershell
pip install fastapi uvicorn sqlalchemy
```

Authentication helpers used so far:

```powershell
pip install email-validator
pip install "passlib[bcrypt]"
```

bcrypt version that fixed our compatibility problem:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

## Run backend

```powershell
uvicorn app.main:app --reload
```

Open Swagger:

```text
http://127.0.0.1:8000/docs
```

Stop server:

```text
Press Ctrl+C
```

## Inspect package versions

```powershell
pip show passlib
pip show bcrypt
```

List installed packages:

```powershell
pip freeze
```

Write them to `requirements.txt`:

```powershell
pip freeze > requirements.txt
```

:::warning Current reminder
We installed packages and changed bcrypt **after** the first requirements export. Run `pip freeze > requirements.txt` again before we treat the environment as finalized.
:::

## Test password hashing directly

This was useful because it isolates password hashing from FastAPI and the database:

```powershell
python -c "from app.utils.security import hash_password; print(hash_password('Test1234'))"
```

If this command fails, we know the problem is in the hashing layer/dependencies, not necessarily in the signup route.

## Useful mental commands

When debugging, ask:

```text
1. Is (venv) active?
2. Is Uvicorn still running?
3. Does /docs open?
4. What status code did Swagger return?
5. What does the terminal traceback say?
6. Is the failing line ours or inside a dependency?
7. Did package versions change?
```
