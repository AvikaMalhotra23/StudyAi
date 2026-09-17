import React, { useState } from 'react';
import { AIConceptExtraction, StudentUser } from '../types';
import { PRESET_EXTRACTIONS } from '../data/initialData';
import { extractConceptsFromDocument } from '../services/docExtractionService';
import { 
  Wand2, 
  UploadCloud, 
  FileText, 
  RotateCw, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  HelpCircle,
  FileCode,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SnapStudyViewProps {
  currentUser: StudentUser;
  onEarnStars: (stars: number) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onActiveDocumentChange?: (docContext: string) => void;
}

export const SnapStudyView: React.FC<SnapStudyViewProps> = ({
  currentUser,
  onEarnStars,
  showToast,
  onActiveDocumentChange
}) => {
  const [activeExtraction, setActiveExtraction] = useState<AIConceptExtraction | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    showToast(`Synthesizing concepts for "${file.name}"...`, 'info');

    const res = await extractConceptsFromDocument(file);
    setIsProcessing(false);

    if (res.success && res.extraction) {
      loadExtraction(res.extraction);
      if (res.documentContext && onActiveDocumentChange) {
        onActiveDocumentChange(res.documentContext);
      }
      showToast(`Successfully extracted concepts from "${file.name}"!`, 'success');
    } else {
      showToast(res.error || 'Failed to extract concepts from document. Falling back to demo preview.', 'warning');
      loadExtraction(PRESET_EXTRACTIONS.induction);
    }
  };

  const loadExtraction = (extraction: AIConceptExtraction) => {
    setActiveExtraction(extraction);
    setFlippedCards({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setBonusClaimed(false);
    if (onActiveDocumentChange && extraction.summary) {
      onActiveDocumentChange(`Document "${extraction.title}":\n- ${extraction.summary.join('\n- ')}`);
    }
  };

  const toggleFlipCard = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeExtraction) return;
    const questions = activeExtraction.quiz;

    for (let i = 0; i < questions.length; i++) {
      if (quizAnswers[i] === undefined) {
        showToast(`Please answer question ${i + 1} before checking score!`, 'warning');
        return;
      }
    }

    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.ans) {
        correct++;
      }
    });

    setQuizScore(correct);
    setQuizSubmitted(true);

    if (correct === questions.length && !bonusClaimed) {
      onEarnStars(30);
      setBonusClaimed(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('🌟 Perfect Score (3/3)! +30 Bonus Stars credited to your wallet!', 'success');
    } else {
      showToast(`Scored ${correct}/${questions.length}. Flip the flashcards to master the concepts!`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-cyan-400" />
          SnapStudy AI: Doc & Photo Concept Extractor
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload textbook photos, handwritten notes, or lecture PDFs. AI automatically generates structured summaries, 3D active recall flashcards, and practice quizzes!
        </p>
      </div>

      {/* Upload Dropzone & Demo Presets */}
      <div 
        id="snap-upload-dropzone"
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 text-center relative overflow-hidden"
      >
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              Upload Notes, Textbook Photo, or PDF
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG, PDF up to 25MB (or test instant demo syllabus below)
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <label 
              id="select-doc-label"
              className="cursor-pointer px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-600/30 flex items-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Select Document / Photo</span>
              <input 
                type="file" 
                id="snap-file-upload-input"
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*,.pdf" 
              />
            </label>
          </div>

          {/* Quick Demo Presets */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Or test instant sample chapters with 1-click:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                id="preset-induction-btn"
                onClick={() => loadExtraction(PRESET_EXTRACTIONS.induction)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition flex items-center gap-1.5 active:scale-95"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>NCERT Physics: Induction & Lenz</span>
              </button>

              <button
                id="preset-genetics-btn"
                onClick={() => loadExtraction(PRESET_EXTRACTIONS.genetics)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>NEET Biology: DNA & Operon</span>
              </button>

              <button
                id="preset-integrals-btn"
                onClick={() => loadExtraction(PRESET_EXTRACTIONS.integrals)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition flex items-center gap-1.5 active:scale-95"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>JEE Maths: King's Rule Integrals</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Extracted Content Results */}
      {activeExtraction && (
        <div id="extraction-results-container" className="space-y-6">
          
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {activeExtraction.title}
                </h3>
                <p className="text-xs text-slate-400">
                  AI Synthesized {activeExtraction.summary.length} Core Takeaways • {activeExtraction.flashcards.length} Flashcards • {activeExtraction.quiz.length} Practice Qs
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>+30 Stars for perfect quiz</span>
            </span>
          </div>

          {/* Section A: Bullet Summaries */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Synthesis & NCERT High-Yield Takeaways</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {activeExtraction.summary.map((point, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section B: 3D Flip Active Recall Flashcards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-purple-400" />
                <span>Active Recall Flashcards (Click to Flip)</span>
              </h4>
              <span className="text-xs text-slate-500">Tap cards to reveal answers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeExtraction.flashcards.map((fc, idx) => {
                const isFlipped = flippedCards[idx] || false;
                return (
                  <div
                    key={idx}
                    id={`flashcard-${idx}`}
                    onClick={() => toggleFlipCard(idx)}
                    className="h-48 perspective-1000 cursor-pointer select-none"
                  >
                    <div 
                      className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Front Card */}
                      <div className="absolute inset-0 backface-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-4 rounded-2xl shadow-lg flex flex-col justify-between text-center">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                            Concept {idx + 1}
                          </span>
                          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <p className="text-xs font-bold text-white leading-snug px-1">
                          {fc.front}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          Tap to flip answer
                        </span>
                      </div>

                      {/* Back Card */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-950/90 to-slate-900 border border-purple-500/50 p-4 rounded-2xl shadow-xl flex flex-col justify-between text-center">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          Key Mechanism
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed px-1">
                          {fc.back}
                        </p>
                        <span className="text-[10px] text-purple-300">
                          Tap to flip back
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: Instant Mastery Quiz */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Instant Concept Mastery Check</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer all 3 questions correctly to claim your +30 bonus stars!
                </p>
              </div>

              <button
                id="submit-snapstudy-quiz-btn"
                onClick={handleSubmitQuiz}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 self-start sm:self-auto"
              >
                Submit & Check Answers
              </button>
            </div>

            <div className="space-y-4">
              {activeExtraction.quiz.map((q, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800"
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-200 mb-2.5">
                    Q{idx + 1}. {q.q}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[idx] === optIdx;
                      let optClass = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-cyan-500/40';

                      if (quizSubmitted) {
                        if (optIdx === q.ans) {
                          optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold';
                        } else if (isSelected && optIdx !== q.ans) {
                          optClass = 'bg-rose-950/40 border-rose-500 text-rose-300 line-through';
                        }
                      } else if (isSelected) {
                        optClass = 'bg-cyan-600/20 border-cyan-500 text-cyan-200 font-semibold';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => {
                            if (!quizSubmitted) {
                              setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }));
                            }
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer text-xs border transition ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
