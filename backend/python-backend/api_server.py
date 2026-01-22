from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bson import ObjectId
import os
import logging
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    return MongoClient(
        os.getenv("MONGO_URI"),
        tlsAllowInvalidCertificates=True
    )["test"]


@app.get("/submissions/{agent_id}")
async def get_submissions(agent_id: str):
    """
    Get all form submissions for a given agent
    """
    try:
        db = get_db()

        agent = db.agents.find_one({"_id": ObjectId(agent_id)})
        if not agent:
            return JSONResponse({
                "agent": None,
                "submissions": []
            })

        submissions = list(
            db.form_submissions.find(
                {"agentId": ObjectId(agent_id)}
            ).sort("createdAt", -1)
        )

        for sub in submissions:
            sub["_id"] = str(sub["_id"])
            sub["agentId"] = str(sub["agentId"])
            if "createdAt" in sub:
                sub["createdAt"] = str(sub["createdAt"])

        form_fields = []
        for field in agent.get("formFields", []):
            form_fields.append({
                "key": field.get("key", ""),
                "label": field.get("label", ""),
                "type": field.get("type", "string"),
                "required": field.get("required", True)
            })

        logger.info(f"✅ Found {len(submissions)} submissions for agent {agent_id}")

        return {
            "agent": {
                "agentId": str(agent["_id"]),
                "agentName": agent.get("agentName", ""),
                "agentType": agent.get("agentType", "form"),
                "formFields": form_fields
            },
            "submissions": submissions
        }

    except Exception as e:
        logger.error(f"❌ Failed to fetch submissions: {e}")
        return JSONResponse(
            {"agent": None, "submissions": []},
            status_code=500
        )
