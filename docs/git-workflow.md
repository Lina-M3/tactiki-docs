---
sidebar_position: 5
title: GitHub Team Workflow
---

# GitHub Team Workflow

Tactiki now uses a shared GitHub repository for the actual project code and a separate repository for documentation.

## Repository layout

### Main project code

Repository:

```text
Lina-M3/tactiki
```

Current plan:

```text
tactiki/
├── backend/      ← FastAPI backend
├── frontend/     ← teammate frontend work
├── .gitignore
└── README.md
```

### Documentation site

Separate repository:

```text
Lina-M3/tactiki-docs
```

This keeps the living notebook / GitHub Pages site independent from the application source code.

## Why one code repository?

For this graduation project, one monorepo makes it easier to keep compatible frontend and backend versions together:

```text
same project commit history
same README
shared integration changes
one place for final submission
```

The frontend and backend are still separate applications. They communicate through HTTP APIs; being in the same repository is an organization choice, not the API connection itself.

## Local backend path

Current backend working path:

```text
C:\Users\ACER\tactiki\backend
```

The old `tactiki-backend` folder is only a temporary backup and should not be used for new development.

## Git ignore safety

The repository root `.gitignore` protects local/private data such as:

```text
**/.env
**/venv/
**/__pycache__/
**/*.pyc
**/*.db
**/node_modules/
**/dist/
**/build/
**/.next/
```

Important rule:

> `.env`, local database files, virtual environments, and frontend dependency folders must never be committed.

Before an important first commit, we verified ignored files with:

```powershell
git check-ignore -v backend/.env backend/tactiki.db backend/venv/
```

and inspected all untracked files with:

```powershell
git status --untracked-files=all
```

## Team branch rule

`main` should stay stable.

Do not use `main` as the everyday coding branch.

Example backend feature:

```powershell
git switch main
git pull origin main
git switch -c backend/lineup-api
```

Example frontend feature:

```powershell
git switch main
git pull origin main
git switch -c frontend/login-page
```

If a branch already exists, do **not** use `-c` again:

```powershell
git switch backend/lineup-api
```

## Save a completed feature

After coding and Swagger testing:

```powershell
git status
git add backend
git commit -m "feat(backend): add lineup API"
git push -u origin backend/lineup-api
```

Then create a Pull Request:

```text
backend/lineup-api
        ↓
       main
```

Frontend follows the same pattern with `git add frontend` and a frontend branch.

## Rules between teammates

```text
1. Pull latest main before starting a new feature.
2. Create a feature branch.
3. Backend owner normally edits backend/.
4. Frontend owner normally edits frontend/.
5. Do not push secrets or local generated files.
6. Coordinate before changing shared root files such as README or .gitignore.
7. Test before opening the Pull Request.
8. Merge stable work into main; do not use main as scratch space.
```

## Terminal organization

To avoid confusion in VS Code, we use two clear terminal roles.

### `BACKEND SERVER`

```powershell
cd C:\Users\ACER\tactiki\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Leave this terminal running while testing.

### `TACTIKI - GIT`

Usually stays at:

```text
C:\Users\ACER\tactiki
```

Use it for:

```text
git status
git add
git commit
git push
git pull
git switch
```

## Why the Uvicorn terminal looks frozen

When this command runs:

```powershell
uvicorn app.main:app --reload
```

Uvicorn occupies that terminal and waits for HTTP requests. This is normal.

Either:

```text
leave it running + use another terminal
```

or stop it by actually pressing:

```text
Ctrl+C
```

## Frontend ↔ backend connection later

Repository structure does not perform the connection.

The connection is:

```text
Frontend
   ↓ HTTP request
FastAPI API
   ↓
Database
   ↓ JSON response
Frontend
```

Later integration work will include:

```text
CORS configuration in FastAPI
frontend API base URL from .env
JWT login/token handling
real API calls instead of mock data
```

A local address such as:

```text
http://127.0.0.1:8000
```

belongs to the machine running the backend. A teammate on another computer cannot use that address to reach your local server unless she runs the backend herself or the backend is deployed/shared over the network.
