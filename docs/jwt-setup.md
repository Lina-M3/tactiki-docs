---
sidebar_position: 6
title: JWT Setup
---

# JWT Setup — Completed Checkpoint

JWT is now fully connected to login and protected routes.

## Why JWT comes after login

Login proves the credentials are correct. JWT lets the backend remember that authenticated identity across later requests without asking for the password again.

```text
Correct credentials
       ↓
Create signed access token
       ↓
Client sends token with later requests
       ↓
Backend validates token
       ↓
Protected endpoint knows which coach is calling
```

## Packages

```powershell
pip install pyjwt python-dotenv
```

Installed environment confirmed PyJWT successfully.

## Environment configuration

Root `.env`:

```env
SECRET_KEY=<private-random-value>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a secret when needed:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

:::danger
Never place the real `SECRET_KEY` in this notebook, screenshots, messages, or GitHub commits.
:::

## Access-token creation

File:

```text
app/utils/security.py
```

```python
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
```

Login calls it with:

```python
create_access_token(
    data={"sub": str(coach.coach_id)}
)
```

### Claims used

- `sub` = subject, currently the coach ID.
- `exp` = expiration time.

## Login response

`POST /auth/login` now returns:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

The schema is:

```python
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
```

## Token validation

We added:

```python
def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except jwt.InvalidTokenError:
        return None
```

The function rejects invalid/expired JWTs through PyJWT validation.

## Current-coach dependency

File:

```text
app/dependencies/auth.py
```

It uses `HTTPBearer()` and follows this chain:

```text
Authorization header
      ↓
Bearer token
      ↓
decode_access_token()
      ↓
read sub
      ↓
coach_id
      ↓
query Coach
      ↓
return current Coach
```

This function is now reused across Team and Player routes.

## Protected `/auth/me`

Endpoint:

```text
GET /auth/me
```

This was our first end-to-end proof that JWT worked.

After Swagger authorization, it returned the authenticated coach profile using the token alone.

## Swagger authorization

1. Login.
2. Copy the token value beginning with something like `eyJ...`.
3. Press **Authorize 🔒**.
4. Paste the token value.
5. Authorize.
6. Test protected routes.

When it works, Swagger sends:

```text
Authorization: Bearer eyJ...
```

## Important mental model

JWT is like a temporary signed entry card:

```text
email + password
      ↓ login once
JWT access token
      ↓ send repeatedly
protected APIs
```

The token is not the user's password and should not contain passwords/password hashes.

## JWT milestone status

```text
Configuration ✅
Secret outside source code ✅
Token creation ✅
Login returns token ✅
Token decoding ✅
Expiration validation ✅
Current-coach extraction ✅
Protected endpoint ✅
Swagger Authorize ✅
Team/Player routes use current coach ✅
```
