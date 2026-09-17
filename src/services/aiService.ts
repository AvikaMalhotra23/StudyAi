import { ChatMessage, StudentUser } from '../types';

export interface VidyaAIResponse {
  success: boolean;
  text?: string;
  error?: string;
  isConfigError?: boolean;
}

export async function sendVidyaAIMessage(
  prompt: string,
  messages: ChatMessage[],
  currentUser: StudentUser,
  documentContext?: string
): Promise<VidyaAIResponse> {
  try {
    // Filter out error messages from context payload
    const formattedHistory = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    const response = await fetch('/api/ai-tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        messages: formattedHistory,
        documentContext,
        currentUser: {
          name: currentUser.name,
          student_class: currentUser.student_class,
          target_exam: currentUser.target_exam,
          stream: currentUser.stream
        }
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Server error (${response.status}). Please try again.`,
        isConfigError: !!data.isConfigError
      };
    }

    return {
      success: true,
      text: data.text
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while connecting to Vidya AI backend. Please check your connection.'
    };
  }
}
