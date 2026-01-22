import Agent from '../models/agent.models.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';


// ================== UTILS ==================
function deleteUnusedFiles(filePath) {
  try {
    if (filePath) fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}


// ================== CREATE AGENT ==================
export async function createAgent(req, res) {
  try {
    const { agentName, agentType, language, formFields = [] } = req.body;
    const knowledgeBaseFilePath = req.file?.path;


    // ✅ Parse formFields (form-data sends string)
    let parsedFormFields = [];
    if (formFields) {
      if (typeof formFields === "string") {
        try {
          parsedFormFields = formFields.trim() ? JSON.parse(formFields) : [];
        } catch (error) {
          deleteUnusedFiles(knowledgeBaseFilePath);
          return res.status(400).json({
            message: "Invalid JSON format for formFields"
          });
        }
      } else {
        parsedFormFields = formFields;
      }
    }


    // ✅ Basic validation (KB is optional)
    if (
      [agentName, agentType, language].some(
        (field) => field?.trim() === "" || field === undefined
      )
    ) {
      deleteUnusedFiles(knowledgeBaseFilePath);
      return res.status(400).json({
        message: "agentName, agentType, and language are required"
      });
    }


    // ================== OPTIONAL KB UPLOAD ==================
    let knowledgeBaseUrl = "";
    let knowledgeBase;


    if (knowledgeBaseFilePath) {
      try {
        knowledgeBase = await uploadOnCloudinary(knowledgeBaseFilePath);
        knowledgeBaseUrl = knowledgeBase?.url || "";
      } catch (error) {
        throw new ApiError(500, "Failed to upload Knowledge Base to Cloudinary");
      }
    }


    const fileMimeType = req.file.mimetype;
    const fileBase64 = fs.readFileSync(knowledgeBaseFilePath).toString('base64');


    // ================== GEMINI ==================
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });


    let prompt = "";


    // ================= FORM + SURVEY =================
    if (agentType === "form" || agentType === "survey") {
      prompt = `
You are a Voice AI Assistant speaking to a user over a phone call.


BACKGROUND CONTEXT (REFERENCE ONLY):
"${knowledgeBaseUrl}"


🚨 ABSOLUTE RULES (MANDATORY):
- You MUST ask questions ONLY from the FIELDS below.
- You MUST NOT invent, infer, or ask questions from the BACKGROUND CONTEXT.
- The BACKGROUND CONTEXT is NOT a source of questions.
- If a question is not listed in FIELDS, you must NEVER ask it.


YOUR ROLE:
- Politely tell the user you will ask a few questions.
- Keep the conversation simple, calm, and reassuring.


🚨 CRITICAL START BEHAVIOR:
- After your greeting, IMMEDIATELY ask the FIRST question.
- Your FIRST spoken message MUST END WITH A QUESTION.
- Do NOT wait silently.


FIELDS (order matters):
${JSON.stringify(parsedFormFields, null, 2)}


STRICT CONVERSATION RULES:
- Ask ONLY ONE question at a time.
- Wait for the user to answer.
- Repeat the answer and ask for confirmation.
- Do NOT accept "yes", "okay", "hello", or similar words as field values.
- Do NOT move to the next field unless confirmed.


FIELD HANDLING RULES:
- For numeric fields: accept digit-by-digit speech.
- For text fields: accept responses longer than one character.


🚨 END BEHAVIOR:
- After ALL fields are confirmed:
  - Thank the user politely.
  - IMMEDIATELY call submit_form.
  - Do NOT say anything after submit_form.


LANGUAGE:
- Speak ONLY in ${language}.
- Do NOT switch languages.


OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "systemPrompt": "...",
  "greeting": "..."
}
`;
    }


    // ================= QUERY =================
    else {
      prompt = `
You are a helpful voice AI assistant.


KNOWLEDGE BASE:
"${knowledgeBase}"


RULES:
1. Read the attached Knowledge Base carefully.
2. The "systemPrompt" MUST include every factual detail found in the document
3. Answer clearly and concisely.
4. Stay strictly within the knowledge base.
5. Speak ONLY in ${language}.
6. DO NOT use markdown formatting symbols like *, **, ***, #, ##, ###, or any other markdown syntax in the systemPrompt.
7. Write the systemPrompt in plain text with natural language only - no special characters for formatting.
8. Use simple punctuation like periods, commas, and line breaks for structure instead of markdown.


OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "systemPrompt": "A comprehensive instruction set containing ALL document facts in ${language}",
  "greeting": "A warm opening in ${language}"
}


IMPORTANT: The systemPrompt must be clean plain text suitable for voice AI - no asterisks, hashtags, or markdown formatting whatsoever.
`;
    }


    // ================== GENERATE ==================
    let result;
    if(agentType==="form" || agentType==="survey"){
       result = await model.generateContent(prompt);
    }
    else{
        result = await model.generateContent([
            {
                inlineData: {
                    data: fileBase64,
                    mimeType: fileMimeType
                }
            }, { text: prompt }


        ]);
    }
   
    deleteUnusedFiles(knowledgeBaseFilePath);
   
    const aiData = JSON.parse(result.response.text());


    // ================== GREETING OVERRIDE (SURVEY) ==================
    let greeting = aiData.greeting;


    if (agentType === "survey") {
      greeting =
        language === "hi"
          ? "Namaste! Main aapse ek chhota sa survey karna chahta hoon. Kya hum shuru kar sakte hain?"
          : "Hello! I’m calling to conduct a short survey. May I ask you a few questions?";
    }


    // ================== SAVE AGENT ==================
    const agent = await Agent.create({
      adminId: req.user.id,
      agentName,
      agentType,
      language,
      knowledgeBase: knowledgeBaseUrl,
      formFields:
        agentType === "form" || agentType === "survey"
          ? parsedFormFields
          : [],
      systemPrompt: aiData.systemPrompt,
      greeting
    });


    res.status(201).json(agent);


  } catch (err) {
    console.error("❌ Agent creation failed:", err);
    res.status(500).json({ message: "Agent creation failed" });
  }
}


// ================== GET AGENTS ==================
export async function getAgents(req, res) {
  const agents = await Agent.find({ adminId: req.user.id });
  res.json(agents);
}


// ================== DELETE AGENT ==================
export async function deleteAgent(req, res) {
  await Agent.findByIdAndDelete(req.params.agentId);
  res.json({ message: "Agent deleted" });
}

