---
sidebar_position: 7
title: Testing & Swagger
---

# Testing & Swagger

We use Swagger to test the backend independently before React depends on it.

## Open Swagger

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

## Why test here first?

If an endpoint fails in Swagger, the problem is probably in the backend/API layer.

If it works in Swagger but later fails from React, we can investigate frontend integration separately.

That separation makes debugging much easier.

## Root endpoint test

Endpoint:

```text
GET /
```

Expected successful response:

```json
{
  "message": "Tactiki Backend is running successfully"
}
```

Status:

```text
200 OK
```

## Signup test

Endpoint:

```text
POST /auth/signup
```

Example body:

```json
{
  "full_name": "Lina Test",
  "email": "lina@test.com",
  "university": "King Abdulaziz University",
  "password": "Test1234"
}
```

### Fresh email

Expected behavior:

```text
201 Created
```

Response should contain safe coach data and not contain the password/hash.

### Repeated email

Expected behavior:

```text
400 Bad Request
```

```json
{
  "detail": "Email already registered"
}
```

## How to interpret common status codes

| Status | Simple meaning | In our current work |
|---|---|---|
| `200` | Request succeeded | Root endpoint |
| `201` | Resource created | Successful signup |
| `400` | Request violates a rule | Duplicate email |
| `422` | Validation problem | FastAPI/Pydantic may reject invalid body |
| `500` | Server-side failure | We saw this during bcrypt hashing failure |

:::tip بالعربي
لا تشوفين كلمة Error وتفترضين إن المشروع خربان. أول شيء شوفي **status code** و **response body** و **terminal traceback**.
:::

## When you see 500

Look at the terminal running Uvicorn.

A browser/Swagger `500 Internal Server Error` usually does not explain the root cause. The Python traceback in the terminal tells us where execution failed.

Our bcrypt problem is a perfect example: Swagger only showed a server error, while the terminal showed the dependency failure.

## Good testing habit

For every new endpoint we add later, test at least:

1. Valid request.
2. Missing/invalid data.
3. Duplicate/not-found case where relevant.
4. Unauthorized request if the endpoint becomes protected.
5. Response shape.
6. Database result.

We will keep adding exact tests as endpoints are implemented.
