# Deployed Link For the project: https://citizen-voice-ai-zeta.vercel.app/

# Check out our project demo: https://youtu.be/CrOdFvIc07g

# 🎙️ Voice4Gov AI
<p align="center">
  <img src="citizen-voice-ai/public/Homepage1" width="300"/>
  <img src="citizen-voice-ai/public/AgentDashboard" width="300"/>
  <img src="citizen-voice-ai/public/AgentCreation" width="300"/>
    <img src="citizen-voice-ai/public/HomepageSS2" width="300"/>
  <img src="citizen-voice-ai/public/HomepageSS3" width="300"/>
</p>

**AI Voice Agents for Government Surveys, Forms & Grievance Redressal**

Voice4Gov AI is a **voice-first AI platform** that enables government agencies to conduct surveys, fill forms, and register citizen grievances through **simple phone calls**. The system uses **conversational AI** to interact with citizens in natural language, automatically capturing structured data with high accuracy, no smartphone, app, or internet required.

## 🚀 Problem Statement

Government departments often face challenges such as:

* Limited human staff to handle millions of citizen calls
* Low digital literacy and smartphone penetration
* Complex forms and long PDFs that are hard to understand
* Inefficient and error-prone data collection

**Voice4Gov AI** solves this by turning any phone call into an intelligent, conversational data-collection channel.


## 💡 Solution Overview

Voice4Gov AI deploys **AI-powered voice agents** that:

* Talk to citizens like a human operator
* Ask questions dynamically based on form/survey/grievance schemas
* Understand spoken responses in multiple languages
* Confirm and validate inputs before submission
* Store structured data securely for analysis and reporting

## 🧠 Key Features

*  **Phone Call–Based Access** (IVR-style, no app needed)
*  **Conversational AI** (Natural speech, not keypad menus)
*  **Multilingual Support** (Hindi, English, Hinglish)
*  **Form, Survey & Grievance Agents**
*  Intelligent number extraction (phone, ID, income, etc.)
*  Field-level confirmation for high accuracy
*  Real-time data storage & retrieval
*  Dynamic agent configuration from database

## 🏗️ System Architecture (High Level)

```text
Citizen Phone Call
        ↓
     Twilio Voice
        ↓
FastAPI WebSocket Server
        ↓
 Deepgram Agent API
(STT + LLM + TTS)
        ↓
   MongoDB Database
```


## 🔁 Agent Workflow

1. Admin creates an agent (form/survey/grievance/query)
2. Agent configuration is stored in MongoDB
3. Citizen calls the assigned phone number
4. AI agent starts a natural voice conversation
5. Fields are collected one by one with confirmation
6. Final submission is saved automatically
7. Admin views collected data via dashboard/API

## 🧱 Tech Stack

### Backend

* **FastAPI** – API & WebSocket server
* **Python (AsyncIO)** – Real-time audio streaming
* **Uvicorn** – ASGI server

### Voice & AI

* **Twilio Voice** – Call handling & audio streaming
* **Deepgram Agent API**

  * Speech-to-Text (Nova)
  * Text-to-Speech (Aura)
* **OpenAI (GPT-4o-mini)** – Reasoning & conversation logic

### Database

* **MongoDB** – Agent configs & submissions
* **PyMongo**

### Infrastructure & Utilities

* WebSockets
* Base64 audio streaming
* CORS Middleware
* dotenv for secrets
* Structured logging

## 📊 Agent States

Each agent can be in one of the following states:

* **Idle** – Configured but not started
* **Actively Calling** – Making outbound calls
* **Paused** – Temporarily stopped

## 🏛️ Use Cases

* Government surveys & census collection
* Welfare scheme enrollment
* Citizen grievance registration
* Rural outreach programs
* Low-connectivity regions
* Large-scale public feedback collection

## 🔐 Security & Reliability

* Environment-based secret management
* Structured validation before saving data
* Schema-driven data collection
* Stateless runtime, database-driven agents

## 🌍 Impact

Voice4Gov AI bridges the **digital divide** by making government services:

* Accessible
* Scalable
* Inclusive
* Voice-first

It empowers citizens to engage with government services using the **most universal interface: a phone call**.

## 📌 Future Enhancements

* Analytics dashboard
* Call scheduling & retries
* Sentiment analysis on grievances
* Auto-escalation workflows
* Regional language expansion
* Integration with government CRMs
