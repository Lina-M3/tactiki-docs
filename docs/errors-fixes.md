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

Important messages included problems reading the bcrypt version and an error related to bcrypt password handling.

### What we checked

We inspected installed versions:

```powershell
pip show passlib
pip show bcrypt
```

Results at that time:

```text
passlib 1.7.4
bcrypt 5.0.0
```

Then we isolated the hashing function:

```powershell
python -c "from app.utils.security import hash_password; print(hash_password('Test1234'))"
```

It failed outside the API too.

### Why that test mattered

If direct `hash_password(...)` fails, the problem is below the router layer.

That told us not to waste time rewriting the signup endpoint before checking dependencies.

### Fix that worked

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

After that, direct hashing succeeded.

### Lesson

🧠 A traceback inside a dependency can mean **version incompatibility**, even when our own code is logically correct.

---

## Error 2 — Signup returned 400 after the fix

After fixing bcrypt, we executed signup again and saw:

```text
400 Bad Request
```

with:

```json
{
  "detail": "Email already registered"
}
```

At first glance that looked like another failure.

But it actually meant the email already existed in the database, so this block was working:

```python
if existing_coach:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email already registered"
    )
```

### Lesson

🧠 A `4xx` response may be intentional validation. Always read the response body before deciding something is broken.

---

## Error 3 — PowerShell `Ctrl + C`

Typing:

```text
Ctrl + C
```

as literal text is not the same as pressing the shortcut.

Correct action:

```text
Hold Ctrl and press C
```

This stops the running Uvicorn process.

---

## Documentation website errors

We also debugged the notebook site itself.

### First GitHub Pages deployment failure

The GitHub Actions workflow enabled npm caching, but the repository did not yet have a dependency lock file.

The workflow failed during Node setup because it expected one of:

```text
package-lock.json
npm-shrinkwrap.json
yarn.lock
```

We removed the cache setting from the workflow for the initial deployment.

### Second deployment failure

Docusaurus built successfully, but GitHub Pages was not enabled for the repository.

The build reached:

```text
Generated static files in "build"
```

then failed at the Pages configuration step.

Fix:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

After Pages was enabled, the deployment could be rerun and the site opened successfully.

### Lesson

The application build and hosting configuration are two different layers.

A project can **build successfully** while deployment still fails because the hosting service is not configured.

---

## Debugging template for future errors

When a new error happens, add it here using:

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

This format will make the final project discussion much easier because we can explain our troubleshooting process clearly.
