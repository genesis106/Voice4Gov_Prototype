from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",  # Dashboard
        "http://localhost:8082",  # Homepage
        "http://localhost:3001"   # Node.js API
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
def get_db():
    client = MongoClient(
        os.getenv("MONGO_URI"),
        tlsAllowInvalidCertificates=True
    )
    return client["test"]

# ================== GET SUBMISSIONS BY AGENT ==================
@app.get("/submissions/{agent_id}")

async def get_submissions(agent_id: str):

    """Get all form submissions for an agent"""

    try:

        db = get_db()

        

        # Get agent details

        agent = db.agents.find_one({"_id": ObjectId(agent_id)})

        if not agent:

            logger.warning(f"Agent not found: {agent_id}")

            return JSONResponse({

                "agent": None,

                "submissions": []

            })

        

        # Get submissions

        submissions = list(db.form_submissions.find(

            {"agentId": ObjectId(agent_id)}

        ).sort("createdAt", -1))

        

        # Convert ObjectId to string for JSON serialization

        for sub in submissions:

            sub["_id"] = str(sub["_id"])

            sub["agentId"] = str(sub["agentId"])

            # Ensure createdAt is present

            if "createdAt" not in sub:

                sub["createdAt"] = None

         # Clean formFields - remove _id from each field if present

        form_fields = agent.get("formFields", [])

        cleaned_fields = []

        for field in form_fields:

            cleaned_field = {

                "key": field.get("key", ""),

                "label": field.get("label", ""),

                "type": field.get("type", "string"),

                "required": field.get("required", True)

            }

            cleaned_fields.append(cleaned_field)

        

        logger.info(f"✅ Found {len(submissions)} submissions for agent {agent_id}")

        

        return JSONResponse({

            "agent": {

                "agentId": str(agent["_id"]),

                "agentName": agent.get("agentName", ""),

                "agentType": agent.get("agentType", "form"),

                "formFields": cleaned_fields

            },

            "submissions": submissions

        })

    except Exception as e:

        logger.error(f"❌ Failed to fetch submissions: {e}")
        import traceback
        logger.error(traceback.format_exc())
        
        return JSONResponse({

            "agent": None,

            "submissions": []

        }, status_code=500)



# ================== GET ALL SUBMISSIONS (COMPILED) ==================
@app.get("/submissions")
async def get_all_submissions():
    """Get all submissions across all agents - for compiled view"""
    try:
        db = get_db()
        
        # Get all submissions with agent lookup
        pipeline = [
            {
                "$lookup": {
                    "from": "agents",
                    "localField": "agentId",
                    "foreignField": "_id",
                    "as": "agent"
                }
            },
            {
                "$unwind": "$agent"
            },
            {
                "$sort": {"createdAt": -1}
            }
        ]
        
        submissions = list(db.form_submissions.aggregate(pipeline))
        
        # Format response
        formatted_submissions = []
        for sub in submissions:
            # Extract phone number from answers
            answers = sub.get("answers", {})
            phone_number = answers.get("phone_number", "") or answers.get("phoneNumber", "")
            
            # Convert datetime to string
            created_at = sub.get("createdAt")
            if created_at:
                try:
                    created_at = created_at.isoformat()
                except AttributeError:
                    created_at = str(created_at)
                except Exception:
                    created_at = None
            
            formatted_sub = {
                "_id": str(sub["_id"]),
                "agentId": str(sub["agentId"]),
                "agentName": sub["agent"].get("agentName", ""),
                "agentType": sub["agent"].get("agentType", "form"),
                "phoneNumber": phone_number,
                "data": answers,
                "createdAt": created_at
            }
            formatted_submissions.append(formatted_sub)
        
        logger.info(f"✅ Found {len(formatted_submissions)} total submissions")
        
        return JSONResponse({
            "submissions": formatted_submissions,
            "total": len(formatted_submissions)
        })
    
    except Exception as e:
        logger.error(f"❌ Error fetching all submissions: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return JSONResponse({
            "submissions": [],
            "total": 0
        }, status_code=500)

# ================== HEALTH CHECK ==================
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "submissions-api",
        "port": 8000
    }

# ================== RUN SERVER ==================
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Submissions API starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)