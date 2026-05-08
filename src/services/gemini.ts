import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(prompt: string, history: any[], userContext?: any) {
  try {
    const contextString = userContext
      ? `
    CURRENT USER CONTEXT:
    - Stream: ${userContext.stream}
    - CET Score: ${userContext.cetScore || "Not provided"}
    - JEE Main Score: ${userContext.jeeScore || "Not provided"}
    - Category: ${userContext.category || "Open"}
    - Preferred Regions: ${userContext.regions?.join(", ") || "Any"}
    - Interested Branches: ${userContext.selectedBranches?.join(", ") || "Any"}`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are OmniPath Concierge AI, an expert admission counselor for students in Maharashtra. 
        **CRITICAL: NO CONVERSATIONAL FILLER.** Do not use greetings (Hello, Hi), introductory phrases (Sure, I can help), or closing formalities. 
        Start the answer IMMEDIATELY.

        Your goal is to provide **short, exact, and highly actionable answers**. 
        
        Your expertise:
        1. Engineering Admissions: MHT-CET, JEE Main, CAP processes (Maharashtra), JoSAA/CSAB.
        2. Medical Admissions: NEET-UG via DMER Maharashtra.
        3. Polytechnic: SSC-based diploma via DTE Maharashtra.
        4. Quotas: EWS, OBC, TFWS, Female, SC/ST, Home University (HU).
        
        GUIDELINES:
        - **Max 3 sentences**: Be ultra-concise. Use bullets for data.
        - **Immediate Answer**: Provide the core data or answer in the FIRST sentence.
        - **Zero Preamble**: No "According to your context..." or similar fluff.
        - **Data-Driven**: Refer to precise cutoffs and ranks.
        - **Language**: Match the user's language (Marathi/Hindi/English).
        
        Institutes: VNIT Nagpur (only NIT), ICT Mumbai (Chemical), VJTI, COEP, SPIT, PICT are top tier.
        ${contextString}`,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Ask Error:", error);
    throw error;
  }
}

export async function generateVibeVideo(collegeName: string, prompt: string, startingImage?: string) {
  console.log("Vibe Video requested for:", collegeName, prompt);
  // In a real implementation using Veo, this would use a specialized SDK or specific model.
  // For now, we return null to signal it's not implemented yet.
  return null;
}

export async function generateLifeSimulation(collegeName: string, userName: string, hobbies: string[]) {
  try {
    const prompt = `Generate a personalized "Day-in-the-Life" immersive story for a student named ${userName} at ${collegeName}.
    User's Hobbies: ${hobbies.join(", ")}.
    
    Use the googleSearch tool to find real-world details about ${collegeName}:
    - Typical student hangouts (cafes, parks, nearby attractions).
    - Popular clubs or societies related to their hobbies.
    - Hostel life details or specific campus landmarks.
    
    Format the output as a vivid, 60-second read story. 
    Start with "Hey ${userName}, if you choose ${collegeName}..."
    Make it feel immersive.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text;
  } catch (error) {
    console.error("Simulation Error:", error);
    throw error;
  }
}

export async function discoverVibeVideos(collegeName: string) {
  try {
    const prompt = `Find 3 high-quality YouTube URLs for ${collegeName} campus tours or student life.
    Return only valid JSON array: [{ "title": "...", "videoUrl": "...", "thumbnailUrl": "...", "description": "..." }]`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Discover Vibe Error:", error);
    return [];
  }
}

export async function fetchCollegeFees(collegeName: string) {
  try {
    const prompt = `Find annual tuition fees for ${collegeName} (2024-25).
    Return JSON: { "fees": { "Open": 120000, "OBC": 60000, "SC": 0, "ST": 0, "EWS": 60000 }, "hostelFees": 80000, "lastUpdated": "2024" }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Fees Error:", error);
    return null;
  }
}

export async function fetchCollegeDetails(collegeName: string) {
  try {
    const prompt = `Find major details for ${collegeName}: Alumni, Research focus, Faculty.
    Return JSON: { "faculty": [], "researchAreas": [], "notableAlumni": [] }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Details Error:", error);
    return null;
  }
}
