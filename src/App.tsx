import { useState, useEffect, useCallback } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { ExerciseCard } from './components/ExerciseCard';
import { WorkoutSessionTracker } from './components/WorkoutSessionTracker';
import { HistoryBottomSheet } from './components/HistoryBottomSheet';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { AddExerciseModal } from './components/AddExerciseModal';
import { KotlinArchitectureModal } from './components/KotlinArchitectureModal';
import { Toast } from './components/Toast';
import { roomDb } from './db/roomDatabase';
import { ExerciseEntity, ExerciseWithLatestLog, WorkoutLogEntity, WorkoutSessionWithLogs } from './types';
import { Dumbbell, Info, Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'kotlin'>('app');
  const [exercisesWithLogs, setExercisesWithLogs] = useState<ExerciseWithLatestLog[]>([]);
  const [selectedExerciseForHistory, setSelectedExerciseForHistory] = useState<ExerciseEntity | null>(null);
  const [historyLogs, setHistoryLogs] = useState<WorkoutLogEntity[]>([]);
  const [sessionHistory, setSessionHistory] = useState<WorkoutSessionWithLogs[]>([]);
  const [activeSession, setActiveSession] = useState<{ id: number; startTime: number } | null>(null);

  // Modals state
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<boolean>(false);
  const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load all exercises, latest logs, and session history
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const exercises = await roomDb.getAllExercises();
    const loadedData: ExerciseWithLatestLog[] = [];

    for (const ex of exercises) {
      const latestLog = await roomDb.getLatestLogForExercise(ex.id);
      const todayLog = await roomDb.getTodayLogForExercise(ex.id);
      const allLogs = await roomDb.getLogsForExercise(ex.id);

      loadedData.push({
        exercise: ex,
        latestLog,
        todayLog,
        historyCount: allLogs.length,
      });
    }

    const sessions = await roomDb.getAllSessionsWithLogs();
    const active = roomDb.getActiveSession();

    setExercisesWithLogs(loadedData);
    setSessionHistory(sessions);
    setActiveSession(active);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Start a new workout session
  const handleStartSession = async () => {
    const session = await roomDb.startWorkoutSession();
    setActiveSession(session);
    setToastMessage('🚀 Sesi latihan dimulai! Timer & riwayat sesi sedang berjalan.');
  };

  // End active workout session
  const handleEndSession = async () => {
    const completedSession = await roomDb.endWorkoutSession();
    if (completedSession) {
      await refreshData();
      const mins = Math.floor(completedSession.durationSeconds / 60);
      const secs = completedSession.durationSeconds % 60;
      const durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      setToastMessage(
        `🎉 Sesi latihan #${completedSession.id} selesai! Durasi: ${durationStr}, Total: ${completedSession.totalReps} repetisi.`
      );
    }
  };

  // Cancel workout session
  const handleCancelSession = async () => {
    await roomDb.cancelWorkoutSession();
    setActiveSession(null);
    setToastMessage('Sesi latihan dibatalkan.');
  };

  // Save workout reps for an exercise
  const handleSaveWorkout = async (
    exerciseId: number,
    set1: number,
    set2: number,
    set3: number
  ) => {
    const exercise = exercisesWithLogs.find((e) => e.exercise.id === exerciseId)?.exercise;
    if (!exercise) return;

    await roomDb.insertWorkoutLog({
      date: Date.now(),
      exercise_id: exerciseId,
      set_1_reps: set1,
      set_2_reps: set2,
      set_3_reps: set3,
    });

    await refreshData();

    const totalReps = set1 + set2 + set3;
    setToastMessage(`✓ ${exercise.name}: ${totalReps} total repetisi berhasil disimpan!`);
  };

  // Add new custom exercise
  const handleAddExercise = async (name: string) => {
    const newEx = await roomDb.insertExercise(name);
    await refreshData();
    setToastMessage(`Gerakan "${newEx.name}" berhasil ditambahkan ke database Room!`);
  };

  // Delete exercise
  const handleDeleteExercise = async (exerciseId: number) => {
    await roomDb.deleteExercise(exerciseId);
    await refreshData();
    setToastMessage('Gerakan custom berhasil dihapus');
  };

  // Open history bottom sheet for a single exercise
  const handleOpenHistory = async (exercise: ExerciseEntity) => {
    setSelectedExerciseForHistory(exercise);
    const logs = await roomDb.getLogsForExercise(exercise.id);
    setHistoryLogs(logs);
  };

  // Close history bottom sheet
  const handleCloseHistory = () => {
    setSelectedExerciseForHistory(null);
    setHistoryLogs([]);
  };

  // Delete log from history
  const handleDeleteLog = async (logId: number) => {
    await roomDb.deleteLog(logId);
    if (selectedExerciseForHistory) {
      const updatedLogs = await roomDb.getLogsForExercise(selectedExerciseForHistory.id);
      setHistoryLogs(updatedLogs);
    }
    await refreshData();
    setToastMessage('Catatan latihan berhasil dihapus');
  };

  // Delete whole session
  const handleDeleteSession = async (sessionId: number) => {
    await roomDb.deleteSession(sessionId);
    await refreshData();
    setToastMessage(`Sesi #${sessionId} berhasil dihapus.`);
  };

  // Reset database to default initial state
  const handleResetData = async () => {
    if (window.confirm('Reset database ke 5 gerakan default awal?')) {
      await roomDb.resetToDefaults();
      await refreshData();
      setToastMessage('Database berhasil direset ke data default');
    }
  };

  // Compute active session live statistics
  const sessionLogs = activeSession
    ? exercisesWithLogs.filter((e) => e.todayLog && e.todayLog.session_id === activeSession.id)
    : [];
  const sessionExercisesCount = sessionLogs.length;
  const sessionRepsCount = sessionLogs.reduce((acc, curr) => {
    if (curr.todayLog) {
      return acc + curr.todayLog.set_1_reps + curr.todayLog.set_2_reps + curr.todayLog.set_3_reps;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top App Bar with Date, Add Exercise, Session History & Mode Selector */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        onOpenAddExercise={() => setIsAddExerciseOpen(true)}
        onOpenSessionHistory={() => setIsSessionHistoryOpen(true)}
        sessionCount={sessionHistory.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 sm:px-6">
        {activeTab === 'kotlin' ? (
          <KotlinArchitectureModal />
        ) : (
          <div className="space-y-4">
            {/* Start / Active / End Workout Session Tracker */}
            <WorkoutSessionTracker
              activeSession={activeSession}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onCancelSession={handleCancelSession}
              sessionRepsCount={sessionRepsCount}
              sessionExercisesCount={sessionExercisesCount}
            />

            {/* Header: Title & Add Exercise trigger */}
            <div className="flex items-center justify-between px-1 pt-1">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Daftar Gerakan ({exercisesWithLogs.length})
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Klik nama gerakan untuk melihat riwayat repetisi per gerakan
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddExerciseOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Gerakan</span>
              </button>
            </div>

            {/* List of Exercise Cards */}
            {isLoading ? (
              <div className="py-16 text-center text-neutral-400">
                <Dumbbell className="w-8 h-8 mx-auto animate-bounce mb-2" />
                <p className="text-sm">Memuat database gerakan...</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {exercisesWithLogs.map((item) => (
                  <ExerciseCard
                    key={item.exercise.id}
                    exercise={item.exercise}
                    latestLog={item.latestLog}
                    todayLog={item.todayLog}
                    historyCount={item.historyCount}
                    onSave={handleSaveWorkout}
                    onOpenHistory={handleOpenHistory}
                    onDeleteExercise={handleDeleteExercise}
                  />
                ))}
              </div>
            )}

            {/* Progressive Overload Tips Card (Minimalist) */}
            <div className="mt-8 p-4 rounded-xl bg-neutral-200/50 border border-neutral-200/80 text-xs text-neutral-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Progressive Overload & Session Tracking:</strong> Tekan <strong>Start Workout</strong> saat memulai sesi, catat repetisi untuk setiap gerakan, lalu tekan <strong>End Workout</strong> untuk menyimpan riwayat 1 sesi latihan utuh. Anda juga bisa melihat riwayat per gerakan kapan saja.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Per-Exercise History Modal Bottom Sheet */}
      <HistoryBottomSheet
        exercise={selectedExerciseForHistory}
        logs={historyLogs}
        onClose={handleCloseHistory}
        onDeleteLog={handleDeleteLog}
      />

      {/* Whole Workout Session History Modal */}
      <SessionHistoryModal
        isOpen={isSessionHistoryOpen}
        onClose={() => setIsSessionHistoryOpen(false)}
        sessions={sessionHistory}
        onDeleteSession={handleDeleteSession}
      />

      {/* Add Custom Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        onAddExercise={handleAddExercise}
      />

      {/* Toast feedback */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
