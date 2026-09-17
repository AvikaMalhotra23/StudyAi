sed -i 's/const handleRegisterSubmit = (e: React.FormEvent) => {/const handleRegisterSubmit = async (e: React.FormEvent) => {/g' src/components/AuthPage.tsx
sed -i 's/import { auth, db } from '\''..\/utils\/firebase'\'';/import confetti from '\''canvas-confetti'\'';\nimport { auth, db } from '\''..\/utils\/firebase'\'';/g' src/components/AuthPage.tsx
