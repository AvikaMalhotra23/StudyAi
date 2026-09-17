import type { IncomingMessage, ServerResponse } from 'http';
import { handleExtractDocRequest } from '../src/server/extractDocHandler.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleExtractDocRequest(req, res);
}
