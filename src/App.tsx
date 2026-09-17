import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs 
} from 'firebase/firestore';
import { db } from './utils/firebase';
import { 
  StudentUser, 
  LearningModule, 
  StoreItem, 
  StoreOrder, 
  Doubt, 
  DoubtAnswer 
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_MODULES, 
  INITIAL_STORE_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_DOUBTS 
} from './data/initialData';
import { calculateRating } from './utils/rating';
import { getSpinCooldown } from './utils/spinCooldown';
import { evaluateLoginStreak } from './utils/streakUtils';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ModulesView } from './components/ModulesView';
import { StoreView } from './components/StoreView';
import { BuddiesView } from './components/BuddiesView';
import { PeerSolveView } from './components/PeerSolveView';
import { SnapStudyView } from './components/SnapStudyView';
import { SpinWheelModal } from './components/SpinWheelModal';
import { VidyaAITutor } from './components/VidyaAITutor';
import { RegisterModal } from './components/RegisterModal';
import { AuthPage } from './components/AuthPage';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('eduquest_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [allUsers, setAllUsers] = useState<StudentUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    try {
      const savedUserId = localStorage.getItem('eduquest_user_id');
      const savedUserData = localStorage.getItem(`eduquest_user_${savedUserId || INITIAL_USERS[0].id}`);
      if (savedUserData) {
        return JSON.parse(savedUserData);
      }
      const found = INITIAL_USERS.find(u => u.id === savedUserId);
      return found || INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  const [modules, setModules] = useState<LearningModule[]>(INITIAL_MODULES);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);
  const [orders, setOrders] = useState<StoreOrder[]>(INITIAL_ORDERS);
  const [doubts, setDoubts] = useState<Doubt[]>(INITIAL_DOUBTS);
  const [activeDocumentContext, setActiveDocumentContext] = useState<string>('');

  useEffect(() => {
    // 1. Listen to Firebase users collection
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const usersData = snapshot.docs.map(doc => doc.data() as StudentUser);
        setAllUsers(usersData);

        const savedUserId = localStorage.getItem('eduquest_user_id');
        if (savedUserId) {
          const updatedCurrent = usersData.find(u => u.id === savedUserId);
          if (updatedCurrent) {
            setCurrentUser(updatedCurrent);
          }
        }
      } else {
        INITIAL_USERS.forEach(user => {
          setDoc(doc(db, 'users', user.id), user).catch(console.error);
          localStorage.setItem(`eduquest_user_${user.id}`, JSON.stringify(user));
        });
      }
    });

    // 2. Listen to Firebase doubts collection
    const unsubDoubts = onSnapshot(collection(db, 'doubts'), (snapshot) => {
      if (!snapshot.empty) {
        const doubtsData = snapshot.docs.map(doc => doc.data() as Doubt);
        setDoubts(doubtsData);
      }
    });

    // 3. Listen to Firebase orders collection
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) {
        const ordersData = snapshot.docs.map(doc => doc.data() as StoreOrder);
        setOrders(ordersData);
      }
    });

    return () => {
      unsubUsers();
      unsubDoubts();
      unsubOrders();
    };
  }, []);

  const [isSpinModalOpen, setIsSpinModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: StudentUser) => {
    // Evaluate per-day login streak
    const streakResult = evaluateLoginStreak(user);
    const activeUser = streakResult.updatedUser;

    setCurrentUser(activeUser);
    setAllUsers(prev => prev.map(u => u.id === activeUser.id ? activeUser : u));
    setIsAuthenticated(true);
    try {
      localStorage.setItem('eduquest_auth', 'true');
      localStorage.setItem('eduquest_user_id', activeUser.id);
      setDoc(doc(db, 'users', activeUser.id), activeUser).catch(console.error); localStorage.setItem(`eduquest_user_${activeUser.id}`, JSON.stringify(activeUser));
    } catch {
      // ignore
    }

    if (streakResult.isNewDay) {
      setTimeout(() => {
        showToast(streakResult.message, 'success');
      }, 600);
    }
  };

  const handleRegisterSuccess = (newUser: StudentUser) => {
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    localStorage.setItem("eduquest_user_id", newUser.id);
    localStorage.setItem("eduquest_auth", "true");
    setIsAuthenticated(true);
    try {
      localStorage.setItem('eduquest_auth', 'true');
      localStorage.setItem('eduquest_user_id', newUser.id);
      setDoc(doc(db, 'users', newUser.id), newUser).catch(console.error); localStorage.setItem(`eduquest_user_${newUser.id}`, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('eduquest_auth');
      localStorage.removeItem('eduquest_user_id');
    } catch {
      // ignore
    }
    showToast('Logged out successfully. You can sign in anytime!', 'info');
  };

  const handleSwitchPersona = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      // Check streak for this persona if logging in today
      const streakResult = evaluateLoginStreak(user);
      const activeUser = streakResult.updatedUser;
      setCurrentUser(activeUser);
      setAllUsers(prev => prev.map(u => u.id === activeUser.id ? activeUser : u));
      try {
        localStorage.setItem('eduquest_user_id', activeUser.id);
        setDoc(doc(db, 'users', activeUser.id), activeUser).catch(console.error); localStorage.setItem(`eduquest_user_${activeUser.id}`, JSON.stringify(activeUser));
      } catch {
        // ignore
      }
      showToast(`Switched active persona to ${activeUser.name} (${activeUser.streak_days}d streak)`);
      if (streakResult.isNewDay) {
        setTimeout(() => {
          showToast(streakResult.message, 'success');
        }, 500);
      }
    }
  };

  const handleClaimStreak = () => {
    const streakResult = evaluateLoginStreak(currentUser);
    
    if (!streakResult.isNewDay) {
      showToast(streakResult.message, 'info');
      const elem = document.getElementById('educational-consistency-streak-card');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const updatedUser = streakResult.updatedUser;
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    try {
      setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error); localStorage.setItem(`eduquest_user_${updatedUser.id}`, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }

    try {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(streakResult.message, 'success');
  };

  const handleCompleteModule = (moduleId: string, scorePct: number, starsEarned: number) => {
    const newCompleted = currentUser.modules_completed + 1;
    const newAccuracy = Math.round((currentUser.quiz_accuracy_pct + scorePct) / 2);
    const newRating = calculateRating(
      newCompleted,
      currentUser.doubts_solved,
      currentUser.streak_days,
      currentUser.upvotes_received,
      newAccuracy
    );

    const updatedUser: StudentUser = {
      ...currentUser,
      modules_completed: newCompleted,
      stars: currentUser.stars + starsEarned,
      quiz_accuracy_pct: newAccuracy,
      rating_score: newRating
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error);
  };

  const handleRedeemItem = (newOrder: StoreOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(console.error);

    // Deduct stock
    setStoreItems(prev => prev.map(item => {
      if (item.id === newOrder.item_id) {
        return { ...item, stock: Math.max(0, item.stock - 1) };
      }
      return item;
    }));

    // Deduct user stars
    const updatedUser: StudentUser = {
      ...currentUser,
      stars: Math.max(0, currentUser.stars - newOrder.star_cost)
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error);
  };

  const handlePostDoubt = (newDoubt: Doubt) => {
    setDoubts(prev => [newDoubt, ...prev]);
    setDoc(doc(db, 'doubts', newDoubt.id), newDoubt).catch(console.error);

    // Deduct locked bounty from wallet
    const updatedUser: StudentUser = {
      ...currentUser,
      stars: Math.max(0, currentUser.stars - newDoubt.bounty_stars)
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error);
  };

  const handlePostAnswer = (doubtId: string, answerText: string) => {
    const newAnswer: DoubtAnswer = {
      id: `ans_${Date.now()}`,
      doubt_id: doubtId,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_class: currentUser.student_class,
      author_rating: currentUser.rating_score,
      content: answerText,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      upvotes: 0,
      is_accepted: false
    };

    let updatedTargetDoubt: Doubt | null = null;
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        updatedTargetDoubt = {
          ...d,
          answers: [...d.answers, newAnswer]
        };
        return updatedTargetDoubt;
      }
      return d;
    }));

    if (updatedTargetDoubt) {
      setDoc(doc(db, 'doubts', doubtId), updatedTargetDoubt).catch(console.error);
    }

    // Solver gets +5 Stars immediately and doubts_solved increment
    const newDoubtsSolved = currentUser.doubts_solved + 1;
    const newRating = calculateRating(
      currentUser.modules_completed,
      newDoubtsSolved,
      currentUser.streak_days,
      currentUser.upvotes_received,
      currentUser.quiz_accuracy_pct
    );

    const updatedUser: StudentUser = {
      ...currentUser,
      doubts_solved: newDoubtsSolved,
      stars: currentUser.stars + 5,
      rating_score: newRating
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error);
  };

  const handleAcceptAnswer = (doubtId: string, answerId: string, bountyStars: number) => {
    let solverAuthorId: string | null = null;
    let updatedTargetDoubt: Doubt | null = null;

    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        const updatedAnswers = d.answers.map(ans => {
          if (ans.id === answerId) {
            solverAuthorId = ans.author_id;
            return { ...ans, is_accepted: true };
          }
          return ans;
        });
        updatedTargetDoubt = {
          ...d,
          status: 'solved',
          accepted_answer_id: answerId,
          answers: updatedAnswers
        };
        return updatedTargetDoubt;
      }
      return d;
    }));

    if (updatedTargetDoubt) {
      setDoc(doc(db, 'doubts', doubtId), updatedTargetDoubt).catch(console.error);
    }

    // Transfer bounty stars to solver
    if (solverAuthorId) {
      setAllUsers(prev => prev.map(user => {
        if (user.id === solverAuthorId) {
          const newUpvotes = user.upvotes_received + 10;
          const newRating = calculateRating(
            user.modules_completed,
            user.doubts_solved,
            user.streak_days,
            newUpvotes,
            user.quiz_accuracy_pct
          );
          const updated = {
            ...user,
            stars: user.stars + bountyStars,
            upvotes_received: newUpvotes,
            rating_score: newRating
          };
          if (currentUser.id === user.id) {
            setCurrentUser(updated);
          }
          setDoc(doc(db, 'users', updated.id), updated).catch(console.error);
          return updated;
        }
        return user;
      }));
    }
  };

  const handleUpvoteDoubt = (doubtId: string) => {
    let updatedTargetDoubt: Doubt | null = null;
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        updatedTargetDoubt = { ...d, upvotes: d.upvotes + 1 };
        return updatedTargetDoubt;
      }
      return d;
    }));
    if (updatedTargetDoubt) {
      setDoc(doc(db, 'doubts', doubtId), updatedTargetDoubt).catch(console.error);
    }
    showToast('Upvote recorded! Thanks for curating high-yield questions.');
  };

  const handleUpvoteAnswer = (doubtId: string, answerId: string) => {
    let authorId: string | null = null;
    let updatedTargetDoubt: Doubt | null = null;

    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        updatedTargetDoubt = {
          ...d,
          answers: d.answers.map(a => {
            if (a.id === answerId) {
              authorId = a.author_id;
              return { ...a, upvotes: a.upvotes + 1 };
            }
            return a;
          })
        };
        return updatedTargetDoubt;
      }
      return d;
    }));

    if (updatedTargetDoubt) {
      setDoc(doc(db, 'doubts', doubtId), updatedTargetDoubt).catch(console.error);
    }

    if (authorId) {
      setAllUsers(prev => prev.map(u => {
        if (u.id === authorId) {
          const newUpvotes = u.upvotes_received + 1;
          const newRating = calculateRating(
            u.modules_completed,
            u.doubts_solved,
            u.streak_days,
            newUpvotes,
            u.quiz_accuracy_pct
          );
          const updated = { ...u, upvotes_received: newUpvotes, rating_score: newRating };
          if (currentUser.id === u.id) {
            setCurrentUser(updated);
          }
          setDoc(doc(db, 'users', updated.id), updated).catch(console.error);
          return updated;
        }
        return u;
      }));
    }

    showToast('Helpful solution upvoted!');
  };

  const handleSpinWin = (rewardStars: number, streakBonus: number, label: string) => {
    // Enforce 24-hour single spin rule
    const cooldown = getSpinCooldown(currentUser.last_spin_date);
    if (!cooldown.canSpin) {
      showToast(`Daily spin is limited to once every 24 hours. Next spin unlocks in ${cooldown.formattedRemaining}`, 'warning');
      return;
    }

    const newStreak = currentUser.streak_days + streakBonus;
    const newStars = currentUser.stars + rewardStars;
    const newRating = calculateRating(
      currentUser.modules_completed,
      currentUser.doubts_solved,
      newStreak,
      currentUser.upvotes_received,
      currentUser.quiz_accuracy_pct
    );

    const nowIso = new Date().toISOString();

    const updatedUser: StudentUser = {
      ...currentUser,
      stars: newStars,
      streak_days: newStreak,
      rating_score: newRating,
      last_spin_date: nowIso
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    try {
      setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error); localStorage.setItem(`eduquest_user_${updatedUser.id}`, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
  };

  const handleEarnStars = (starsAmount: number) => {
    const updatedUser: StudentUser = {
      ...currentUser,
      stars: currentUser.stars + starsAmount
    };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error); localStorage.setItem(`eduquest_user_${updatedUser.id}`, JSON.stringify(updatedUser));
  };

  const handleRegisterUser = (newUser: StudentUser) => {
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    localStorage.setItem("eduquest_user_id", newUser.id);
    localStorage.setItem("eduquest_auth", "true");
    setDoc(doc(db, 'users', newUser.id), newUser).catch(console.error); localStorage.setItem(`eduquest_user_${newUser.id}`, JSON.stringify(newUser));
  };

  const handleSendInvite = (targetUserId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        const invites = u.study_invites || [];
        if (!invites.includes(currentUser.id)) {
          // Update the target user's local storage entry too to persist
          const updatedTarget = { ...u, study_invites: [...invites, currentUser.id] };
          try {
            setDoc(doc(db, 'users', updatedTarget.id), updatedTarget).catch(console.error); localStorage.setItem(`eduquest_user_${updatedTarget.id}`, JSON.stringify(updatedTarget));
          } catch {}
          return updatedTarget;
        }
      }
      return u;
    }));
    showToast(`📨 Study session invite dispatched! You'll be notified when they join.`, 'info');
  };

  const handleAcceptInvite = (senderId: string) => {
    const updatedUser = {
      ...currentUser,
      study_invites: (currentUser.study_invites || []).filter(id => id !== senderId),
      accepted_buddies: [...(currentUser.accepted_buddies || []), senderId]
    };
    setCurrentUser(updatedUser);
    
    setAllUsers(prev => prev.map(u => {
      if (u.id === updatedUser.id) return updatedUser;
      if (u.id === senderId) {
        const updatedSender = {
          ...u,
          accepted_buddies: [...(u.accepted_buddies || []), updatedUser.id]
        };
        try {
          setDoc(doc(db, 'users', updatedSender.id), updatedSender).catch(console.error); localStorage.setItem(`eduquest_user_${updatedSender.id}`, JSON.stringify(updatedSender));
        } catch {}
        return updatedSender;
      }
      return u;
    }));
    try {
      setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(console.error); localStorage.setItem(`eduquest_user_${updatedUser.id}`, JSON.stringify(updatedUser));
    } catch {}
    showToast(`✅ You accepted the study buddy invitation! Workspace created.`, 'success');
  };

  const toastContainer = (
    <div className="fixed top-4 sm:top-6 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-indigo-300 flex-shrink-0" />
        };

        const colors = {
          success: 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-lg',
          warning: 'bg-amber-50 border-amber-300 text-amber-900 shadow-lg',
          error: 'bg-rose-50 border-rose-300 text-rose-900 shadow-lg',
          info: 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-lg'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl text-xs font-semibold border shadow-lg flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 ${colors[t.type]}`}
          >
            {icons[t.type]}
            <span className="leading-snug">{t.message}</span>
          </div>
        );
      })}
    </div>
  );

  // Before opening the dashboard, show the Login & Registration page if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-slate-50 to-sky-50/70 text-slate-800">
        {toastContainer}
        <AuthPage
          allUsers={allUsers}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          showToast={showToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Container */}
      {toastContainer}

      {/* Top Navbar & Mobile Bottom Navigation */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSwitchPersona={handleSwitchPersona}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenSpinModal={() => setIsSpinModalOpen(true)}
        onClaimStreak={handleClaimStreak}
        onLogout={handleLogout}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            onTabChange={handleTabChange}
            onOpenSpinModal={() => setIsSpinModalOpen(true)}
            onClaimDailyStreak={handleClaimStreak}
          />
        )}

        {currentTab === 'modules' && (
          <ModulesView
            modules={modules}
            currentUser={currentUser}
            onCompleteModule={handleCompleteModule}
            showToast={showToast}
          />
        )}

        {currentTab === 'store' && (
          <StoreView
            storeItems={storeItems}
            orders={orders}
            currentUser={currentUser}
            onRedeemItem={handleRedeemItem}
            showToast={showToast}
          />
        )}

        {currentTab === 'buddies' && (
          <BuddiesView
            allUsers={allUsers}
            currentUser={currentUser}
            onSendInvite={handleSendInvite}
            onAcceptInvite={handleAcceptInvite}
            showToast={showToast}
          />
        )}

        {currentTab === 'doubts' && (
          <PeerSolveView
            doubts={doubts}
            currentUser={currentUser}
            onPostDoubt={handlePostDoubt}
            onPostAnswer={handlePostAnswer}
            onAcceptAnswer={handleAcceptAnswer}
            onUpvoteDoubt={handleUpvoteDoubt}
            onUpvoteAnswer={handleUpvoteAnswer}
            showToast={showToast}
          />
        )}

        {currentTab === 'snapstudy' && (
          <SnapStudyView
            currentUser={currentUser}
            onEarnStars={handleEarnStars}
            showToast={showToast}
            onActiveDocumentChange={setActiveDocumentContext}
          />
        )}
      </main>

      {/* Modals & 24/7 AI Tutor Drawer */}
      <SpinWheelModal
        isOpen={isSpinModalOpen}
        onClose={() => setIsSpinModalOpen(false)}
        onSpinWin={handleSpinWin}
        showToast={showToast}
        lastSpinDate={currentUser.last_spin_date}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterUser={handleRegisterUser}
        showToast={showToast}
      />

      <VidyaAITutor
        currentUser={currentUser}
        showToast={showToast}
        activeDocumentContext={activeDocumentContext}
      />

    </div>
  );
}
