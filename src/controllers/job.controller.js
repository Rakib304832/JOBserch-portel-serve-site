/**
 * src/controllers/job.controller.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Public job endpoints wired in routes/job.routes.js:
 *
 *   list GET /api/jobs        - filtered + paginated job feed powering the
 *                               "Browse Jobs" page and the Seeker dashboard
 *                               "Browse & Apply" page.
 *   get  GET /api/jobs/:jobId - single job detail powering /jobs/:jobId,
 *                               plus 4 "similar jobs" suggestions that the
 *                               Job Details page shows at the bottom.
 *
 * Only ACTIVE jobs with a future deadline are public. Closed/draft jobs stay
 * invisible here; recruiter/admin management endpoints come in phase 2.
 * Filtering runs in MongoDB (regex + range operators) rather than in
 * JavaScript, so the DB uses its indexes and pagination stays cheap.
 * ---------------------------------------------------------------------------
 */
import { ObjectId } from "mongodb";
import { jobs } from "../db/mongo.js";
import { httpError } from "../middlewares/errorHandler.js";

/** escapeRegex - makes raw user text safe inside a $regex (prevents regex injection like ".*"). */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * list - GET /api/jobs
 * Query parameters (all optional, combinable):
 *   q         - keyword searched in title AND description
 *   type      - exact: Full-time | Part-time | Remote | Contract | Internship
 *   category  - exact: Fintech, AI, Developer Tools, E-Commerce, ...
 *   location  - substring matched against city OR country
 *   minSalary / maxSalary - intersect the job's [salaryMin..salaryMax] range
 *   page / limit - pagination (default 1 / 12, max 50)
 *   sort      - "newest" (default) | "salaryDesc" | "salaryAsc"
 * Response: { ok, jobs, total, page, pages }
 */
export async function list(req, res) {
  // Base filter: the public feed only ever shows live job posts.
  const filter = { status: "active", deadline: { $gte: new Date() } };

  if (req.query.q) {
    const pattern = escapeRegex(String(req.query.q));
    // $or inside the keyword filter = "title matches OR description matches";
    // $and on the outside combines it with the other filters safely.
    filter.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
    ];
  }
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.location) {
    const pattern = escapeRegex(String(req.query.location));
    filter.$and = [
      ...(filter.$and ?? []),
      {
        $or: [
          { "location.city": { $regex: pattern, $options: "i" } },
          { "location.country": { $regex: pattern, $options: "i" } },
        ],
      },
    ];
  }
  // Salary intersect: a job qualifies when its range overlaps the user's.
  if (req.query.minSalary) {
    filter.salaryMax = { ...(filter.salaryMax ?? {}), $gte: Number(req.query.minSalary) };
  }
  if (req.query.maxSalary) {
    filter.salaryMin = { ...(filter.salaryMin ?? {}), $lte: Number(req.query.maxSalary) };
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

  // Sort mapping - newest by default; the UI's "Sort by salary" toggles map here.
  const sort =
    req.query.sort === "salaryDesc" ? { salaryMax: -1 }
    : req.query.sort === "salaryAsc" ? { salaryMin: 1 }
    : { postedAt: -1 };

  const [total, docs] = await Promise.all([
    jobs.countDocuments(filter),
    jobs.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).toArray(),
  ]);

  res.json({
    ok: true,
    jobs: docs,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}

/**
 * get - GET /api/jobs/:jobId
 * 1. Validate the id is a real Mongo ObjectId -> 404 otherwise (better UX
 *    than a 500 from an invalid ObjectId cast).
 * 2. Fetch the job; public view requires active status.
 * 3. Also return up to 4 "similar" jobs (same category, different id, still
 *    active) - the Job Details page renders them as suggestion cards.
 */
export async function get(req, res) {
  const { jobId } = req.params;
  if (!ObjectId.isValid(jobId)) throw httpError(404, "Job not found.");

  const job = await jobs.findOne({ _id: new ObjectId(jobId) });
  if (!job || job.status !== "active") throw httpError(404, "Job not found.");

  // Similar jobs: same category first; fall back to same type if the
  // category is lonely. Excludes the current job; max 4 cards.
  const similarFilter = {
    _id: { $ne: job._id },
    status: "active",
    deadline: { $gte: new Date() },
    ...(req.query.similarBy === "type"
      ? { type: job.type }
      : { category: job.category }),
  };

  const similar = await jobs.find(similarFilter).sort({ postedAt: -1 }).limit(4).toArray();

  res.json({ ok: true, job, similar });
}
