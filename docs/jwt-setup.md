---
sidebar_position: 6
title: JWT Setup
---

# JWT Setup — Current Checkpoint

This page records exactly where we stopped in the JWT stage.

## Why JWT comes after login

The login endpoint already proves that the email and password are correct.

JWT adds the next capability:

```text
Correct credentials
       ↓
Create signed access token
       ↓
Frontend keeps token temporarily
       ↓
Frontend sends token with later requests
       ↓
Backend validates token
       ↓
Protected endpoint knows which coach is calling
```

Without the token, our current login only verifies credentials for that single request.

## Packages

For this stage we added:

```powershell
pip install pyjwt python-dotenv
```

## Environment configuration

We created a root-level `.env` file.

Structure:

```env
SECRET_KEY=<private-random-value>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Generate a secret key

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

:::danger
Never put the real `SECRET_KEY` in this notebook, screenshots, GitHub commits, or messages.
:::

## Protecting local/private files

The root project `.gitignore` now includes:

```gitignore
# Environment variables / secrets
.env

# Virtual environment
venv/

# Python cache
__pycache__/
*.pyc

# Local database
tactiki.db
*.db

# Misc
.DS_Store
```

Note: the `venv` directory may also contain its own automatically created `.gitignore`. We intentionally created **another `.gitignore` at the project root**, because that is the one that protects the whole backend repository.

## Current `create_access_token()`

File:

```text
app/utils/security.py
```

Core logic:

```python
import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)


def create_access_token(data: dict):
    # Work on a copy so we do not mutate the caller's dictionary.
    to_encode = data.copy()

    # Calculate token expiration in UTC.
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Add standard expiration claim.
    to_encode.update({"exp": expire})

    # Sign and encode the token.
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
```

## Why `data.copy()`?

If we wrote directly into the original dictionary, adding `exp` would modify the object passed by the caller.

Using:

```python
to_encode = data.copy()
```

keeps the function safer and easier to reason about.

## Why UTC?

Authentication timestamps should not depend on a user's local timezone.

We use:

```python
datetime.now(timezone.utc)
```

so the token expiration is based on a consistent global time reference.

## Claims we are using

### `exp`

Expiration time. After this time, the token should no longer be accepted.

### `sub`

Subject. We plan to put the coach identifier here:

```python
{"sub": "1"}
```

That lets later validation identify the authenticated coach.

## Important security idea

JWT is not a password vault.

Do not put these inside the payload:

```text
password
password_hash
SECRET_KEY
private personal data that does not need to be there
```

## Exact next test

We stopped before running:

```powershell
python -c "from app.utils.security import create_access_token; print(create_access_token({'sub': '1'}))"
```

Expected: a long token string, often beginning with:

```text
eyJ...
```

We only need to confirm that it appears. We do **not** need to share the full token.

## After that test

Next coding steps:

```text
1. Create a token response schema.
2. Change POST /auth/login to return:
   access_token
   token_type = "bearer"
3. Decode and validate incoming tokens.
4. Build a current-coach dependency.
5. Add GET /auth/me.
6. Use Swagger Authorize 🔒.
7. Test missing / invalid / expired tokens.
```
