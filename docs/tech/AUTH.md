# TUP Authentication System

## Implementation Guide

### Local Storage Implementation

#### Setup Steps

1. **Initialize Storage Service**
```typescript
// services/storage.ts
export const storage = {
  setUser: (user: User) => {
    localStorage.setItem('tup_user', JSON.stringify({
      version: 1,
      timestamp: Date.now(),
      data: user
    }));
  },
  getUser: (): User | null => {
    const stored = localStorage.getItem('tup_user');
    return stored ? JSON.parse(stored).data : null;
  },
  // ... other methods
};
```

2. **Configure AuthContext**
```typescript
// context/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = storage.getUser();
    if (storedUser) setUser(storedUser);
  }, []);
  
  // ... auth methods
}
```

3. **Setup Auth API Routes**
```typescript
// app/api/auth/signup/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  // Validate and store user
  return Response.json({ success: true });
}
```

### MongoDB Atlas Integration

#### Environment Setup

Our system uses a dual-database approach for different purposes:

#### 1. MongoDB Atlas (Production Database)
- **Location**: Configuration in `frontend/.env.local`
- **Purpose**: Primary database for the frontend, handling:
  - User authentication
  - User profiles
  - Session management
  - Real-time data synchronization
- **Connection String**: Production MongoDB URI stored securely in frontend/.env.local

#### 2. PostgreSQL (Development Database)
- **Location**: Configuration in root `.env`
- **Purpose**: Backend development database, handling:
  - Structured data modeling
  - Complex queries and relationships
  - Data integrity and transactions
  - Development and testing environment

1. **Root Directory (.env)**
```env
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_NAME=tup-livestock
```

2. **Frontend (.env.local)**
```env
# frontend/.env.local
MONGODB_URI=mongodb+srv://<username>:<password>@tupcluster50.oogbg.mongodb.net/?retryWrites=true&w=majority&appName=TUPCluster50
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_ENV=development

# MongoDB Configuration
MONGODB_DB_NAME=livestock
MONGODB_MAX_POOL_SIZE=10
MONGODB_CONNECT_TIMEOUT=10000
```

### PostgreSQL Development Setup

#### Environment Configuration
```env
# root .env - PostgreSQL development settings
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_NAME=tup-livestock
```

#### Database Connection
```typescript
// backend/src/config/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

export const query = async (text: string, params?: any[]) => {
  return pool.query(text, params);
};
```

#### MongoDB Setup Steps

1. **Create Database Connection**
```typescript
// backend/src/config/database.ts
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
```

2. **User Schema**
```typescript
// backend/src/models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  farm: String,
  location: String,
  role: { type: String, default: 'user' },
  memberSince: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

3. **Authentication Controller**
```typescript
// backend/src/controllers/AuthController.ts
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export class AuthController {
  static async signup(req, res) {
    try {
      const user = new User(req.body);
      await user.save();
      
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async signin(req, res) {
    // ... signin logic
  }
}
```

### Authentication Flow

#### Sign Up Process

1. **Frontend Validation**
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrors({});
  
  // Validate form
  const newErrors: Record<string, string> = {};
  if (!form.email) newErrors.email = 'Email is required';
  if (!form.name) newErrors.name = 'Name is required';
  if (!form.password) newErrors.password = 'Password is required';
  else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  setIsLoading(true);
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (!response.ok) throw new Error('Signup failed');
    
    const { user, token } = await response.json();
    // Store token and user data
    localStorage.setItem('token', token);
    storage.setUser(user);
    
    router.push('/dashboard');
  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    setIsLoading(false);
  }
};
```

2. **Backend Processing**
```typescript
// backend/src/routes/auth.ts
router.post('/signup', async (req, res) => {
  try {
    // Validate input
    const { error } = validateSignup(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    // Check if user exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    
    // Create user
    const user = new User(req.body);
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Security Best Practices

1. **Environment Variables**
- Never commit .env files
- Use different .env files for different environments
- Rotate secrets regularly
- Use strong JWT secrets

2. **Password Security**
- Hash passwords using bcrypt
- Enforce minimum password strength
- Implement password reset functionality
- Store password reset tokens with expiration

3. **API Security**
- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Implement request timeouts

4. **MongoDB Security**
- Use connection string with credentials
- Enable MongoDB Atlas security features
- Regular backups
- Network access restrictions

### Migration Strategy

1. **Local Storage to MongoDB**
```typescript
async function migrateData() {
  // Get all local data
  const localUser = storage.getUser();
  const localAnimals = storage.getAnimals();
  
  // Create MongoDB user
  const user = await User.create({
    ...localUser,
    password: await bcrypt.hash(localUser.password, 10)
  });
  
  // Migrate related data
  await Animal.insertMany(localAnimals.map(animal => ({
    ...animal,
    userId: user._id
  })));
  
  // Clear local storage after successful migration
  storage.clearAll();
}
```

2. **Data Verification**
```typescript
async function verifyMigration(userId: string) {
  const user = await User.findById(userId);
  const animals = await Animal.find({ userId });
  
  // Verify data integrity
  // Log any inconsistencies
}
```

## Testing

1. **Authentication Tests**
```typescript
describe('Auth Flow', () => {
  it('should signup new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

2. **Integration Tests**
```typescript
describe('Protected Routes', () => {
  let token;
  
  beforeAll(async () => {
    // Setup test user and get token
  });
  
  it('should access protected route with valid token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});
```

## Monitoring

1. **Error Tracking**
- Implement error logging
- Monitor failed authentication attempts
- Track API response times
- Monitor database performance

2. **Usage Analytics**
- Track user signups
- Monitor active sessions
- Analyze authentication patterns
- Track feature usage

## Maintenance

1. **Regular Updates**
- Update dependencies
- Rotate secrets
- Review security policies
- Monitor for vulnerabilities

2. **Backup Strategy**
- Regular database backups
- Automated backup testing
- Disaster recovery plan
- Data retention policy