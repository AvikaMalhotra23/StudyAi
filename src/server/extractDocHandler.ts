import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

export async function handleExtractDocRequest(req: IncomingMessage, res: ServerResponse) {
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

  let body: any = {};
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

  const { fileName, fileText, base64Data, mimeType } = body;

  if (!fileText && !base64Data) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing document content or base64 file data.' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your .env file.',
        isConfigError: true
      })
    );
    return;
  }

  const prompt = `You are an expert AI academic concept extractor for high school and competitive exam notes (NCERT, CBSE, JEE, NEET).
Analyze the provided document ("${fileName || 'Uploaded Document'}") and generate a structured JSON object containing:
1. "title": A concise, clear title for the document/chapter.
2. "summary": An array of 4 to 6 high-yield key takeaway strings summarizing the document.
3. "flashcards": An array of 4 active-recall flashcard objects, each with "front" (question/concept) and "back" (key mechanism/answer).
4. "quiz": An array of 3 practice quiz questions, each with "q" (question text), "options" (array of 4 option strings), "ans" (0-based integer index of correct answer), and "explanation" (1-sentence explanation).

Respond ONLY with valid JSON. No markdown code blocks, no trailing comments.

JSON Schema format:
{
  "title": "...",
  "summary": ["..."],
  "flashcards": [{"front": "...", "back": "..."}],
  "quiz": [{"q": "...", "options": ["A", "B", "C", "D"], "ans": 0, "explanation": "..."}]
}`;

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

  let contents: any[] = [];
  if (base64Data && mimeType) {
    contents = [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      }
    ];
  } else {
    contents = [
      {
        role: 'user',
        parts: [
          { text: `Document Name: ${fileName || 'Uploaded File'}\nContent:\n${(fileText || '').slice(0, 15000)}` },
          { text: prompt }
        ]
      }
    ];
  }

  let generatedText: string | null = null;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          temperature: 0.2,
          maxOutputTokens: 2000
        }
      });

      if (response && response.text) {
        generatedText = response.text;
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[SnapStudy Server] Model ${modelName} call failed:`, err?.message || err);
    }
  }

  if (!generatedText) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: lastError?.message || 'Failed to process document with Gemini AI.' }));
    return;
  }

  try {
    // Sanitize JSON text
    let cleanJson = generatedText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJson);
    const documentContext = `Document "${parsedData.title || fileName}":\n- ${ (parsedData.summary || []).join('\n- ') }`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        extraction: parsedData,
        documentContext
      })
    );
  } catch (parseErr: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to parse AI JSON extraction output.', raw: generatedText }));
  }
}
