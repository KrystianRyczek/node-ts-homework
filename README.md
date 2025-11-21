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
