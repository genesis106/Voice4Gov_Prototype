# Citizen Voice AI - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React SPA (TypeScript + Vite)                           │   │
│  │  - Radix UI Components + Tailwind CSS                    │   │
│  │  - TanStack Query (State Management)                     │   │
│  │  - React Router (Navigation)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌────────────────────────┐    ┌──────────────────────────┐    │
│  │  Node.js Backend       │    │  Python Backend          │    │
│  │  (Express.js)          │    │  (WebSocket Server)      │    │
│  │  - REST API            │◄───┤  - Voice Call Handler    │    │
│  │  - JWT Auth            │    │  - Real-time Audio       │    │
│  │  - Business Logic      │    │  - FastAPI (HTTP)        │    │
│  └────────────────────────┘    └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB Database                                         │   │
│  │  - Users Collection                                       │   │
│  │  - Agents Collection                                      │   │
│  │  - Form Submissions Collection                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ External APIs
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Twilio   │  │ Deepgram │  │ Cartesia │  │ Google       │   │
│  │ (Calls)  │  │ (STT)    │  │ (TTS)    │  │ Gemini (AI)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────┐                                                   │
│  │Cloudinary│                                                   │
│  │(Storage) │                                                   │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.3.0
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack Query 5.83.0
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form 7.61.1 + Zod 3.25.76
- **Charts**: Recharts 2.15.4

#### Backend (Node.js)
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2.1
- **Database ODM**: Mongoose 9.1.0
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **AI Integration**: Google Generative AI 0.24.1
- **Telephony**: Twilio 5.11.1

#### Backend (Python)
- **Runtime**: Python 3.8+
- **WebSocket**: websockets library
- **HTTP API**: FastAPI
- **Database**: PyMongo
- **Speech Services**: Deepgram SDK
- **Transliteration**: indic-transliteration

#### Database
- **Primary Database**: MongoDB 4.4+
- **Connection**: Mongoose (Node.js), PyMongo (Python)

#### External Services
- **Voice Calls**: Twilio
- **Speech-to-Text**: Deepgram (Nova-3 model)
- **Text-to-Speech**: Cartesia (Sonic-2 model)
- **AI/LLM**: Google Gemini 2.5 Flash
- **File Storage**: Cloudinary

---

## 2. Data Model Design

### 2.1 Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required, lowercase),
  fullName: String (required, indexed),
  password: String (hashed, required),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `email`: Unique index for authentication
- `fullName`: Text index for search

**Security**:
- Passwords hashed with bcrypt (10 rounds)
- Refresh tokens stored for session management

#### Agents Collection
```javascript
{
  _id: ObjectId,
  adminId: ObjectId (ref: User, required),
  agentName: String (required),
  agentType: String (enum: ['query', 'survey', 'form'], required),
  language: String (default: 'en'),
  knowledgeBase: String (Cloudinary URL),
  knowledgeBasePublicId: String (Cloudinary ID),
  formFields: [
    {
      key: String (required),
      label: String (required),
      type: String (enum: ['string', 'number', 'date'], default: 'string'),
      minLength: Number,
      maxLength: Number,
      required: Boolean (default: true)
    }
  ],
  systemPrompt: String (AI-generated),
  greeting: String (AI-generated),
  createdAt: Date (default: Date.now)
}
```

**Indexes**:
- `adminId`: For filtering agents by user
- `agentType`: For filtering by type

**Relationships**:
- One-to-Many: User → Agents
- One-to-Many: Agent → Form Submissions

#### Form Submissions Collection
```javascript
{
  _id: ObjectId,
  agentId: ObjectId (ref: Agent, required),
  answers: Object (dynamic key-value pairs),
  createdAt: Date (default: Date.now)
}
```

**Indexes**:
- `agentId`: For filtering submissions by agent
- `createdAt`: For sorting by date

**Dynamic Schema**:
- `answers` object structure varies based on agent's `formFields`
- Keys match `formFields[].key`
- Values are strings or numbers based on field type

