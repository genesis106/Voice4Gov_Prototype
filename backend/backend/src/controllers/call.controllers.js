import twilio from 'twilio';
import 'dotenv/config';


export async function triggerCall(req, res) {
  const { phoneNumber, agentId } = req.body; // Sent from React
  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM_NUMBER = process.env.TWILIO_NUMBER;


  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    throw new Error("Missing required Twilio environment variables");
  }




  const twilioClient = twilio(ACCOUNT_SID, AUTH_TOKEN);




  // ✅ FIXED: Use <Connect> for bidirectional audio
  const twiml = `
  <Response>
    <Connect>
      <Stream url="wss://galleried-sheryll-rudderless.ngrok-free.dev/twilio">
      <Parameter name="agentId" value="${agentId}" />
      </Stream>
    </Connect>
  </Response>
  `;


  try {
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      throw new Error("Phone number must be in E.164 format (e.g., +918595835096)");
    }
    console.log(`Initiating call to ${phoneNumber}...`);


    const call = await twilioClient.calls.create({
      to: phoneNumber,
      from: FROM_NUMBER,
      twiml: twiml,
    });


    console.log("✅ Call initiated successfully!");
    console.log("Call SID:", call.sid);
    console.log("Status:", call.status);


    return res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error("❌ Call failed:", error.message);
    throw error;
  }
}

