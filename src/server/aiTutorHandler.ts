import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

interface StudentUserPayload {
  name?: string;
  student_class?: string;
  target_exam?: string;
  stream?: string;
}

interface AiTutorRequestBody {
  prompt?: string;
  messages?: ChatMessageInput[];
  currentUser?: StudentUserPayload;
  documentContext?: string;
}

export async function handleAiTutorRequest(req: IncomingMessage, res: ServerResponse) {
  // Enforce POST method
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  let bodyText = '';
  try {
    for await (const chunk of req) {
      bodyText += chunk;
    }
  } catch (err: any) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to read request body.' }));
    return;
  }

  let body: AiTutorRequestBody = {};
  try {
    if (bodyText) {
      body = JSON.parse(bodyText);
    }
  } catch (err: any) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
    return;
  }

  const { prompt, messages = [], currentUser, documentContext } = body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing or empty "prompt" in request body.' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error:
          'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your .env file.',
        isConfigError: true
      })
    );
    return;
  }

  let systemInstruction = `You are Vidya AI, an expert, encouraging, Socratic AI Study Companion for Indian students.
The student you are tutoring is ${currentUser?.name || 'Student'}, studying in ${currentUser?.student_class || 'High School'} preparing for ${currentUser?.target_exam || 'Board/Competitive Exams'} (Stream: ${currentUser?.stream || 'General'}).

Guidelines for your responses:
1. Provide accurate, high-quality, step-by-step academic explanations tailored to CBSE, JEE, NEET, and NCERT standards.
2. Use clear formatting with Markdown: section headers (###), bold key terms (**term**), bullet points, and code blocks where relevant.
3. For Physics, Chemistry, or Math formulas, use clear mathematical expressions and equations.
4. Be encouraging, concise, and structured. Break down derivations, problem-solving shortcuts (elimination tricks), or mnemonics when requested.
5. Provide real, contextually accurate answers to every question. Never output generic or fake responses.
6. When responding to follow-up questions, stay coherent with the previous conversation history.`;

  if (documentContext && documentContext.trim()) {
    systemInstruction += `\n\n--- ACTIVE UPLOADED DOCUMENT CONTEXT ---\nThe student has uploaded a study document/notes with the following content summary:\n${documentContext.trim()}\n\nUse this active document context to directly answer questions, clarify concepts, or create practice questions based on their uploaded document.`;
  }

  // Build multi-turn history contents array for Gemini
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add conversation history
  for (const msg of messages) {
    if (msg.content && msg.content.trim()) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.trim() }]
      });
    }
  }

  // Ensure prompt is included as final user turn if not already present
  const trimmedPrompt = prompt.trim();
  const lastContent = contents[contents.length - 1];
  if (!lastContent || lastContent.role !== 'user' || lastContent.parts[0]?.text !== trimmedPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: trimmedPrompt }]
    });
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

  let lastError: any = null;
  let generatedText: string | null = null;

  for (const modelName of modelsToTry) {
    try {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents as any,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 1500
            }
          });

          if (response && response.text) {
            generatedText = response.text;
            break;
          }
        } catch (attemptErr: any) {
          attempts++;
          const status = attemptErr?.status || attemptErr?.statusCode;
          if ((status === 429 || status === 503 || status === 500) && attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1000 * attempts));
            continue;
          }
          throw attemptErr;
        }
      }

      if (generatedText) break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Vidya AI Server] Model ${modelName} call failed:`, err?.message || err);
    }
  }

  if (generatedText) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, text: generatedText }));
  } else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    const errMsg =
      lastError?.message || 'Failed to generate response from Gemini AI. Please try again.';
    res.end(JSON.stringify({ error: errMsg }));
  }
}
