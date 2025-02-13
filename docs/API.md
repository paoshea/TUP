# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Registers a new user.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Logs in a user.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string"
}
```

## Livestock Management Endpoints

### GET /api/livestock
Retrieves a list of livestock.

**Response:**
```json
[
  {
    "id": "string",
    "species": "string",
    "breed": "string",
    "age": "number",
    "weight": "number",
    "healthStatus": "string"
  }
]
```

### POST /api/livestock
Adds a new livestock.

**Request:**
```json
{
  "species": "string",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "healthStatus": "string"
}
```

**Response:**
```json
{
  "message": "Livestock added successfully"
}
```

## Evaluation Endpoints

### GET /api/evaluations
Retrieves a list of evaluations.

**Response:**
```json
[
  {
    "id": "string",
    "livestockId": "string",
    "evaluator": "string",
    "score": "number",
    "notes": "string",
    "date": "string"
  }
]
```

### POST /api/evaluations
Adds a new evaluation.

**Request:**
```json
{
  "livestockId": "string",
  "evaluator": "string",
  "score": "number",
  "notes": "string",
  "date": "string"
}
```

**Response:**
```json
{
  "message": "Evaluation added successfully"
}
```

## Photo Management Endpoints

### GET /api/photos
Retrieves a list of photos.

**Response:**
```json
[
  {
    "id": "string",
    "url": "string",
    "description": "string",
    "date": "string"
  }
]
```

### POST /api/photos
Uploads a new photo.

**Request:**
```json
{
  "url": "string",
  "description": "string",
  "date": "string"
}
```

**Response:**
```json
{
  "message": "Photo uploaded successfully"
}
