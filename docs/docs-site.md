---
sidebar_position: 10
title: This Documentation Site
---

# This Documentation Site

This page records how we built this notebook itself.

## Why we changed the documentation plan

We first explored GitBook, but we wanted a solution that could stay under our control without depending on a temporary paid-feature trial.

So the documentation moved to:

```text
Docusaurus + GitHub + GitHub Pages
```

## Repository

```text
Lina-M3/tactiki-docs
```

This repository contains the source files for the documentation site.

## Why Docusaurus?

For our use case it gives us:

- Sidebar navigation.
- Markdown pages.
- Syntax-highlighted code blocks.
- Notes/warnings/tips.
- A clean documentation layout.
- Version-controlled content on GitHub.
- Static build that can be hosted with GitHub Pages.

## Main site files

```text
tactiki-docs/
├── docs/                  # Notebook pages
├── src/
│   ├── css/custom.css     # Visual customizations
│   └── pages/index.js     # Home page
├── static/img/            # Static images/icons
├── docusaurus.config.js   # Main Docusaurus config
├── sidebars.js            # Sidebar organization
├── package.json           # Node dependencies/scripts
└── .github/workflows/
    └── deploy.yml         # Automatic GitHub Pages deployment
```

## Deployment flow

Every time we push an update to `main`:

```text
GitHub commit
    ↓
GitHub Actions starts
    ↓
npm install
    ↓
npm run build
    ↓
Docusaurus creates build/
    ↓
GitHub Pages deploys build/
    ↓
Updated website
```

## Site URL

```text
https://lina-m3.github.io/tactiki-docs/
```

## Important benefit

Because the notes are stored as Markdown in GitHub, updating the notebook is just another code/documentation change.

That means the documentation can grow at the same pace as the backend instead of becoming outdated at the end of the semester.
