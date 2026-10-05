---
sidebar_position: 12
title: Defense Questions
---

# Defense Questions — Current Work

These questions are based on code we have actually implemented so far.

## Architecture

### Why FastAPI?

FastAPI gives us structured HTTP endpoints, Pydantic validation, dependency injection, and automatic OpenAPI/Swagger documentation. We are already using Swagger to verify backend behavior before React integration.

### Why not put everything in `main.py`?

We separated responsibilities into database configuration, models, schemas, routers, dependencies, and utilities. This makes each feature easier to understand, test, and extend.

### What is the difference between a router and `main.py`?

`main.py` creates/configures the app and includes routers. Routers contain feature endpoints such as authentication, teams, and players.

## Database

### Why SQLAlchemy?

It maps database tables to Python classes and lets us work with records through ORM objects while still defining keys, foreign keys, and relationships.

### Model vs Schema?

- SQLAlchemy Model = database storage structure.
- Pydantic Schema = API request/response structure.

Example: `Player` stores `overall_score`, but `PlayerCreate` no longer accepts `overall_score` because the server calculates it.

### ForeignKey vs relationship?

`ForeignKey` creates the database-level reference. `relationship` makes ORM navigation easier in Python.

### Why does `LineupPlayer` use two primary keys?

`lineup_id + player_id` form a composite key identifying a specific player's assignment inside a specific lineup.

## Authentication

### Why not store plain passwords?

A database leak would expose them directly. We store a one-way bcrypt hash instead.

### What does login return now?

A valid login returns a JWT access token:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### What is JWT in simple words?

A temporary signed identity card. The coach logs in once, receives a token, and sends it with later protected requests instead of resending the password.

### Is JWT encrypted?

Not in our HS256 setup. It is signed. The signature lets the backend detect tampering, so secrets such as passwords must never be stored in the payload.

### What does `sub` mean?

`sub` means subject. We store the coach ID there so token validation can identify the current coach.

### Why `exp`?

It gives the token an expiration time so it does not stay valid forever.

### What is `get_current_coach()`?

A reusable FastAPI dependency that:

```text
reads Bearer token
→ decodes/validates JWT
→ extracts sub
→ finds Coach in database
→ returns current Coach
```

### Why `/auth/me`?

It proves authentication end-to-end and gives the current coach profile from the token without asking for email/password again.

## Authorization / Ownership

### Authentication vs authorization?

Authentication answers:

> Who is this user?

Authorization answers:

> Is this user allowed to operate on this specific data?

Our Team/Player APIs do both. JWT identifies the coach, then queries check `coach_id` ownership.

### Why check both `team_id` and `coach_id`?

If we only check `team_id`, another logged-in coach could guess an ID and access another coach's team. Filtering by both prevents that.

## Team API

### Why is `coach_id` not in `TeamCreate`?

Because the server gets the coach identity from the JWT. Trusting a client-supplied coach ID would weaken ownership protection.

### Why prevent duplicate team names per coach?

Repeated POST testing created multiple teams with the same name. We added a business rule so the same coach cannot create the same team name twice.

### Why PATCH instead of PUT?

We currently allow partial updates. The coach can update only `team_name` or only `university` without sending the full object.

## Player API

### Why is `team_id` in the URL instead of `PlayerCreate`?

The route is nested under the team:

```text
/teams/{team_id}/players
```

The backend verifies the team belongs to the current coach before creating the player.

### How do you prevent duplicate players?

We check the player's name inside the same team using `team_id + player_name`.

### Why is `overall_score` not an input anymore?

It is a derived value. If the client could submit it manually, it could disagree with the six skill ratings.

### How is OverallScore calculated now?

Current implementation:

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

rounded to two decimals.

### Is that formula specified in the report?

The report says OverallScore is calculated, but it does not define the exact formula. The simple average is our current implementation decision and can later be replaced by a weighted formula if needed.

## Player Progress

### When is a progress record created?

Only when at least one of the six skill ratings changes.

Changing only name, position, height, weight, or activity should not create a performance-change record.

### What are the progress statuses?

```text
current > previous → improved
current < previous → declined
current = previous → stable
```

### Why a separate PlayerProgress table?

`Player` stores the latest state. `PlayerProgress` keeps the historical timeline so we can later show development graphs and compare performance over time.

### What is the `last_update` format?

The API returns an ISO-style datetime such as:

```text
2026-10-01T06:38:03.217011
```

The current database default uses UTC time. The frontend can later convert it to a friendlier Saudi/local display.

## Delete Player

### Why not always permanently delete a player?

If that player appears in a saved lineup, deleting the record could break historical lineup data.

Current rule:

```text
No lineup history → permanent delete
Has lineup history → is_active = False
```

This matches the project requirement to preserve historical records.

## Testing

### Why Swagger before React?

It isolates backend behavior. If the API works in Swagger but fails from React later, the issue is likely in integration rather than core endpoint logic.

### Why did POST /teams create multiple records?

Because POST means create. Every successful Execute was another create request. We later cleaned the duplicates and added duplicate-name validation.

### Why did a protected endpoint return 401 even though login worked before?

Swagger had lost the authorization token. We checked the Curl output, saw there was no `Authorization: Bearer ...` header, authorized again, then the route worked.

## Exact current state

If asked today:

> Authentication and JWT are implemented and tested. Team CRUD is complete with ownership and duplicate-name protection. Player CRUD is implemented with ownership checks, automatic OverallScore calculation, and automatic PlayerProgress history. The next major milestone is the Lineup API; the player deactivation branch that depends on saved lineup history will be fully verified during that stage.
