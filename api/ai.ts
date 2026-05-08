import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured on server' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'ask': {
        const { prompt, history, userContext } = payload;
        const contextString = userContext ? `
        CURRENT USER CONTEXT:
        - Stream: ${userContext.stream}
        - CET Score: ${userContext.cetScore || 'Not provided'}
        - JEE Main Score: ${userContext.jeeScore || 'Not provided'}
        - Category: ${userContext.category || 'Open'}
        - Preferred Regions: ${userContext.regions?.join(', ') || 'Any'}
        - Interested Branches: ${userContext.selectedBranches?.join(', ') || 'Any'}` : '';

        const chat = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: `You are OmniPath Concierge AI, an expert admission counselor for students in Maharashtra. 
            Your goal is to provide **short, exact, and highly actionable answers**. Avoid long introductions or generic filler text.
            
            Your expertise includes:
            1. Engineering Admissions: MHT-CET, JEE Main/Advanced, CAP processes (Maharashtra), and JoSAA/CSAB (National).
            2. Medical Admissions: NEET-UG for MBBS/BDS/BAMS/BHMS via DMER Maharashtra.
            3. Polytechnic: SSC-based diploma admissions via DTE Maharashtra.
            4. Quotas: EWS, OBC-NCL, Female, SC/ST, Home University (HU), and Institutional quotas.
            
            GUIDELINES FOR RESPONDING:
            - **Brevity is key**: Keep responses under 3-4 sentences whenever possible. Use bullet points for lists.
            - **Directness**: Answer the specific question first, then provide minimal context only if necessary.
            - **Data-Driven**: Refer to known cutoffs and trends precisely.
            - **Language**: Respond in the same language the user speaks (Marathi, Hindi, English, etc.).
            
            VNIT Nagpur is the only NIT in Maharashtra. ICT Mumbai is premier for Chemical. VJTI and COEP are top state-govt autonomous institutes.
            ${contextString}`,
          },
          history: history,
        });
        const response = await chat.sendMessage({ message: prompt });
        return res.json({ text: response.text });
      }

      case 'simulate': {
        const { collegeName, userName, hobbies } = payload;
        const prompt = `Generate a personalized "Day-in-the-Life" immersive story for a student named ${userName} at ${collegeName}.
        User's Hobbies: ${hobbies.join(', ')}.
        
        Use the googleSearch tool to find real-world details about ${collegeName}:
        - Typical student hangouts (cafes, parks, nearby attractions).
        - Popular clubs or societies related to their hobbies.
        - Hostel life details or specific campus landmarks.
        - Recent student vlogs or Reddit discussions about daily life there.
        
        Format the output as a vivid, 60-second read story. 
        Start with "Hey ${userName}, if you choose ${collegeName}..."
        Make it feel immersive, using sensory details. 
        Mention specific places and activities that exist at or near ${collegeName}.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        return res.json({ text: response.text });
      }

      case 'generate-vibe': {
        const { collegeName, prompt: userPrompt, startingImage } = payload;
        const videoPrompt = `Create a high-energy, cinematic "Day-in-the-Life" vibe video for ${collegeName}. 
        The video should capture the essence of: ${userPrompt}. 
        Focus on the vibrant student culture, state-of-the-art labs, and the unique atmosphere of the campus. 
        Make it look like a professional student vlog or a high-end institutional showcase.`;

        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: videoPrompt,
          image: startingImage ? {
            imageBytes: startingImage.split(',')[1],
            mimeType: 'image/png',
          } : undefined,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) return res.status(500).json({ error: "Failed to generate video" });

        return res.json({ videoUrl: `/api/proxy-video?url=${encodeURIComponent(downloadLink)}` });
      }

      case 'discover-vibe': {
        const { collegeName } = payload;
        const prompt = `Find 3 high-quality YouTube video URLs or official campus tour videos for ${collegeName}. 
        These should be "Day in the Life", "Campus Tour", or "Vibe" style videos.
        Return the results as a JSON array of objects with:
        - title: A catchy title for the video
        - videoUrl: The direct YouTube or video link (ensure it starts with https://)
        - thumbnailUrl: A high-quality thumbnail URL if possible (or use a placeholder)
        - description: A short 1-sentence description of what the video shows.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
          },
        });
        return res.json(JSON.parse(response.text));
      }

      case 'fetch-fees': {
        const { collegeName } = payload;
        const prompt = `Quickly find annual tuition and hostel fees for ${collegeName}, Maharashtra (2024-25).
        Categories: Open, OBC, SC, ST, EWS.
        Return JSON: { "fees": { "Category": number }, "hostelFees": number, "sourceUrl": string, "lastUpdated": "Year" }
        Use INR. Estimate if missing based on MH govt norms.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          },
        });
        return res.json(JSON.parse(response.text));
      }

      case 'fetch-details': {
        const { collegeName } = payload;
        const prompt = `Find major details for ${collegeName}, Maharashtra:
        1. Notable Alumni (at least 2-3 prominent ones with their current achievement)
        2. Research Focus Areas (3-5 key focus areas or centers of excellence)
        3. Distinguished Faculty (Names and specializations of 2-3 prominent professors or heads)
        
        Return in JSON format:
        {
          "faculty": [{ "name": "Name", "designation": "Professor/Director", "specialization": "Field" }],
          "researchAreas": ["Area 1", "Area 2"],
          "notableAlumni": [{ "name": "Name", "achievement": "CEO at X / Scientist / Politician" }]
        }`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          },
        });
        return res.json(JSON.parse(response.text));
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error(`AI Action Error (${action}):`, error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