### 2.2 Data Relationships

```
User (1) ──────► (N) Agent
                      │
                      │
                      ▼
                 (N) FormSubmission
```

### 2.3 Data Flow

#### Agent Creation Flow
```
User Input → Node.js API → Cloudinary Upload → Gemini AI Processing
    ↓
MongoDB (Agent Document) ← AI-Generated Prompts
```

#### Call Handling Flow
```
Twilio Call → Python WebSocket → MongoDB (Fetch Agent Config)
    ↓
Deepgram STT → User Speech → Text
    ↓
OpenAI GPT-4o-mini → Response Generation
    ↓
Cartesia TTS → Audio → Twilio → User
    ↓
MongoDB (Save Submission)
```

---

## 3. API Design

### 3.1 REST API Endpoints (Node.js Backend)

#### Base URL
```
http://localhost:3000/api/v1
```

#### Authentication Endpoints

**POST /users/register**
```json
Request:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "User registered successfully"
}
```

**POST /users/login**
```json
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully"
}

Cookies Set:
- accessToken (httpOnly, secure)
- refreshToken (httpOnly, secure)
```

**POST /users/logout** (Protected)
```json
Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "User logged out successfully"
}
```

**GET /users/current-user** (Protected)
```json
Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**POST /users/refresh-token**
```json
Request (Cookie):
refreshToken: <refreshToken>

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Agent Management Endpoints

**POST /agents/create-agent** (Protected)
```json
Request (multipart/form-data):
{
  "agentName": "Survey Agent",
  "agentType": "survey",
  "language": "hi",
  "knowledgeBase": <file>,
  "formFields": "[{\"key\":\"name\",\"label\":\"What is your name?\",\"type\":\"string\",\"required\":true}]"
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439012",
  "adminId": "507f1f77bcf86cd799439011",
  "agentName": "Survey Agent",
  "agentType": "survey",
  "language": "hi",
  "knowledgeBase": "https://res.cloudinary.com/...",
  "formFields": [
    {
      "key": "name",
      "label": "What is your name?",
      "type": "string",
      "required": true
    }
  ],
  "systemPrompt": "You are a helpful voice AI assistant...",
  "greeting": "Namaste! Main aapse ek chhota sa survey karna chahta hoon...",
  "createdAt": "2026-02-13T10:30:00.000Z"
}
```

**GET /agents/get-agents** (Protected)
```json
Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "agentName": "Survey Agent",
    "agentType": "survey",
    "language": "hi",
    "createdAt": "2026-02-13T10:30:00.000Z"
  }
]
```

**DELETE /agents/delete-agent/:agentId** (Protected)
```json
Response (200):
{
  "message": "Agent deleted"
}
```

#### Analytics Endpoints

**GET /compiled-submissions** (Protected)
```json
Response (200):
{
  "agents": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "agentName": "Survey Agent",
      "submissionCount": 150
    }
  ],
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "agentId": "507f1f77bcf86cd799439012",
      "agentName": "Survey Agent",
      "phoneNumber": "+919876543210",
      "data": {
        "name": "Rajesh Kumar",
        "age": "35"
      },
      "createdAt": "2026-02-13T11:00:00.000Z"
    }
  ]
}
```

**POST /analytics/ai-query** (Protected)
```json
Request:
{
  "query": "What is the average age of respondents?",
  "agentId": "507f1f77bcf86cd799439012"
}

Response (200):
{
  "answer": "The average age of respondents is 32.5 years.",
  "explanation": "Calculated from 150 submissions with valid age data.",
  "suggestedVisualization": "bar",
  "aggregation": {
    "field": "age",
    "values": [
      { "label": "20-30", "value": 45 },
      { "label": "31-40", "value": 65 },
      { "label": "41-50", "value": 40 }
    ]
  },
  "data": [...]
}
```

