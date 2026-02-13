# Citizen Voice AI - Requirements Document

## Project Overview

Citizen Voice AI is a voice-based AI agent platform that enables organizations to create intelligent phone agents for conducting surveys, collecting form data, and answering queries. The system uses AI-powered voice recognition and natural language processing to interact with users over phone calls in multiple languages.

## System Architecture

### Frontend (React + TypeScript)
- Single Page Application built with React 18 and TypeScript
- UI framework: Radix UI components with Tailwind CSS
- State management: TanStack Query (React Query)
- Routing: React Router v6
- Form handling: React Hook Form with Zod validation

### Backend Services

#### Node.js Backend (Express)
- RESTful API server
- Authentication and authorization
- Agent management
- Analytics and data aggregation
- Integration with AI services (Google Gemini)

#### Python Backend (WebSocket)
- Real-time voice call handling via Twilio
- Deepgram integration for speech-to-text
- Cartesia integration for text-to-speech
- Multi-language support (English, Hindi)
- Form submission processing

### Database
- MongoDB for data persistence
- Collections: Users, Agents, Form Submissions

### Third-Party Services
- Twilio: Phone call infrastructure
- Deepgram: Speech recognition (Nova-3 model)
- Google Gemini: AI prompt generation and analytics
- Cartesia: Voice synthesis (Sonic-2 model)
- Cloudinary: File storage for knowledge bases

## Core Features

### 1. User Management

#### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Access token and refresh token mechanism
- Password hashing with bcrypt
- Protected routes and middleware

#### User Roles
- Admin users who create and manage agents
- Each user has isolated agent workspace

### 2. Agent Management

#### Agent Types
1. **Query Agent**: Answers questions based on uploaded knowledge base
2. **Form Agent**: Collects structured data through conversational interface
3. **Survey Agent**: Conducts surveys with predefined questions

#### Agent Configuration
- Agent name and type selection
- Language selection (English, Hindi, extensible)
- Knowledge base upload (PDF, documents)
- Custom form field definition for form/survey agents
- AI-generated system prompts and greetings

#### Form Field Types
- String fields (text input)
- Number fields (digit-by-digit collection)
- Date fields
- Field validation (required, min/max length)

#### Agent Creation Workflow
1. User uploads knowledge base document
2. System extracts content and uploads to Cloudinary
3. Google Gemini generates:
   - System prompt based on knowledge base
   - Greeting message in selected language
4. Agent configuration saved to database
5. Agent ready for phone calls

### 3. Voice Call System

#### Call Flow
1. Incoming call routed through Twilio
2. WebSocket connection established with Python backend
3. Agent configuration loaded from database
4. Deepgram STS (Speech-to-Speech) session initiated
5. Real-time audio streaming between caller and AI agent
6. Form data collected and validated
7. Submission saved to database
8. Call terminated gracefully

#### Conversation Management
- Natural language understanding
- Context-aware responses
- Confirmation loops for data accuracy
- Interruption handling (user can interrupt agent)
- Multi-turn conversations

#### Language Processing
- Hindi to English transliteration (Devanagari to ITRANS)
- Number word to digit conversion
- Confirmation word detection (yes, haan, ji, etc.)
- Noise filtering and cleanup

### 4. Data Collection & Storage

#### Form Submissions
- Dynamic schema based on agent form fields
- Answers stored as key-value pairs
- Timestamp tracking
- Agent association for each submission

#### Data Validation
- Type checking (string, number, date)
- Required field enforcement
- Length constraints
- Confirmation before saving

### 5. Analytics & Insights

#### Data Visualization
- Submission count by agent
- Field-based aggregations
- Chart types: bar, pie, line
- Filtering and grouping capabilities

#### AI-Powered Analytics
- Natural language queries on submission data
- Google Gemini integration for data analysis
- Automatic visualization suggestions
- Aggregation operations:
  - Count
  - Sum
  - Average
  - Group by any field

#### Query Capabilities
- Filter by agent or across all agents
- Custom filters (greater than, less than, equals, contains, between)
- Field-based grouping
- Top 50 results limitation for performance

### 6. Dashboard

#### Agent Dashboard
- List of all user's agents
- Agent type indicators
- Submission count per agent
- Quick actions (view, delete)
- Agent creation interface

#### Analytics Dashboard
- Compiled submissions view
- AI query interface
- Dynamic chart rendering
- Data export capabilities
- Real-time data fetching from Python API

## Technical Requirements

