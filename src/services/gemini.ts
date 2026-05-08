async function callAiApi(action: string, payload: any) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'AI request failed');
  }
  return response.json();
}

export async function askGemini(prompt: string, history: { role: string; parts: { text: string }[] }[], userContext?: any) {
  const data = await callAiApi('ask', { prompt, history, userContext });
  return data.text;
}

export async function generateLifeSimulation(collegeName: string, userName: string, hobbies: string[]) {
  const data = await callAiApi('simulate', { collegeName, userName, hobbies });
  return data.text;
}

export async function generateVibeVideo(collegeName: string, prompt: string, startingImage?: string) {
  const data = await callAiApi('generate-vibe', { collegeName, prompt, startingImage });
  return data.videoUrl;
}

export async function discoverVibeVideos(collegeName: string) {
  return await callAiApi('discover-vibe', { collegeName });
}

export async function fetchCollegeFees(collegeName: string) {
  return await callAiApi('fetch-fees', { collegeName });
}

export async function fetchCollegeDetails(collegeName: string) {
  return await callAiApi('fetch-details', { collegeName });
}