**POST /analytics/aggregate** (Protected)
```json
Request:
{
  "agentId": "507f1f77bcf86cd799439012",
  "groupBy": "city",
  "metric": "count",
  "filters": [
    {
      "field": "age",
      "operator": "gt",
      "value": 25
    }
  ]
}

Response (200):
{
  "field": "city",
  "values": [
    { "label": "Mumbai", "value": 45 },
    { "label": "Delhi", "value": 38 },
    { "label": "Bangalore", "value": 32 }
  ]
}
```

#### Call Trigger Endpoint

**POST /calls/trigger** (Protected)
```json
Request:
{
  "agentId": "507f1f77bcf86cd799439012",
  "phoneNumber": "+919876543210"
}

Response (200):
{
  "success": true,
  "callSid": "CA1234567890abcdef",
  "message": "Call initiated successfully"
}
```

### 3.2 WebSocket API (Python Backend)

#### Connection URL
```
ws://localhost:5004
```

#### Message Flow

**1. Connection Established**
```
Client (Twilio) → WebSocket Server
```

**2. Start Event**
```json
{
  "event": "start",
  "start": {
    "streamSid": "MZ1234567890abcdef",
    "customParameters": {
      "agentId": "507f1f77bcf86cd799439012"
    }
  }
}
```

**3. Media Event (Audio from User)**
```json
{
  "event": "media",
  "media": {
    "payload": "<base64-encoded-mulaw-audio>"
  }
}
```

**4. Media Event (Audio to User)**
```json
{
  "event": "media",
  "streamSid": "MZ1234567890abcdef",
  "media": {
    "payload": "<base64-encoded-mulaw-audio>"
  }
}
```

**5. Clear Event (Stop Agent Speech)**
```json
{
  "event": "clear",
  "streamSid": "MZ1234567890abcdef"
}
```

### 3.3 Python HTTP API (FastAPI)

#### Base URL
```
http://localhost:8000
```

**GET /submissions/:agent_id**
```json
Response (200):
{
  "agent": {
    "agentId": "507f1f77bcf86cd799439012",
    "agentName": "Survey Agent",
    "agentType": "survey",
    "formFields": [
      {
        "key": "name",
        "label": "What is your name?",
        "type": "string",
        "required": true
      }
    ]
  },
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "agentId": "507f1f77bcf86cd799439012",
      "answers": {
        "name": "Rajesh Kumar",
        "age": "35"
      },
      "createdAt": "2026-02-13T11:00:00.000Z"
    }
  ]
}
```

---

## 4. Frontend Architecture

### 4.1 Component Structure

```
src/
├── components/
│   ├── ui/                    # Radix UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── Header.tsx             # Navigation header
│   ├── Footer.tsx             # Footer component
│   ├── HeroSection.tsx        # Landing page hero
│   ├── HowItWorksSection.tsx  # Process explanation
│   ├── CapabilitiesSection.tsx
│   ├── ProtectedRoute.tsx     # Auth guard
│   └── ...
├── pages/
│   ├── Index.tsx              # Landing page
│   ├── Login.tsx              # Login page
│   ├── Signup.tsx             # Registration page
│   ├── Dashboard.tsx          # Main dashboard
│   └── NotFound.tsx           # 404 page
├── contexts/
│   └── AuthContext.tsx        # Authentication state
├── hooks/
│   └── useAuth.ts             # Auth hook
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

### 4.2 State Management

#### Authentication State (Context API)
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

#### Server State (TanStack Query)
- Agent list queries
- Submission data queries
- Analytics queries
- Automatic caching and refetching
- Optimistic updates

### 4.3 Routing Design

```typescript
Routes:
/                    → Index (Landing Page)
/login               → Login
/signup              → Signup
/dashboard           → Dashboard (Protected)
/dashboard/agents    → Agent Management (Protected)
/dashboard/analytics → Analytics Dashboard (Protected)
*                    → NotFound (404)
```

### 4.4 Authentication Flow

```
1. User enters credentials
   ↓
2. AuthContext.login() called
   ↓
