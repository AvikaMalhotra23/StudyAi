import React, { useState, useRef, useEffect } from 'react';
import { StudentUser } from '../types';
import { 
  GraduationCap, 
  Sparkles, 
  Flame, 
  Star, 
  ChevronDown, 
  UserPlus, 
  ShieldCheck, 
  PieChart, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Wand2,
  LogOut,
  Clock
} from 'lucide-react';
import { getSpinCooldown } from '../utils/spinCooldown';
import { getTodayDateStr } from '../utils/streakUtils';

interface NavbarProps {
  currentUser: StudentUser;
  allUsers: StudentUser[];
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSwitchPersona: (userId: string) => void;
  onOpenRegisterModal: () => void;
  onOpenSpinModal: () => void;
  onClaimStreak: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  currentTab,
  onTabChange,
  onSwitchPersona,
  onOpenRegisterModal,
  onOpenSpinModal,
  onClaimStreak,
  onLogout
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'store', label: 'EduBazaar', icon: ShoppingBag },
    { id: 'buddies', label: 'Study Buddies', icon: Users },
    { id: 'doubts', label: 'PeerSolve', icon: MessageSquare },
    { id: 'snapstudy', label: 'SnapStudy AI', icon: Wand2, isSpecial: true }
  ];

  return (
    <>
      {/* Desktop & Mobile Header Bar */}
      <header id="top-navbar" className="sticky top-0 z-40 glass-nav px-3 sm:px-6 lg:px-8 py-2.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Tag */}
          <div 
            id="brand-logo-trigger"
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  EduQuest
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block font-medium">
                CBSE 9-12 • JEE & NEET Ecosystem
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-indigo-600 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.isSpecial ? 'text-cyan-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions (Spin Wheel, Streak, Stars, Persona) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {(() => {
              const spinCooldown = getSpinCooldown(currentUser.last_spin_date);
              return (
                <button
                  id="spin-wheel-trigger-btn"
                  onClick={onOpenSpinModal}
                  title={spinCooldown.canSpin ? "Daily Lucky Spin Ready (1 spin per 24 hrs)" : `Daily Spin Cooldown - Unlocks in ${spinCooldown.formattedRemaining}`}
                  className={`relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
                    spinCooldown.canSpin
                      ? 'bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-700'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500'
                  }`}
                >
                  {spinCooldown.canSpin ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                      <span className="hidden md:inline font-semibold">Lucky Spin</span>
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500"></span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden md:inline font-medium text-slate-600">Spin ({spinCooldown.hours}h)</span>
                    </>
                  )}
                </button>
              );
            })()}

            {/* Streak Counter Pill */}
            {(() => {
              const isCheckedInToday = currentUser.last_login_date === getTodayDateStr();
              return (
                <button
                  id="streak-counter-pill"
                  onClick={() => {
                    onClaimStreak();
                    if (currentTab !== 'dashboard') {
                      onTabChange('dashboard');
                    }
                    setTimeout(() => {
                      const elem = document.getElementById('educational-consistency-streak-card');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 150);
                  }}
                  title={
                    isCheckedInToday 
                      ? `Daily Study Streak: ${currentUser.streak_days} Days (Today active & secured)` 
                      : `Daily Streak: ${currentUser.streak_days} Days - Click to log today's study habit & claim +15 Stars!`
                  }
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer ${
                    isCheckedInToday
                      ? 'bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-xs'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isCheckedInToday ? 'text-rose-500 fire-glow' : 'text-amber-200 fill-amber-200 animate-pulse'}`} />
                  <span>{currentUser.streak_days}d</span>
                  {!isCheckedInToday && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>
              );
            })()}

            {/* Star Wallet Balance */}
            <button
              id="star-wallet-pill"
              onClick={() => onTabChange('store')}
              title="Star Wallet - Click to visit EduBazaar Store"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-bold transition active:scale-95"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 star-glow fill-amber-400" />
              <span className="font-mono">{currentUser.stars}</span>
            </button>

            {/* User Profile & Persona Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-profile-menu-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                />
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Rating: {currentUser.rating_score}</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  id="persona-dropdown-container"
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl p-2.5 z-50 border border-slate-200"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <p className="text-xs font-bold text-slate-800">Judge / Demo Persona Switcher</p>
                    <p className="text-[11px] text-slate-500">
                      Instantly test different classes, targets & rating scores
                    </p>
                  </div>

                  <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                    {allUsers.map((user) => {
                      const isCurrent = user.id === currentUser.id;
                      return (
                        <div
                          key={user.id}
                          id={`persona-select-${user.id}`}
                          onClick={() => {
                            onSwitchPersona(user.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`p-2 rounded-xl cursor-pointer transition flex items-center justify-between ${
                            isCurrent
                              ? 'bg-indigo-50 border border-indigo-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {user.name}{' '}
                                {isCurrent && (
                                  <span className="text-[10px] text-indigo-600 font-medium">
                                    (Active)
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {user.student_class} •{' '}
                                <span className="text-purple-600 font-semibold">
                                  {user.target_exam}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="text-xs font-bold font-mono text-emerald-600">
                              {user.rating_score}
                            </span>
                            <p className="text-[9px] text-slate-400">Rating</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                    <button
                      id="register-student-button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenRegisterModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span>Register New Student Account</span>
                    </button>

                    <button
                      id="logout-button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav px-2 py-2 flex items-center justify-around border-t border-slate-200"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.isSpecial && !isActive ? 'text-cyan-600' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
