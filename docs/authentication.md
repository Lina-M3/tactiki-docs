---
sidebar_position: 5
title: Authentication
---

# Authentication

Authentication is the first real feature built on top of the database.

Current state:

✅ Signup schema  
✅ Password hashing  
✅ Signup endpoint  
✅ Duplicate email check  
✅ Swagger test  
✅ Login  
✅ Password verification  
⏭️ JWT  
⏭️ Protected endpoints

## 1. Why separate schemas from models?

The database `Coach` model stores:

```text
coach_id
full_name
email
university
password_hash
```

But a signup request needs a plain `password` temporarily so it can be hashed.

That is why we created API schemas.

## 2. Coach schemas

File:

```text
app/schemas/coach.py
```

```python title="app/schemas/coach.py"
from pydantic import BaseModel, EmailStr

class CoachCreate(BaseModel):
    # Data allowed/required from the signup request.
    full_name: str
    email: EmailStr
    university: str
    password: str

class CoachLogin(BaseModel):
    # Login only needs credentials, not profile data.
    email: EmailStr
    password: str

class CoachResponse(BaseModel):
    # Safe data returned to the client.
    coach_id: int
    full_name: str
    email: EmailStr
    university: str

    class Config:
        # Allows Pydantic to build this response from SQLAlchemy objects.
        from_attributes = True
```

### Why use `EmailStr`?

It gives email-format validation through Pydantic.

That required:

```powershell
pip install email-validator
```

### Why does `CoachResponse` not include the password?

Because the API should never send the password or password hash back to the frontend.

:::danger تذكري
`password` يدخل للـAPI فقط عشان نعمل له hash.  
`password_hash` يُخزن في قاعدة البيانات.  
ولا واحد منهم المفروض يرجع للعميل في `CoachResponse`.
:::

## 3. Password hashing helper

File:

```text
app/utils/security.py
```

```python title="app/utils/security.py"
from passlib.context import CryptContext

# Configure Passlib to use bcrypt.
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    # Returns a one-way hash, not the original password.
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    # Compare a plain password with the stored bcrypt hash.
    return pwd_context.verify(
        plain_password,
        hashed_password
    )
```

We tested the helper directly before using it in the login endpoint:

```powershell
python -c "from app.utils.security import hash_password, verify_password; h=hash_password('Test1234'); print(h); print(verify_password('Test1234', h)); print(verify_password('Wrong123', h))"
```

Observed result:

```text
True
False
```

That isolated the password layer and proved correct and incorrect passwords were handled as expected.

### Hashing is not encryption

A hash is designed to be one-way.

We do not need to recover the original password. During login, we will verify the entered password against the stored hash.

## 4. Authentication router

File:

```text
app/routers/auth.py
```

Current signup endpoint:

```python title="app/routers/auth.py"
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.coach import Coach
from app.schemas.coach import CoachCreate, CoachResponse
from app.utils.security import hash_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/signup",
    response_model=CoachResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(
    coach_data: CoachCreate,
    db: Session = Depends(get_db)
):
    # 1) Check if the email already exists.
    existing_coach = db.query(Coach).filter(
        Coach.email == coach_data.email
    ).first()

    # 2) Stop if a coach already uses this email.
    if existing_coach:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 3) Convert request data into a database model.
    #    Important: store a HASH, not coach_data.password.
    new_coach = Coach(
        full_name=coach_data.full_name,
        email=coach_data.email,
        university=coach_data.university,
        password_hash=hash_password(coach_data.password)
    )

    # 4) Stage the new object for insertion.
    db.add(new_coach)

    # 5) Commit the transaction to the database.
    db.commit()

    # 6) Reload generated DB values such as coach_id.
    db.refresh(new_coach)

    # 7) FastAPI uses CoachResponse to return safe fields only.
    return new_coach
```

## 5. What does `Depends(get_db)` do?

This line:

```python
db: Session = Depends(get_db)
```

asks FastAPI to provide a database session using our `get_db()` dependency.

So the router does not create and close a database connection manually every time.

## 6. Why `201 Created`?

Signup creates a new resource, so the endpoint explicitly returns:

```python
status_code=status.HTTP_201_CREATED
```

That is more descriptive than a generic `200 OK`.

## 7. Register the router in `main.py`

The router is imported:

```python
from app.routers.auth import router as auth_router
```

Then connected:

```python
app.include_router(auth_router)
```

Because the router has:

```python
prefix="/auth"
```

