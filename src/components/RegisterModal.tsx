import React, { useState } from 'react';
import { StudentUser } from '../types';
import { calculateRating } from '../utils/rating';
import { UserPlus, X, Star, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterUser: (newUser: StudentUser) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterUser,
  showToast
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('Class 12');
  const [targetExam, setTargetExam] = useState<string>('JEE Advanced 2027');
  const [stream, setStream] = useState<string>('PCM');
  const [bio, setBio] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Full Name is required.', 'error');
      return;
    }

    if (!email.trim()) {
      showToast('Student Email is required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('Please enter a valid student email address.', 'warning');
      return;
    }

    if (!password.trim() || password.length < 6) {
      showToast('Password is required and must be at least 6 characters.', 'error');
      return;
    }

    if (!school.trim()) {
      showToast('School or Coaching Institute is required.', 'error');
      return;
    }

    if (!bio.trim() || bio.trim().length < 8) {
      showToast('Study Goal & Target AIR is required (min 8 characters).', 'warning');
      return;
    }

    if (!agreeTerms) {
      showToast('You must agree to the Academic Guidelines.', 'error');
      return;
    }

    const initialRating = calculateRating(2, 1, 1, 3, 85);
    const newUser: StudentUser = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      school: school.trim(),
      student_class: studentClass,
      target_exam: targetExam,
      stream: stream,
      stars: 10, // 10 Free Registration Stars!
      streak_days: 1,
      last_login_date: new Date().toISOString().split('T')[0],
      last_spin_date: '',
      modules_completed: 2,
      doubts_solved: 1,
      upvotes_received: 3,
      quiz_accuracy_pct: 85,
      rating_score: initialRating,
      bio: bio.trim()
    };

    onRegisterUser(newUser);
    onClose();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Welcome ${newUser.name}! +10 Free Registration Stars credited & Partner Rating: ${initialRating}/100`, 'success');
  };

  return (
    <div 
      id="register-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 relative my-auto shadow-2xl text-slate-800">
        <button
          id="close-register-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Register Student Profile
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Select your class and target exam to receive verified study buddy matches & +10 free welcome stars!
        </p>

        {/* Required notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>All fields marked with <span className="text-rose-500 font-bold">*</span> are required.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Full Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              id="student-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Divya Nair"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Student Email <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="email"
                required
                id="student-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. divya.n@student.edu"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Password <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                id="student-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              School / Coaching Institute <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              id="student-school-input"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Delhi Public School, R.K. Puram"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Class <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="student-class-select"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="Class 12">Class 12</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Stream <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="student-stream-select"
                required
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="PCM">PCM</option>
                <option value="PCB">PCB</option>
                <option value="PCMB">PCMB</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Exam <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="student-target-exam-select"
                required
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="JEE Advanced 2027">JEE Adv</option>
                <option value="JEE Main 2027">JEE Main</option>
                <option value="NEET-UG 2027">NEET-UG</option>
                <option value="CBSE 12th Board">12th Board</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Study Goal & Target AIR <span className="text-rose-500 font-bold">*</span>
            </label>
            <textarea
              rows={2}
              required
              minLength={8}
              id="student-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Aiming for top 100 AIR in JEE Advanced & 98% in CBSE"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-400"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="student-terms-checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="student-terms-checkbox" className="text-[11px] text-slate-600 cursor-pointer select-none">
              I agree to the Honor Code & Peer Community Guidelines <span className="text-rose-500 font-bold">*</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="submit-register-btn"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Create Profile & Claim 10 Free Stars</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
