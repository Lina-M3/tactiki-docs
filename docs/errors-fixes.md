---
sidebar_position: 6
title: Errors & Fixes
---

# Errors & Fixes

This page keeps the real debugging history of Tactiki.

## Passlib / bcrypt incompatibility

**Symptoms**

- Error while reading the bcrypt version.
- Missing `bcrypt.__about__`.
- Hashing failure during signup testing.

**Environment**

```text
passlib 1.7.4
bcrypt 5.0.0
```

**Fix**

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

**Lesson**

A dependency version can break correct application code. Read the traceback far enough to distinguish our code from third-party code.

---

## Duplicate email returned 400

**Observed response**

```json
{
  "detail": "Email already registered"
}
```

**Meaning**

The same signup data had been submitted again, so the duplicate-email check was working.

**Lesson**

Not every 4xx response means the backend is broken. Some errors are intentional client/business-rule responses.

---

## PowerShell and Ctrl+C

Typing the characters `Ctrl + C` is not the same as using the keyboard shortcut.

To stop Uvicorn, press **Ctrl+C** on the keyboard.
