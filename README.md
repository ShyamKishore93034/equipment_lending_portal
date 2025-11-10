# School Equipment Lending Portal  
**SE ZG503 – Group 96**  
**Roll No:** 2024tm93034

![Frontend-React](https://img.shields.io/badge/Frontend-React-blue)
![Backend-FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Database-MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![Language-Python](https://img.shields.io/badge/Language-Python-yellow)

---

## Overview

This is a full-stack **School Equipment Lending Portal** developed by Shyam Kishore.  
The project is executed in **two phases**:

1) **Manual Development** — I created a working baseline myself  
2) **AI-Assisted Development** — I used ChatGPT / Claude / Grok to accelerate improvements

This project demonstrates how AI can boost development efficiency, while I still remain the primary developer and reviewer.

---

## Repository Structure

| Folder | Description |
|---|---|
| `/manual` | My manually developed version (baseline system) |
| `/ai-assisted` | Improved version with AI assisted refactoring + features |

---

## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/ShyamKishore93034/equipment_lending_portal.git
```

Open either `manual/` or `ai-assisted/` folder for respective setup steps.

---

## Phase 1 — Manual Development

I first built the baseline version **without using AI**.

**Delivered:**

- CRUD for equipment inventory
- User login + borrow + return
- Basic dashboard UI

---

## Phase 2 — AI Assisted Development

After manual version was working, I used AI to speed up production improvements.

**AI helped me improve:**

- Pagination
- Historical borrow/return logs
- Analytics dashboard components
- bcrypt-based secure password hashing
- Joi validation rules
- Auto DB initialization structure

I used ~17 prompts with careful manual review after each improvement.

---

## Documentation

- Postman API Docs → `API_Docs.md`  
- AI Prompt Log & Reflection → `AI_Usage_Log.pdf`

---

## Manual vs AI-Assisted Comparison

| Metric | Manual Version | AI-Assisted Version | Reflection |
|---|---|---|---|
| Time Taken | ~10 hours | ~3 hours | Significant acceleration |
| Code Lines | ~500 | ~550 | Added features / refactors |
| Error Handling | Basic console logs | Advanced try-catch + Joi | AI improved consistency |
| Features | CRUD only | CRUD + History + Analytics + Security | AI added enhancements |
| Security | Plain password | bcrypt hashing | AI enabled stronger security |
| Bugs Found in Testing | 4–6 | 1–2 | Validation reduced issues |
| Readability | Medium | High (async/await, comments) | AI suggested modern patterns |

---

## Final Reflection

Manual phase helped me understand system architecture deeply.

AI did **not** replace development — it **enhanced and accelerated** it.

I remained in control and integrated only the improvements which made the product more secure, readable, and feature-rich.

---
