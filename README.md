# GitHub Profile Analyzer API

A Node.js and Express.js REST API that analyzes GitHub profiles using the GitHub Public API and stores profile insights in a MySQL database.

### Live API

The deployed API is available at: 

```text
https://github-profile-analyzer.up.railway.app/
```

## Tech Stack

* Node.js
* Express.js
* MySQL
* GitHub REST API
* Axios
* Railway (Deployment)

---

## Features

* Analyze any public GitHub profile by username
* Fetch profile data from the GitHub API
* Store analyzed profiles in MySQL
* Automatically update existing profiles on re-analysis
* View all analyzed profiles with Insight History
* View a single analyzed profile
* Store useful insights such as:

  * Followers count
  * Following count
  * Public repositories count
  * Bio
  * Location
  * GitHub profile URL
  * Account creation date

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/anasalam-xyz/github-profile-analyzer
cd github-profile-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the project root:

```env
PORT=3000

MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

GITHUB_TOKEN=
```

### 4. Run the database schema

Execute the SQL script in your MySQL database:

```sql
SOURCE schema.sql;
```

Or manually run the contents of `schema.sql`.

### 5. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## Environment Variables

| Variable            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| PORT                | Server port                                             |
| MYSQL_HOST          | MySQL host                                              |
| MYSQL_PORT          | MySQL port                                              |
| MYSQL_USER          | MySQL username                                          |
| MYSQL_PASSWORD      | MySQL password                                          |
| MYSQL_DATABASE      | MySQL database name                                     |
| GITHUB_TOKEN        | GitHub Personal Access Token (optional but recommended) |

---

## API Endpoints

### Analyze a GitHub Profile

**POST** `/api/analyze/:username`

Fetches data from GitHub, stores it in MySQL, and returns the analyzed profile.

Example:

```http
POST /api/analyze/torvalds
```

---

### Get All Analyzed Profiles

**GET** `/api/profiles`

Returns a list of all analyzed profiles stored in the database with all insight snapshots.

Example:

```http
GET /api/profiles
```

---

### Get a Single Profile

**GET** `/api/profiles/:username`

Returns data for a specific analyzed profile with insight history.

Example:

```http
GET /api/profiles/torvalds
```

---

## Database Schema

The application uses two tables:

### profiles

Stores GitHub user profile information.

| Column            | Type         | Description                  |
| ----------------- | ------------ | ---------------------------- |
| id                | INT          | Primary key                  |
| github_id         | BIGINT       | Unique GitHub user ID        |
| username          | VARCHAR(100) | GitHub username              |
| name              | VARCHAR(255) | User's display name          |
| bio               | TEXT         | GitHub bio                   |
| location          | VARCHAR(255) | User location                |
| avatar_url        | VARCHAR(500) | Profile image URL            |
| github_url        | VARCHAR(500) | GitHub profile URL           |
| followers         | INT          | Followers count              |
| following         | INT          | Following count              |
| public_repos      | INT          | Public repository count      |
| created_at_github | DATETIME     | GitHub account creation date |
| analyzed_at       | DATETIME     | Last analysis timestamp      |

### insights

Stores all insights for a profile.

| Column      | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| id          | INT      | Primary key                     |
| profile_id  | INT      | Reference to profile            |
| total_stars | INT      | Total stars across repositories |
| total_forks | INT      | Total forks across repositories |
| languages   | JSON     | Language usage statistics       |
| top_repos   | JSON     | Most popular repositories       |
| recorded_at | DATETIME | Insight generation timestamp    |


## Author

Anas Alam

- GitHub: https://github.com/anasalam-xyz
- Portfolio: https://anasalam.vercel.app

---

### All feedbacks are appreciated.
## Thank You
