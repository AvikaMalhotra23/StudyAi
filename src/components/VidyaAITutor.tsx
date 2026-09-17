import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentUser } from '../types';
import { sendVidyaAIMessage } from '../services/aiService';
import { 
  Bot, 
  X, 
  Send, 
  BookOpen, 
  Zap, 
  Dna, 
  HelpCircle,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

interface VidyaAITutorProps {
  currentUser: StudentUser;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  activeDocumentContext?: string;
}

export const VidyaAITutor: React.FC<VidyaAITutorProps> = ({
  currentUser,
  showToast,
  activeDocumentContext
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello ${currentUser.name.split(' ')[0]}! I'm **Vidya AI**, your 24/7 Socratic tutor for **${currentUser.target_exam}** (${currentUser.student_class}). Ask me to break down derivations, explain JEE/NEET PYQs, or generate NCERT memory mnemonics!`,
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: 'Just now'
    };

    // Update state with user message
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await sendVidyaAIMessage(content, currentMessages, currentUser, activeDocumentContext);

      if (res.success && res.text) {
        const assistantMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: res.text,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errorText = res.error || 'Unable to generate AI response. Please try again.';
        const errorMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: errorText,
          timestamp: 'Just now',
          isError: true,
          rawPrompt: content
        };
        setMessages(prev => [...prev, errorMsg]);
        showToast(res.isConfigError ? 'Server API Key missing' : 'AI response failed', 'error');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: err?.message || 'An unexpected error occurred while calling Vidya AI.',
        timestamp: 'Just now',
        isError: true,
        rawPrompt: content
      };
      setMessages(prev => [...prev, errorMsg]);
      showToast('Network error connecting to Vidya AI backend', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = (rawPrompt?: string) => {
    if (!rawPrompt) return;
    // Remove last error message before retrying
    setMessages(prev => prev.filter(m => !m.isError));
    handleSendMessage(rawPrompt);
  };

  const renderContent = (content: string) => {
    // Format headers ### and bold ** text
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let formattedLine = line;

      // Header 3
      if (formattedLine.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold text-indigo-300 mt-1 mb-1.5 flex items-center gap-1">
            {formattedLine.replace('### ', '')}
          </h4>
        );
      }

      // Header 2 or 1
      if (formattedLine.startsWith('## ') || formattedLine.startsWith('# ')) {
        return (
          <h3 key={idx} className="text-xs font-extrabold text-cyan-300 mt-1.5 mb-1.5">
            {formattedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      }

      // Render bold text safely
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={idx} className={line.trim() === '' ? 'h-1.5' : 'min-h-[1rem]'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          id="vidya-ai-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative p-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-2xl shadow-indigo-500/40 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Vidya AI Tutor
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f19] animate-pulse"></span>
        </button>
      </div>

      {/* Flyout Drawer Panel */}
      {isOpen && (
        <div
          id="vidya-ai-drawer"
          className="fixed bottom-24 lg:bottom-20 right-3 sm:right-6 w-[94vw] sm:w-[420px] h-[540px] max-h-[80vh] glass-panel rounded-3xl shadow-2xl border border-indigo-500/40 z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Vidya AI Study Companion</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Socratic CBSE & JEE/NEET Mode Active</span>
                </p>
              </div>
            </div>

            <button
              id="close-ai-tutor-btn"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              disabled={isTyping}
              onClick={() => handleSendMessage('How to structure a 5-mark CBSE Board Derivation for Electromagnetic Induction?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 whitespace-nowrap transition flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>📋 CBSE Derivation</span>
            </button>
            <button
              disabled={isTyping}
              onClick={() => handleSendMessage('Give me the JEE / NEET Rapid Elimination Hack for Physics')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 whitespace-nowrap transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>⚡ Elimination Hack</span>
            </button>
            <button
              disabled={isTyping}
              onClick={() => handleSendMessage('Give me an NCERT biology mnemonic for Prophase I Meiosis stages')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 whitespace-nowrap transition flex items-center gap-1"
            >
              <Dna className="w-3 h-3 text-emerald-400" />
              <span>🧬 NEET Mnemonic</span>
            </button>
            <button
              disabled={isTyping}
              onClick={() => handleSendMessage('Quiz me with a high-yield JEE Mains Physics PYQ question')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 whitespace-nowrap transition flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>🎯 Test on PYQ</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div 
            ref={chatStreamRef}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5 ${
                    m.isError ? 'bg-amber-600' : 'bg-indigo-600'
                  }`}>
                    {m.isError ? <AlertTriangle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white shadow'
                      : m.isError
                      ? 'bg-amber-950/60 border border-amber-500/50 text-amber-200'
                      : 'bg-slate-800/90 border border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="leading-relaxed">
                    {renderContent(m.content)}
                  </div>

                  {/* Retry Button for Error Messages */}
                  {m.isError && m.rawPrompt && (
                    <button
                      onClick={() => handleRetry(m.rawPrompt)}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-medium transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry Request</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="animate-pulse">Vidya AI is writing explanation...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                id="ai-tutor-message-input"
                value={inputMessage}
                disabled={isTyping}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isTyping ? "Vidya AI is responding..." : "Ask formula, derivation, or concept..."}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
              />
              <button
                type="submit"
                id="send-ai-message-btn"
                disabled={isTyping || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition active:scale-95 flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