3. POST /api/v1/users/login
   ↓
4. Cookies set (accessToken, refreshToken)
   ↓
5. User state updated
   ↓
6. Redirect to /dashboard
```

### 4.5 Protected Route Pattern

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Checks authentication status
// Redirects to /login if not authenticated
// Shows loading state during check
```

---

## 5. Backend Architecture (Node.js)

### 5.1 Directory Structure

```
src/
├── controllers/
│   ├── user.controllers.js
│   ├── agent.controllers.js
│   ├── analytics.controller.js
│   └── call.controllers.js
├── models/
│   ├── user.models.js
│   ├── agent.models.js
│   └── formSubmission.models.js
├── routes/
│   ├── user.routes.js
│   ├── agent.routes.js
│   ├── analytics.routes.js
│   └── call.routes.js
├── middlewares/
│   ├── auth.middlewares.js
│   ├── error.middlewares.js
│   └── multer.middlewares.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── db/
│   └── index.js
├── app.js
├── index.js
└── constants.js
```

### 5.2 Middleware Chain

```
Request
  ↓
CORS Middleware
  ↓
Body Parser (JSON/URL-encoded)
  ↓
Cookie Parser
  ↓
Static File Serving
  ↓
Route Handler
  ↓
verifyJWT (if protected)
  ↓
Controller
  ↓
Error Handler
  ↓
Response
```

### 5.3 Authentication Middleware

```javascript
verifyJWT:
1. Extract token from cookies or Authorization header
2. Verify token with JWT secret
3. Decode user ID from token
4. Fetch user from database
5. Attach user to req.user
6. Call next() or throw error
```

### 5.4 Error Handling Pattern

```javascript
asyncHandler wrapper:
- Catches async errors
- Passes to error middleware

ApiError class:
- statusCode
- message
- errors array
- success: false

Error Middleware:
- Logs error
- Formats response
- Returns JSON error
```

---

## 6. Backend Architecture (Python)

### 6.1 Directory Structure

```
python-backend/
├── main.py              # WebSocket server
├── api_server.py        # FastAPI HTTP server
├── submissions_api.py   # Submission endpoints
├── requirements.txt
└── .env
```

### 6.2 WebSocket Server Design

#### Connection Lifecycle
```
1. Twilio connects → twilio_handler()
2. Receive start event → configure_agent()
3. Load agent config from MongoDB
4. Initialize Deepgram STS session
5. Start concurrent tasks:
   - twilio_receiver() → Receive audio from user
   - sts_sender() → Send audio to Deepgram
   - sts_receiver() → Receive responses from Deepgram
6. Process conversation
7. Save form submission
8. Close connection
```

#### Concurrent Task Architecture
```
asyncio.gather(
  twilio_receiver(),    # Listen to Twilio audio
  configure_agent(),    # Setup agent config
  sts_sender(),         # Send to Deepgram
  sts_receiver()        # Receive from Deepgram
)
```

### 6.3 Audio Processing Pipeline

```
User Speech (Phone)
  ↓
Twilio (μ-law 8kHz)
  ↓
WebSocket → Python Server
  ↓
Deepgram STS (Speech-to-Speech)
  ├─► Speech-to-Text (Nova-3)
  ├─► OpenAI GPT-4o-mini (Think)
  └─► Cartesia TTS (Sonic-2)
  ↓
Python Server → WebSocket
  ↓
Twilio → User (Phone)
```

### 6.4 Language Processing

#### Hindi Support
```python
# Transliteration
hindi_to_english("राजेश") → "raajesh"

# Number extraction
extract_digits("nine eight seven six") → "9876"

# Confirmation detection
is_yes("haan ji") → True
```

---

## 7. AI Integration Design

### 7.1 Google Gemini Integration

#### Agent Creation Prompt Engineering

**For Query Agents:**
```
Input: Knowledge base document
Output: {
  "systemPrompt": "Comprehensive instructions with all facts",
  "greeting": "Warm opening message"
}

Model: gemini-2.5-flash
Temperature: 0.2
Response Format: JSON
```

