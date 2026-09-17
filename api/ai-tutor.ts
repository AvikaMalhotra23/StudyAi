import type { IncomingMessage, ServerResponse } from 'http';
import { handleAiTutorRequest } from '../src/server/aiTutorHandler.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleAiTutorRequest(req, res);
}
