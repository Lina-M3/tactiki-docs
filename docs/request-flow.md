---
sidebar_position: 6
title: Request Flow
---

# Request Flow — How the Backend Thinks

This page is for understanding the whole flow instead of memorizing isolated files.

## Example: Coach signup

Imagine Swagger sends:

```json
{
  "full_name": "Lina Test",
  "email": "lina@test.com",
  "university": "King Abdulaziz University",
  "password": "Test1234"
}
```

## Step 1 — FastAPI route receives the request

The request goes to:

```text
POST /auth/signup
```

The endpoint is defined in:

```text
app/routers/auth.py
```

## Step 2 — Pydantic validates the body

FastAPI sees:

```python
coach_data: CoachCreate
```

So it uses `CoachCreate` from:

```text
app/schemas/coach.py
```

If the body structure is invalid, validation can stop the request before our signup logic runs.

## Step 3 — FastAPI injects the DB session

```python
db: Session = Depends(get_db)
```

`get_db()` comes from:

```text
app/database.py
```

Now the endpoint can query and write to SQLite.

## Step 4 — Check business rule

We do not allow the same email twice:

```python
existing_coach = db.query(Coach).filter(
    Coach.email == coach_data.email
).first()
```

If found:

```python
raise HTTPException(
    status_code=400,
    detail="Email already registered"
)
```

## Step 5 — Protect the password

Instead of:

```python
password_hash=coach_data.password  # WRONG
```

we use:

```python
password_hash=hash_password(coach_data.password)
```

## Step 6 — Build ORM object

```python
new_coach = Coach(...)
```

At this moment, we have a Python ORM object prepared for the database.

## Step 7 — Save

```python
db.add(new_coach)
db.commit()
db.refresh(new_coach)
```

### Easy meaning

```text
add      = جهز السجل للإضافة
commit   = احفظ التغيير فعليًا
refresh  = رجع أحدث نسخة من السجل من قاعدة البيانات
```

## Step 8 — Return safe response

We return `new_coach`, but the endpoint has:

```python
response_model=CoachResponse
```

So the API response is shaped according to `CoachResponse`.

The password hash is not part of that schema.

## The whole chain

```text
Request JSON
   ↓
CoachCreate
   ↓
signup()
   ↓
get_db()
   ↓
Coach SQLAlchemy model
   ↓
SQLite
   ↓
CoachResponse
   ↓
Response JSON
```

:::tip تذكري
إذا سألوك "كيف البيانات تمشي في النظام؟" اشرحي هذا المسار. هذا أهم من حفظ syntax كل سطر.
:::

## Later: protected request flow

This is planned, not implemented yet:

```text
React sends JWT
      ↓
FastAPI checks Authorization header
      ↓
token is decoded/validated
      ↓
current coach is identified
      ↓
protected Team/Player endpoint continues
```
