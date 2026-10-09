---
sidebar_position: 8
title: Commands Cheat Sheet
---

# Commands Cheat Sheet

هذه الصفحة مرجع سريع للأوامر والمسارات اللي نحتاجها كثير.

## Main local paths

Project root:

```text
C:\Users\ACER\tactiki
```

Backend:

```text
C:\Users\ACER\tactiki\backend
```

## `BACKEND SERVER` terminal

```powershell
cd C:\Users\ACER\tactiki\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Stop Uvicorn by actually pressing:

```text
Ctrl+C
```

:::tip
While Uvicorn is running, that terminal is intentionally busy. Use a second terminal for Git commands.
:::

## `TACTIKI - GIT` terminal

```powershell
cd C:\Users\ACER\tactiki
```

Check current state:

```powershell
git status
```

Start a new backend feature from latest main:

```powershell
git switch main
git pull origin main
git switch -c backend/feature-name
```

Return to an existing branch:

```powershell
git switch backend/lineup-api
```

Save completed backend feature:

```powershell
git status
git add backend
git commit -m "feat(backend): describe feature"
git push -u origin branch-name
```

Then open a Pull Request to `main`.

## Git ignore verification

```powershell
git check-ignore -v backend/.env backend/tactiki.db backend/venv/
```

Show every untracked source file:

```powershell
git status --untracked-files=all
```

Never commit:

```text
.env
venv/
*.db
__pycache__/
node_modules/
build output
```

## Install backend dependencies

From `backend/`:

```powershell
pip install -r requirements.txt
```

Refresh dependency lock-style snapshot:

```powershell
pip freeze > requirements.txt
```

## Package inspection

```powershell
pip show passlib
pip show bcrypt
pip show PyJWT
pip freeze
```

## Generate JWT secret

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Put the result in `backend/.env`. Never commit/share the real secret.

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

Quick current-user test:

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

### Lineups

```text
POST   /teams/{team_id}/lineups
GET    /teams/{team_id}/lineups
GET    /teams/{team_id}/lineups/{lineup_id}
PATCH  /teams/{team_id}/lineups/{lineup_id}
DELETE /teams/{team_id}/lineups/{lineup_id}
```

## HTTP memory trick

```text
POST   = create
GET    = read
PATCH  = partial update
DELETE = remove/deactivate
```

## Overall score formula

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

Rounded to 2 decimal places.

## `flush()` vs `commit()`

Used during Lineup creation:

```text
flush  = send pending DB work / obtain generated lineup_id
commit = finalize the transaction
```

## Useful status codes

```text
200 = success
201 = created
204 = delete/no body where configured
400 = business rule failed
401 = auth missing/invalid
404 = resource missing/not owned
422 = request validation failed
500 = backend error → inspect Uvicorn traceback
```

## Debugging checklist

```text
1. Am I in C:\Users\ACER\tactiki, not the old tactiki-backend folder?
2. Is (venv) active in the backend terminal?
3. Is Uvicorn running?
4. Did I save the file?
5. Did StatReload reload?
6. Does /docs show the route?
7. Am I Authorized 🔒?
8. What status code/body did I get?
9. What does the Uvicorn traceback say?
10. Did I accidentally run POST when I only wanted GET?
11. Am I on the correct Git feature branch?
```
