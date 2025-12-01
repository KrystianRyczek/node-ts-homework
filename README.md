# Projekt Car Shop

## Opis

Projekt umożliwia rejestrację, logowanie, zarządzanie użytkownikami i samochodami oraz symulację zakupu samochodów.

## Uruchomienie

1. Skompiluj projekt przy użyciu `tsc`.
2. Uruchom serwer (np. `node dist/index.js`).
3. Frontend znajduje się w katalogu `frontend/` – dostęp do plików statycznych przez endpoint `/static/`.

## Uwaga

Konto administratora jest predefiniowane w `db/users.json`:

- **Username:** admin
- **Password:** admin123

## Cele zadania

- CRUD dla users (create, read, update, delete)

- CRUD dla cars (create, read, update, delete)

- zapis do bazy danych w formie plików json
- obsługa błędów

- logowanie
- rejestracja

- sprawdzanie roli/permissionów (admin widzi wszystko i może updatować wszystko, user może tylko swoje zasoby)

- ustawianie ciasteczka (dla chętnych refresh tokena i expire time)

- serwowanie frontendu z poziomu serwera jako pliki statyczne

- dopieszczenie frontendu

- SSE - (server side events), w momencie zakupu samochodu wysyłamy info do wszystkich podpiętych userów

- hack/fund, backdoor do zasilania konta usera

- pełne otypowanie

---

# Node.js + PostgreSQL Project

A simple Node.js project with PostgreSQL database integration, running in Docker with pgAdmin GUI. Built with raw Node.js (no frameworks).

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050`

### 3. Configure pgAdmin

1. Open your browser and go to: http://localhost:5050
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Add a new server in pgAdmin:
   - Right-click "Servers" → "Register" → "Server"
   - **General Tab:**
     - Name: `PostgreSQL Server`
   - **Connection Tab:**
     - Host name/address: `postgres` (container name)
     - Port: `5432`
     - Maintenance database: `mydb`
     - Username: `postgres`
     - Password: `postgres`
   - Click "Save"

### 4. Start Node.js Application

```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check and database connection status
- `GET /users` - Get all users
- `POST /users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

## Environment Variables

The project uses a `.env` file for configuration. Default values:

- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgres`
- `POSTGRES_DB=mydb`
- `POSTGRES_HOST=localhost`
- `POSTGRES_PORT=5432`
- `PGADMIN_EMAIL=admin@admin.com`
- `PGADMIN_PASSWORD=admin`
- `PGADMIN_PORT=5050`
- `PORT=3000`

## Docker Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f
```

### Stop and remove volumes (clean slate)

```bash
docker-compose down -v
```

## Project Structure

```
.
├── index.js              # Main application file
├── package.json          # Node.js dependencies
├── docker-compose.yml    # Docker services configuration
├── .env                  # Environment variables
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/users

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Troubleshooting

- **Connection refused**: Make sure Docker containers are running (`docker-compose ps`)
- **Port already in use**: Change ports in `.env` file
- **Database connection error**: Wait a few seconds after starting Docker containers for PostgreSQL to initialize

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Prisma
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Express.js + Prisma + PostgreSQL API

A modern Node.js API built with Express.js and Prisma ORM, demonstrating how Prisma simplifies database operations compared to raw SQL queries.

## Jak rozpocząć

- Install dependencies: npm install
- Create .env file with DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
- Start database: docker-compose up -d
- Generate Prisma Client: npm run prisma:generate
- Run migrations: npm run prisma:migrate
- Start server: npm start

## Table of Contents

