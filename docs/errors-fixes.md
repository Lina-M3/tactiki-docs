---
sidebar_position: 9
title: Errors & Fixes
---

# Errors & Fixes

This is the project's debugging diary.

The goal is not just to remember the fix. We want to remember **how we reasoned about the problem**.

## Error 1 — Signup returned 500

Swagger returned `500 Internal Server Error` and the traceback pointed into password hashing.

Installed versions at the time:

```text
passlib 1.7.4
bcrypt 5.0.0
```

Fix:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

Lesson: a dependency traceback may be a version-compatibility problem rather than endpoint logic.

---

## Error 2 — Signup returned 400 after the bcrypt fix

Response:

```json
{
  "detail": "Email already registered"
}
```

This was intentional duplicate validation, not a crash.

Lesson: always read the status code **and response body** before deciding the backend is broken.

---

## Error 3 — PowerShell `Ctrl + C`

Typing literal text `Ctrl + C` is not the same as pressing the keyboard shortcut.

Correct action: hold **Ctrl** and press **C**.

---

## Error 4 — Swagger stopped opening after JWT login edit

Uvicorn showed:

```text
SyntaxError: unmatched ')'
```

Then VS Code showed:

```text
"return" can be used only within a function
"coach" is not defined
```

Root cause: token creation/return code had incorrect parentheses/indentation and fell outside `login()`.

Lesson: Python indentation is structural, not cosmetic.

---

## Error 5 — Protected route returned 401

Swagger showed:

```text
401 Unauthorized
Not authenticated
```

The generated request did not contain an Authorization header.

Fix:

```text
POST /auth/login
→ copy access_token
→ Authorize 🔒
→ paste token
→ retry route
```

Lesson: check `Authorization: Bearer ...` before debugging database code.

---

## Error 6 — Repeated Execute kept creating teams

Repeated:

```text
POST /teams
```

created multiple rows.

This is correct HTTP behavior: POST means create.

Fixes:

1. Clean duplicate test rows with DELETE.
2. Add duplicate-name business rule.
3. Use GET when the intent is only to view data.

---

## Error 7 — GET route existed but did not appear in Swagger

The code was present but the running app had not loaded it.

Fix:

```text
Ctrl+S
verify StatReload / restart Uvicorn
refresh Swagger
```

Lesson: if valid route code is missing from Swagger, first verify save/reload state.

---

## Error 8 — Overall score stayed fixed after skill update

Skill fields changed but `overall_score` remained old.

Root cause: it was initially treated as a normal client input field rather than a derived server value.

Fix:

```text
OverallScore = average of six skills
```

and remove `overall_score` from Player create/update input schemas.

Lesson: derived values should usually be calculated in one trusted layer.

---

## Error 9 — `requirements.txt` not found after creating the monorepo

We created:

```text
C:\Users\ACER\tactiki\backend
```

but initially copied `app`, `.env`, `requirements.txt`, and `tactiki.db` into the **repository root** instead of `backend/`.

Running:

```powershell
pip install -r requirements.txt
```

inside `backend` returned:

```text
No such file or directory: 'requirements.txt'
```

Fix: move backend files into:

```text
tactiki/backend/
```

After that, install dependencies from the correct folder.

Lesson: command failures can be caused by the current working directory / project layout, not package problems.

---

## Error 10 — `.gitignore` did not ignore secrets

The file had accidentally been named:

```text
gitignore
```

without the leading dot.

Git therefore treated `.env`, DB, and venv as ordinary untracked files.

Fix:

```powershell
Rename-Item gitignore .gitignore
```

Then verify with:

```powershell
git check-ignore -v backend/.env backend/tactiki.db backend/venv/
```

Lesson: `.gitignore` must have the exact filename including the dot.

---

## Error 11 — Git said `not a git repository`

We ran Git commands while the terminal was in the old folder:

```text
C:\Users\ACER\tactiki-backend
```

instead of the cloned repository:

```text
C:\Users\ACER\tactiki
```

Fix:

```powershell
cd C:\Users\ACER\tactiki
```

Lesson: always check the prompt path before Git operations.

---

## Error 12 — Uvicorn terminal would not accept new commands

After:

```powershell
uvicorn app.main:app --reload
```

it looked like the terminal was stuck.

This is normal: the server process is running and waiting for requests.

Current workflow:

```text
BACKEND SERVER → leave Uvicorn running
TACTIKI - GIT  → use separate terminal for Git/other commands
```

Lesson: a running development server occupies its terminal by design.

---

## Error 13 — Branch already exists

We ran:

```powershell
git switch -c backend/lineup-api
```

after the branch had already been created.

Git returned:

```text
fatal: a branch named 'backend/lineup-api' already exists
```

Fix for an existing branch:

```powershell
git switch backend/lineup-api
```

Lesson: `-c` means **create** a new branch; omit it when switching to an existing branch.

---

## Documentation website errors

### GitHub Pages deployment: missing lock file for npm cache

The initial workflow enabled npm caching before a dependency lock file existed. We removed that cache setting for the first deployment.

### GitHub Pages not enabled

Docusaurus built successfully, but Pages hosting was not yet configured.

Fix:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

Lesson: application build success and hosting configuration are separate layers.

---

## Debugging template

```text
Problem:
Where it appeared:
Status code / error message:
Relevant traceback:
What we suspected:
What we tested:
Root cause:
Fix:
How we verified the fix:
Lesson:
```
