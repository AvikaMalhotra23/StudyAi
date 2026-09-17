import React, { useState } from 'react';
import { Doubt, DoubtAnswer, StudentUser } from '../types';
import { 
  MessageSquare, 
  PlusCircle, 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  X, 
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PeerSolveViewProps {
  doubts: Doubt[];
  currentUser: StudentUser;
  onPostDoubt: (newDoubt: Doubt) => void;
  onPostAnswer: (doubtId: string, answerText: string) => void;
  onAcceptAnswer: (doubtId: string, answerId: string, bountyStars: number) => void;
  onUpvoteDoubt: (doubtId: string) => void;
  onUpvoteAnswer: (doubtId: string, answerId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PeerSolveView: React.FC<PeerSolveViewProps> = ({
  doubts,
  currentUser,
  onPostDoubt,
  onPostAnswer,
  onAcceptAnswer,
  onUpvoteDoubt,
  onUpvoteAnswer,
  showToast
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedDoubts, setExpandedDoubts] = useState<Record<string, boolean>>({});
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [showAskModal, setShowAskModal] = useState<boolean>(false);

  // New doubt form fields
  const [doubtSubject, setDoubtSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Class 10 Foundation'>('Physics');
  const [doubtTitle, setDoubtTitle] = useState<string>('');
  const [doubtDesc, setDoubtDesc] = useState<string>('');
  const [doubtBounty, setDoubtBounty] = useState<number>(25);

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Class 10 Foundation'];

  const filteredDoubts = doubts.filter((d) => {
    const matchesSubject = selectedSubject === 'All' || d.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    return matchesSubject && matchesStatus;
  });

  const toggleExpand = (doubtId: string) => {
    setExpandedDoubts(prev => ({
      ...prev,
      [doubtId]: !prev[doubtId]
    }));
  };

  const handleAnswerSubmit = (doubtId: string) => {
    const text = (answerInputs[doubtId] || '').trim();
    if (!text) {
      showToast('Please type an answer before submitting.', 'warning');
      return;
    }

    onPostAnswer(doubtId, text);
    setAnswerInputs(prev => ({ ...prev, [doubtId]: '' }));
    
    // Auto expand thread
    setExpandedDoubts(prev => ({ ...prev, [doubtId]: true }));
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast('Answer posted! +5 Stars credited for helping a peer!', 'success');
  };

  const handleAcceptBest = (doubtId: string, answerId: string, bounty: number) => {
    onAcceptAnswer(doubtId, answerId, bounty);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(`🏆 Solution accepted! ⭐ ${bounty} Stars transferred to peer solver!`, 'success');
  };

  const handleAskDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtTitle.trim() || !doubtDesc.trim()) {
      showToast('Please enter both title and description.', 'warning');
      return;
    }

    if (currentUser.stars < doubtBounty) {
      showToast(`You have ${currentUser.stars} stars, but this bounty requires ${doubtBounty} stars.`, 'warning');
      return;
    }

    const newDoubt: Doubt = {
      id: `dbt_${Math.random().toString(36).substring(2, 9)}`,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_class: currentUser.student_class,
      author_exam: currentUser.target_exam,
      author_rating: currentUser.rating_score,
      title: doubtTitle.trim(),
      description: doubtDesc.trim(),
      subject: doubtSubject,
      bounty_stars: doubtBounty,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'open',
      upvotes: 0,
      answers: []
    };

    onPostDoubt(newDoubt);
    setShowAskModal(false);
    setDoubtTitle('');
    setDoubtDesc('');

    showToast(`Doubt posted with ⭐ ${doubtBounty} Star Bounty locked! Peers notified.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Ask Doubt CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            PeerSolve: Collaborative Doubt Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ask doubts with Star Bounties; post verified answers to win peer bounties and boost your rating!
          </p>
        </div>

        <button
          id="ask-doubt-trigger-btn"
          onClick={() => setShowAskModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask Doubt with Bounty</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subjects.map((sub) => (
            <button
              key={sub}
              id={`doubt-subj-btn-${sub.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 self-end md:self-auto">
          <span>Status:</span>
          <select
            id="filter-doubt-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Doubts</option>
            <option value="open">Open (Bounties Active)</option>
            <option value="solved">Solved</option>
          </select>
        </div>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">No doubts found matching this filter. Be the first to ask!</p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => {
            const isAuthor = currentUser.id === doubt.author_id;
            const isSolved = doubt.status === 'solved';
            const isExpanded = expandedDoubts[doubt.id] || false;

            return (
              <div
                key={doubt.id}
                id={`doubt-card-${doubt.id}`}
                className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 transition"
              >
                {/* Doubt Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doubt.author_avatar}
                      alt={doubt.author_name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {doubt.author_name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
                          Rating: {doubt.author_rating}/100
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {doubt.created_at} •{' '}
                        <span className="text-indigo-300 font-medium">
                          {doubt.subject}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Bounty / Solved Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        isSolved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isSolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Solved</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 star-glow" />
                          <span>⭐ {doubt.bounty_stars} Stars Bounty</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Question Details */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {doubt.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                    {doubt.description}
                  </p>
                </div>

                {/* Bottom Bar: Upvote & Toggle Answers */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      id={`upvote-doubt-btn-${doubt.id}`}
                      onClick={() => onUpvoteDoubt(doubt.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition active:scale-95"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Upvote ({doubt.upvotes})</span>
                    </button>
                    <span className="text-slate-500 text-xs">
                      {doubt.answers.length} Answers
                    </span>
                  </div>

                  <button
                    id={`toggle-answers-btn-${doubt.id}`}
                    onClick={() => toggleExpand(doubt.id)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>{isExpanded ? 'Hide Discussion' : 'View / Answer'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Expandable Answers Section */}
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    
                    {/* Answers Stream */}
                    <div className="space-y-2.5">
                      {doubt.answers.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2">
                          No solutions posted yet. Be the first to explain and earn stars!
                        </p>
                      ) : (
                        doubt.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-xl space-y-2 transition ${
                              ans.is_accepted
                                ? 'bg-emerald-950/20 border border-emerald-500/40'
                                : 'bg-slate-900/90 border border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={ans.author_avatar}
                                  alt={ans.author_name}
                                  className="w-6 h-6 rounded-lg object-cover"
                                />
                                <span className="text-xs font-bold text-white">
                                  {ans.author_name}
                                </span>
                                <span className="text-[9px] text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  {ans.author_rating}/100
                                </span>
                                {ans.is_accepted && (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Accepted Solution</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                {ans.created_at}
                              </span>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                              {ans.content}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-xs">
                              <button
                                onClick={() => onUpvoteAnswer(doubt.id, ans.id)}
                                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] transition"
                              >
                                <ThumbsUp className="w-3 h-3 text-indigo-400" />
                                <span>Upvote ({ans.upvotes})</span>
                              </button>

                              {isAuthor && !isSolved && (
                                <button
                                  id={`accept-answer-btn-${ans.id}`}
                                  onClick={() => handleAcceptBest(doubt.id, ans.id, doubt.bounty_stars)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow active:scale-95"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Accept & Award ⭐ {doubt.bounty_stars} Stars</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Inline Answer Form */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Write a verified peer solution</span>
                        <span className="text-[10px] text-amber-400 font-normal">
                          (Earns +5 Stars immediately)
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          id={`answer-input-${doubt.id}`}
                          value={answerInputs[doubt.id] || ''}
                          onChange={(e) => setAnswerInputs({ ...answerInputs, [doubt.id]: e.target.value })}
                          placeholder="Provide clear formula steps, NCERT reference, or derivation..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          id={`submit-answer-btn-${doubt.id}`}
                          onClick={() => handleAnswerSubmit(doubt.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Ask Doubt Modal */}
      {showAskModal && (
        <div 
          id="ask-doubt-modal-container"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-indigo-500/40 p-5 sm:p-6 relative my-auto shadow-2xl">
            <button
              id="close-ask-doubt-modal"
              onClick={() => setShowAskModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>Ask a Doubt to Peers</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Incentivize high-quality answers by attaching a Star Bounty from your wallet!
            </p>

            <form onSubmit={handleAskDoubtSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Subject
                </label>
                <select
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs"
                >
                  <option value="Physics">Physics (Mechanics, Electrodynamics, Optics)</option>
                  <option value="Chemistry">Chemistry (Organic, Inorganic, Physical)</option>
                  <option value="Mathematics">Mathematics (Calculus, Algebra, Vectors)</option>
                  <option value="Biology">Biology (Genetics, Physiology, Ecology)</option>
                  <option value="Class 10 Foundation">Class 10 Foundation (Science & Maths)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Doubt Title / Question
                </label>
                <input
                  type="text"
                  required
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                  placeholder="e.g. Condition for pure rolling of cylinder on accelerating truck"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Detailed Explanation & What You've Tried
                </label>
                <textarea
                  rows={4}
                  required
                  value={doubtDesc}
                  onChange={(e) => setDoubtDesc(e.target.value)}
                  placeholder="Provide formula steps, Free Body Diagram equations, or NCERT page references..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Star Bounty (Awarded to Accepted Solver)
                </label>
                <select
                  value={doubtBounty}
                  onChange={(e) => setDoubtBounty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-indigo-500 text-xs"
                >
                  <option value={15}>⭐ 15 Stars</option>
                  <option value={25}>⭐ 25 Stars (Standard Bounty)</option>
                  <option value={50}>⭐ 50 Stars (Tricky JEE/NEET Question)</option>
                  <option value={100}>⭐ 100 Stars (Mega Challenge)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  id="confirm-post-doubt-btn"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Post Doubt & Lock {doubtBounty} Star Bounty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
