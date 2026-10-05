---
sidebar_position: 13
title: Next Steps
---

# Next Steps

This page separates completed work from future work.

## Completed backend foundation

```text
Authentication ✅
JWT protected routes ✅
Team CRUD ✅
Player CRUD ✅
Automatic OverallScore ✅
PlayerProgress history ✅
```

## Immediate next milestone — Lineup API

The database models already exist:

```text
Lineup
LineupPlayer
```

The next goal is to expose them safely through protected APIs.

### Planned Lineup work

```text
[ ] Create Lineup schemas
[ ] Create Lineup router
[ ] Create/save a lineup for an owned team
[ ] Read saved lineups for a team
[ ] Read one lineup
[ ] Add players to saved lineup positions
[ ] Validate players belong to the same team
[ ] Prevent invalid duplicate assignments
[ ] Preserve assigned_position per lineup-player pair
[ ] Test LineupPlayer history
```

## Why Lineup comes next

Lineup is now the missing connection between:

```text
Team
 ↓
Players
 ↓
Lineup / LineupPlayer
```

It also lets us fully verify the Player deletion rule:

```text
Player has lineup history
→ do not permanently delete
→ set is_active = False
```

## After basic Lineup CRUD

The next stage should move toward the project intelligence features.

### Substitute recommendation

Planned use of:

```text
Cosine Similarity
```

Player skill vectors use:

```text
Speed
Passing
Shooting
Defending
Stamina
Dribbling
```

### Position analysis

Roadmap includes:

```text
K-Means clustering
```

for grouping similar skill profiles / role analysis.

### Optimized lineup

Roadmap includes:

```text
Genetic Algorithm
```

for searching lineup combinations under formation/position constraints.

## Frontend stage later

After stable backend endpoints:

```text
React login form
JWT storage/handling
Team management screens
Player management screens
Progress visualization
Lineup generation UI
Substitute recommendation UI
```

## Testing/hardening later

- Broader authentication edge cases.
- Data validation ranges for skill ratings/height/weight.
- Database migration strategy instead of relying only on `create_all`.
- Production database decision.
- CORS configuration for React.
- Automated tests.
- Better error handling/transaction rollback.

## Important current design decisions to revisit if needed

### OverallScore formula

Current implementation:

```text
simple average of six skill ratings
```

The report says the field is calculated but does not define the exact formula. If the project team/dataset later defines weighted scoring, replace the helper in one place.

### UTC progress timestamps

Database currently stores progress `last_update` using UTC-style timestamps. Frontend can convert them to Saudi/local display time.

## Next session starting point

> Start with **Lineup schemas and router**, while preserving the same authorization pattern already used for Team and Player endpoints.
