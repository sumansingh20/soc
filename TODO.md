# SOC Academy – Enterprise Build TODO

## Phase 0 — Foundation & correctness (must finish first)
- [ ] Unify persistence on MongoDB + Mongoose (remove/stop using SQL-based model logic)
- [ ] Fix any model imports/exports so all routes use the same Mongo collections
- [ ] Ensure all protected routes are guarded by authenticate + authorize
- [ ] Add audit logging model + middleware hooks for admin/content changes

## Phase 1 — Real SOC Lab Engine (terminal + datasets + grading)
- [ ] Extend lab schema to include: datasets, terminal profile (allowed commands), expected evidence JSON, scoring rules
- [ ] Add LabInstance model for per-user runtime state
- [ ] Add lab engine service: dataset loader, simulated terminal command execution, evidence extraction
- [ ] Implement lab instance endpoints (start/command/finish/progress)
- [ ] Replace lab frontend evidence section with a real interactive terminal + step UI
- [ ] Add lab progress validation (structured evidence vs expected)

## Phase 2 — Real Investigation Workflow Room
- [ ] Add InvestigationInstance model and workflow stage state machine
- [ ] Implement investigation endpoints (start/evidence/next/finish)
- [ ] Update investigation frontend page into an interactive workflow room with validation + persistence

## Phase 3 — Real SIEM Simulation (events + alerts + dashboards)
- [ ] Add event ingestion model (synthetic events stored in Mongo)
- [ ] Add rule model (Sigma-like JSON filters + severity + enrichment)
- [ ] Add alert model generated from events
- [ ] Implement SIEM endpoints (start/stop/events query/alerts stream)
- [ ] Update SIEM frontend page into a real monitoring console with search + alert timeline

## Phase 4 — Admin system fully wired
- [ ] Update AdminPanel lab creation/edit fields to support datasets + terminal profile + expected evidence JSON
- [ ] Add admin endpoints/tests for validating lab schema
- [ ] Ensure seeded baseline content includes the full 7-day roadmap with executable labs

## Phase 5 — Quality & production readiness
- [ ] Add environment validation, improved error handling, request validation
- [ ] Run backend smoke tests + frontend build
- [ ] Update docs: installation, environment variables, deployment