and the endpoint has:

```python
"/signup"
```

the final path is:

```text
POST /auth/signup
```

## 8. Signup request flow

```text
Swagger / React
     ↓
POST /auth/signup
     ↓
CoachCreate validates body
     ↓
get_db gives SQLAlchemy Session
     ↓
Search Coach by email
     ↓
 ┌───────────────┬────────────────────┐
 │ email exists  │ email does not exist
 │               │
 │ 400 response  │ hash password
 │               │
 └───────────────┴──────→ create Coach
                           ↓
                        db.add
                           ↓
                        db.commit
                           ↓
                        db.refresh
                           ↓
                     CoachResponse
                           ↓
                      201 Created
```

## 9. Actual test result: duplicate email

After signup had already created the account, running the same request again returned:

```json
{
  "detail": "Email already registered"
}
```

with:

```text
400 Bad Request
```

This was expected behavior because the duplicate check was working.

## 10. bcrypt compatibility problem

Our environment originally showed:

```text
passlib 1.7.4
bcrypt 5.0.0
```

The hashing code failed even when tested directly.

We inspected versions:

```powershell
pip show passlib
pip show bcrypt
```

Then tested hashing independently:

```powershell
python -c "from app.utils.security import hash_password; print(hash_password('Test1234'))"
```

The fix that worked was:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

After that, direct hashing worked.

🧠 **Lesson:** not every authentication failure is caused by our endpoint code. Library compatibility can be the real problem.

## 11. Login endpoint — implemented and verified

We added a dedicated `CoachLogin` schema containing only:

```python
class CoachLogin(BaseModel):
    email: EmailStr
    password: str
```

Then we added:

```text
POST /auth/login
```

The login logic now:

1. Finds the coach by email.
2. Returns `401 Unauthorized` if the email is not found.
3. Uses `verify_password(...)` to compare the entered password with the stored bcrypt hash.
4. Returns `401 Unauthorized` if the password is wrong.
5. Returns safe coach data when credentials are correct.

Verified successful test:

```text
POST /auth/login
email: lina@test.com
password: Test1234
→ 200 OK
```

The response returned coach data and did **not** expose the password hash.

:::tip Important
The current login proves the credentials are correct, but it does **not yet** keep the user authenticated between requests. JWT is the next step.
:::

## 12. JWT setup — started, not fully connected yet

We began the JWT layer after verifying login.

### Packages added for this stage

```powershell
pip install pyjwt python-dotenv
```

### Why use `.env`?

The JWT signing key is a secret and should not be hard-coded into source files or committed to GitHub.

The project now has a root-level:

```text
.env
```

with variables shaped like:

```env
SECRET_KEY=<private-random-value>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

The real `SECRET_KEY` must stay private.

### Root `.gitignore`

We created a project-level `.gitignore` and included:

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

This prevents secrets, the virtual environment, Python cache files, and the local SQLite database from being committed accidentally.

### `create_access_token()`

We added the beginning of JWT creation to `app/utils/security.py`:

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
    # Copy the payload so the caller's dictionary is not modified.
    to_encode = data.copy()

    # Give the token a limited lifetime.
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # JWT standard expiration claim.
    to_encode.update({"exp": expire})

    # Sign the token using our private secret key.
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
```

### Why an expiration time?

An access token should not remain valid forever. The `exp` claim limits how long it can be used.

### What should go inside the token?

We plan to identify the coach using the standard JWT subject claim:

```python
{"sub": "1"}
```

Here, `sub` means **subject** — the identity the token represents.

:::warning Important security note
A signed JWT is not a place for passwords or password hashes. Do not put `password`, `password_hash`, or other secrets in the token payload.
:::

### Exact stopping point

The code for `create_access_token()` has been written, but we intentionally stopped **before verifying the token-generation command and before changing the login response to return a token**.

The next command to run is:

```powershell
python -c "from app.utils.security import create_access_token; print(create_access_token({'sub': '1'}))"
```

If it succeeds, we should see a long JWT string beginning with something similar to `eyJ...`.

## 13. What is NOT implemented yet?

The following are still **next**:

- Verify `create_access_token()` from the terminal.
- Change `POST /auth/login` to return `access_token` and `token_type`.
- Add JWT decoding/validation.
- Read the current coach from the token.
- Add a protected `/auth/me` endpoint.
- Use Swagger's **Authorize 🔒** flow.
- Test missing, invalid, and expired tokens.

We will mark these complete only after we implement and test them.
