"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Submission, User, View } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { addSubmission, subscribeToSubmissions, clearAllSubmissions } from '@/lib/firestore-service';

import WelcomePage from '@/components/layout/welcome-page';
import StudentLoginDialog from '@/components/auth/student-login-dialog';
import AdminLoginDialog from '@/components/auth/admin-login-dialog';
import InstructionsDialog from '@/components/quiz/instructions-dialog';
import QuizView from '@/components/quiz/quiz-view';
import ResultDialog from '@/components/quiz/result-dialog';
import AdminDashboard from '@/components/admin/admin-dashboard';
import Header from '@/components/layout/header';

export default function Home() {
  const [view, setView] = useState<View>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentResult, setCurrentResult] = useState<Submission | null>(null);
  const [attempt, setAttempt] = useLocalStorage<number>('attempt', 1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to admin view if URL hash is #admin
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setView('adminLogin');
    }
  }, []);

  // Real-time listener for submissions — only active when admin is logged in
  useEffect(() => {
    if (view !== 'admin' || !isAuthenticated) return;

    const unsubscribe = subscribeToSubmissions((data) => {
      setSubmissions(data);
    });

    return () => unsubscribe();
  }, [view, isAuthenticated]);

  const handleStudentLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setView('instructions');
  }, []);

  const handleStartQuiz = useCallback(() => {
    setView('quiz');
  }, []);

  const handleQuizSubmit = useCallback(async (submissionData: Omit<Submission, 'id' | 'timestamp' | 'attempt'>) => {
    setIsSubmitting(true);
    const newSubmission: Submission = {
      ...submissionData,
      id: `${new Date().getTime()}-${submissionData.user.email}`,
      timestamp: new Date().toLocaleString(),
      attempt: attempt,
    };

    try {
      // Save to Firestore (cross-device persistent storage)
      await addSubmission(newSubmission);
    } catch (error) {
      console.error('Failed to save submission to Firestore:', error);
      // Even if Firestore fails, we still show the result to the student
    } finally {
      setIsSubmitting(false);
    }

    setCurrentResult(newSubmission);
    setAttempt(prev => prev + 1);
    setView('results');
  }, [attempt, setAttempt]);

  const handleAdminLogin = useCallback(() => {
    setIsAuthenticated(true);
    setView('admin');
    window.location.hash = 'admin';
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentResult(null);
    setSubmissions([]);
    setView('welcome');
    window.location.hash = '';
  }, []);

  const handleClearSubmissions = useCallback(async () => {
    try {
      await clearAllSubmissions();
      setSubmissions([]);
    } catch (error) {
      console.error('Failed to clear submissions:', error);
    }
  }, []);

  const showQuiz = view === 'quiz';
  const showHeader = view === 'quiz' || view === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header user={user} attempt={attempt} onGoHome={handleLogout} isAdmin={view === 'admin'} onAdminLogout={handleLogout} />}
      <main className="flex-grow flex items-center justify-center p-4">
        {view === 'welcome' && <WelcomePage onStudentLogin={() => setView('studentLogin')} onAdminLogin={() => setView('adminLogin')} />}
        {view === 'quiz' && user && <QuizView user={user} onSubmit={handleQuizSubmit} isSubmitting={isSubmitting} />}
        {view === 'admin' && isAuthenticated && (
          <AdminDashboard
            submissions={submissions}
            onClearSubmissions={handleClearSubmissions}
          />
        )}
      </main>

      <StudentLoginDialog isOpen={view === 'studentLogin'} onClose={() => setView('welcome')} onLogin={handleStudentLogin} />
      <AdminLoginDialog isOpen={view === 'adminLogin'} onClose={() => setView('welcome')} onLogin={handleAdminLogin} />
      <InstructionsDialog isOpen={view === 'instructions'} onConfirm={handleStartQuiz} />
      <ResultDialog isOpen={view === 'results'} result={currentResult} onClose={handleLogout} />
    </div>
  );
}