**For Form/Survey Agents:**
```
Input: Form fields + Knowledge base (optional)
Output: {
  "systemPrompt": "Conversational form collection instructions",
  "greeting": "Survey introduction"
}

Rules:
- Ask only defined questions
- One question at a time
- Confirm each answer
- Call submit_form when complete
```

#### Analytics Query Processing

```
Input: User natural language query + Submission data
Output: {
  "answer": "Direct answer",
  "explanation": "Analysis explanation",
  "suggestedVisualization": "bar|pie|line|null",
  "field": "field_name|null"
}

Model: gemini-2.5-flash
Temperature: 0.3
Response Format: JSON
```

### 7.2 Deepgram STS Configuration

```json
{
  "type": "Settings",
  "audio": {
    "input": {
      "encoding": "mulaw",
      "sample_rate": 8000
    },
    "output": {
      "encoding": "mulaw",
      "sample_rate": 8000,
      "container": "none"
    }
  },
  "agent": {
    "language": "hi",
    "greeting": "Namaste!",
    "listen": {
      "provider": {
        "type": "deepgram",
        "model": "nova-3"
      }
    },
    "think": {
      "provider": {
        "type": "open_ai",
        "model": "gpt-4o-mini"
      },
      "prompt": "<system_prompt>",
      "functions": [
        {
          "name": "submit_form",
          "description": "Submit collected form"
        }
      ]
    },
    "speak": {
      "provider": {
        "type": "cartesia",
        "model_id": "sonic-2",
        "voice": {
          "mode": "id",
          "id": "9358571b-7f13-41a0-b222-112c748eb31c"
        },
        "language": "hi"
      }
    }
  }
}
```

---

## 8. Security Design

### 8.1 Authentication Security

#### JWT Token Strategy
```
Access Token:
- Short-lived (15 minutes)
- Stored in httpOnly cookie
- Used for API authentication

Refresh Token:
- Long-lived (7 days)
- Stored in httpOnly cookie
- Used to refresh access token
- Stored in database for revocation
```

#### Password Security
```
- bcrypt hashing (10 rounds)
- Minimum length validation
- No plaintext storage
- Secure comparison
```

### 8.2 API Security

#### CORS Configuration
```javascript
cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:8082'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

#### Request Validation
- Input sanitization
- Type checking
- Required field validation
- File upload restrictions

### 8.3 Data Security

#### Database Security
- Connection string in environment variables
- TLS/SSL for connections
- No SQL injection (Mongoose ODM)
- Access control by user ID

#### File Upload Security
- File type validation
- Size limits
- Cloudinary secure upload
- Temporary file cleanup

---

## 9. Performance Design

### 9.1 Frontend Optimization

#### Code Splitting
```typescript
// Lazy loading routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

#### Caching Strategy
```typescript
// TanStack Query configuration
queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 10 * 60 * 1000,  // 10 minutes
    }
  }
});
```

#### Asset Optimization
- Vite build optimization
- Tree shaking
- Minification
- Gzip compression

### 9.2 Backend Optimization

#### Database Indexing
```javascript
// User model
email: { index: true, unique: true }
fullName: { index: true }

// Agent model
adminId: { index: true }
agentType: { index: true }

// FormSubmission model
agentId: { index: true }
createdAt: { index: true }
```

#### Connection Pooling
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2
});
```

#### Query Optimization
- Projection (select specific fields)
- Pagination (limit results)
- Aggregation pipelines
- Lean queries (plain objects)

### 9.3 Real-time Performance

#### WebSocket Optimization
```python
# Ping/pong for connection health
ping_interval=10
ping_timeout=10

