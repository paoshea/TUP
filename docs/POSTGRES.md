# PostgreSQL Setup Guide for macOS

## Installation

1. **Install PostgreSQL using Homebrew**
```bash
brew install postgresql@14
```

2. **Start PostgreSQL Service**
```bash
brew services start postgresql@14
```

## Initial Setup

1. **Connect to PostgreSQL**
On macOS, the default superuser is your system username. You can connect using:
```bash
psql postgres
```

2. **Create Application Database and User**
Once connected to psql, run these commands:
```sql
-- Create the application database
CREATE DATABASE livestock;

-- Create a new user for the application
CREATE USER livestock_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE livestock TO livestock_user;

-- Connect to the new database
\c livestock

-- Grant schema privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO livestock_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO livestock_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO livestock_user;
```

3. **Test Connection**
```bash
psql -U livestock_user -d livestock -h localhost
```

## Environment Configuration

Update your `.env` file with:
```
DATABASE_URL="postgresql://livestock_user:your_secure_password@localhost:5432/livestock?schema=public"
```

## Common macOS Issues

1. **PostgreSQL Not Found**
   ```bash
   # Add PostgreSQL binaries to your PATH
   echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Service Won't Start**
   ```bash
   # Check PostgreSQL status
   brew services list
   
   # Restart PostgreSQL
   brew services restart postgresql@14
   ```

3. **Permission Denied**
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   
   # Create database directory if needed
   initdb /usr/local/var/postgres
   ```

## Best Practices

1. **Security**
   - Use strong passwords
   - Limit database user permissions
   - Keep credentials in environment variables
   - Never commit sensitive data to version control

2. **Backup**
   ```bash
   # Backup database
   pg_dump livestock > backup.sql
   
   # Restore database
   psql livestock < backup.sql
   ```

3. **Monitoring**
   - Monitor disk space
   - Check connection pools
   - Review logs: `/usr/local/var/log/postgresql@14.log`

## Development Workflow

1. **Local Development**
   - Use a local PostgreSQL instance
   - Maintain separate development database
   - Use seed data for testing

2. **Migration Management**
   ```bash
   # Create migration
   npx prisma migrate dev --name init
   
   # Apply migrations
   npx prisma migrate deploy
   ```

3. **Database Management**
   ```bash
   # Connect to database
   psql livestock
   
   # List tables
   \dt
   
   # Describe table
   \d table_name
   ```

## Useful Commands

```bash
# Start PostgreSQL
brew services start postgresql@14

# Stop PostgreSQL
brew services stop postgresql@14

# Restart PostgreSQL
brew services restart postgresql@14

# Check status
brew services list

# Connect to database
psql livestock

# List databases
\l

# List users
\du

# List tables
\dt

# Quit psql
\q
```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Homebrew PostgreSQL Formula](https://formulae.brew.sh/formula/postgresql)
- [Prisma Documentation](https://www.prisma.io/docs/)