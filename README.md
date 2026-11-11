# JOBserch-portel-serve-site

<div align="center">

### 🚀 HireLoop — Job Portal Server (REST API)

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Cookie_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

![status](https://img.shields.io/badge/status-phase%201%20complete-success?style=flat-square)
![tests](https://img.shields.io/badge/smoke%20tests-7%2F7%20passing-brightgreen?style=flat-square)
![api](https://img.shields.io/badge/API-v1-blue?style=flat-square)
![license](https://img.shields.io/badge/license-ISC-yellow?style=flat-square)

**The backend that powers HireLoop:** job search, applications, company profiles,
subscription plans and a recruiter toolkit — consumed by a Next.js client.

</div>

---

## 🛠️ Technologies Used (what the website is made with)

> 🎨 **Legend:** ✅ = already running in the server today · 🔜 = planned for the next phase (client side / new features)

### ⚙️ Backend core — running now ✅

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v5_Framework-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL_Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![REST](https://img.shields.io/badge/REST-API_Design-2563EB?style=for-the-badge)

| Technology | Role in the website | Status |
|---|---|---|
| **Node.js** | JavaScript runtime — executes the whole server | ✅ running |
| **Express.js v5** | Web framework: routes, middleware, JSON responses, auto async-error forwarding | ✅ running |
| **MongoDB** (native driver) | Stores users, jobs, companies, applications, saved jobs, payments | ✅ running |
| **JavaScript (ESM)** | `"type": "module"` — modern import/export syntax everywhere | ✅ running |

### 🔐 Security & authentication — running now ✅

![JWT](https://img.shields.io/badge/JWT-Token_Sessions-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcryptjs-Password_Hashing-EF4444?style=for-the-badge&logo=lock&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth2-Sign_In-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-Security_Headers-7C3AED?style=for-the-badge)
![Rate Limit](https://img.shields.io/badge/express--rate--limit-Brute_Force_Shield-F59E0B?style=for-the-badge)
![CORS](https://img.shields.io/badge/CORS-Origin_Control-0EA5E9?style=for-the-badge)
![Cookie](https://img.shields.io/badge/httpOnly_Cookie-XSS_Safe-D946EF?style=for-the-badge)

| Technology | Role in the website | Status |
|---|---|---|
| **jsonwebtoken** | Signs/verifies 7-day login tokens (HS256 pinned) | ✅ running |
| **bcryptjs** | One-way password hashing — plain passwords never stored | ✅ running |
| **google-auth-library** | Verifies Google ID tokens for "Continue with Google" | ✅ running |
| **helmet** | ~11 security headers on every response | ✅ running |
| **express-rate-limit** | Brute-force shield: 20 failed attempts / 15 min on auth | ✅ running |
| **cors** | Only the Next.js origin may call this API | ✅ running |
| **httpOnly cookie** | Token unreadable by JavaScript → XSS cannot steal it | ✅ running |

### 🧪 Validation & configuration — running now ✅

![Zod](https://img.shields.io/badge/Zod-Input_Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-Config_Loading-2496ED?style=for-the-badge&logo=dotenv&logoColor=white)
![cookie-parser](https://img.shields.io/badge/cookie--parser-Cookie_Parsing-EC4899?style=for-the-badge)

| Technology | Role in the website | Status |
|---|---|---|
| **zod** | Validates every request body before business logic runs | ✅ running |
| **dotenv** | Loads secret config from `.env` (validated at startup) | ✅ running |
| **cookie-parser** | Reads the login cookie into `req.cookies.token` | ✅ running |

### 🎨 Front-end client (separate Next.js repo) — planned 🔜

![Next.js](https://img.shields.io/badge/Next.js-Client_App-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-UI_Library-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-E70488?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Dashboard_Charts-22C55E?style=for-the-badge&logo=recharts&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

| Technology | Role in the website | Status |
|---|---|---|
| **Next.js + React** | Public pages, dashboards for all three roles | 🔜 next phase |
| **Tailwind CSS** | Utility-first styling of pages and tables | 🔜 next phase |
| **Framer Motion** | Page transitions, card and chart micro-animations | 🔜 next phase |
| **Recharts** | Application-status pie/bar charts, recruiter + admin analytics | 🔜 next phase |
| **Stripe** | Subscription payments (Free/Pro/Premium · Free/Growth/Enterprise) | 🔜 after billing phase |

### 🧰 Developer tooling — running now ✅

![npm](https://img.shields.io/badge/npm-Packages-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-Auto_Restart-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)
![Git](https://img.shields.io/badge/Git-Version_Control-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Code_Hosting-181717?style=for-the-badge&logo=github&logoColor=white)

| Technology | Role in the website | Status |
|---|---|---|
| **npm** | Dependency management (`npm install`, `npm run dev/seed/start`) | ✅ running |
| **nodemon** | Auto-restarts the server during development | ✅ running |
| **Git + GitHub** | Version control — every milestone pushed to this repo | ✅ running |

---

poject structure   
```
server/
├── .env                          ← Secret config (password, secret, URL)
├── .gitignore                    ← Files/folders kept out of GitHub
├── package.json                  ← List of dependencies and scripts
└── src/
    ├── index.js                  ← Entry point: starts everything
    ├── server.js                 ← Starts and stops the HTTP server
    ├── app.js                    ← Express app: connects middleware and routes
    │
    ├── config/
    │   └── env.js                ← Validates .env and provides it from one place
    │
    ├── db/
    │   └── mongo.js              ← MongoDB connection and collection references
    │
    ├── data/
    │   └── jobs.json             ← Original job data used for seeding
    │
    ├── scripts/
    │   └── seedJobs.js           ← Loads jobs.json into MongoDB (run once)
    │
    ├── utils/
    │   ├── token.js              ← Creates JWTs and sets/clears cookies
    │   └── publicUser.js         ← Safe user info that can be sent to the client
    │
    ├── validators/
    │   └── auth.schema.js        ← Validates register and login input
    │
    ├── middlewares/
    │   ├── rateLimit.js          ← Blocks brute-force attempts on login/register
    │   ├── auth.js               ← Verifies tokens and roles
    │   └── errorHandler.js       ← Handles all errors in one place
    │
    ├── controllers/
    │   ├── auth.controller.js    ← Core logic for register, login, Google login, logout
    │   ├── user.controller.js    ← Current user and user list
    │   └── job.controller.js     ← Job list and single job fetch
    │
    └── routes/
        ├── index.js              ← Combines all routes together
        ├── auth.routes.js        ← /api/auth/* URLs
        ├── user.routes.js        ← /api/me and /api/users URLs
        └── job.routes.js         ← /api/jobs URLs
```




```
Client (Next.js)
   │
   ▼
index.js ──► server.js ──► app.js
                              │
                              ▼
                   helmet, cors, json parser, cookieParser
                              │
                              ▼
                      routes/index.js
                              │
                              ▼
                      routes/auth.routes.js
                              │
                  authLimiter (rateLimit.js)   ← stops here if it fails
                              │
                              ▼
                  controllers/auth.controller.js
                  ├── validators/auth.schema.js  (validates input)
                  ├── db/mongo.js                (looks up the user)
                  ├── utils/token.js             (creates token and sets cookie)
                  └── utils/publicUser.js        (builds the safe response)
                              │
                              ▼
                        JSON response

                        ```

Client (Next.js) sends a request, such as a login.
index.js starts the app, server.js runs the HTTP server, and app.js sets up Express.
Global middleware runs first on every request: helmet adds security headers, cors allows the client to connect, the JSON parser reads the body, and cookieParser reads cookies.
routes/index.js forwards /api/auth/* requests to auth.routes.js.
authLimiter checks the request against the rate limit. If there are too many failed attempts, the request stops here and never reaches the controller.
auth.controller.js does the main work:
auth.schema.js checks that the input is valid.
mongo.js finds the user in the database.
token.js creates a JWT and sets it as a cookie.
publicUser.js strips out sensitive fields so only safe data goes back.
The server sends a JSON response to the client.


One comment install all Dependencies what should we need in the project that is 

npm install bcryptjs cookie-parser cors dotenv express express-rate-limit google-auth-library helmet jsonwebtoken mongodb zod

---

# 🚀 HireLoop — Full Project Explanation (server)

> 💡 This section is **added below** the original outline — nothing above was changed.
> It explains what the project is, how every file works, what was fixed, how to run it,
> and what comes next.

## 👥 1. What this project is

**HireLoop** is the backend of a modern job-hunting portal that connects **job seekers**
(people looking for work) with **recruiters** (companies that hire). This repository is
the **server** (REST API) only — a separate Next.js client will consume it.

The platform supports three user roles:

| Role | What they do on the platform |
|---|---|
| 👤 **Seeker** | Browses jobs with filters, saves favorites, applies (limited by plan), tracks application status |
| 🏢 **Recruiter** | Registers a company, posts jobs (limited by plan), reviews applicants, changes application status |
| 🛠️ **Admin** | Approves companies, manages users, moderates jobs, watches revenue and payments |

Companies go through a status flow — **Pending → Approved/Rejected** — and job applications
through **Applied → Under Review → Shortlisted → Offered/Rejected**. Both are described in the
`Project requirements.md`.

## 🧰 2. Tech stack and why each dependency was chosen

| Dependency | Why it is in the project |
|---|---|
| `express` (v5) | The web framework: routes, middleware, JSON responses. v5 auto-forwards async errors to the error handler |
| `mongodb` | Database driver — stores users, jobs, companies, applications, payments |
| `jsonwebtoken` | Creates and verifies the login JWT stored in a cookie |
| `bcryptjs` | Hashes passwords one-way; plain passwords are never stored |
| `google-auth-library` | Verifies the Google ID token sent by "Continue with Google" |
| `zod` | Validates request bodies (register/login/jobs) before any logic runs |
| `express-rate-limit` | Blocks brute-force login attempts and API abuse per IP |
| `helmet` | Adds ~11 security headers to every response |
| `cors` | Allows ONLY the Next.js client origin to call this API |
| `cookie-parser` | Reads the login cookie into `req.cookies.token` |
| `dotenv` | Loads `.env` values into `process.env` |
| `nodemon` (dev) | Restarts the server automatically while developing |

The project uses **ES modules** (`"type": "module"` in package.json), so every local import
needs the `.js` extension.

## ⚙️ 3. How to run the server locally

```bash
npm install              # install dependencies
cp .env.example .env     # create your secret config, then fill in real values
npm run seed             # OPTIONAL: load src/data/jobs.json into MongoDB (12 sample jobs)
npm run dev              # start with nodemon (auto-restart)
# or
npm start                # start normally
```

Requirements:
- A reachable MongoDB — local (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI in `.env`.
- `JWT_SECRET` at least 32 characters (generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
- `GOOGLE_CLIENT_ID` from Google Cloud Console (only needed for Google login).
- `CLIENT_URL` = the Next.js dev URL (default `http://localhost:3000`).

> 🔐 **Security note:** the real `.env` is in `.gitignore` and is never pushed to GitHub.
> `.env.example` is the committed template. If `.env` is missing or invalid, `src/config/env.js`
> stops the server at startup with a message naming the exact missing key.

## 📂 4. File-by-file explanation (the server part)

### 🔥 Entry & server lifecycle

| File | What it does |
|---|---|
| `src/index.js` | **Entry point** executed by `npm start`. Registers SIGINT/SIGTERM handlers so Ctrl+C or `docker stop` triggers a graceful shutdown, then calls `startServer()`. Exits with code 1 if startup fails |
| `src/server.js` | **HTTP server lifecycle.** `startServer()` connects MongoDB → creates the unique email index → opens the port. `stopServer()` (added — was missing while `index.js` already imported it) closes the HTTP server first, then the DB pool, with a 5s force-exit failsafe |
| `src/app.js` | **Express app wiring.** Creates the app and installs global middleware in strict order: `helmet` → `cors` (only `CLIENT_URL`, credentials allowed) → `express.json` (10kb limit) → `cookieParser` → routes → `notFound` → `errorHandler`. Disables the `X-Powered-By` header and sets `trust proxy` so rate limiting sees real client IPs behind a proxy |

### 🗄️ Config & database

| File | What it does |
|---|---|
| `src/config/env.js` | Reads `.env` **once**, validates every key with zod, exports `env` + `IS_PROD`. Bad config = instant, readable startup failure instead of a random crash later |
| `src/db/mongo.js` | **The only file that talks to MongoDB.** One `MongoClient` (connection pool of 10) shared by the whole server. Exports collections: `user`, `jobs`, `companies`, `applications`, `savedJobs`, `payments`, `notifications` — the last five are ready for the phase-2 features. `connectDB()` pings the server to prove the connection truly works; `closeDB()` flushes and closes the pool |

### 🧩 Utilities (shared helpers)

| File | What it does |
|---|---|
| `src/utils/token.js` | Everything about the login JWT: `sendToken()` signs a 7-day HS256 token (`sub` = user id, `email`, `role`) and stores it in an **httpOnly** cookie — JavaScript can never read it, so XSS cannot steal it. `verifyToken()` pins the algorithm to HS256 (blocks the "none algorithm" attack). `clearToken()` deletes the cookie on logout (added) |
| `src/utils/publicUser.js` | **Allow-list** that shapes user data safe to send to the client: id, name, email, role, provider, photo, status, createdAt. Password hashes can never leak because a field must be explicitly added here first. `status`/`createdAt` were added for the admin "Manage Users" table |

### 🛡️ Validation & middleware

| File | What it does |
|---|---|
| `src/validators/auth.schema.js` | zod schemas for `register` (trims name, lowercases email, password min 8 / max 72 because bcrypt cuts at 72 bytes, role = seeker/recruiter only — admin accounts are made directly in the DB), `login` (lenient on purpose so unknown-email and wrong-password give the same 401 — prevents user enumeration), `google` (the client's ID token string) |
| `src/middlewares/rateLimit.js` | `authLimiter`: 20 requests / 15 min / IP on register+login+google, and **successful** requests are not counted — only failed guesses burn the budget. `apiLimiter`: 120 req/min on public reads like `/api/jobs` |
| `src/middlewares/auth.js` | `requireAuth`: reads `req.cookies.token`, verifies the JWT, **re-loads the user from the DB on every request** — this makes role changes and suspensions take effect immediately instead of after token expiry — then puts the fresh document on `req.user`. Rejects suspended accounts with 403. `requireRole(...roles)`: factory used like `requireRole("admin")`; returns 403 when the role does not match |
| `src/middlewares/errorHandler.js` | All errors in ONE place. Exports `httpError(status, msg)` (throw it anywhere to abort a request), `notFound` (404 JSON for unknown routes), and `errorHandler` which maps: ZodError → 400 with readable messages, Mongo 11000 → 409 duplicate email, body > 10kb → 413, malformed JSON → 400, anything else → 500 (real message hidden in production, full detail logged to the console) |

### 🧠 Controllers (business logic)

| File | What it does |
|---|---|
| `src/controllers/auth.controller.js` | **register**: zod validate → 409 if email exists → bcrypt hash (10 rounds) → insert (provider `local`, status `active`, `createdAt`) → auto-login via cookie. **login**: same 401 for unknown email and wrong password; Google-only accounts get a hint to use Google. **google**: verifies the ID token against Google with `GOOGLE_CLIENT_ID` as audience (the security-critical step — the server never trusts the raw payload), then logs in or creates the account (`provider: "google"`, role `seeker`). **logout**: clears the cookie |
| `src/controllers/user.controller.js` | **me** (`GET /api/me`): returns `publicUser(req.user)` — the client's "who am I?" call that hydrates the dashboard sidebar. **list** (`GET /api/users`): admin-only directory with `?email=` substring search, `?role=` filter, `?page`/`?limit` pagination — feeds the "Manage Users" table |
| `src/controllers/job.controller.js` | **list** (`GET /api/jobs`): public feed with `?q=` keyword (title or description), `?type`, `?category`, `?location` (city/country), `?minSalary`/`?maxSalary` (range intersect), `?page`/`?limit`, `?sort` (newest/salary). Only `status: "active"` jobs with a future deadline are shown. Regex user input is escaped to prevent regex injection. **get** (`GET /api/jobs/:jobId`): validates the ObjectId, returns the job **plus up to 4 similar jobs** (same category) for the Job Details page |

### 🗺️ Routes (URL table)

| File | What it does |
|---|---|
| `src/routes/index.js` | Single mount point used by `app.js`: `GET /` health probe, `/api/auth/*` → auth router, `/api/*` → user router, `/api/jobs*` → job router. A new feature domain later means one new line here |
| `src/routes/auth.routes.js` | `POST /api/auth/register`, `/login`, `/google` (each guarded by `authLimiter` — a rate-limited request never reaches the controller or its bcrypt work), `POST /api/auth/logout` (no limiter needed) |
| `src/routes/user.routes.js` | `GET /api/me` → `requireAuth` → `me`; `GET /api/users` → `requireAuth` → `requireRole("admin")` → `list`. Order matters: the role check reads `req.user` that `requireAuth` just created |
| `src/routes/job.routes.js` | `GET /api/jobs` → `apiLimiter` → `list`; `GET /api/jobs/:jobId` → `get`. Both public — browsing needs no account; *applying* will be authenticated in phase 2 |

### 🌱 Data & seeding

| File | What it does |
|---|---|
| `src/data/jobs.json` | 12 realistic sample jobs (Fintech, AI, Developer Tools, E-Commerce, Healthcare…) with the full field shape the requirements describe: title, description, company block, category, type, salary range, currency, location, remote flag, deadline, responsibilities, requirements, benefits, status, postedAt |
| `src/scripts/seedJobs.js` | Run with `npm run seed`. Wipes the `jobs` collection first (idempotent — no duplicates on re-run), inserts all 12 in one batch, then creates the indexes the list queries rely on (`status+postedAt`, `category`, `type`, `deadline`, `company.name`) |

## 🔁 5. Request lifecycle — login example

```
Client (Next.js) → POST /api/auth/login { email, password }
  1. app.js: helmet → cors → express.json → cookieParser
  2. routes/index.js → /api/auth → auth.routes.js
  3. authLimiter — stops here with 429 after 20 failed attempts / 15 min
  4. auth.controller.login:
       loginSchema.parse()      → 400 on bad input (errorHandler)
       user.findOne(email)      → db/mongo.js
       bcrypt.compare()         → 401 on wrong password
       sendToken()              → utils/token.js sets the JWT cookie
       publicUser()             → safe profile JSON
  5. Later requests: requireAuth verifies the cookie, re-loads the user,
     attaches req.user → protected handlers run or 401/403 is returned.
```

## 🌐 6. Current API reference (phase 1)

| Method & path | Auth | Purpose |
|---|---|---|
| `🟢 GET /` | 🔓 public | Health/info probe |
| `🟠 POST /api/auth/register` | 🔓 public (limiter) | Create Seeker/Recruiter account, auto-login |
| `🟠 POST /api/auth/login` | 🔓 public (limiter) | Email + password login |
| `🟠 POST /api/auth/google` | 🔓 public (limiter) | Google sign-in via verified ID token |
| `🟠 POST /api/auth/logout` | 🔓 public | Clear the login cookie |
| `🟢 GET /api/me` | 🔐 logged in | Current user's profile |
| `🟢 GET /api/users` | 👑 admin | User directory (search/filter/paginate) |
| `🟢 GET /api/jobs` | 🔓 public (limiter) | Job feed with filters + pagination |
| `🟢 GET /api/jobs/:jobId` | 🔓 public | Job detail + similar job suggestions |

Every response has the shape `{ ok: true, ... }` or `{ ok: false, message, issues? }`.

## 🐞 7. Bugs fixed in previously written code

| Where | Problem | Fix |
|---|---|---|
| `package.json` | `"type": "commonjs"` while all code uses `import` → would crash instantly | set to `"module"` |
| `package.json` | bogus dependency `cros` (typo of `cors`) | removed, lockfile updated |
| `package.json` | `seed` script pointed at non-existent `src/scripts/seed.js` | points to `src/scripts/seedJobs.js` |
| folder names | `routers/`, `validatons/`, `ratelimit.js`, `json.json` did not match the README plan | renamed to `routes/`, `validators/`, `rateLimit.js`, `jobs.json` |
| `src/db/mongo.js` | `maxPoolSixe` typo (driver silently ignored the option) | `maxPoolSize: 10` |
| `src/db/mongo.js` | extension-less import + hard-coded db name `"JOBserch"` ignored `DB_NAME` | `../config/env.js` + `client.db(env.DB_NAME)` |
| `src/server.js` | `index.js` imported `stopServer`, but it was never exported → crash on Ctrl+C | implemented graceful `stopServer()` |
| `src/utils/token.js` | imported `Is_PROD`, real export is `IS_PROD` → crash at startup | corrected |
| `src/app.js` | imported `./routes/index.js` while the folder was `routers/` | consistent after rename; `notFound` middleware added |
| `src/index.js`, `auth.routes.js` | extension-less relative imports (invalid in Node ESM) | `.js` extensions added |
| `src/data/json.json` | empty file | real 12-job seed data |

## ✅ 8. Verified by smoke test

| # | Check | Result |
|---|---|---|
| 1 | `GET /` health probe returns API info | ✅ 200 |
| 2 | Unknown route returns 404 JSON (not HTML) | ✅ 404 |
| 3 | `/api/users` without cookie | ✅ 401 |
| 4 | `/api/me` without cookie | ✅ 401 |
| 5 | Invalid login body | ✅ 400 + zod messages |
| 6 | Malformed JSON body | ✅ 400 |
| 7 | DB-backed call while Mongo offline | ✅ clean 500 |

Because no MongoDB runs on this machine yet, an HTTP smoke test was executed against the real
Express app (7/7 passed). The DB-backed call correctly produced a 500 while Mongo is offline,
proving the whole request chain runs.

## 🗺️ 9. Roadmap — what this server will grow next (per the requirements)

| Status | Feature | Details |
|---|---|---|
| 🔜 next | **Companies** | Recruiter registers a company (status `pending`), admin approves/rejects; public list shows approved only |
| 🔜 next | **Applications** | Seeker applies (plan limit: 3/30/unlimited), status flow `applied → underReview → shortlisted → offered/rejected` |
| 🔜 next | **Saved jobs** | Bookmark/unbookmark, 10-saved limit on the Free plan |
| 🔜 next | **Subscription & billing** | Stripe checkout, plan activation (Free/Pro/Premium · Free/Growth/Enterprise), payment history |
| 🔜 next | **Admin dashboard APIs** | Role control + suspension, company/job moderation, revenue analytics |
| 🔜 next | **Notifications** | Recent-activity feeds, application-status email notifications |

The collections for all of the above are already declared in `src/db/mongo.js`, and the
`routes/index.js` mount point makes each feature a single line to plug in.

---

<div align="center">

**HireLoop Server** · built with 🟢 Node.js + ⚫ Express + 🍃 MongoDB

![Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Powered%20by-Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Data%20in-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

⭐ *Developed by [Rakib304832](https://github.com/Rakib304832) — every milestone is pushed to this repository.*

</div>
