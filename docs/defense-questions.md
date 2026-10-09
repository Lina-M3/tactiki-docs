---
sidebar_position: 12
title: Defense Questions
---

# Defense Questions — Current Work

These questions are based on code and workflow we have actually implemented so far.

## Architecture

### Why FastAPI?

FastAPI gives us structured HTTP endpoints, Pydantic validation, dependency injection, and automatic OpenAPI/Swagger documentation. We use Swagger to verify backend behavior before frontend integration.

### Why not put everything in `main.py`?

We separated responsibilities into database configuration, models, schemas, routers, dependencies, and utilities. This makes each feature easier to understand, test, and extend.

### What is the difference between a router and `main.py`?

`main.py` creates/configures the app and includes routers. Routers contain feature endpoints such as authentication, teams, players, and lineups.

### Why use one repository for frontend and backend?

For this graduation project, a monorepo keeps compatible frontend and backend work in one project history and simplifies final delivery. The frontend and backend are still separate applications and communicate through HTTP APIs.

### Why keep `tactiki-docs` separate?

The Docusaurus notebook has a different purpose and deployment pipeline from the application code. Keeping it separate avoids mixing generated documentation-site files with backend/frontend source code.

## Database

### Why SQLAlchemy?

It maps database tables to Python classes and lets us work with records through ORM objects while still defining keys, foreign keys, and relationships.

### Model vs Schema?

- SQLAlchemy Model = database storage structure.
- Pydantic Schema = API request/response structure.

Example: `Player` stores `overall_score`, but `PlayerCreate` does not accept it because the server calculates it.

### ForeignKey vs relationship?

`ForeignKey` creates the database-level reference. `relationship` makes ORM navigation easier in Python.

### Why does `LineupPlayer` use two primary keys?

`lineup_id + player_id` form a composite key identifying one player's assignment inside one specific lineup.

### Why is `assigned_position` in LineupPlayer instead of Player?

Because a player's base position can stay the same while their tactical role changes between saved lineups.

Example:

```text
Player.position = CM
Lineup A assigned_position = CM
Lineup B assigned_position = CAM
```

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

Not in our HS256 setup. It is signed, so tampering can be detected. Secrets such as passwords must never be stored in the payload.

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

Authentication answers: **Who is this user?**

Authorization answers: **Is this user allowed to operate on this specific data?**

JWT identifies the coach; Team, Player, and Lineup queries then verify ownership/context.

### Why check both `team_id` and `coach_id`?

If we only check `team_id`, another logged-in coach could guess an ID and access another coach's team. Filtering by both prevents that.

## Team API

### Why is `coach_id` not in `TeamCreate`?

Because the server gets coach identity from JWT. Trusting client-supplied coach IDs would weaken ownership protection.

### Why prevent duplicate team names per coach?

Repeated POST testing created multiple teams with the same name. We added a business rule so the same coach cannot create the same team name twice.

### Why PATCH instead of PUT?

We allow partial updates. The coach can update only one field without sending the complete object.

## Player API

### Why is `team_id` in the URL instead of `PlayerCreate`?

The route is nested under the team. The backend verifies ownership before creating or reading the player.

### How do you prevent duplicate players?

We check `team_id + player_name`, so the same name is prevented inside the same team.

### Why is `overall_score` not an input?

It is derived from the six skill values. Letting the client submit it could create inconsistent data.

### How is OverallScore calculated now?

```text
(speed + passing + shooting + defending + stamina + dribbling) / 6
```

rounded to two decimals.

### Is that exact formula specified in the report?

No. The report says OverallScore is calculated but does not define the exact formula. The simple average is our current implementation choice and can later be replaced if a weighted formula is defined.

## Player Progress

### When is a progress record created?

Only when at least one of the six skill ratings changes.

### What are the progress statuses?

```text
current > previous → improved
current < previous → declined
current = previous → stable
```

### Why a separate PlayerProgress table?

`Player` stores the latest state. `PlayerProgress` keeps a historical timeline for development tracking and later visualization.

### What is the `last_update` format?

The API returns an ISO-style datetime such as:

```text
2026-10-01T06:38:03.217011
```

The current DB default uses UTC-style time; the frontend can convert it for display.

## Lineup API

### What does a saved Lineup contain?

The `Lineup` row stores team, formation, and creation date. Individual player assignments are stored in `LineupPlayer` rows.

### Why not store player IDs as one JSON list inside Lineup?

Using an associative table preserves relational integrity, supports querying player history, and stores an `assigned_position` for each player-lineup pair.

### What does create-lineup validate?

Before writing:

```text
team belongs to current coach
player list is non-empty
no duplicate player IDs
players belong to that team
players are active
```

### Why use `db.flush()` while creating a lineup?

We need the database-generated `lineup_id` before inserting `LineupPlayer` rows. `flush()` makes the pending insert/ID available without finalizing the transaction; `commit()` finishes the transaction later.

### Why can the current test lineup have fewer than 11 players?

That was a deliberate temporary development decision to verify CRUD, relationships, and validation first. Final football rules such as exactly 11 starters, goalkeeper requirements, and formation-position counts are still roadmap items.

### What happens when PATCH includes a new `players` list?

Current behavior treats it as the new complete assignment list. The backend validates the new list first, deletes old LineupPlayer assignments, then inserts the replacements.

### Why delete LineupPlayer rows before deleting Lineup?

They reference the lineup. Deleting the association rows first avoids leaving dependent assignment rows behind and makes the deletion flow explicit.

## Delete Player

### Why not always permanently delete a player?

If a player appears in saved lineup history, permanent deletion could break historical data.

Current rule:

```text
No lineup history → permanent delete
Has lineup history → is_active = False
```

Now that Lineup CRUD is implemented, the remaining task is an end-to-end test of the `has lineup history` branch with real saved data.

## Git / Collaboration

### Why not work directly on `main`?

`main` should represent the stable integrated project. Feature branches isolate unfinished work and make review/merge safer.

### What branch naming pattern are we using?

Examples:

```text
backend/lineup-api
frontend/login-page
```

### Why are `.env`, `venv`, `.db`, and `node_modules` ignored?

They are secrets, local runtime state, machine-specific environments, or generated dependencies. They should not be version-controlled.

## Testing

### Why Swagger before frontend integration?

It isolates backend behavior. If an API works in Swagger but fails from the frontend later, the problem is likely in integration rather than core endpoint logic.

### Why did POST /teams create multiple records?

Because POST means create. Every successful Execute created a new row. We later cleaned duplicates and added duplicate-name validation.

### Why did a protected endpoint return 401 even though login had worked?

Swagger had lost the authorization token. We checked the request header, re-authorized with the JWT, and the route worked.

## Exact current state

If asked today:

> Authentication/JWT, Team CRUD, Player CRUD, automatic OverallScore, PlayerProgress history, and basic protected Lineup CRUD are implemented and manually verified in Swagger. The project is also organized in a shared GitHub monorepo for backend/frontend collaboration. Remaining work includes verifying player deactivation with real lineup history, adding final lineup/formation rules, implementing the planned intelligence features, integrating the frontend, automated testing, and deployment.
