---
sidebar_position: 13
title: Next Steps
---

# Next Steps

This page separates future work from completed work.

## Immediate next milestone — Finish JWT authentication

The next authentication stage should complete this flow:

```text
Coach enters email + password
        ↓
Find coach by email
        ↓
Verify entered password against password_hash
        ↓
If correct → create access token
        ↓
Return token
        ↓
Use token for protected endpoints
```

### Tasks we still need to implement

```text
[x] password verification helper
[x] login request schema
[x] login endpoint
[x] install JWT/config dependencies
[x] write access token creation function
[x] create .env configuration
[x] create root .gitignore to protect secrets
[ ] test access token creation directly
[ ] make login return token response
[ ] token validation dependency
[ ] current coach extraction
[ ] first protected endpoint (/auth/me)
[ ] Swagger Authorization test
```

:::warning
These are plans, not current implementation. We will add exact code only after we build and test it.
:::

## After authentication

### Team CRUD

Planned operations:

```text
Create team
Get coach's teams
Get one team
Update team
Delete team
```

The authenticated coach should eventually only operate on data that belongs to that coach.

### Player CRUD

Planned operations:

```text
Create player
List players for a team
Get player
Update player
Delete/deactivate player
```

Player input will include the six football attributes already represented in the Player model.

## Later backend milestones

- Player progress records.
- Substitute recommendation flow.
- AI lineup generation.
- Save/retrieve generated lineups.
- React ↔ FastAPI integration.
- Broader testing.

## AI roadmap reminder

The project roadmap includes:

- **K-Means** for grouping/role-related player analysis.
- **Cosine Similarity** for substitute/player similarity.
- **Genetic Algorithm** for optimized lineup generation.

We will document the actual datasets, feature preparation, functions, endpoints, and test results only when those components are implemented.
