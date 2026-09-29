---
sidebar_position: 5
title: Authentication
---

# Authentication

## Goal

Authentication begins with coach signup, then continues with login and JWT-based protected access.

## Signup flow implemented so far

The signup endpoint:

1. Receives coach data through a Pydantic schema.
2. Queries the database to check whether the email already exists.
3. Rejects duplicate emails with HTTP `400 Bad Request`.
4. Hashes the password instead of storing plain text.
5. Creates the new `Coach` row.
6. Commits the transaction.
7. Returns safe coach information without returning the password hash.

## Example duplicate response

```json
{
  "detail": "Email already registered"
}
```

This response is **expected validation behavior**, not a server crash.

## Password hashing dependency issue

During testing, the environment had:

```text
passlib 1.7.4
bcrypt 5.0.0
```

Hashing failed inside the dependency with bcrypt compatibility errors.

The working fix was to replace bcrypt 5.0.0 with:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

After that, the password hash test worked.

### What did we learn?

When our own authentication logic looks correct but the traceback fails inside a package, dependency compatibility must be checked too.

## Next work

- Password verification
- Login endpoint
- JWT creation
- Authentication dependency
- Protected endpoints
- Swagger tests for valid and invalid login cases
