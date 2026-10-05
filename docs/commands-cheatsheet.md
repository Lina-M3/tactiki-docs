---
sidebar_position: 8
title: Commands Cheat Sheet
---

# Commands Cheat Sheet

هذه الصفحة مرجع سريع للأوامر والمسارات اللي نحتاجها كثير.

## Activate environment

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation for the current session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

## Run backend

```powershell
uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Stop Uvicorn:

```text
Press Ctrl+C
```

## Core packages

```powershell
pip install fastapi uvicorn sqlalchemy
pip install email-validator
pip install "passlib[bcrypt]"
pip install bcrypt==4.0.1
pip install pyjwt python-dotenv
```

## Package inspection

```powershell
pip show passlib
pip show bcrypt
pip show PyJWT
pip freeze
pip freeze > requirements.txt
```

## Generate JWT secret

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Put the result in `.env`. Never commit/share the real secret.

## Password helper test

```powershell
python -c "from app.utils.security import hash_password, verify_password; h=hash_password('Test1234'); print(h); print(verify_password('Test1234', h)); print(verify_password('Wrong123', h))"
```

Expected final booleans:

```text
True
False
```

## Swagger authentication shortcut

```text
POST /auth/login
→ copy access_token
→ Authorize 🔒
→ paste token only
→ Authorize
```

Protected requests should contain:

```text
Authorization: Bearer eyJ...
```

Quick token/current-user test:

```text
GET /auth/me
```

## Endpoint map

### Authentication

```text
POST /auth/signup
POST /auth/login
GET  /auth/me
```

### Teams

```text
POST   /teams
GET    /teams
GET    /teams/{team_id}
PATCH  /teams/{team_id}
DELETE /teams/{team_id}
```

### Players

```text
POST   /teams/{team_id}/players
GET    /teams/{team_id}/players
GET    /teams/{team_id}/players/{player_id}
PATCH  /teams/{team_id}/players/{player_id}
DELETE /teams/{team_id}/players/{player_id}
GET    /teams/{team_id}/players/{player_id}/progress
```

## HTTP memory trick

```text
POST   = create
GET    = read
PATCH  = partial update
DELETE = remove/deactivate
```

## Overall score formula

Current implementation:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

Rounded to 2 decimal places.

## Useful status codes

```text
200 = success
201 = created
204 = delete/no response body where configured
400 = business rule failed (duplicate)
401 = auth missing/invalid
404 = resource missing/not owned
422 = request validation failed
500 = backend error → inspect terminal traceback
```

## Root `.gitignore`

```gitignore
.env
venv/
__pycache__/
*.pyc
tactiki.db
*.db
.DS_Store
```

## Debugging checklist

```text
1. Is (venv) active?
2. Is Uvicorn running?
3. Did I save the file?
4. Did the reload happen?
5. Does /docs show the new route?
6. Am I Authorized 🔒?
7. What status code did I get?
8. What does response body say?
9. What does terminal traceback say?
10. Did I accidentally run POST when I only wanted GET?
```
