import React, { useState } from 'react';
import { StudentUser } from '../types';
import { getRatingBadge } from '../utils/rating';
import { StudyWorkspaceModal } from './StudyWorkspaceModal';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Send, 
  Check, 
  Award, 
  GraduationCap,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface BuddiesViewProps {
  allUsers: StudentUser[];
  currentUser: StudentUser;
  onSendInvite: (userId: string) => void;
  onAcceptInvite: (userId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const BuddiesView: React.FC<BuddiesViewProps> = ({
  allUsers,
  currentUser,
  onSendInvite,
  onAcceptInvite,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [invitedBuddies, setInvitedBuddies] = useState<Record<string, boolean>>({});
  const [activeWorkspaceBuddy, setActiveWorkspaceBuddy] = useState<StudentUser | null>(null);

  const examOptions = ['All', 'JEE', 'NEET', 'CBSE 12th', 'Foundation'];

  // Identify users who have invited the current user
  const incomingInvites = allUsers.filter(b => currentUser.study_invites?.includes(b.id));
  
  // Identify active study buddies
  const activeBuddies = allUsers.filter(b => currentUser.accepted_buddies?.includes(b.id));

  const filteredBuddies = allUsers.filter((b) => {
    // Exclude users who are already active buddies or the current user from the discover list
    if (currentUser.accepted_buddies?.includes(b.id) || b.id === currentUser.id) return false;

    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      b.name.toLowerCase().includes(query) ||
      b.school.toLowerCase().includes(query) ||
      b.student_class.toLowerCase().includes(query) ||
      b.target_exam.toLowerCase().includes(query) ||
      b.bio.toLowerCase().includes(query);

    const matchesExam = 
      selectedExam === 'All'
        ? true
        : b.target_exam.toLowerCase().includes(selectedExam.toLowerCase()) ||
          b.student_class.toLowerCase().includes(selectedExam.toLowerCase());

    return matchesQuery && matchesExam;
  });

  const handleSendInviteLocal = (buddy: StudentUser) => {
    setInvitedBuddies(prev => ({
      ...prev,
      [buddy.id]: true
    }));
    onSendInvite(buddy.id);
  };

  return (
    <div className="space-y-6">
      
      {activeWorkspaceBuddy && (
        <StudyWorkspaceModal 
          currentUser={currentUser} 
          buddy={activeWorkspaceBuddy} 
          onClose={() => setActiveWorkspaceBuddy(null)} 
        />
      )}

      {/* Incoming Invitations Banner */}
      {incomingInvites.length > 0 && (
        <div className="mb-8 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Incoming Study Session Invitations ({incomingInvites.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingInvites.map(inviter => (
              <div key={`invite-${inviter.id}`} className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg shadow-emerald-900/10">
                <div className="flex items-center gap-3">
                  <img src={inviter.avatar} alt={inviter.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-emerald-500/50" />
                  <div>
                    <p className="text-xs font-bold text-white">{inviter.name}</p>
                    <p className="text-[10px] text-emerald-300 font-medium">{inviter.target_exam}</p>
                  </div>
                </div>
                <button
                  onClick={() => onAcceptInvite(inviter.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-[11px] font-bold rounded-lg transition active:scale-95"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Study Buddies */}
      {activeBuddies.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            My Active Study Groups ({activeBuddies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBuddies.map(buddy => (
              <div key={`active-${buddy.id}`} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {buddy.name}
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] uppercase font-bold tracking-wider">
                        Connected
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{buddy.school}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveWorkspaceBuddy(buddy)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-900/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Open Workspace
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Study Buddy Compatibility Matcher
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose trusted study partners based on their transparent 100-point diligence & reliability score
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-buddies-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, school, exam..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Exam Goal Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {examOptions.map((exam) => (
          <button
            key={exam}
            id={`filter-exam-${exam.toLowerCase()}`}
            onClick={() => setSelectedExam(exam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedExam === exam
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {exam === 'All' ? 'All Aspirants' : exam}
          </button>
        ))}
      </div>

      {/* Buddies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuddies.map((buddy) => {
          const isMe = buddy.id === currentUser.id;
          const badge = getRatingBadge(buddy.rating_score);
          const isInvited = invitedBuddies[buddy.id] || buddy.study_invites?.includes(currentUser.id);

          return (
            <div
              key={buddy.id}
              id={`buddy-card-${buddy.id}`}
              className={`glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between ${
                isMe ? 'ring-1 ring-indigo-500/50' : ''
              }`}
            >
              <div>
                {/* Top: Avatar, Name, School & Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700"
                      />
                      <span 
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"
                        title="Online"
                      ></span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                        <span>{buddy.name}</span>
                        {isMe && (
                          <span className="text-[10px] text-indigo-400 font-normal">
                            (You)
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {buddy.school}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                          {buddy.student_class}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 truncate">
                          {buddy.target_exam}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-sm font-black font-mono text-emerald-400">
                        {buddy.rating_score}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${badge.bgBadge} ${badge.textBadge} ${badge.borderBadge}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 mt-3.5 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 line-clamp-2 leading-relaxed">
                  "{buddy.bio}"
                </p>

                {/* 4 Pillars Quick Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-medium">Modules</p>
                    <p className="text-xs font-bold text-indigo-400 font-mono mt-0.5">
                      {buddy.modules_completed}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-medium">Doubts</p>
                    <p className="text-xs font-bold text-cyan-400 font-mono mt-0.5">
                      {buddy.doubts_solved}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-medium">Streak</p>
                    <p className="text-xs font-bold text-rose-400 font-mono mt-0.5">
                      {buddy.streak_days}d
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-medium">Accuracy</p>
                    <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                      {Math.round(buddy.quiz_accuracy_pct)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {isMe ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-800/60 text-slate-500 text-xs font-semibold cursor-not-allowed"
                  >
                    Your Profile
                  </button>
                ) : (
                  <button
                    id={`invite-buddy-btn-${buddy.id}`}
                    onClick={() => handleSendInviteLocal(buddy)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                      isInvited
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Invite Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Invite to Study Session</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
