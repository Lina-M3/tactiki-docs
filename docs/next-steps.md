---
sidebar_position: 13
title: Roadmap & Next Steps
---

# Roadmap & Next Steps

## Backend foundation ✅

```text
FastAPI / SQLAlchemy / SQLite / Pydantic ✅
JWT authentication ✅
Team CRUD ✅
Player CRUD ✅
PlayerProgress ✅
Lineup CRUD ✅
11-player final lineup validation ✅
Git feature-branch + PR workflow ✅
```

## AI Feature 1 — Substitute Recommendation ✅

```text
Cosine Similarity
PR #3 merged
```

## AI Feature 2 — Position Analysis ✅

```text
FIFA 23 reference-trained K-Means
fixed outfield centroids
Goalkeeper handled separately
PR #5 final revision merged
```

## AI Feature 3 — Optimized Lineup ✅

```text
Genetic Algorithm using DEAP
dynamic formations
exactly one goalkeeper
11-gene slot-aware chromosome
50/30/20 Synergy Score
selection + crossover + repair + mutation + elitism
atomic save
PR #6 merged
```

Final backend verification:

```text
195 backend tests passing
195 tests passing in reversed order
real Swagger verification complete
30-player GA benchmark = 1.271s
performance target <5s achieved
```

## Next Phase — Frontend ↔ Backend Integration ⏭️

Now connect the existing frontend to the stable backend.

Recommended order:

```text
1. Configure backend CORS
2. Confirm frontend API base URL
3. Connect Login + JWT storage
4. Connect Team CRUD
5. Connect Player CRUD
6. Connect Player Progress
7. Connect Saved Lineups
8. Connect Substitute Recommendation
9. Connect Position Analysis
10. Connect Optimized Lineup generation
```

Do not redesign stable backend contracts during frontend integration unless an actual integration issue requires it.

## Integration testing ⬜

After each connected screen, verify:

```text
request payload
JWT header
HTTP status
response schema
loading state
success state
validation errors
ownership/security behavior
```

## End-to-end testing ⬜

Final user flow should include:

```text
Login
→ open/create team
→ add/edit players
→ view progress
→ run Position Analysis
→ find substitute
→ choose available players + formation
→ generate optimized lineup
→ display Synergy Score
→ view saved lineup
```

## Deployment ⬜

```text
[ ] Production database decision
[ ] Environment variables
[ ] Production CORS
[ ] Backend deployment
[ ] Frontend deployment
[ ] HTTPS/API URL
[ ] Deployment smoke test
```

## Final project preparation ⬜

```text
[ ] Synchronize final report with implemented behavior
[ ] Update architecture diagrams if needed
[ ] Update sequence diagrams if needed
[ ] Capture final screenshots
[ ] Prepare demo dataset
[ ] Prepare demo script
[ ] Defense questions
[ ] Limitations and future work
[ ] Final README/setup instructions
```

## Immediate next actions

```text
1. Pull latest main locally
2. Inspect current frontend structure
3. Freeze frontend-to-backend API map
4. Configure CORS
5. Begin integration with authentication
6. Connect one feature at a time
7. Add integration tests as screens become connected
```
