import Agent from '../models/agent.models.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PYTHON_API_URL = "http://localhost:8000";

// ================== GET COMPILED SUBMISSIONS ==================
export async function getCompiledSubmissions(req, res) {
  try {
    const userId = req.user.id;
    console.log('🔍 Getting submissions for user:', userId);

    // Get all agents for this user
    const agents = await Agent.find({ adminId: userId });
    console.log('📋 Found agents:', agents.length);

    if (agents.length === 0) {
      return res.json({ agents: [], submissions: [] });
    }

    // Fetch submissions from Python API for each agent
    const allSubmissions = [];
    
    for (const agent of agents) {
      try {
        const response = await fetch(`${PYTHON_API_URL}/submissions/${agent._id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Got ${data.submissions.length} submissions for ${agent.agentName}`);
          
          // Add submissions with agent info
          data.submissions.forEach(sub => {
            allSubmissions.push({
              _id: sub._id,
              agentId: agent._id.toString(),
              agentName: agent.agentName,
              phoneNumber: sub.answers?.phone_number || sub.answers?.phoneNumber || '',
              data: sub.answers,
              createdAt: sub.createdAt || new Date().toISOString()
            });
          });
        }
      } catch (error) {
        console.error(`Failed to fetch submissions for agent ${agent.agentName}:`, error.message);
      }
    }

    // Build agent summary
    const agentSummary = agents.map(agent => {
      const submissionCount = allSubmissions.filter(
        sub => sub.agentId === agent._id.toString()
      ).length;
      
      return {
        _id: agent._id,
        agentName: agent.agentName,
        submissionCount
      };
    });

    console.log('✅ Total submissions:', allSubmissions.length);

    res.json({
      agents: agentSummary,
      submissions: allSubmissions
    });

  } catch (error) {
    console.error('❌ Failed to get compiled submissions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch submissions',
      error: error.message 
    });
  }
}

// ================== AI QUERY PROCESSOR (WITH GEMINI) ==================
export async function aiQuery(req, res) {
  try {
    const { query, agentId } = req.body;
    const userId = req.user.id;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }

    console.log('🤖 AI Query received:', { query, agentId, userId });

    // Get agents for this user
    const agents = await Agent.find({ adminId: userId });
    
    if (agents.length === 0) {
      return res.json({
        answer: 'No agents found to analyze.',
        explanation: 'You need to create an agent first before analyzing submissions.',
        data: []
      });
    }

    // ✅ FIXED: Fetch submissions from Python API instead of MongoDB
    const allSubmissions = [];
    let targetAgents = agents;
    
    // Filter agents if specific agentId provided
    if (agentId && agentId !== 'all') {
      targetAgents = agents.filter(a => a._id.toString() === agentId);
      if (targetAgents.length === 0) {
        return res.status(404).json({ message: 'Agent not found' });
      }
    }

    console.log(`📡 Fetching submissions for ${targetAgents.length} agent(s)...`);

    // Fetch submissions from Python API for each agent
    for (const agent of targetAgents) {
      try {
        console.log(`🔄 Fetching from: ${PYTHON_API_URL}/submissions/${agent._id}`);
        const response = await fetch(`${PYTHON_API_URL}/submissions/${agent._id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Got ${data.submissions.length} submissions for ${agent.agentName}`);
          
          // Add submissions with agent info
          data.submissions.forEach(sub => {
            allSubmissions.push({
              _id: sub._id,
              agentId: agent._id.toString(),
              agentName: agent.agentName,
              answers: sub.answers,
              createdAt: sub.createdAt || new Date().toISOString()
            });
          });
        } else {
          console.error(`❌ Failed to fetch submissions for ${agent.agentName}: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ Error fetching submissions for agent ${agent.agentName}:`, error.message);
      }
    }

    console.log(`📊 Total submissions fetched: ${allSubmissions.length}`);

    if (allSubmissions.length === 0) {
      return res.json({
        answer: 'No submissions found to analyze.',
        explanation: 'There are currently no submissions in the database for the selected agent(s). Make sure your Python API on port 8000 is running and has submissions.',
        data: []
      });
    }

    // Get all unique fields from submissions
    const allFields = new Set();
    allSubmissions.forEach(sub => {
      Object.keys(sub.answers || {}).forEach(key => allFields.add(key));
    });

    console.log(`🔑 Fields found: ${Array.from(allFields).join(', ')}`);

    // Prepare data summary for Gemini
    const dataSummary = {
      totalSubmissions: allSubmissions.length,
      fields: Array.from(allFields),
      sampleData: allSubmissions.slice(0, 5).map(s => s.answers)
    };

    // Create prompt for Gemini
    const prompt = `You are a data analyst assistant. You have access to ${allSubmissions.length} form submissions with the following structure:

Available fields: ${Array.from(allFields).join(', ')}

Sample data (first 5 submissions):
${JSON.stringify(dataSummary.sampleData, null, 2)}

User query: "${query}"

Analyze the data and provide:
1. A direct answer to the user's question
2. A brief explanation of how you arrived at the answer
3. If applicable, suggest a visualization type (bar, pie, or line chart)
4. If suggesting visualization, specify which field should be used

Format your response as valid JSON with this exact structure:
{
  "answer": "Direct answer to the question",
  "explanation": "Brief explanation of the analysis",
  "suggestedVisualization": "bar" or "pie" or "line" or null,
  "field": "field name for visualization if applicable" or null
}

IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.`;

    console.log('🤖 Calling Gemini AI...');

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let aiResponse;
    
    try {
      aiResponse = JSON.parse(responseText);
      console.log('✅ Gemini response parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      // Fallback response
      aiResponse = {
        answer: responseText || "I analyzed the data but couldn't format the response properly.",
        explanation: 'Analysis completed',
        suggestedVisualization: null,
        field: null
      };
    }

    // If visualization suggested, prepare aggregation data
    let aggregation = null;
    if (aiResponse.field && aiResponse.suggestedVisualization) {
      try {
        console.log(`📊 Creating aggregation for field: ${aiResponse.field}`);
        aggregation = await performAggregation({
          agentId,
          groupBy: aiResponse.field,
          metric: 'count',
          filters: []
        }, userId, allSubmissions);
      } catch (aggError) {
        console.error('Aggregation failed:', aggError);
        // Continue without aggregation
      }
    }

    console.log('✅ Sending AI response to client');

    res.json({
      answer: aiResponse.answer,
      explanation: aiResponse.explanation,
      suggestedVisualization: aiResponse.suggestedVisualization,
      aggregation: aggregation,
      data: allSubmissions.slice(0, 100).map(s => s.answers) // Limit to 100 for performance
    });

  } catch (error) {
    console.error('❌ AI Query failed:', error);
    res.status(500).json({ 
      message: 'Failed to process AI query',
      error: error.message 
    });
  }
}

