# Prisma & Database Architecture

## Overview

Our project uses a dual-database architecture:
1. **PostgreSQL with Prisma** - For structured relational data and development
2. **MongoDB Atlas** - For production data and real-time operations

## Prisma's Role

Prisma serves as our primary ORM (Object-Relational Mapping) tool for PostgreSQL, handling:

- Type-safe database queries
- Schema management and migrations
- Development environment data modeling
- Relationship management between entities

### Key Features Used

1. **Schema Definition**
```prisma
// prisma/schema.prisma
model Profile {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  fullName  String?
  // ... other fields
}
```

2. **Type Safety**
- Automatically generated TypeScript types
- Compile-time query validation
- Type-safe JSON handling

3. **Migrations**
- Version-controlled schema changes
- Safe database updates
- Development environment synchronization

## Database Separation

### PostgreSQL (Development)
- **Location**: Local development environment
- **Purpose**: 
  - Development and testing
  - Schema prototyping
  - Relationship modeling
  - Complex SQL queries
- **Configuration**: Root `.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_NAME=tup-livestock
```

### MongoDB Atlas (Production)
- **Location**: Cloud-hosted (MongoDB Atlas)
- **Purpose**:
  - Production data storage
  - Real-time operations
  - User authentication
  - Session management
- **Configuration**: `frontend/.env.local`
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
MONGODB_DB_NAME=livestock
```

## Data Flow & Boundaries

### PostgreSQL/Prisma Handles:
1. Development environment data
2. Schema prototyping and testing
3. Complex relational queries
4. Data integrity and transactions
5. Type-safe database operations

### MongoDB Atlas Handles:
1. Production user data
2. Authentication sessions
3. Real-time data synchronization
4. Scalable document storage
5. Cloud-based operations

## Best Practices

### 1. Schema Management
```typescript
// Always use Prisma migrations for schema changes
npx prisma migrate dev --name description_of_changes
```

### 2. Type Safety
```typescript
// Use Prisma's generated types
import { Prisma } from '@prisma/client';

type ShowWithEntries = Prisma.ShowGetPayload<{
  include: { entries: true }
}>;
```

### 3. JSON Handling
```typescript
// Use Prisma's JSON types for type safety
const data: Prisma.InputJsonValue = JSON.stringify({
  scores: { movement: 8, conformation: 9 }
});
```

### 4. Transactions
```typescript
// Use transactions for atomic operations
await prisma.$transaction(async (tx) => {
  // Multiple operations that should succeed or fail together
});
```

## Configuration

### 1. Prisma Setup
```bash
# Initialize Prisma
npx prisma init

# After schema changes
npx prisma generate  # Update client
npx prisma migrate dev  # Update database
```

### 2. Environment Variables
```env
# Development (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Production (frontend/.env.local)
MONGODB_URI="mongodb+srv://..."
```

## Common Operations

### 1. Creating Records
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    // ...
  }
});
```

### 2. Querying with Relations
```typescript
const show = await prisma.show.findUnique({
  where: { id: showId },
  include: {
    entries: true,
    organizer: true
  }
});
```

### 3. Transactions
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const profile = await tx.profile.create({ ... });
  return { user, profile };
});
```

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Use generated types in your TypeScript code
4. Test with PostgreSQL locally
5. Deploy with MongoDB Atlas in production

## Troubleshooting

### Common Issues

1. **Type Errors**
   - Run `npx prisma generate` after schema changes
   - Ensure proper JSON type handling
   - Use correct Prisma import paths

2. **Migration Issues**
   - Reset development database if needed: `npx prisma migrate reset`
   - Check migration history: `npx prisma migrate status`
   - Verify environment variables

3. **Production Concerns**
   - Keep PostgreSQL for development only
   - Use MongoDB Atlas for production data
   - Never mix development and production data

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different credentials for development and production
   - Rotate secrets regularly

2. **Access Control**
   - Implement proper user authentication
   - Use role-based access control
   - Validate all database operations

3. **Data Validation**
   - Use Prisma's built-in validators
   - Implement custom validation logic
   - Sanitize all user inputs

## Maintenance

1. **Regular Updates**
   - Keep Prisma CLI and client updated
   - Monitor for security patches
   - Update dependencies regularly

2. **Monitoring**
   - Track query performance
   - Monitor database size
   - Log database operations

3. **Backup Strategy**
   - Regular PostgreSQL backups for development
   - MongoDB Atlas automatic backups
   - Verify backup integrity