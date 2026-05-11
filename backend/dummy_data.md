User issue: 500 error after deploy.
Root cause 1: `logger.js` crashing because of read-only FS writing to `logs`. (Fixed).
Root cause 2: `MONGODB_URI` is not set in Vercel Backend Environment Variables, causing `mongodb.js` to trigger `process.exit(1)`.
