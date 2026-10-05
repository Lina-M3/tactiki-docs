---
sidebar_position: 10
title: Player Progress
---

# Player Progress Tracking

Player progress is now connected directly to player skill updates.

The coach does not manually create progress records. The backend creates them automatically when one or more of the six skill ratings changes.

## Files

```text
app/models/player_progress.py
app/schemas/player_progress.py
app/routers/player.py
```

## Database model

```python
class PlayerProgress(Base):
    __tablename__ = "player_progress"

    progress_id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.player_id"), nullable=False)

    previous_score = Column(Float, nullable=False)
    current_score = Column(Float, nullable=False)
    progress_status = Column(String, nullable=False)

    last_update = Column(DateTime, default=datetime.utcnow)

    player = relationship("Player", back_populates="progress_records")
```

Relationship:

```text
Player 1 ───── many PlayerProgress
```

One player can therefore have a history of many score changes.

## Response schema

```python
class PlayerProgressResponse(BaseModel):
    progress_id: int
    player_id: int
    previous_score: float
    current_score: float
    progress_status: str
    last_update: datetime

    class Config:
        from_attributes = True
```

## How progress is created

During:

```text
PATCH /teams/{team_id}/players/{player_id}
```

we first remember the old score:

```python
previous_score = player.overall_score
```

Then we detect whether any real skill was changed:

```python
skills_changed = any([
    player_data.speed is not None,
    player_data.passing is not None,
    player_data.shooting is not None,
    player_data.defending is not None,
    player_data.stamina is not None,
    player_data.dribbling is not None
])
```

This is important because changing only a name, height, weight, position, or activity flag should not create a false performance-history record.

## Recalculate current score

If a skill changed, the backend recalculates the overall score using the current six-skill average.

Then it compares:

```text
previous_score
current_score
```

## Progress status

Current rules:

```python
if current_score > previous_score:
    progress_status = "improved"
elif current_score < previous_score:
    progress_status = "declined"
else:
    progress_status = "stable"
```

Then a new history row is inserted:

```python
progress_record = PlayerProgress(
    player_id=player.player_id,
    previous_score=previous_score,
    current_score=current_score,
    progress_status=progress_status
)
```

The player update and progress record are committed together.

## Why keep history instead of only the latest score?

The `Player` table gives us the player's **current** state.

The `PlayerProgress` table gives us the **timeline**:

```text
82.00 → 82.83 → 85.10 → 84.50
```

That can later support progress graphs and evidence-based coaching decisions.

## Progress endpoint

Implemented endpoint:

```text
GET /teams/{team_id}/players/{player_id}/progress
```

It first verifies:

```text
1. The team belongs to the authenticated coach.
2. The player belongs to that team.
```

Then it returns all records ordered by `last_update` ascending.

Example:

```json
[
  {
    "progress_id": 1,
    "player_id": 1,
    "previous_score": 82.83,
    "current_score": 86.83,
    "progress_status": "improved",
    "last_update": "2026-10-01T06:38:03.217011"
  }
]
```

## Understanding `last_update`

Example:

```text
2026-10-01T06:38:03.217011
```

Meaning:

```text
2026-10-01 = date
T          = separator between date and time
06         = hour
38         = minutes
03         = seconds
217011     = microseconds
```

The model currently uses:

```python
datetime.utcnow
```

so this database timestamp is based on UTC.

For a user interface we can later format/convert it into a friendlier local display such as:

```text
01/10/2026 - 09:38 AM (Saudi time)
```

without changing the stored historical value.

## Current progress checkpoint

```text
Automatic progress creation ✅
Improved / declined / stable status ✅
History stored in separate table ✅
GET progress history endpoint ✅
Ordered timeline ✅
Friendly frontend time formatting ⏭️ later
Progress graph ⏭️ later frontend/analytics stage
```