### Frontend Requirements
- Modern browser support (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop and tablet
- Accessible UI components
- Form validation and error handling
- Loading states and error boundaries

### Backend Requirements

#### Node.js Backend
- Node.js 18+ runtime
- Express.js framework
- MongoDB connection pooling
- JWT token management
- File upload handling (Multer)
- CORS configuration
- Error handling middleware

#### Python Backend
- Python 3.8+ runtime
- WebSocket server (websockets library)
- Async/await support
- MongoDB connection
- SSL/TLS support
- Windows compatibility (event loop policy)

### Database Requirements
- MongoDB 4.4+
- Indexed fields for performance
- Referential integrity
- Timestamp tracking
- ObjectId references

### API Requirements

#### REST API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/agents - Create agent
- GET /api/agents - List user's agents
- DELETE /api/agents/:id - Delete agent
- GET /api/analytics/submissions - Get all submissions
- POST /api/analytics/query - AI-powered query
- POST /api/analytics/aggregation - Data aggregation
- POST /api/calls/trigger - Initiate phone call

#### WebSocket Endpoints
- ws://localhost:5004 - Voice call handling

#### Python API Endpoints
- GET /submissions/:agentId - Fetch submissions by agent

### Security Requirements
- Password hashing (bcrypt, 10 rounds)
- JWT token authentication
- Secure token storage
- CORS policy enforcement
- Environment variable protection
- File upload validation
- SQL injection prevention (MongoDB)
- XSS protection

### Performance Requirements
- API response time < 2 seconds
- Real-time audio streaming latency < 500ms
- Support for concurrent calls
- Database query optimization
- Pagination for large datasets
- Cloudinary CDN for file delivery

## Environment Configuration

### Node.js Backend (.env)
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
MONGO_URI=mongodb://...
REFRESH_TOKEN_SECRET=secret
REFRESH_TOKEN_EXPIRY=7d
ACCESS_TOKEN_SECRET=secret
ACCESS_TOKEN_EXPIRY=15m
PYTHON_BACKEND_URL=http://localhost:8000
GEMINI_API_KEY=key
TWILIO_ACCOUNT_SID=sid
TWILIO_AUTH_TOKEN=token
TWILIO_NUMBER=+1234567890
```

### Python Backend (.env)
```
DEEPGRAM_API_KEY=key
TWILIO_ACCOUNT_SID=sid
TWILIO_AUTH_TOKEN=token
TWILIO_NUMBER=+1234567890
MONGO_URI=mongodb://...
PORT=5004
CARTESIA_API_KEY=key
```

## User Workflows

### Agent Creation Workflow
1. User logs in to dashboard
2. Clicks "Create Agent"
3. Fills agent details:
   - Agent name
   - Agent type (query/form/survey)
   - Language selection
   - Knowledge base upload
   - Form fields (if form/survey type)
4. System processes knowledge base with AI
5. Agent created and appears in dashboard
6. User receives agent phone number

### Call Handling Workflow
1. Citizen calls agent phone number
2. System answers and greets in selected language
3. For query agents: Answers questions from knowledge base
4. For form/survey agents:
   - Asks questions one by one
   - Collects and confirms each answer
   - Handles corrections and clarifications
   - Submits form when complete
5. Call ends with thank you message
6. Data saved to database

### Analytics Workflow
1. User navigates to analytics dashboard
2. Views submission summary by agent
3. Asks natural language question
4. AI analyzes data and provides insights
5. System suggests visualization if applicable
6. User views charts and detailed data
7. Can apply filters and groupings
8. Export or further analyze data

## Non-Functional Requirements

### Scalability
- Horizontal scaling for backend services
- Database sharding support
- CDN for static assets
- Load balancing for API servers

### Reliability
- Error handling and logging
- Graceful degradation
- Retry mechanisms for external APIs
- Database connection pooling
- Health check endpoints

### Maintainability
- Modular code architecture
- Clear separation of concerns
- Comprehensive error messages
- Environment-based configuration
- Code documentation

### Usability
- Intuitive user interface
- Clear error messages
- Loading indicators
- Responsive feedback
- Accessibility compliance

### Monitoring
- Application logging
- Error tracking
- Performance metrics
- Call quality monitoring
- Database query performance

## Future Enhancements

### Potential Features
- Multi-language expansion (Spanish, French, etc.)
- Advanced analytics with ML insights
- Call recording and playback
- Real-time dashboard updates
- Webhook integrations
- API for third-party integrations
- Voice customization options
- Sentiment analysis
- Call transcription storage
- A/B testing for agent prompts
- Team collaboration features
- Role-based access control
- White-label options
- Mobile app for iOS/Android

### Technical Improvements
- Microservices architecture
- GraphQL API
- Redis caching layer
- Elasticsearch for analytics
- Kubernetes deployment
- CI/CD pipeline
- Automated testing suite
- Performance monitoring (APM)
- Rate limiting
- API versioning

## Constraints & Limitations

### Current Limitations
- Single-level form fields (no nested structures)
- Maximum 50 results in aggregations
- English and Hindi languages only
- Phone calls only (no web chat)
- No call recording storage
- Limited to Twilio infrastructure
- Synchronous AI processing

### Technical Constraints
- Twilio account required
- External API dependencies
- MongoDB as primary database
- WebSocket connection required for calls
- File size limits for knowledge base uploads
- Token expiry requires re-authentication

## Success Metrics

### Key Performance Indicators
- Number of agents created
- Total calls handled
- Average call duration
- Form completion rate
- User satisfaction score
- System uptime percentage
- API response times
- Error rate
- User retention rate
- Data accuracy rate

## Compliance & Privacy

### Data Protection
- User data encryption at rest
- Secure transmission (HTTPS/WSS)
- Access control and authentication
- Data retention policies
- GDPR compliance considerations
- User consent management

### Call Recording
- Compliance with local regulations
- User notification requirements
- Data storage security
- Access audit trails

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Active Development
