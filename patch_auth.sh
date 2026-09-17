sed -i '/const initialRating = calculateRating(2, 1, 1, 3, 85);/,/onRegisterSuccess(newUser);/c\
    setIsAuthLoading(true);\
    try {\
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);\
      const uid = userCredential.user.uid;\
\
      const initialRating = calculateRating(0, 0, 0, 0, 0);\
      \
      const newUser: StudentUser = {\
        id: uid,\
        name: regName.trim(),\
        email: regEmail.trim(),\
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(regName.trim())}&background=random`,\
        school: regSchool.trim(),\
        student_class: regClass,\
        target_exam: regExam,\
        stream: regStream,\
        stars: 10,\
        streak_days: 1,\
        last_login_date: new Date().toISOString().split('\''T'\'')[0],\
        last_spin_date: '\'\'',\
        modules_completed: 0,\
        doubts_solved: 0,\
        upvotes_received: 0,\
        quiz_accuracy_pct: 0,\
        rating_score: initialRating,\
        bio: regBio.trim()\
      };\
\
      confetti({\
        particleCount: 120,\
        spread: 80,\
        origin: { y: 0.6 }\
      });\
\
      showToast(`Account created! +10 Free Stars credited to ${newUser.name}.`, '\''success'\'');\
      onRegisterSuccess(newUser);\
    } catch (error: any) {\
      console.error("Registration error:", error);\
      showToast(error.message || '\''Failed to create account.'\'', '\''error'\'');\
    } finally {\
      setIsAuthLoading(false);\
    }' src/components/AuthPage.tsx
