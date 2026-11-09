---
sidebar_position: 13
title: Roadmap & Next Steps
---

# Roadmap & Next Steps

## Completed foundation ✅

```text
FastAPI / SQLAlchemy / SQLite / Pydantic ✅
JWT authentication ✅
Team CRUD ✅
Player CRUD ✅
PlayerProgress ✅
Lineup CRUD ✅
Exactly 11 saved players ✅
Non-empty formation ✅
Git feature-branch + PR workflow ✅
```

## AI Feature 1 — Substitute Recommendation ✅

Algorithm:

```text
Cosine Similarity
```

Status:

```text
implemented ✅
tested ✅
Swagger verified ✅
merged to main ✅
```

The feature compares the unavailable player's six-skill vector with active same-team candidates and returns a deterministic ranked list.

## AI Feature 2 — Position Analysis ✅ implemented / ⏭️ final merge

Final technical design:

```text
FIFA 23 outfield dataset
→ offline K-Means K=3
→ fixed reference centroids
→ university outfield player
→ nearest centroid
→ Defender / Attacker / Midfielder
```

Goalkeeper rule:

```text
GK / Goalkeeper
→ Goalkeeper directly
→ cluster_id = null
→ outside outfield K-Means
```

Why the revision matters:

```text
Old team-level fitting = roles depended on roster composition
Fixed FIFA reference = same skill vector gets same role across teams
```

Current validation:

```text
16,467 FIFA 23 training profiles
102 backend tests passing
38 existing Cosine tests still green
raw FIFA CSV ignored by Git
small JSON reference artifact tracked
```

Git note:

```text
PR #4 merged the earlier roster-relative version.
Commit a1503a5 contains the improved FIFA-reference revision
and is pushed on backend/position-analysis.
Follow-up PR is still required.
```

## AI Feature 3 — Optimized Lineup ⏭️ NEXT AFTER MERGE

Algorithm:

```text
Genetic Algorithm
```

Before implementation, explicitly finalize:

```text
1. supported formations
2. exactly-one-goalkeeper rule
3. eligible/active player pool
4. positional constraints
5. chromosome representation
6. fitness function
7. exact Synergy Score formula
8. penalty strategy for invalid lineups
9. population size
10. generations
11. selection method
12. crossover method
13. mutation method
14. deterministic/random-seed strategy
15. save-vs-preview behavior
```

Do not code the GA until these rules are traceable to the report or explicitly documented as implementation decisions.

## Frontend integration ⬜

```text
[ ] CORS
[ ] API base URL
[ ] Login + JWT
[ ] Team screens
[ ] Player screens
[ ] Progress charts
[ ] Saved lineup screens
[ ] Substitute Recommendation UI
[ ] Position Analysis UI
[ ] Optimized Lineup UI
```

## Quality / deployment ⬜

```text
[ ] Broader CRUD automated tests
[ ] Stronger numeric validation
[ ] Production database decision
[ ] Deployment
[ ] End-to-end tests
[ ] Final report sync
[ ] Demo + defense preparation
```

## Immediate next actions

```text
1. Open/merge follow-up PR for commit a1503a5
2. Pull updated main locally
3. Confirm backend/data/raw is ignored on main
4. Review Genetic Algorithm requirements from the report
5. Freeze Synergy Score + formation/GK rules
6. Implement GA on a new branch
```
