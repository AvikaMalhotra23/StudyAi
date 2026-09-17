import React, { useState } from 'react';
import { StudentUser } from '../types';
import { calculateRating } from '../utils/rating';
import { 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  BookOpen, 
  MessageSquare, 
  Bot, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  School, 
  Target, 
  Zap,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { auth, db } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthPageProps {
  allUsers: StudentUser[];
  onLoginSuccess: (user: StudentUser) => void;
  onRegisterSuccess: (newUser: StudentUser) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  allUsers,
  onLoginSuccess,
  onRegisterSuccess,
  showToast
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state - all fields required
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Register form state - all fields required
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [regSchool, setRegSchool] = useState<string>('');
  const [regClass, setRegClass] = useState<string>('Class 12');
  const [regExam, setRegExam] = useState<string>('JEE Advanced 2027');
  const [regStream, setRegStream] = useState<string>('PCM');
  const [regBio, setRegBio] = useState<string>('');
  const [regAgreeTerms, setRegAgreeTerms] = useState<boolean>(false);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail.trim()) {
      showToast('Student Email Address is required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      showToast('Please enter a valid student email address.', 'warning');
      return;
    }

    if (!loginPassword.trim()) {
      showToast('Password is required.', 'error');
      return;
    }

    if (loginPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setIsAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const uid = userCredential.user.uid;

      // Try to find the user in our local allUsers array first
      let foundUser = allUsers.find(u => u.id === uid);
      
      // If not in local state, fetch directly from Firestore
      if (!foundUser) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          foundUser = docSnap.data() as StudentUser;
        } else {
          throw new Error('User profile not found in database.');
        }
      }

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(`Welcome back, ${foundUser.name}! Opening EduQuest...`, 'success');
      onLoginSuccess(foundUser);
    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error.message || 'Failed to sign in. Please check your credentials.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail.trim()) {
      showToast('Please enter your email address first to reset password.', 'warning');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginEmail.trim());
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (error: any) {
      console.error("Reset error:", error);
      showToast(error.message || 'Failed to send reset email.', 'error');
    }
  };

  const handleQuickPersonaLogin = (user: StudentUser) => {
    // Fill credentials and authenticate
    setLoginEmail(user.email);
    setLoginPassword('password123');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(`Signed in as ${user.name} (${user.target_exam})`, 'success');
    onLoginSuccess(user);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict requirement validation for every field
    if (!regName.trim()) {
      showToast('Full Name is required.', 'error');
      return;
    }

    if (!regEmail.trim()) {
      showToast('Student Email Address is required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      showToast('Please enter a valid email address (e.g. name@school.edu).', 'warning');
      return;
    }

    if (!regPassword.trim()) {
      showToast('Password is required.', 'error');
      return;
    }

    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    if (!regConfirmPassword.trim()) {
      showToast('Please confirm your password.', 'error');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match. Please recheck.', 'error');
      return;
    }

    if (!regSchool.trim()) {
      showToast('School or Coaching Institute is required.', 'error');
      return;
    }

    if (!regClass.trim()) {
      showToast('Class selection is required.', 'error');
      return;
    }

    if (!regExam.trim()) {
      showToast('Target Exam Goal is required.', 'error');
      return;
    }

    if (!regStream.trim()) {
      showToast('Academic Stream is required.', 'error');
      return;
    }

    if (!regBio.trim()) {
      showToast('Aspirant Bio & Target AIR is required.', 'error');
      return;
    }

    if (regBio.trim().length < 8) {
      showToast('Aspirant Bio must be at least 8 characters explaining your goal.', 'warning');
      return;
    }

    if (!regAgreeTerms) {
      showToast('You must agree to the Academic Honor Code & Guidelines.', 'error');
      return;
    }

    setIsAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      const uid = userCredential.user.uid;

      const initialRating = calculateRating(0, 0, 0, 0, 0);
      
      const newUser: StudentUser = {
        id: uid,
        name: regName.trim(),
        email: regEmail.trim(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(regName.trim())}&background=random`,
        school: regSchool.trim(),
        student_class: regClass,
        target_exam: regExam,
        stream: regStream,
        stars: 10,
        streak_days: 1,
        last_login_date: new Date().toISOString().split('T')[0],
        last_spin_date: '',
        modules_completed: 0,
        doubts_solved: 0,
        upvotes_received: 0,
        quiz_accuracy_pct: 0,
        rating_score: initialRating,
        bio: regBio.trim()
      };

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      showToast(`Account created! +10 Free Stars credited to ${newUser.name}.`, 'success');
      onRegisterSuccess(newUser);
    } catch (error: any) {
      console.error("Registration error:", error);
      showToast(error.message || 'Failed to create account.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-slate-50 to-sky-50/70 text-slate-800 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Brand, Vision & Ecosystem Features */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          {/* Brand Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  EduQuest
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AICTE Smart Education Ecosystem
              </p>
            </div>
          </div>

          {/* Headline & Description */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Gamified Peer Learning for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                CBSE 9-12, JEE & NEET
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-3 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Earn spendable Stars by completing syllabus modules, resolve peer doubts with bounties, find vetted study partners using a 100-point reliability score, and learn with 24/7 AI assistance.
            </p>
          </div>

          {/* Key Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">EduBazaar Stationery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Redeem OMR sheets, formula charts, and tees using stars.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">100-Pt Partner Rating</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Transparent 5-pillar study partner diligence algorithm.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-200">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">PeerSolve Bounties</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Post tough doubts with star bounties; get peer solutions.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-200">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">24/7 Vidya AI Tutor</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Socratic assistance for derivations, PYQs, and mnemonics.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Authentication Card (Login & Register Tabs) */}
        <div className="lg:col-span-6">
          <div 
            id="auth-card-container"
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative"
          >
            
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
              <button
                id="switch-login-tab-btn"
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Sign In</span>
              </button>

              <button
                id="switch-register-tab-btn"
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Create Account</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                  +10 ⭐
                </span>
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <div className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Welcome Back!</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in to continue your revision streak & access your star wallet.
                  </p>
                </div>

                {/* All fields required indicator */}
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>All fields marked with <span className="text-rose-500 font-bold">*</span> are required.</span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  {/* Email */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Student Email Address <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        id="auth-login-email-input"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. aarav.jee@student.edu"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs transition placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-semibold">
                        Password <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-indigo-600 hover:text-indigo-700 transition font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="auth-login-password-input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password (min. 6 chars)"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs transition placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="remember-me-checkbox" className="text-xs text-slate-600 cursor-pointer select-none">
                      Keep me signed in on this device
                    </label>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      id="sign-in-submit-btn"
                      type="submit"
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <span>Sign In to EduQuest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* 1-Click Fast Judge/Demo Student Login */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Or Instant 1-Click Demo Login:</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        id={`quick-login-${user.id}`}
                        type="button"
                        onClick={() => handleQuickPersonaLogin(user)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition flex items-center gap-2 group cursor-pointer"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {user.name.split(' ')[0]}
                          </p>
                          <p className="text-[9px] text-slate-500 truncate">
                            {user.student_class} • {user.target_exam.split(' ')[0]}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Create student profile
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* REGISTRATION FORM */}
            {authMode === 'register' && (
              <div className="space-y-3.5">
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Create Student Account</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      ⭐ +10 Free Stars
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Match with top aspirants and receive 10 Free Stars on new registration!
                  </p>
                </div>

                {/* All fields required indicator */}
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>All fields marked with <span className="text-rose-500 font-bold">*</span> are required.</span>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Full Name <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          id="auth-reg-name-input"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Divya Nair"
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Student Email <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          id="auth-reg-email-input"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. divya@student.edu"
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Password (min 6 chars) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          id="auth-reg-password-input"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Confirm Password <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          id="auth-reg-confirm-password-input"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* School / Coaching */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      School / Coaching Institute <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <School className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        id="auth-reg-school-input"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="e.g. Delhi Public School, R.K. Puram / FIITJEE"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Class, Stream & Target Exam (3-column layout) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Class / Standard <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        id="auth-reg-class-select"
                        required
                        value={regClass}
                        onChange={(e) => setRegClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                      >
                        <option value="Class 12">Class 12</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 10">Class 10 (Foundation)</option>
                        <option value="Class 9">Class 9 (Foundation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Academic Stream <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        id="auth-reg-stream-select"
                        required
                        value={regStream}
                        onChange={(e) => setRegStream(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                      >
                        <option value="PCM">PCM (Physics, Chem, Math)</option>
                        <option value="PCB">PCB (Physics, Chem, Bio)</option>
                        <option value="PCMB">PCMB (Both Math & Bio)</option>
                        <option value="Commerce + Math">Commerce with Math</option>
                        <option value="General Science">General Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Target Exam <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        id="auth-reg-exam-select"
                        required
                        value={regExam}
                        onChange={(e) => setRegExam(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                      >
                        <option value="JEE Advanced 2027">JEE Advanced</option>
                        <option value="JEE Main 2027">JEE Main</option>
                        <option value="NEET-UG 2027">NEET-UG</option>
                        <option value="CBSE 12th Board">CBSE 12th Board</option>
                        <option value="CBSE 10th Board">CBSE 10th Board</option>
                      </select>
                    </div>
                  </div>

                  {/* Study Goal & Bio */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Aspirant Bio & Target AIR <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      minLength={8}
                      id="auth-reg-bio-input"
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="e.g. Aiming for Top 100 AIR in JEE Advanced & 98% in CBSE Board examinations"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  {/* Honor Code & Agreement (Required) */}
                  <div className="flex items-start gap-2 pt-1 pb-1">
                    <input
                      type="checkbox"
                      id="auth-reg-terms-checkbox"
                      required
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="auth-reg-terms-checkbox" className="text-[11px] text-slate-600 cursor-pointer select-none leading-tight">
                      I agree to the <strong className="text-indigo-600 font-semibold">Academic Honor Code</strong>, Peer Community Guidelines, and Anti-Cheating Policy <span className="text-rose-500 font-bold">*</span>
                    </label>
                  </div>

                  {/* Register Submit Button */}
                  <div className="pt-2">
                    <button
                      id="register-submit-btn"
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Create Account & Claim 10 Free Stars</span>
                    </button>
                  </div>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
