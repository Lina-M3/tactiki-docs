---
sidebar_position: 12
title: Defense Questions
---

# Defense Questions — Current Work

These questions are based on code we have actually worked on so far.

## Architecture

### Why did you use FastAPI?

FastAPI gives us a structured way to build HTTP API endpoints and automatically generates OpenAPI/Swagger documentation, which we are already using to test the backend before frontend integration.

### Why did you not put all code in `main.py`?

We separated responsibilities into database configuration, ORM models, Pydantic schemas, routers, and utilities. This makes the project easier to understand and maintain as more features are added.

### What is the difference between a router and `main.py`?

`main.py` creates/configures the application. Routers organize endpoints by feature. For example, authentication endpoints live in `app/routers/auth.py`.

## Database

### Why are you using SQLAlchemy?

SQLAlchemy lets us represent database tables as Python classes and work with records using ORM objects while still defining keys and relationships.

### What is `Base`?

`Base = declarative_base()` is the parent class for our SQLAlchemy ORM models. SQLAlchemy uses model metadata from these classes when creating tables.

### Why do you import models before `Base.metadata.create_all(...)`?

SQLAlchemy needs the model classes loaded so their table metadata is registered before `create_all` runs.

### What is a primary key?

A primary key uniquely identifies a row. Example: `coach_id`, `team_id`, and `player_id`.

### What is a foreign key?

A foreign key connects one table to another. Example: `Team.coach_id` references `Coach.coach_id`.

### What is `back_populates`?

It connects both sides of an ORM relationship. For example, `Coach.teams` and `Team.coach` describe opposite directions of the same relationship.

### Why does `LineupPlayer` use two primary keys?

`lineup_id` and `player_id` together create a composite primary key for the lineup-player association.

## API and validation

### What is the difference between an SQLAlchemy model and Pydantic schema?

The SQLAlchemy model defines how data is stored in the database. The Pydantic schema defines the data shape accepted or returned by the API.

### Why use `EmailStr`?

It validates that the provided value has an email-like format before normal endpoint logic continues.

### What does `response_model=CoachResponse` help with?

It defines the shape of the successful response and prevents us from intentionally exposing fields such as `password_hash` through that response schema.

## Sessions and dependencies

### What does `Depends(get_db)` do?

FastAPI calls our database dependency and injects a SQLAlchemy Session into the endpoint.

### Why use `try/finally` in `get_db()`?

It makes sure the database session is closed after the request even if an error occurs.

### What is the difference between `db.add`, `db.commit`, and `db.refresh`?

- `add` stages the ORM object for persistence.
- `commit` commits the transaction.
- `refresh` reloads the object from the database so generated/current values are available.

## Authentication

### Why not store the plain password?

Storing plain passwords would expose users' passwords if the database were leaked. We store a one-way password hash instead.

### What did the bcrypt error teach you?

The endpoint logic was not the only possible source of failure. We isolated the hashing function, checked package versions, found a Passlib/bcrypt compatibility problem, and fixed it by using bcrypt 4.0.1.

### Why did signup return 400 on the second test?

The first execution had already inserted that email, so the duplicate-email check correctly rejected the repeated signup.

### Why use 201 instead of 200 for signup?

`201 Created` describes that a new resource was successfully created.

## Testing

### Why do you test with Swagger before React?

It isolates backend behavior. We can verify the endpoint independently, then later troubleshoot frontend/API integration separately.

### What is the difference between 400 and 500 in your tests?

Our 400 was intentional business validation for duplicate email. The earlier 500 represented a server-side failure during password hashing.

### How does your current login work?

The login endpoint receives email and password through a dedicated Pydantic schema, queries the coach by email, and verifies the entered plain password against the stored bcrypt hash using `verify_password(...)`. Invalid credentials return `401 Unauthorized`. Valid credentials currently return safe coach data.

### Why do you return the same message for a missing email and a wrong password?

To avoid revealing whether a specific account exists. Both cases return `Invalid email or password`.

## Questions we should NOT pretend are finished yet

If asked today about Login/JWT, be clear:

> Signup, hashing, login, and password verification are implemented and tested. JWT generation and protected endpoints are the next authentication milestone and are not yet completed.

That answer is better than describing planned code as if it were already implemented.
