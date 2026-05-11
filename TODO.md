# SOC Analyst Training Platform — Build TODO

## Step 0: Repo understanding & current gaps
- [x] Inspect existing backend content/labs endpoints and fallback content (`backend/routes/content.js`, `backend/data/socContent.js`, `backend/routes/labs.js`).
- [x] Identify mismatch with required “enterprise level, real-world, deep, no placeholder content”.

## Step 1: Enterprise content data model
- [ ] Add MongoDB schemas/models for:
  - Lessons with ordered sections (beginner/deep/practical/examples/workflow/mistakes/tips/commands/logs/ui-spec/tasks)
  - Investigation cases (multi-stage narratives + evidence timeline)
  - Datasets (JSON evidence packs used by labs)
  - Dashboard boards/widgets (SOC-style panels)
  - UI spec assets (screenshots-style UI definitions)
- [ ] Update backend routes to expose these new entities.

## Step 2: Dataset-driven labs + evidence-based grading
- [ ] Update lab schema to store evidence IDs, required evidence checklist, and rubrics.
- [ ] Replace keyword/substring grading in `backend/routes/labs.js` with evidence-based scoring.
- [ ] Add endpoints for lab evidence packs and task checks.

## Step 3: Replace `backend/data/socContent.js` fallback
- [ ] Create a content package (Day 1–Day 7) with real investigation workflows, real logs, real commands, and structured attack traces.
- [ ] Load this package via seed scripts / content loader.

## Step 4: SOC dashboard UI + investigation workflows
- [ ] Implement real-time style dashboard pages (alert widgets, investigation feed, log windows, terminal sections).
- [ ] Implement student investigation feed + saved notes linked to evidence IDs.

## Step 5: Quizzes enhancements
- [ ] Improve quiz model to store per-question rationale/evidence requirements.
- [ ] Update grading and feedback.

## Step 6: Admin panel + upload capabilities
- [ ] Ensure admin routes can upload/edit lessons, datasets, labs, quizzes, UI specs.
- [ ] Add admin analytics endpoints (completion funnel, time-on-task, lab pass rates).

## Step 7: Verification
- [ ] Seed enterprise content and verify endpoints:
  - `/api/content/roadmap`
  - `/api/content/days`
  - `/api/content/search`
  - `/api/labs`, `/api/labs/:slug`
- [ ] Frontend build + lint + runtime smoke tests.

## Release criteria
- [ ] Platform renders Day 1–Day 7 with deep, step-by-step, real-world content.
- [ ] Labs are dataset-driven with evidence-based grading.
- [ ] SOC-style dashboard pages show real investigation structures.

