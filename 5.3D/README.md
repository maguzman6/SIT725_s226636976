## 5.3D Apply Ethical Software Principles MVC + Database

This task was developed on top of the previous task 5.2C available at [SIT725_s226636976 Task 5.2C](https://www.google.com/search?q=https://github.com/maguzman6/SIT725_s226636976/tree/main/5.2C).

First, the UI available at `localhost:3000` retains the same responsive design and functionality as developed for Task 5.2C:

![Figure 1: Home page](./screenshots/fig1.png)


**Note:** For validation testing, the database must be running locally on `localhost:27017`. It must be pre-populated using the `scripts/seed.js` script, which creates an index for the `id` parameter.

## Book Schema Validation Rules

To apply validation rules to our Book Schema, the following code and validation rules were implemented:

![Figure 2: Book Schema](./screenshots/fig2.png)

### Validation Rules Table

| Field | Rule Description | Justification & Code Quality Improvement |
| :--- | :--- | :--- |
| **id** | 1. Required, non-empty string (`minlength: 1`), unique primary key constraint.<br><br>2. Immutable on `UPDATE` (`PUT /api/books/:id`). | 1. The `id` serves as the unique primary key identifier for each book entity. It is mandatory and cannot be empty or missing on `CREATE`. Uniqueness guarantees entity identity and prevents duplicate record pollution, returning `409 Conflict` if duplicated.<br><br>2. Immutability ensures that once an entity is stored, its primary identifier cannot be mutated via `UPDATE`, preventing broken references and referential integrity violations. |
| **title** | Required string, non-empty (`minlength: 1`). Enforced on `CREATE` and `UPDATE`. | Every book record requires a title containing at least one character. Prevents blank or untitled entries from degrading search indexes and causing visual bugs in user interface components. |
| **author** | Required string, non-empty (`minlength: 1`). Enforced on `CREATE` and `UPDATE`. | Essential for bibliographic attribution, catalog search, and filtering. Enforcing non-empty strings prevents unassigned or anonymous corrupt records from entering the database. |
| **year** | Required `Number` type, with maximum value restricted to next year (`CURRENT_YEAR + 1`). Enforced on `CREATE` and `UPDATE`. | Enforces strict numeric typing for chronological queries and sorting. Restricting the upper boundary ensures temporal consistency by blocking unrealistic future dates while permitting legitimate upcoming pre-releases. |
| **genre** | Required string, non-empty (`minlength: 1`). Enforced on `CREATE` and `UPDATE`. | Necessary for category grouping, catalog classification, and UI filtering. Enforcing a non-empty string ensures valid taxonomy and avoids uncategorized entries. |
| **summary** | Required string, length between 1 and 1000 characters (`minlength: 1, maxlength: 1000`). Enforced on `CREATE` and `UPDATE`. | Provides the synopsis displayed in book detail modals. The minimum length prevents empty summaries, while the 1000-character upper bound mitigates payload abuse, UI overflow, and excessive storage consumption. |
| **price** | Required `Decimal128` type, custom validator requiring strictly positive values (`price > 0`). Enforced on `CREATE` and `UPDATE`. | `Decimal128` prevents floating-point rounding errors common to financial values. Custom validation ensures prices are valid positive numbers, avoiding zero or negative values in the commercial catalog. |

It is also important to note that this schema enforces the option `strict: 'throw'`. This raises an error if an instance of the schema is initialized with extra/unregistered fields, ensuring safe writes and mitigating property injection attacks.

These validation rules enhance overall code quality by preventing unexpected API behaviors, handling objects with invalid types or unexpected fields, and delivering informative error messages to assist both users and developers.

## API Endpoints

To complement the schema validation rules described above, the API incorporates the following endpoints:

### 1. `POST /api/books` (Create Book)
Creates a new book entity after validating all schema rules and safe-write policies on the server.
* **201 Created:** Returned when the payload satisfies all schema rules and is successfully persisted. Returns the created book JSON object.
* **409 Conflict:** Returned when an attempt is made to create a record with an `id` that already exists in the database (duplicate primary key).
* **400 Bad Request:** Returned when any field fails schema validation (missing required fields, length violations, type errors, boundary/temporal violations, or unexpected extra fields).

**Sample Create Payload:**
```json
{
  "id": "Valid ID",
  "title": "Valid Title",
  "author": "Valid Author",
  "year": 2020,
  "genre": "Other",
  "summary": "Valid summary text that satisfies your rules.",
  "price": "9.99"
}

```

The service extracts expected fields from the incoming payload. However, because of the `strict: 'throw'` setting, sending extra/unrecognized fields triggers a MongoDB error (Code 11000/validation error), which is caught by the controller and returned as an HTTP response.

---

### 2. `PUT /api/books/:id` (Update Book)
Updates an existing book record matching the specified `:id` parameter.
* **200 OK:** Returned when the update payload satisfies all schema rules and the target book is updated successfully. Returns the updated book JSON object.
* **404 Not Found:** Returned when the target record with `:id` does not exist.
* **400 Bad Request:** Returned when validation fails (e.g., attempt to alter immutable `id`, invalid types, boundary violations, empty fields, or unknown extra fields).

**Sample Update Payload:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "year": 2021,
  "genre": "Other",
  "summary": "Updated summary text.",
  "price": "10.50"
}
```

The update payload mirrors the `POST` payload structure, except it excludes the `id` field, preventing errors caused by trying to modify an immutable field.

---

### 3. `GET /api/books` (Read All Books)
Retrieves all book catalog records.
* **200 OK:** Successfully returns an array of all book objects.

---

### 4. `GET /api/books/:id` (Read Book By ID)
Retrieves a specific book record by its `:id`.
* **200 OK:** Book matching `:id` is found and returned.
* **404 Not Found:** Returned when no matching record is found.

---

### 5. `DELETE /api/books/:id` (Delete Book)
Deletes a specific book record by id. This endpoint completes the standard CRUD operations (Create, Read, Update, Delete) and allows validation tests to clean up created data without polluting the database. 
* **200 OK:** Target book record deleted successfully.
* **404 Not Found:** Returned when the target `:id` does not exist.

---

Notes:  

1. Read and Delete endpoints do not require safe-write validation rules as they do not perform write operations; however, they complete the CRUD requirements for book records. 

2. The valid book and valid update JSON payloads in validation-test.js were left unchanged as they already follow all schema rules. 

## Validation Testing Results

Finally, `validation-test.js` was extended to enforce the validation rules testing creating and updating records, such as:


* **T01:** `POST /api/books` - Valid create payload (Expected: 201 Created).
* **T02:** `POST /api/books` - Duplicate `id` submission (Expected: 409 Conflict).
* **T03:** `PUT /api/books/:id` - Attempt to modify immutable `id` (Expected: 400 Bad Request).
* **T04:** `POST /api/books` - Unknown/malicious field injection on create (Expected: 400 Bad Request).
* **T05:** `PUT /api/books/:id` - Unknown/malicious field injection on update (Expected: 400 Bad Request).
* **T06:** `PUT /api/books/b999` - Update non-existent record (Expected: 404 Not Found).
* **T07:** `POST /api/books` - Missing required `id` (Expected: 400 Bad Request).
* **T08:** `POST /api/books` - Empty string `id` (Expected: 400 Bad Request).
* **T09:** `POST /api/books` - Missing required `title` (Expected: 400 Bad Request).
* **T10:** `POST /api/books` - Empty string `title` on create (Expected: 400 Bad Request).
* **T11:** `PUT /api/books/:id` - Empty string `title` on update (Expected: 400 Bad Request).
* **T12:** `POST /api/books` - Missing required `author` (Expected: 400 Bad Request).
* **T13:** `POST /api/books` - Empty string `author` on create (Expected: 400 Bad Request).
* **T14:** `PUT /api/books/:id` - Empty string `author` on update (Expected: 400 Bad Request).
* **T15:** `POST /api/books` - Missing required `year` (Expected: 400 Bad Request).
* **T16:** `POST /api/books` - Non-numeric string `year` on create (Expected: 400 Bad Request).
* **T17:** `PUT /api/books/:id` - Non-numeric string `year` on update (Expected: 400 Bad Request).
* **T18:** `POST /api/books` - Future `year` exceeding boundary on create (Expected: 400 Bad Request).
* **T19:** `PUT /api/books/:id` - Future `year` exceeding boundary on update (Expected: 400 Bad Request).
* **T20:** `POST /api/books` - Missing required `genre` (Expected: 400 Bad Request).
* **T21:** `POST /api/books` - Empty string `genre` on create (Expected: 400 Bad Request).
* **T22:** `PUT /api/books/:id` - Empty string `genre` on update (Expected: 400 Bad Request).
* **T23:** `POST /api/books` - Missing required `summary` (Expected: 400 Bad Request).
* **T24:** `POST /api/books` - Empty string `summary` on create (Expected: 400 Bad Request).
* **T25:** `PUT /api/books/:id` - Empty string `summary` on update (Expected: 400 Bad Request).
* **T26:** `POST /api/books` - `summary` exceeding 1000 characters on create (Expected: 400 Bad Request).
* **T27:** `PUT /api/books/:id` - `summary` exceeding 1000 characters on update (Expected: 400 Bad Request).
* **T28:** `POST /api/books` - Missing required `price` (Expected: 400 Bad Request).
* **T29:** `POST /api/books` - Non-numeric `price` string on create (Expected: 400 Bad Request).
* **T30:** `PUT /api/books/:id` - Non-numeric `price` string on update (Expected: 400 Bad Request).
* **T31:** `POST /api/books` - Zero `price` value on create (Expected: 400 Bad Request).
* **T32:** `PUT /api/books/:id` - Zero `price` value on update (Expected: 400 Bad Request).
* **T33:** `POST /api/books` - Negative `price` value on create (Expected: 400 Bad Request).
* **T34:** `PUT /api/books/:id` - Negative `price` value on update (Expected: 400 Bad Request).
* **T35:** `DELETE /api/books/:id` - Delete existing book record (Expected: 200 OK).
* **T36:** `DELETE /api/books/b999` - Delete non-existent record (Expected: 404 Not Found).

![Figure 3: Validation test results](./screenshots/fig3.png)
