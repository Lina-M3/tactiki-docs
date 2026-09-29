---
sidebar_position: 1
title: Tactiki Documentation
description: Living technical documentation for the Tactiki CPIT499 project.
---

# Tactiki — CPIT499 Development Documentation

> This is our **living study and development reference** for the Tactiki graduation project.

Tactiki is an AI-powered decision-support system for university football trainers. This documentation focuses on the implementation journey and is designed to stay useful while we are coding **and** when we prepare for the project discussion.

## What belongs here?

For every implemented feature, we will document:

- **What** we built.
- **Why** we built it this way.
- **Where** the code lives.
- **How** the code works.
- **How** we tested it.
- **What errors** happened and how we solved them.
- **What questions** we may be asked during the defense.

## Current backend stack

| Layer | Technology |
|---|---|
| API | FastAPI |
| Server | Uvicorn |
| ORM | SQLAlchemy |
| Database | SQLite |
| Validation | Pydantic |
| Authentication | Password hashing now; Login + JWT next |

## Current stopping point

The backend foundation is running, the database and initial models exist, Swagger has been tested, and the signup flow has been implemented and debugged.

**Next milestone:** Login, password verification, JWT, and protected endpoints.

:::tip How to study from this site
Do not memorize code line-by-line. Focus on understanding each file's responsibility, the flow of a request, the reason for each dependency, and how data moves between the API and database.
:::
