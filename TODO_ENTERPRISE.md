# Enterprise SOC Platform — Implementation TODO

## 0. Inventory & alignment (done/locked)
- [x] Analyzed existing SOC platform routes/models/UI entry points.
- [x] Verified current content pipeline relies heavily on fallback `backend/data/socContent.js`.
- [x] Identified lab scoring is keyword-based, not evidence-driven.

## 1. Backend: data model & APIs (start)
- [ ] Add new Mongo models/collections: Dataset, EvidencePack, CaseStudy/InvestigationScenario, DashboardBoard, DashboardWidget.
- [ ] Extend Lab model to reference datasets/evidence packs robustly (caseId linkage).
- [ ] Extend/adjust Progress model usage to store evidence completion + timeline reconstruction checkpoints.
- [ ] Add APIs:
  - [ ] `GET /api/datasets/:slug`
  - [ ] `GET /api/evidence/:packSlug`
  - [ ] `GET /api/cases/:slug`
  - [ ] `GET /api/dashboard/boards/:slug`

## 2. Backend: evidence-based grading
- [ ] Replace `scoreSubmission()` in `backend/routes/labs.js` with required evidence checklist validation + rubric scoring.
- [ ] Add endpoints for evidence selection/checklists and timeline submissions.
- [ ] Ensure submissions reference evidence IDs the UI exposes.

## 3. Backend: seed/content package migration (Day 1–Day 7)
- [ ] Convert `backend/data/socContent.js` fallback content into structured dataset/evidence/case packages.
- [ ] Implement loader/seed pipeline for the new entities.

## 4. Frontend: SOC workstation & workflow UI
- [ ] Implement dataset viewer + terminal-style evidence windows.
- [ ] Implement investigation feed, attack timelines, and incident panels (dataset-driven widgets).
- [ ] Implement evidence checklist workflow with save notes.
- [ ] Update Day-wise, Labs, Investigation, SIEM, Threat Hunting, Incident Response pages to use new APIs.

## 5. Admin panel: enterprise upload + analytics
- [ ] Extend admin CRUD to support datasets/evidence/cases/widgets.
- [ ] Add analytics endpoints: pass rates, evidence miss breakdown, time-on-task.

## 6. Verification & smoke tests
- [ ] Run seed + verify APIs for days/lessons/labs.
- [ ] Smoke-test lab evidence grading end-to-end.
- [ ] Smoke-test dashboard widget rendering.
- [ ] Build + typecheck frontend.

## Release criteria
- [ ] Production content no longer relies on fallback for core learning/labs.
- [ ] Labs are evidence-based (requiredEvidenceIds enforced).
- [ ] SOC dashboards render real investigation structures from dataset-driven entities.

