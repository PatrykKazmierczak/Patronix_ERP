# Patronix ERP

A modern ERP system built with FastAPI, React, and PostgreSQL.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Railway Deployment

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize Railway project:
   ```bash
   railway init
   ```

4. Link repository:
   ```bash
   railway link
   ```

5. Add PostgreSQL database:
   ```bash
   railway add
   # Select PostgreSQL
   ```

6. Set environment variables in Railway dashboard:
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=<generated-by-railway>
   POSTGRES_DB=erp_db
   SECRET_KEY=<generate-a-secure-random-string>
   ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.railway.app
   VITE_API_URL=https://your-backend-domain.railway.app
   ```

7. Deploy:
   ```bash
   railway up
   ```

## Project Structure

```
erp-system/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── models/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── railway.toml
└── nixpacks.toml
```

## Troubleshooting

If deployment fails:

1. Check Railway logs in the dashboard
2. Ensure all environment variables are set correctly
3. Verify database connection string is correct
4. Check if all dependencies are properly listed in requirements.txt and package.json
5. Make sure the build process completes successfully

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 