# Audio buffering
MULAW_SILENCE = b"\xff" * 3200
chunk_size = 3200  # 200ms at 8kHz
```

#### Audio Streaming
- Low latency buffering
- Silence injection for gaps
- Interruption handling
- Network resilience

---

## 10. Scalability Design

### 10.1 Horizontal Scaling

#### Stateless Backend
- No session storage in memory
- JWT for authentication
- Database for state
- Load balancer ready

#### Database Scaling
- MongoDB replica sets
- Read replicas for analytics
- Sharding by user ID
- Connection pooling

### 10.2 Microservices Architecture (Future)

```
┌─────────────┐
│   Gateway   │
└──────┬──────┘
       │
   ┌───┴───┬───────┬──────────┐
   │       │       │          │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐  ┌───▼────┐
│Auth │ │Agent│ │Call │  │Analytics│
│Svc  │ │Svc  │ │Svc  │  │Svc      │
└─────┘ └─────┘ └─────┘  └─────────┘
```

### 10.3 Caching Strategy (Future)

```
Redis Cache:
- User sessions
- Agent configurations
- Frequently accessed submissions
- Analytics results

TTL Strategy:
- User data: 1 hour
- Agent config: 24 hours
- Analytics: 5 minutes
```

---

## 11. Monitoring & Logging

### 11.1 Application Logging

#### Log Levels
```
ERROR: System failures, exceptions
WARN: Degraded performance, retries
INFO: Important events (login, agent creation)
DEBUG: Detailed flow information
```

#### Log Format
```
[TIMESTAMP] [LEVEL] [MODULE] Message
2026-02-13T10:30:00.000Z INFO agent.controller Agent created: 507f1f77bcf86cd799439012
```

### 11.2 Monitoring Metrics

#### Application Metrics
- Request rate (req/sec)
- Response time (ms)
- Error rate (%)
- Active connections

#### Business Metrics
- Agents created
- Calls handled
- Form completion rate
- User registrations

### 11.3 Error Tracking

#### Error Categories
- Authentication errors
- Validation errors
- Database errors
- External API errors
- WebSocket errors

#### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": []
}
```

---

## 12. Deployment Architecture

### 12.1 Development Environment

```
Frontend: http://localhost:8081
Node.js Backend: http://localhost:3000
Python Backend: ws://localhost:5004
Python API: http://localhost:8000
MongoDB: mongodb://localhost:27017
```

### 12.2 Production Architecture (Recommended)

```
┌─────────────────────────────────────────┐
│           Load Balancer (Nginx)         │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    │         │          │            │
┌───▼───┐ ┌──▼───┐  ┌───▼────┐  ┌───▼────┐
│React  │ │Node  │  │Python  │  │Python  │
│(CDN)  │ │API   │  │WS      │  │API     │
└───────┘ └──┬───┘  └───┬────┘  └───┬────┘
             │          │           │
             └──────────┴───────────┘
                        │
                   ┌────▼────┐
                   │ MongoDB │
                   │ Cluster │
                   └─────────┘
```

### 12.3 Container Strategy (Docker)

```dockerfile
# Frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]

# Node.js Backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["npm", "start"]

# Python Backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

---

## 13. Testing Strategy

### 13.1 Frontend Testing

#### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

#### Integration Tests
- Form submissions
- API interactions
- Authentication flow

#### E2E Tests
- User registration
- Agent creation
- Dashboard navigation

### 13.2 Backend Testing

#### Unit Tests
- Controller logic
- Model validation
- Utility functions

#### Integration Tests
- API endpoints
- Database operations
- Authentication middleware

#### Load Tests
- Concurrent requests
- Database performance
- WebSocket connections

---

## 14. Future Enhancements

### 14.1 Technical Improvements

- GraphQL API for flexible queries
- Redis caching layer
- Elasticsearch for analytics
- Kubernetes orchestration
- CI/CD pipeline
- Automated testing suite
- APM integration

### 14.2 Feature Additions

- Multi-language expansion
- Call recording storage
- Real-time dashboard updates
- Webhook integrations
- Team collaboration
- Role-based access control
- Mobile applications

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Active Development
