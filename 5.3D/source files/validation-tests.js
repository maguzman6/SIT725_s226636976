/**
 * SIT725 – 5.3D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status, text } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Other",
    summary: "Valid summary text that satisfies your rules.",
    price: "9.99"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Other",
    summary: "Updated summary text.",
    price: "10.50"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // STUDENTS MUST ADD ADDITIONAL TESTS
  // =====================================
  //
  // Add tests covering:
  // - REQUIRED
  // - TYPE
  // - BOUNDARY
  // - LENGTH
  // - TEMPORAL
  // - UPDATE_FAIL
  //
  // Each test must include appropriate tags.
  //

   // ---- T06 Not found id UPDATE ----
  await test({
    id: "T06",
    name: "Not found id UPDATE",
    method: "PUT",
    path: updatePath("b999"),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"]
  });

  // ---- T07 Missing id CREATE ----
  const missingIdBook = makeValidBook(`b${Date.now() + 2}`);
  delete missingIdBook.id;
  await test({
    id: "T07",
    name: "Missing id CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingIdBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T08 Empty string id CREATE ----
  await test({
    id: "T08",
    name: "Empty id CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 3}`), id: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T09 Missing title CREATE ----
  const missingTitleBook = makeValidBook(`b${Date.now() + 4}`);
  delete missingTitleBook.title;
  await test({
    id: "T09",
    name: "Missing title CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingTitleBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T10 Empty string title CREATE ----
  await test({
    id: "T10",
    name: "Empty title CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 5}`), title: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T11 Empty string title UPDATE ----
  await test({
    id: "T11",
    name: "Empty title UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { title: "" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T12 Missing author CREATE ----
  const missingAuthorBook = makeValidBook(`b${Date.now() + 6}`);
  delete missingAuthorBook.author;
  await test({
    id: "T12",
    name: "Missing author CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingAuthorBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T13 Empty string author CREATE ----
  await test({
    id: "T13",
    name: "Empty author CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 7}`), author: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T14 Empty string author UPDATE ----
  await test({
    id: "T14",
    name: "Empty author UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { author: "" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T15 Missing year CREATE ----
  const missingYearBook = makeValidBook(`b${Date.now() + 8}`);
  delete missingYearBook.year;
  await test({
    id: "T15",
    name: "Missing year CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingYearBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T16 Invalid year type CREATE ----
  await test({
    id: "T16",
    name: "Invalid year type CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 9}`), year: "year-as-string" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T17 Invalid year type UPDATE ----
  await test({
    id: "T17",
    name: "Invalid year type UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { year: "year-as-string" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- T18 Year boundary CREATE ----
  await test({
    id: "T18",
    name: "Year above allowed boundary CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 10}`), year: new Date().getFullYear() + 2 },
    tags: ["CREATE_FAIL", "BOUNDARY", "TEMPORAL"]
  });

  // ---- T19 Year boundary UPDATE ----
  await test({
    id: "T19",
    name: "Future year UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { year: new Date().getFullYear() + 2 },
    tags: ["UPDATE_FAIL", "TEMPORAL", "BOUNDARY"]
  });

  // ---- T20 Missing genre CREATE ----
  const missingGenreBook = makeValidBook(`b${Date.now() + 11}`);
  delete missingGenreBook.genre;
  await test({
    id: "T20",
    name: "Missing genre CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingGenreBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T21 Empty string genre CREATE ----
  await test({
    id: "T21",
    name: "Empty genre CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 12}`), genre: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T22 Empty string genre UPDATE ----
  await test({
    id: "T22",
    name: "Empty genre UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { genre: "" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T23 Missing summary CREATE ----
  const missingSummaryBook = makeValidBook(`b${Date.now() + 13}`);
  delete missingSummaryBook.summary;
  await test({
    id: "T23",
    name: "Missing summary CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingSummaryBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T24 Empty string summary CREATE ----
  await test({
    id: "T24",
    name: "Empty summary CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 14}`), summary: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T25 Empty string summary UPDATE ----
  await test({
    id: "T25",
    name: "Empty summary UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { summary: "" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T26 Exceeded summary length CREATE ----
  await test({
    id: "T26",
    name: "Exceeded summary length CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 15}`), summary: "A".repeat(1001) },
    tags: ["CREATE_FAIL", "LENGTH", "BOUNDARY"]
  });

  // ---- T27 Exceeded summary length UPDATE ----
  await test({
    id: "T27",
    name: "Exceeded summary length UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { summary: "A".repeat(1001) },
    tags: ["UPDATE_FAIL", "LENGTH", "BOUNDARY"]
  });

  // ---- T28 Missing price CREATE ----
  const missingPriceBook = makeValidBook(`b${Date.now() + 16}`);
  delete missingPriceBook.price;
  await test({
    id: "T28",
    name: "Missing price CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: missingPriceBook,
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T29 Invalid price type CREATE ----
  await test({
    id: "T29",
    name: "Invalid price type CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 17}`), price: "invalid-price" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T30 Invalid price type UPDATE ----
  await test({
    id: "T30",
    name: "Invalid price type UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { price: "invalid-price" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- T31 Price zero boundary CREATE ----
  await test({
    id: "T31",
    name: "Zero price boundary CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 18}`), price: "0" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T32 Price zero boundary UPDATE ----
  await test({
    id: "T32",
    name: "Zero price boundary UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { price: "0" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  // ---- T33 Price negative boundary CREATE ----
  await test({
    id: "T33",
    name: "Negative price boundary CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 19}`), price: "-5.00" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T34 Price negative boundary UPDATE ----
  await test({
    id: "T34",
    name: "Negative price boundary UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { price: "-1.00" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });

  // ---- T35 Delete existing book ----
  await test({
    id: "T35",
    name: "Delete existing book",
    method: "DELETE",
    path: updatePath(uniqueId),
    expected: 200,
    tags: []
  });

  // ---- T36 Delete book not found ----
  await test({
    id: "T36",
    name: "Delete book not found",
    method: "DELETE",
    path: updatePath("b999"),
    expected: 404,
    tags: []
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});
