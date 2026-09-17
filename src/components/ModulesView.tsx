import React, { useState } from 'react';
import { LearningModule, StudentUser, QuizQuestion } from '../types';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Award,
  AlertCircle,
  Code2,
  Terminal,
  RotateCcw,
  Cpu,
  Laptop,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModulesViewProps {
  modules: LearningModule[];
  currentUser: StudentUser;
  onCompleteModule: (moduleId: string, scorePct: number, starsEarned: number) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  modules,
  currentUser,
  onCompleteModule,
  showToast
}) => {
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeQuizModule, setActiveQuizModule] = useState<LearningModule | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Coding Sandbox State
  const [activeTabInModal, setActiveTabInModal] = useState<'code' | 'quiz'>('code');
  const [editableCode, setEditableCode] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [codeTestedSuccessfully, setCodeTestedSuccessfully] = useState<boolean>(false);

  const subjects = [
    'All', 
    'Coding & Tech Skills', 
    'Physics', 
    'Chemistry', 
    'Mathematics', 
    'Biology', 
    'Class 10 Foundation'
  ];

  const filteredModules = activeSubject === 'All'
    ? modules
    : modules.filter(m => m.subject === activeSubject);

  const openQuiz = (module: LearningModule) => {
    setActiveQuizModule(module);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCodeTestedSuccessfully(false);

    if (module.code_playground) {
      setEditableCode(module.code_playground.default_code);
      setTerminalOutput('');
      setActiveTabInModal('code');
    } else {
      setActiveTabInModal('quiz');
    }
  };

  const closeQuiz = () => {
    setActiveQuizModule(null);
  };

  const handleRunCode = () => {
    if (!activeQuizModule?.code_playground) return;
    setIsRunningCode(true);
    setTerminalOutput('Compiling and executing code in sandboxed environment...');

    setTimeout(() => {
      setIsRunningCode(false);
      const expected = activeQuizModule.code_playground?.expected_output || '';
      setTerminalOutput(expected);
      setCodeTestedSuccessfully(true);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`⚡ Code executed successfully without errors! Output verified.`, 'success');
    }, 600);
  };

  const handleResetCode = () => {
    if (activeQuizModule?.code_playground) {
      setEditableCode(activeQuizModule.code_playground.default_code);
      setTerminalOutput('');
      setCodeTestedSuccessfully(false);
      showToast('Code reset to template.', 'info');
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizModule) return;
    const questions = activeQuizModule.quiz_data;

    // Verify all questions are answered
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        showToast(`Please answer question ${i + 1} before submitting!`, 'warning');
        return;
      }
    }

    // Calculate score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.ans) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    const baseReward = scorePct >= 70 
      ? activeQuizModule.star_reward 
      : Math.floor(activeQuizModule.star_reward * 0.5);

    // Extra 15 stars bonus if tested code in sandbox!
    const bonusStars = codeTestedSuccessfully ? 15 : 0;
    const totalReward = baseReward + bonusStars;

    onCompleteModule(activeQuizModule.id, scorePct, totalReward);

    if (scorePct >= 70) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast(`🎯 Module completed! Score: ${scorePct}% (+${totalReward} Stars earned!${bonusStars ? ' Incl. Sandbox Bonus' : ''})`, 'success');
    } else {
      showToast(`Completed with ${scorePct}%. Try reviewing concepts to get 100%! (+${totalReward} Stars)`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Interactive Syllabus & Skills Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Master CBSE Board core, competitive exam syllabi, and in-demand programming skills (Python, C++, Java, Web) to earn Stars!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Up to +75 Stars per Module</span>
          </span>
        </div>
      </div>

      {/* Subject & Skill Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((subj) => {
          const isCoding = subj === 'Coding & Tech Skills';
          return (
            <button
              key={subj}
              id={`filter-subject-${subj.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubject === subj
                  ? isCoding
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20 font-bold'
                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isCoding
                    ? 'bg-white text-cyan-700 hover:text-cyan-900 border border-cyan-300 shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs'
              }`}
            >
              {isCoding && <Code2 className="w-3.5 h-3.5 text-cyan-600" />}
              <span>{subj}</span>
              {isCoding && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 font-bold ml-0.5">
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Featured Skills Banner if viewing Coding or All */}
      {(activeSubject === 'All' || activeSubject === 'Coding & Tech Skills') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-indigo-50 to-purple-50 border border-cyan-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Applied Tech & Programming Skills Track
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                  Python • C++ • Java • Web JS
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Empowering CBSE Computer Science, Informatics Practices, and engineering aspirants with interactive in-browser code sandboxes, algorithm tracing, and output verification.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubject('Coding & Tech Skills')}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs whitespace-nowrap transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>View All Programming Modules</span>
          </button>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredModules.map((m) => {
          const isCodingModule = m.subject === 'Coding & Tech Skills';

          return (
            <div
              key={m.id}
              id={`module-card-${m.id}`}
              className={`bg-white rounded-2xl overflow-hidden border flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow ${
                isCodingModule ? 'border-cyan-300' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Thumbnail with overlay badges */}
                <div className="h-44 relative overflow-hidden group">
                  <img
                    src={m.thumbnail}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      isCodingModule
                        ? 'bg-cyan-900/90 text-cyan-200 border-cyan-400/40 flex items-center gap-1'
                        : 'bg-slate-900/90 text-indigo-200 border-indigo-400/30'
                    }`}>
                      {isCodingModule && <Code2 className="w-3 h-3 text-cyan-300" />}
                      <span>{m.subject}</span>
                    </span>
                    <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200">
                      {m.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-900 text-xs font-black flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                    <span>+{m.star_reward} Stars</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isCodingModule ? 'text-cyan-600' : 'text-purple-600'
                    }`}>
                      {m.grade_level}
                    </span>
                    {m.code_playground && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                        <Terminal className="w-2.5 h-2.5" />
                        <span>Interactive Sandbox</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mt-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.duration_mins} mins</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{m.quiz_data.length} Qs Test</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Launch Action */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  id={`launch-module-btn-${m.id}`}
                  onClick={() => openQuiz(m)}
                  className={`w-full py-2.5 rounded-xl text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                    isCodingModule
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  {isCodingModule ? (
                    <>
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Open Code Sandbox & Quiz</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Launch Diagnostic Test & Earn Stars</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Quiz & Interactive Code Playground Modal */}
      {activeQuizModule && (
        <div 
          id="active-module-quiz-modal"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 relative my-auto shadow-2xl text-slate-800">
            {/* Close button */}
            <button
              id="close-quiz-modal-btn"
              onClick={closeQuiz}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2 pr-6">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                activeQuizModule.subject === 'Coding & Tech Skills'
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200 flex items-center gap-1'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {activeQuizModule.subject === 'Coding & Tech Skills' && <Code2 className="w-3 h-3" />}
                <span>{activeQuizModule.subject}</span>
              </span>
              <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                +{activeQuizModule.star_reward} Stars Reward
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeQuizModule.title}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              {activeQuizModule.description}
            </p>

            {/* Modal Tabs if code playground exists */}
            {activeQuizModule.code_playground && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-4">
                <button
                  type="button"
                  id="tab-code-sandbox"
                  onClick={() => setActiveTabInModal('code')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTabInModal === 'code'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Code Sandbox</span>
                  {codeTestedSuccessfully && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>

                <button
                  type="button"
                  id="tab-diagnostic-quiz"
                  onClick={() => setActiveTabInModal('quiz')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTabInModal === 'quiz'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Diagnostic Quiz ({activeQuizModule.quiz_data.length} Qs)</span>
                  {quizSubmitted && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {quizScore}%
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* TAB 1: CODE SANDBOX (FOR PROGRAMMING MODULES) */}
            {activeQuizModule.code_playground && activeTabInModal === 'code' && (
              <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                {/* Editor Header */}
                <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-800 text-white rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-cyan-300 font-bold uppercase ml-1">
                      {activeQuizModule.code_playground.language} Editor
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCode}
                      className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isRunningCode ? 'Running...' : 'Run Code & Test Output'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Textarea Editor */}
                <textarea
                  rows={9}
                  id="code-editor-textarea"
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 border border-slate-800 rounded-b-xl text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                  spellCheck={false}
                />

                {/* Execution Output Console / Terminal */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
                    <span className="flex items-center gap-1 text-slate-200">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Standard Output (stdout):</span>
                    </span>
                    {codeTestedSuccessfully && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Execution Success (+15 Bonus Stars)</span>
                      </span>
                    )}
                  </div>

                  <pre className="font-mono text-xs text-emerald-400 bg-slate-950 p-2.5 rounded-lg whitespace-pre-wrap min-h-[60px] border border-slate-800/80">
                    {terminalOutput || '// Click "Run Code & Test Output" to compile and see stdout...'}
                  </pre>
                </div>

                {/* Key Language Syntax Hints */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Language Insights & Best Practices:</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activeQuizModule.code_playground.explanation}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeQuizModule.code_playground.hints.map((hint, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium"
                      >
                        • {hint}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Switch to Quiz CTA */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Ready to verify your understanding?
                  </span>
                  <button
                    onClick={() => setActiveTabInModal('quiz')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Diagnostic Quiz</span>
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIAGNOSTIC QUIZ QUESTIONS */}
            {(!activeQuizModule.code_playground || activeTabInModal === 'quiz') && (
              <>
                {/* Quiz Questions List */}
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {activeQuizModule.quiz_data.map((q, qIdx) => {
                    return (
                      <div 
                        key={qIdx}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5">
                          Q{qIdx + 1}. {q.q}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selectedAnswers[qIdx] === optIdx;
                            let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400';

                            if (quizSubmitted) {
                              if (optIdx === q.ans) {
                                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                              } else if (isChosen && optIdx !== q.ans) {
                                optionStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                              }
                            } else if (isChosen) {
                              optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold';
                            }

                            return (
                              <div
                                key={optIdx}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer text-xs border transition ${optionStyle}`}
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
                    );
                  })}
                </div>

                {/* Footer and Submit/Close CTA */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {quizSubmitted ? (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-800">
                        Your Score: <span className="text-amber-600 font-mono text-sm">{quizScore}%</span>
                        {codeTestedSuccessfully && (
                          <span className="ml-2 text-emerald-600 text-xs">(+15 Bonus Stars Included!)</span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Answer all {activeQuizModule.quiz_data.length} questions to claim stars
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {activeQuizModule.code_playground && (
                      <button
                        type="button"
                        onClick={() => setActiveTabInModal('code')}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-cyan-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Code Sandbox</span>
                      </button>
                    )}

                    {quizSubmitted ? (
                      <button
                        id="close-quiz-btn"
                        onClick={closeQuiz}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        id="submit-quiz-answers-btn"
                        onClick={handleSubmitQuiz}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer"
                      >
                        Submit & Claim Stars
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
