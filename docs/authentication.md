---
sidebar_position: 5
title: Authentication
---

# Authentication

Authentication is now working end-to-end.

## Current state

```text
Signup ✅
Duplicate email protection ✅
Password hashing ✅
Login ✅
Password verification ✅
JWT creation ✅
JWT decoding/validation ✅
Current coach dependency ✅
GET /auth/me ✅
Swagger Authorize ✅
Protected Team/Player routes ✅
```

## Files involved

```text
app/schemas/coach.py
app/routers/auth.py
app/utils/security.py
app/dependencies/auth.py
.env
.gitignore
```

## Coach schemas

File:

```text
app/schemas/coach.py
```

Current roles:

```python
class CoachCreate(BaseModel):
    full_name: str
    email: EmailStr
    university: str
    password: str

class CoachLogin(BaseModel):
    email: EmailStr
    password: str

class CoachResponse(BaseModel):
    coach_id: int
    full_name: str
    email: EmailStr
    university: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
```

Why separate them?

```text
CoachCreate   = what signup accepts
CoachLogin    = what login accepts
CoachResponse = safe coach data returned by API
TokenResponse = JWT login result
```

The plain password is never returned. `password_hash` is also intentionally excluded from API responses.

## Password hashing

File:

```text
app/utils/security.py
```

We use Passlib with bcrypt:

```python
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )
```

### bcrypt compatibility issue

The environment originally had a Passlib/bcrypt combination that failed during hashing.

The working fix was:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

This was verified by testing hashing separately before returning to the API.

## Signup

Endpoint:

```text
POST /auth/signup
```

Flow:

```text
CoachCreate validates request
        ↓
Check email uniqueness
        ↓
Hash password
        ↓
Create Coach ORM object
        ↓
db.add → db.commit → db.refresh
        ↓
CoachResponse
        ↓
201 Created
```

Duplicate email returns:

```text
400 Bad Request
```

```json
{
  "detail": "Email already registered"
}
```

## Login

Endpoint:

```text
POST /auth/login
```

Flow:

```text
email + password
      ↓
find coach by email
      ↓
verify_password()
      ↓
invalid → 401
valid   → create JWT
      ↓
TokenResponse
```

The successful response is now:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

Invalid email or password returns the same generic message:

```json
{
  "detail": "Invalid email or password"
}
```

This avoids revealing whether a particular email exists.

## JWT configuration

Environment variables are loaded from the root `.env`:

```env
SECRET_KEY=<private value>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

The real secret must never be placed in documentation or committed to GitHub.

Root `.gitignore` includes:

```gitignore
.env
venv/
__pycache__/
*.pyc
tactiki.db
*.db
.DS_Store
```

## Creating the access token

Core function:

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

Login stores the coach identity inside the standard subject claim:

```python
data={"sub": str(coach.coach_id)}
```

`sub` = **subject** = the identity represented by the token.

## JWT is not encryption

The JWT is a signed access token, not a password vault.

Do not store these in its payload:

```text
password
password_hash
SECRET_KEY
```

The signature helps the backend detect tampering. The expiration limits how long the token is accepted.

## Decoding and validating JWT

We added:

```python
def decode_access_token(token: str):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except jwt.InvalidTokenError:
        return None
```

This validates the signature and expiration during decoding.

## `get_current_coach`

File:

```text
app/dependencies/auth.py
```

We use:

```python
security = HTTPBearer()
```

Then the dependency:

```text
Authorization: Bearer <token>
        ↓
HTTPBearer extracts token
        ↓
decode_access_token()
        ↓
read payload['sub']
        ↓
convert to coach_id
        ↓
query Coach table
        ↓
return authenticated Coach object
```

If the token is invalid/expired, the subject is missing, or the coach cannot be found, the request is rejected.

## First protected endpoint

Endpoint:

```text
GET /auth/me
```

It uses:

```python
current_coach: Coach = Depends(get_current_coach)
```

Successful test returned the current coach from the JWT alone:

```json
{
  "coach_id": 1,
  "full_name": "Lina Test",
  "email": "lina@test.com",
  "university": "King Abdulaziz University"
}
```

This proved that later protected requests do not need to resend email and password.

## Swagger Authorize flow

1. Run `POST /auth/login`.
2. Copy only the `access_token` value.
3. Press **Authorize 🔒** at the top of Swagger.
4. Paste the token value only; Swagger adds the `Bearer` scheme.
5. Authorize and close the dialog.
6. Call protected endpoints.

A protected request should show a header similar to:

```text
Authorization: Bearer eyJ...
```

If the request has no token, the response is:

```text
401 Unauthorized
```

```json
{
  "detail": "Not authenticated"
}
```

## Why we needed authentication before Team/Player CRUD

The JWT gives us `current_coach`.

That lets later endpoints enforce ownership:

```text
Coach 1 → can operate on Coach 1 teams/players
Coach 2 → cannot operate on Coach 1 teams/players
```

This is now used by Team and Player routes.

## Authentication checkpoint

The authentication milestone is complete for the current backend stage.

Next authentication work will mostly be production hardening later, such as broader token edge-case tests, refresh/session policy if needed, and frontend token handling.
