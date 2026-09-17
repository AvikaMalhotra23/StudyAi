import { AIConceptExtraction } from '../types';

export interface DocExtractionResponse {
  success: boolean;
  extraction?: AIConceptExtraction;
  documentContext?: string;
  error?: string;
}

export async function extractConceptsFromDocument(file: File): Promise<DocExtractionResponse> {
  // 1. Validate file size (25MB limit)
  const MAX_SIZE_BYTES = 25 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of 25MB.`
    };
  }

  // 2. Validate file type
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.txt'];
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf' || ext === '.pdf';
  const isTxt = file.type === 'text/plain' || ext === '.txt';

  if (!isImage && !isPdf && !isTxt && !allowedExtensions.includes(ext)) {
    return {
      success: false,
      error: 'Unsupported file format. Please upload a PDF document or notes image (PNG/JPG).'
    };
  }

  try {
    let payload: any = {
      fileName: file.name
    };

    if (isTxt) {
      const text = await file.text();
      payload.fileText = text;
    } else {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Extract base64 portion
          const base64 = result.split(',')[1] || result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      payload.base64Data = base64Data;
      payload.mimeType = file.type || (isPdf ? 'application/pdf' : 'image/jpeg');
    }

    const response = await fetch('/api/extract-doc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Server error (${response.status}) processing document. Please try again.`
      };
    }

    return {
      success: true,
      extraction: data.extraction,
      documentContext: data.documentContext
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while connecting to SnapStudy backend service.'
    };
  }
}