// ================== AGGREGATION HELPER ==================
async function performAggregation(request, userId, submissions = null) {
  const { agentId, groupBy, metric, metricField, filters = [] } = request;

  // If submissions not provided, fetch from Python API
  if (!submissions) {
    console.log('📡 Fetching submissions for aggregation...');
    const agents = await Agent.find({ adminId: userId });
    submissions = [];
    
    let targetAgents = agents;
    if (agentId && agentId !== 'all') {
      targetAgents = agents.filter(a => a._id.toString() === agentId);
    }

    for (const agent of targetAgents) {
      try {
        const response = await fetch(`${PYTHON_API_URL}/submissions/${agent._id}`);
        if (response.ok) {
          const data = await response.json();
          data.submissions.forEach(sub => {
            submissions.push({
              agentId: agent._id.toString(),
              answers: sub.answers
            });
          });
        }
      } catch (error) {
        console.error(`Failed to fetch for aggregation:`, error.message);
      }
    }
  }

  // Filter submissions based on agentId if specified
  let filteredSubmissions = submissions;
  if (agentId && agentId !== 'all') {
    filteredSubmissions = submissions.filter(s => s.agentId === agentId);
  }

  // Apply custom filters
  if (filters.length > 0) {
    filteredSubmissions = filteredSubmissions.filter(sub => {
      return filters.every(f => {
        const value = sub.answers[f.field];
        if (value === undefined) return false;

        switch (f.operator) {
          case 'gt':
            return Number(value) > Number(f.value);
          case 'lt':
            return Number(value) < Number(f.value);
          case 'eq':
            return Number(value) === Number(f.value);
          case 'between':
            return Number(value) >= Number(f.value) && Number(value) <= Number(f.value2);
          case 'contains':
            return String(value).toLowerCase().includes(String(f.value).toLowerCase());
          case 'equals':
            return String(value) === String(f.value);
          default:
            return true;
        }
      });
    });
  }

  // Group by field
  const grouped = {};
  filteredSubmissions.forEach(sub => {
    const key = sub.answers[groupBy] || 'Unknown';
    if (!grouped[key]) {
      grouped[key] = { count: 0, values: [] };
    }
    grouped[key].count++;
    
    if (metricField && sub.answers[metricField] !== undefined) {
      const numVal = Number(sub.answers[metricField]);
      if (!isNaN(numVal)) {
        grouped[key].values.push(numVal);
      }
    }
  });

  // Calculate final values
  const results = Object.entries(grouped).map(([label, data]) => {
    let value = data.count;
    
    if (metric === 'sum' && data.values.length > 0) {
      value = data.values.reduce((a, b) => a + b, 0);
    } else if (metric === 'avg' && data.values.length > 0) {
      value = data.values.reduce((a, b) => a + b, 0) / data.values.length;
    }
    
    return { label, value };
  });

  // Sort and limit
  results.sort((a, b) => b.value - a.value);
  const limitedResults = results.slice(0, 50);

  return {
    field: groupBy,
    values: limitedResults
  };
}

// ================== GET AGGREGATION ==================
export async function getAggregation(req, res) {
  try {
    const userId = req.user.id;
    const result = await performAggregation(req.body, userId);
    res.json(result);
  } catch (error) {
    console.error('❌ Aggregation failed:', error);
    res.status(500).json({ message: 'Failed to perform aggregation' });
  }
}