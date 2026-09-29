---
sidebar_position: 1
title: Start Here
description: Your living notebook for the Tactiki CPIT499 backend.
---

# Tactiki — Development Notebook

> هذا الموقع مو تقرير رسمي فقط. اعتبريه **دفتر ملاحظات تقني حي** لمشروع Tactiki: ماذا عملنا؟ لماذا؟ أين الكود؟ كيف اختبرناه؟ وما الذي يجب أن أتذكره وقت المناقشة؟

Tactiki is an AI-powered decision-support system for university football trainers. Our implementation work is split between the frontend and backend; these notes focus mainly on the **backend work** being implemented with FastAPI.

## How to read this notebook

Each page tries to answer the same questions:

1. **What did we build?**
2. **Why did we need it?**
3. **Which file contains it?**
4. **How does the code work?**
5. **How did we test it?**
6. **What went wrong and how did we fix it?**
7. **What might I be asked in the defense?**

:::tip تذكري
لا تحفظين الكود حرفيًا. افهمي **مسار الطلب Request Flow** ومسؤولية كل ملف. إذا فهمتي ليش كل جزء موجود، تقدرين تشرحين المشروع حتى لو تغيرت بعض الأسطر لاحقًا.
:::

## Status legend

| Symbol | Meaning |
|---|---|
| ✅ | Implemented and/or verified |
| 🟡 | Implemented but still being expanded or retested |
| ⏭️ | The next planned step |
| ⬜ | Not implemented yet |
| 🧠 | Important idea to remember |
| ⚠️ | Common mistake or debugging note |

## Current backend stack

| Layer | Current technology | Why it exists |
|---|---|---|
| API framework | FastAPI | Defines endpoints and generates Swagger/OpenAPI docs |
| Development server | Uvicorn | Runs the FastAPI ASGI application |
| ORM | SQLAlchemy | Maps Python classes to database tables |
| Database | SQLite | Local database during current development |
| Validation | Pydantic | Validates request/response data |
| Password hashing | Passlib + bcrypt | Stores password hashes instead of plain passwords |
| API testing | Swagger UI | Lets us test endpoints before React integration |

## Current stopping point

✅ FastAPI application runs  
✅ SQLite + SQLAlchemy configured  
✅ Six core ORM models created  
✅ Swagger verified  
✅ Coach signup implemented  
✅ Password hashing compatibility issue fixed  
✅ Duplicate-email validation verified  
⏭️ **Next backend milestone: Login + password verification + JWT + protected endpoints**

## The big picture

When the frontend eventually sends a request, the flow will look roughly like this:

```text
React Frontend
      ↓ HTTP request
FastAPI Router
      ↓ validated by
Pydantic Schema
      ↓ uses
SQLAlchemy Session
      ↓ reads/writes
SQLite Database
      ↓ result returned
FastAPI Response
      ↓ JSON
React Frontend
```

Authentication adds another layer:

```text
Signup
  → validate data
  → check duplicate email
  → hash password
  → save Coach

Login  [NEXT]
  → find Coach by email
  → verify password
  → create JWT
  → use JWT on protected endpoints
```

## Important rule for these notes

Pages marked **Current implementation** describe work we actually completed. Future work is clearly labeled **Next / Planned** so we do not accidentally study planned code as if it already exists.
