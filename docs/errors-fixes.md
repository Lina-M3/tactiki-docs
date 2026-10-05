---
sidebar_position: 9
title: Errors & Fixes
---

# Errors & Fixes

This is the project's debugging diary.

The goal is not just to remember the fix. We want to remember **how we reasoned about the problem**.

## Error 1 — Signup returned 500

### What we saw

Swagger returned:

```text
500 Internal Server Error
```

The traceback pointed into password hashing.

Installed versions at the time:

```text
passlib 1.7.4
bcrypt 5.0.0
```

### Fix

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

We verified hashing directly before retrying the API.

### Lesson

A traceback inside a dependency may be a **version compatibility** problem rather than endpoint logic.

---

## Error 2 — Signup returned 400 after the bcrypt fix

Response:

```json
{
  "detail": "Email already registered"
}
```

This was not a new crash. The account had already been created, so the duplicate rule was working.

### Lesson

A `4xx` may be intentional business validation. Always read the response body.

---

## Error 3 — PowerShell `Ctrl + C`

Typing the literal text:

```text
Ctrl + C
```

is not the same as pressing the keyboard shortcut.

Correct action: hold **Ctrl** and press **C** to stop Uvicorn.

---

## Error 4 — Swagger stopped opening after JWT login edit

Uvicorn showed:

```text
SyntaxError: unmatched ')'
```

in:

```text
app/routers/auth.py
```

After fixing the extra parenthesis, VS Code also showed:

```text
"return" can be used only within a function
"coach" is not defined
```

The JWT return block had the wrong indentation and had fallen outside `login()`.

### Fix

Move the token-creation and `return` block inside the function indentation.

### Lesson

Python structure depends on indentation. A block that visually looks close to a function can still be completely outside it.

---

## Error 5 — `POST /teams` returned 401 Not authenticated

Swagger showed:

```text
401 Unauthorized
```

```json
{
  "detail": "Not authenticated"
}
```

The generated Curl did not contain:

```text
Authorization: Bearer ...
```

### Root cause

Swagger was no longer authorized with the JWT.

### Fix

```text
POST /auth/login
→ copy access_token
→ Authorize 🔒
→ paste token
→ retry protected route
```

### Lesson

If a protected endpoint suddenly returns 401, check the **Authorization header** before debugging database code.

---

## Error 6 — Repeated Execute kept creating teams

We repeatedly executed:

```text
POST /teams
```

and got team IDs 1, 2, 3, 4.

This was expected HTTP behavior: every successful POST was a new create request.

### What we changed

1. Used `DELETE /teams/{team_id}` to clean test duplicates.
2. Added a rule preventing the same coach from creating the same `team_name` again.
3. Used `GET /teams` when we only wanted to view existing teams.

### Lesson

```text
POST = create
GET  = read
```

Swagger's Execute button runs the endpoint; it is not just a preview button.

---

## Error 7 — `GET /teams` code existed but did not appear in Swagger

The route was present in `app/routers/team.py`, but Swagger still showed only POST.

### Fix

```text
Ctrl+S
restart/reload Uvicorn if needed
Ctrl+F5 Swagger page
```

After reload, `GET /teams` appeared.

### Lesson

If valid route code is missing from Swagger, first verify the file was saved and the running server loaded the newest code.

---

## Error 8 — Overall score stayed fixed after skill update

We changed:

```json
{
  "speed": 90,
  "stamina": 91
}
```

but `overall_score` stayed at the old value.

### Root cause

At first, `overall_score` was treated like a normal input field. The PATCH endpoint only updated explicitly supplied fields, so there was no automatic recalculation.

### Fix

We moved responsibility to the backend:

```text
OverallScore = average of six skills
```

and removed `overall_score` from `PlayerCreate` and `PlayerUpdate` input schemas.

Now the server recalculates it after skill changes.

### Lesson

Derived values should usually be calculated by one trusted layer instead of letting clients submit inconsistent values.

---

## Documentation website errors

### GitHub Pages deployment: missing lock file for npm cache

The initial workflow enabled npm caching before a dependency lock file existed.

We removed that cache setting for the first deployment.

### GitHub Pages not enabled

Docusaurus built successfully, but hosting configuration still failed.

Fix:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

### Lesson

Build success and hosting configuration are separate layers.

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