- [What is Prisma?](#what-is-prisma)
- [Why Use Prisma Instead of Raw SQL?](#why-use-prisma-instead-of-raw-sql)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Guide](#detailed-setup-guide)
- [Prisma Workflow](#prisma-workflow)
- [Migrations Explained](#migrations-explained)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Common Prisma Operations](#common-prisma-operations)
- [🎓 1-Hour Workshop: Hands-On Prisma Exercises](#-1-hour-workshop-hands-on-prisma-exercises)
- [Troubleshooting](#troubleshooting)

## What is Prisma?

Prisma is a **next-generation ORM (Object-Relational Mapping)** tool that provides:

- **Type-safe database client** - Auto-generated TypeScript/JavaScript types
- **Database migrations** - Version-controlled schema changes
- **Query builder** - Intuitive API for database operations
- **Database introspection** - Automatically generate schema from existing database
- **Developer experience** - Autocomplete, type checking, and great tooling

## Why Use Prisma Instead of Raw SQL?

### Before (Raw SQL with `pg` library):

```javascript
// Manual SQL queries, error-prone, no type safety
const result = await pool.query(
  "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
  [name, email]
);

// Manual error handling
if (err.code === "23505") {
  // What does this code mean?
  // Handle unique violation
}
```

### After (Prisma):

```javascript
// Type-safe, clean, intuitive
const user = await prisma.user.create({
  data: { name, email },
});

// Prisma throws specific error codes (P2002 for unique violations)
// Better error messages and type safety
```

### Key Benefits:

1. **Type Safety**: Prisma generates TypeScript types based on your schema
2. **Less Boilerplate**: No need to write SQL strings manually
3. **Better Errors**: Descriptive error codes (P2002, P2025, etc.)
4. **Migrations**: Version-controlled database schema changes
5. **Autocomplete**: IDE support for all database operations
6. **Database Agnostic**: Easy to switch between PostgreSQL, MySQL, SQLite, etc.

## Prerequisites

- **Node.js** (v16 or higher)
- **Docker and Docker Compose** (for running PostgreSQL)
- **npm** or **yarn**

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL database
docker-compose up -d

# 3. Set up Prisma (generate client and run migrations)
npm run prisma:generate
npm run prisma:migrate

# 4. Start the server
npm start
```

The API will be available at `http://localhost:3000`

## Detailed Setup Guide

### Step 1: Install Dependencies

```bash
npm install
```

This installs:

- `express` - Web framework
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- `dotenv` - Environment variable management

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
PORT=3000
```

**Important**: The `DATABASE_URL` is the connection string Prisma uses. Format:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### Step 3: Start PostgreSQL Database

```bash
docker-compose up -d
```

This starts:

- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (optional database GUI)

Verify it's running:

```bash
docker-compose ps
```

### Step 4: Initialize Prisma

#### 4.1 Generate Prisma Client

```bash
npm run prisma:generate
```

This command:

- Reads your `prisma/schema.prisma` file
- Generates the Prisma Client with TypeScript types
- Creates type-safe database access methods

**When to run**: After any changes to `schema.prisma` or after pulling new migrations.

#### 4.2 Run Database Migrations

```bash
npm run prisma:migrate
```

This command:

- Creates the database tables based on your schema
- Tracks migrations in `prisma/migrations/` folder
- Applies the schema to your database

**First time**: You'll be prompted to name your migration (e.g., "init" or "create_user_table")

### Step 5: Start the Application

```bash
npm start
```

You should see:

```
🚀 Server is running on http://localhost:3000
✅ Successfully connected to PostgreSQL database via Prisma
✅ Prisma Client is ready
```

## Prisma Workflow

### Understanding the Prisma Schema

The schema file (`prisma/schema.prisma`) defines your database structure:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}
```

**Key Concepts**:

- `@id` - Primary key
- `@default(autoincrement())` - Auto-incrementing integer
- `@unique` - Unique constraint
- `@default(now())` - Default to current timestamp
- `@map("created_at")` - Maps to database column name
- `@@map("users")` - Maps model to database table name

### The Prisma Workflow

```
1. Edit schema.prisma
   ↓
2. Create migration: npm run prisma:migrate
   ↓
3. Generate client: npm run prisma:generate (auto-runs after migrate)
   ↓
4. Use Prisma Client in your code
```

## Migrations Explained

### What are Migrations?

Migrations are **version-controlled changes** to your database schema. They allow you to:

- Track all database changes over time
- Apply changes consistently across environments (dev, staging, production)
- Rollback changes if needed
- Collaborate with team members

### Creating a Migration

When you change your schema and run `npm run prisma:migrate`:

1. **Prisma compares** your schema to the current database state
2. **Generates SQL migration** file in `prisma/migrations/`
3. **Applies the migration** to your database
4. **Regenerates Prisma Client** automatically

**Example**: Adding a new field to the User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(100)
  age       Int?     // New optional field
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}
```

Run `npm run prisma:migrate` and name it "add_age_to_user". Prisma will:

- Create a migration file with SQL: `ALTER TABLE users ADD COLUMN age INTEGER;`
- Apply it to your database
- Update Prisma Client

### Migration Commands

```bash
# Create and apply a new migration (development)
npm run prisma:migrate

# Apply pending migrations (production)
npm run prisma:migrate:deploy

# View migration history
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Migration Files Structure

```
prisma/
  migrations/
    20240101120000_init/
      migration.sql          # SQL statements
    20240102130000_add_age/
      migration.sql
```

Each migration folder contains:

- `migration.sql` - The SQL statements to apply
- Metadata about when it was created

## API Endpoints

### `GET /`

Returns API information and available endpoints.

**Response:**

```json
{
  "message": "Express.js + Prisma + PostgreSQL API",
  "endpoints": {
    "health": "/health",
    "users": "/users",
    "createUser": "POST /users"
  }
}
```

### `GET /health`

Health check endpoint that verifies database connectivity.

**Response:**

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### `GET /users`

Retrieves all users from the database.

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### `POST /users`

Creates a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response (409 - Email exists):**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

## Project Structure

```
.
├── index.js                 # Express server with Prisma
├── package.json             # Dependencies and scripts
├── docker-compose.yml       # PostgreSQL and pgAdmin services
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment variables
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   └── migrations/          # Database migration files
│       └── [timestamp]_init/
│           └── migration.sql
└── README.md                # This file
```

## Common Prisma Operations

### Creating Records

```javascript
// Create a single record
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
  },
});

// Create multiple records
const users = await prisma.user.createMany({
  data: [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
  ],
});
```

### Reading Records

```javascript
// Find all
const users = await prisma.user.findMany();

// Find with conditions
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});

// Find with relations (if you have them)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }, // If User has posts relation
});
```

### Updating Records

```javascript
// Update a record
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Jane Doe" },
});

// Update or create (upsert)
const user = await prisma.user.upsert({
  where: { email: "john@example.com" },
  update: { name: "John Updated" },
  create: { name: "John", email: "john@example.com" },
});
```

### Deleting Records

```javascript
// Delete a record
await prisma.user.delete({
  where: { id: 1 },
});

// Delete many records
await prisma.user.deleteMany({
  where: { name: { contains: "John" } },
});
```

### Advanced Queries

```javascript
// Filtering
const users = await prisma.user.findMany({
  where: {
    email: { contains: "@example.com" },
    createdAt: { gte: new Date("2024-01-01") },
  },
});

// Sorting
const users = await prisma.user.findMany({
  orderBy: [{ createdAt: "desc" }, { name: "asc" }],
});

// Pagination
const users = await prisma.user.findMany({
  skip: 10,
  take: 5,
});
```

## Prisma Studio

Prisma Studio is a visual database browser. Launch it with:

```bash
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` where you can:

- View all your data
- Edit records
- Add new records
- Delete records

Great for development and debugging!

## Troubleshooting

### "Prisma Client has not been generated yet"

**Solution**: Run `npm run prisma:generate`

This generates the Prisma Client from your schema. You need to run this:

- After cloning the project
- After pulling new migrations
- After changing `schema.prisma`

### "Migration engine failed to connect to the database"

**Solution**:

1. Make sure PostgreSQL is running: `docker-compose ps`
2. Check your `DATABASE_URL` in `.env`
3. Wait a few seconds after starting Docker containers

### "Table 'users' does not exist"

**Solution**: Run migrations:

```bash
npm run prisma:migrate
```

### "Unique constraint failed"

This means you're trying to create a record with a duplicate unique field (like email). This is expected behavior - Prisma is enforcing data integrity.

### Port already in use

Change the `PORT` in your `.env` file or stop the process using that port.

### Database connection errors

1. Verify Docker containers are running: `docker-compose ps`
2. Check database logs: `docker-compose logs postgres`
3. Verify `DATABASE_URL` matches your Docker configuration
4. Ensure database is fully initialized (wait 10-15 seconds after `docker-compose up`)

## 🎓 1-Hour Workshop: Hands-On Prisma Exercises

This workshop will guide you through practical Prisma exercises. Follow along step-by-step to master Prisma fundamentals.

**Estimated Time**: 60 minutes  
**Prerequisites**: Complete the [Quick Start](#quick-start) section first

---

### Exercise 1: Understanding the Current Setup (5 minutes)

**Goal**: Verify everything is working before we start.

1. **Check your database connection:**

   ```bash
   curl http://localhost:3000/health
   ```

   You should see `"database": "connected"`

2. **View current users:**

   ```bash
   curl http://localhost:3000/users
   ```

3. **Open Prisma Studio** (in a new terminal):
   ```bash
   npm run prisma:studio
   ```
   - Navigate to `http://localhost:5555`
   - Click on "User" model
   - See your data in a visual interface
   - Try editing a record directly in the UI!

**✅ Checkpoint**: You can see your data in Prisma Studio.

---

### Exercise 2: Adding a New Model - Posts (15 minutes)

**Goal**: Learn how to add a new model and create relationships.

#### Step 1: Update the Schema

Open `prisma/schema.prisma` and add a new `Post` model:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(200)
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
```

#### Step 2: Add Relation to User Model

Update the `User` model to include the relation:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")
  posts     Post[]   // Add this line - one user can have many posts

  @@map("users")
}
```

**💡 Key Concepts:**

- `Post[]` means a User can have many Posts (one-to-many relationship)
- `authorId` is a foreign key linking to User
- `@relation` defines the relationship
- `@updatedAt` automatically updates when record changes

#### Step 3: Create and Apply Migration

1. **Create the migration:**

   ```bash
   npm run prisma:migrate
   ```

   - When prompted, name it: `add_post_model`
   - Prisma will generate SQL to create the `posts` table

2. **What happened?**

   - Prisma created a migration file in `prisma/migrations/`
   - Applied the migration to your database
   - Regenerated Prisma Client automatically

3. **Verify the migration:**
   ```bash
   npx prisma migrate status
   ```
   You should see all migrations are applied.

#### Step 4: Test the New Model

1. **Open Prisma Studio:**

   ```bash
   npm run prisma:studio
   ```

   - You should now see both "User" and "Post" models
   - Try creating a Post and linking it to a User!

2. **Or test via code** (create `test-post.js`):

   ```javascript
   const { PrismaClient } = require("@prisma/client");
   const prisma = new PrismaClient();

   async function test() {
     // Get first user
     const user = await prisma.user.findFirst();

     // Create a post for that user
     const post = await prisma.post.create({
       data: {
         title: "My First Post",
         content: "This is the content of my first post!",
         published: true,
         authorId: user.id,
       },
     });

     console.log("Created post:", post);

     // Get user with posts
     const userWithPosts = await prisma.user.findUnique({
       where: { id: user.id },
       include: { posts: true },
     });

     console.log("User with posts:", userWithPosts);
   }

   test()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

   Run it: `node test-post.js`

**✅ Checkpoint**: You can create Posts linked to Users!

---

### Exercise 3: Recreating Database from Scratch (10 minutes)

**Goal**: Learn how to reset your database and start fresh.

#### Scenario: You want to start over with a clean database

**⚠️ Warning**: This will delete ALL data!

#### Method 1: Reset Database (Recommended)

```bash
npx prisma migrate reset
```

**What this does:**

1. Drops the database
2. Creates a new database
3. Applies all migrations from scratch
4. Runs seed script (if configured)

**Try it:**

```bash
# Reset everything
npx prisma migrate reset

# Verify - should be empty
curl http://localhost:3000/users
```

#### Method 2: Manual Reset

1. **Stop your application** (Ctrl+C)

2. **Drop and recreate database:**

   ```bash
   # Connect to PostgreSQL
   docker exec -it node_sql_postgres psql -U postgres -d mydb

   # In psql, drop all tables
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   \q
   ```

3. **Reapply all migrations:**
   ```bash
   npm run prisma:migrate:deploy
   ```

#### Method 3: Using Docker Compose

```bash
# Stop and remove containers with volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait a few seconds, then migrate
npm run prisma:migrate
```

**✅ Checkpoint**: You can reset your database and start fresh!

---

### Exercise 4: Seeding Database with Data (15 minutes)

**Goal**: Learn how to populate your database with initial/test data.

#### Step 1: Understand the Seed File

Open `prisma/seed.js`. This file:

- Connects to the database
- Creates sample data
- Can be run multiple times (cleans first)

#### Step 2: Run the Seed

```bash
npm run prisma:seed
```

**What happens:**

- Deletes existing users
- Creates 3 sample users
- Prints confirmation

#### Step 3: Verify Seeded Data

```bash
# Check via API
curl http://localhost:3000/users

# Or use Prisma Studio
npm run prisma:studio
```

#### Step 4: Enhance the Seed File

Let's add Posts to the seed! Update `prisma/seed.js`:

```javascript
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.post.deleteMany(); // Delete posts first (due to foreign key)
  await prisma.user.deleteMany();
  console.log("✅ Existing data deleted");

  // Create sample users
  console.log("👥 Creating sample users...");

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: "Charlie Brown",
      email: "charlie@example.com",
    },
  });

  console.log(`✅ Created ${3} users`);

  // Create sample posts
  console.log("📝 Creating sample posts...");

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Getting Started with Prisma",
        content: "Prisma is an amazing ORM that makes database work easy!",
        published: true,
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Express.js Best Practices",
        content: "Here are some tips for building great APIs with Express.",
        published: true,
        authorId: bob.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Draft Post",
        content: "This is a draft that is not published yet.",
        published: false,
        authorId: charlie.id,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Important**: Delete posts before users (due to foreign key constraint)!

#### Step 5: Run Enhanced Seed

```bash
npm run prisma:seed
```

#### Step 6: Verify in Prisma Studio

```bash
npm run prisma:studio
```

- View Users and their Posts
- See the relationships visually
- Try querying: Click on a User → See their Posts!

**✅ Checkpoint**: You can seed your database with realistic test data!

---

### Exercise 5: Adding API Endpoints for Posts (10 minutes)

**Goal**: Practice using Prisma in Express routes.

#### Step 1: Add GET /posts Endpoint

Add to `index.js` (after the `/users` routes):

```javascript
// GET /posts - Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true, // Include the author (User) data
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
```

#### Step 2: Add POST /posts Endpoint

```javascript
// POST /posts - Create a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, published = false, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        error: "Title, content, and authorId are required",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: parseInt(authorId),
      },
      include: {
        author: true,
      },
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Invalid authorId - user does not exist",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
```

#### Step 3: Test the Endpoints

```bash
# Get all posts
curl http://localhost:3000/posts

# Create a new post (replace USER_ID with an actual user id from /users)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "This is the content",
    "published": true,
    "authorId": 1
  }'
```

**✅ Checkpoint**: You can create and retrieve posts via API!

---

### Exercise 6: Advanced Queries (5 minutes)

**Goal**: Practice filtering, sorting, and including relations.

#### Challenge: Add GET /posts/published Endpoint

Create an endpoint that returns only published posts:

```javascript
// GET /posts/published - Get only published posts
app.get("/posts/published", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
```

**Key Prisma Features Used:**

- `where` - Filtering
- `include` - Joining related data
- `select` - Choose specific fields
- `orderBy` - Sorting

**Test it:**

```bash
curl http://localhost:3000/posts/published
```

**✅ Checkpoint**: You can filter and query data efficiently!

---

### 🎉 Workshop Complete!

**What you've learned:**

- ✅ How to add new models to Prisma schema
- ✅ How to create and run migrations
- ✅ How to reset/recreate databases
- ✅ How to seed databases with test data
- ✅ How to use Prisma in Express routes
- ✅ How to work with relationships (one-to-many)
- ✅ How to filter and query data

**Next Steps:**

- Try adding more models (Comments, Categories, Tags)
- Experiment with many-to-many relationships
- Add validation and error handling
- Build a complete CRUD API

### 📋 Quick Reference: Essential Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply a new migration
npm run prisma:migrate

# Apply pending migrations (production)
npm run prisma:migrate:deploy

# Reset database (⚠️ deletes all data, then seeds)
npx prisma migrate reset

# Seed database with test data
npm run prisma:seed

# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Check migration status
npx prisma migrate status

# View database schema
npx prisma db pull  # Introspect existing database
```

### 🎯 Common Prisma Patterns

```javascript
// Create
await prisma.model.create({ data: { ... } });

// Read (all)
await prisma.model.findMany();

// Read (one)
await prisma.model.findUnique({ where: { id: 1 } });

// Update
await prisma.model.update({ where: { id: 1 }, data: { ... } });

// Delete
await prisma.model.delete({ where: { id: 1 } });

// Include relations
await prisma.user.findMany({ include: { posts: true } });

// Filter
await prisma.post.findMany({ where: { published: true } });

// Sort
await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
```

---

## Next Steps

- Add more models to your schema
- Create relationships between models (one-to-many, many-to-many)
- Add validation and middleware
- Implement authentication
- Add more API endpoints
- Set up Prisma in production

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

ISC
