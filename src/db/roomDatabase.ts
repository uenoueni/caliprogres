import { ExerciseEntity, WorkoutLogEntity, WorkoutSessionEntity, WorkoutSessionWithLogs } from '../types';

export const DEFAULT_EXERCISES: Omit<ExerciseEntity, 'id'>[] = [
  { name: 'Pull up', is_custom: false },
  { name: 'Push up', is_custom: false },
  { name: 'Diamond push up', is_custom: false },
  { name: 'Pike push up', is_custom: false },
  { name: 'Dip', is_custom: false },
];

const EXERCISES_STORAGE_KEY = 'room_db_exercises_v2';
const WORKOUT_LOGS_STORAGE_KEY = 'room_db_workout_logs_v2';
const WORKOUT_SESSIONS_STORAGE_KEY = 'room_db_workout_sessions_v2';
const ACTIVE_SESSION_STORAGE_KEY = 'room_db_active_session_v2';

/**
 * Simulates Room Database & DAOs with LocalStorage offline persistence.
 */
class RoomDatabaseSimulator {
  private exercises: ExerciseEntity[] = [];
  private workoutLogs: WorkoutLogEntity[] = [];
  private workoutSessions: WorkoutSessionEntity[] = [];
  private activeSession: { id: number; startTime: number } | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const storedExercises = localStorage.getItem(EXERCISES_STORAGE_KEY);
    const storedLogs = localStorage.getItem(WORKOUT_LOGS_STORAGE_KEY);
    const storedSessions = localStorage.getItem(WORKOUT_SESSIONS_STORAGE_KEY);
    const storedActiveSession = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);

    if (storedExercises) {
      try {
        this.exercises = JSON.parse(storedExercises);
      } catch {
        this.populateDefaultExercises();
      }
    } else {
      this.populateDefaultExercises();
    }

    if (storedLogs) {
      try {
        this.workoutLogs = JSON.parse(storedLogs);
      } catch {
        this.populateSampleData();
      }
    } else {
      this.populateSampleData();
    }

    if (storedSessions) {
      try {
        this.workoutSessions = JSON.parse(storedSessions);
      } catch {
        this.workoutSessions = [];
      }
    }

    if (storedActiveSession) {
      try {
        this.activeSession = JSON.parse(storedActiveSession);
      } catch {
        this.activeSession = null;
      }
    }
  }

  private populateDefaultExercises() {
    this.exercises = DEFAULT_EXERCISES.map((ex, index) => ({
      id: index + 1,
      name: ex.name,
      is_custom: false,
    }));
    this.saveExercises();
  }

  private populateSampleData() {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Sample session 1 (3 days ago)
    const session1Time = now - (3 * dayMs);
    const session1: WorkoutSessionEntity = {
      id: 1,
      startTime: session1Time - (42 * 60 * 1000),
      endTime: session1Time,
      durationSeconds: 42 * 60,
      totalExercisesCompleted: 5,
      totalReps: 125,
    };

    // Sample session 2 (1 day ago)
    const session2Time = now - (1 * dayMs);
    const session2: WorkoutSessionEntity = {
      id: 2,
      startTime: session2Time - (45 * 60 * 1000),
      endTime: session2Time,
      durationSeconds: 45 * 60,
      totalExercisesCompleted: 5,
      totalReps: 145,
    };

    this.workoutSessions = [session2, session1];
    this.saveSessions();

    this.workoutLogs = [
      // 3 days ago logs (linked to session 1)
      { id: 1, session_id: 1, date: session1Time, exercise_id: 1, set_1_reps: 6, set_2_reps: 5, set_3_reps: 4 }, // Pull up (15)
      { id: 2, session_id: 1, date: session1Time, exercise_id: 2, set_1_reps: 15, set_2_reps: 12, set_3_reps: 10 }, // Push up (37)
      { id: 3, session_id: 1, date: session1Time, exercise_id: 3, set_1_reps: 10, set_2_reps: 8, set_3_reps: 7 }, // Diamond (25)
      { id: 4, session_id: 1, date: session1Time, exercise_id: 4, set_1_reps: 8, set_2_reps: 7, set_3_reps: 6 }, // Pike (21)
      { id: 5, session_id: 1, date: session1Time, exercise_id: 5, set_1_reps: 10, set_2_reps: 9, set_3_reps: 8 }, // Dip (27)

      // 1 day ago logs (linked to session 2 - progressive overload!)
      { id: 6, session_id: 2, date: session2Time, exercise_id: 1, set_1_reps: 7, set_2_reps: 6, set_3_reps: 5 }, // Pull up (18)
      { id: 7, session_id: 2, date: session2Time, exercise_id: 2, set_1_reps: 16, set_2_reps: 14, set_3_reps: 12 }, // Push up (42)
      { id: 8, session_id: 2, date: session2Time, exercise_id: 3, set_1_reps: 11, set_2_reps: 9, set_3_reps: 8 }, // Diamond (28)
      { id: 9, session_id: 2, date: session2Time, exercise_id: 4, set_1_reps: 9, set_2_reps: 8, set_3_reps: 7 }, // Pike (24)
      { id: 10, session_id: 2, date: session2Time, exercise_id: 5, set_1_reps: 12, set_2_reps: 11, set_3_reps: 9 }, // Dip (32)
    ];
    this.saveLogs();
  }

  private saveExercises() {
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(this.exercises));
  }

  private saveLogs() {
    localStorage.setItem(WORKOUT_LOGS_STORAGE_KEY, JSON.stringify(this.workoutLogs));
  }

  private saveSessions() {
    localStorage.setItem(WORKOUT_SESSIONS_STORAGE_KEY, JSON.stringify(this.workoutSessions));
  }

  private saveActiveSession() {
    if (this.activeSession) {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(this.activeSession));
    } else {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
  }

  // --- Exercise DAO Methods ---
  public async getAllExercises(): Promise<ExerciseEntity[]> {
    return [...this.exercises];
  }

  public async getExerciseById(id: number): Promise<ExerciseEntity | undefined> {
    return this.exercises.find(e => e.id === id);
  }

  public async insertExercise(name: string): Promise<ExerciseEntity> {
    const trimmed = name.trim();
    const newId = this.exercises.length > 0 ? Math.max(...this.exercises.map(e => e.id)) + 1 : 1;
    const newExercise: ExerciseEntity = {
      id: newId,
      name: trimmed,
      is_custom: true,
    };
    this.exercises.push(newExercise);
    this.saveExercises();
    return newExercise;
  }

  public async deleteExercise(id: number): Promise<void> {
    this.exercises = this.exercises.filter(e => e.id !== id);
    // Also remove logs associated
    this.workoutLogs = this.workoutLogs.filter(l => l.exercise_id !== id);
    this.saveExercises();
    this.saveLogs();
  }

  // --- WorkoutSession DAO Methods ---
  public getActiveSession(): { id: number; startTime: number } | null {
    return this.activeSession;
  }

  public async startWorkoutSession(): Promise<{ id: number; startTime: number }> {
    const newId = this.workoutSessions.length > 0 
      ? Math.max(...this.workoutSessions.map(s => s.id), this.activeSession?.id || 0) + 1 
      : (this.activeSession ? this.activeSession.id + 1 : 1);
    
    this.activeSession = {
      id: newId,
      startTime: Date.now(),
    };
    this.saveActiveSession();
    return this.activeSession;
  }

  public async endWorkoutSession(): Promise<WorkoutSessionEntity | null> {
    if (!this.activeSession) return null;

    const endTime = Date.now();
    const durationSeconds = Math.max(1, Math.round((endTime - this.activeSession.startTime) / 1000));
    
    // Get all logs made during this session
    const sessionLogs = this.workoutLogs.filter(l => l.session_id === this.activeSession!.id);
    const totalExercises = new Set(sessionLogs.map(l => l.exercise_id)).size;
    const totalReps = sessionLogs.reduce((acc, curr) => acc + curr.set_1_reps + curr.set_2_reps + curr.set_3_reps, 0);

    const completedSession: WorkoutSessionEntity = {
      id: this.activeSession.id,
      startTime: this.activeSession.startTime,
      endTime: endTime,
      durationSeconds: durationSeconds,
      totalExercisesCompleted: totalExercises,
      totalReps: totalReps,
    };

    this.workoutSessions.unshift(completedSession);
    this.saveSessions();

    this.activeSession = null;
    this.saveActiveSession();

    return completedSession;
  }

  public async cancelWorkoutSession(): Promise<void> {
    this.activeSession = null;
    this.saveActiveSession();
  }

  public async getAllSessionsWithLogs(): Promise<WorkoutSessionWithLogs[]> {
    const result: WorkoutSessionWithLogs[] = [];

    for (const session of this.workoutSessions) {
      const logsInSession = this.workoutLogs.filter(l => l.session_id === session.id);
      const formattedLogs = logsInSession.map(log => {
        const ex = this.exercises.find(e => e.id === log.exercise_id);
        return {
          log,
          exerciseName: ex ? ex.name : 'Unknown Exercise',
        };
      });

      result.push({
        session,
        logs: formattedLogs,
      });
    }

    return result;
  }

  public async deleteSession(sessionId: number): Promise<void> {
    this.workoutSessions = this.workoutSessions.filter(s => s.id !== sessionId);
    // Unlink logs from this session
    this.workoutLogs = this.workoutLogs.map(l => l.session_id === sessionId ? { ...l, session_id: null } : l);
    this.saveSessions();
    this.saveLogs();
  }

  // --- WorkoutLog DAO Methods ---
  public async getLogsForExercise(exerciseId: number): Promise<WorkoutLogEntity[]> {
    return this.workoutLogs
      .filter(log => log.exercise_id === exerciseId)
      .sort((a, b) => b.date - a.date); // Sort newest first (ORDER BY date DESC)
  }

  public async getLatestLogForExercise(exerciseId: number): Promise<WorkoutLogEntity | null> {
    const logs = await this.getLogsForExercise(exerciseId);
    return logs.length > 0 ? logs[0] : null;
  }

  public async getTodayLogForExercise(exerciseId: number): Promise<WorkoutLogEntity | null> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = startOfToday.getTime();

    const todayLog = this.workoutLogs.find(
      log => log.exercise_id === exerciseId && log.date >= startTimestamp
    );
    return todayLog || null;
  }

  public async insertWorkoutLog(log: Omit<WorkoutLogEntity, 'id'>): Promise<WorkoutLogEntity> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = startOfToday.getTime();

    const currentSessionId = this.activeSession?.id ?? log.session_id ?? null;

    const existingTodayIndex = this.workoutLogs.findIndex(
      l => l.exercise_id === log.exercise_id && l.date >= startTimestamp
    );

    let savedLog: WorkoutLogEntity;

    if (existingTodayIndex >= 0) {
      // Update today's existing log
      savedLog = {
        ...this.workoutLogs[existingTodayIndex],
        session_id: currentSessionId || this.workoutLogs[existingTodayIndex].session_id,
        date: log.date,
        set_1_reps: log.set_1_reps,
        set_2_reps: log.set_2_reps,
        set_3_reps: log.set_3_reps,
      };
      this.workoutLogs[existingTodayIndex] = savedLog;
    } else {
      // Insert new log
      const newId = this.workoutLogs.length > 0 ? Math.max(...this.workoutLogs.map(l => l.id)) + 1 : 1;
      savedLog = {
        id: newId,
        session_id: currentSessionId,
        date: log.date,
        exercise_id: log.exercise_id,
        set_1_reps: log.set_1_reps,
        set_2_reps: log.set_2_reps,
        set_3_reps: log.set_3_reps,
      };
      this.workoutLogs.unshift(savedLog);
    }

    this.saveLogs();
    return savedLog;
  }

  public async deleteLog(id: number): Promise<void> {
    this.workoutLogs = this.workoutLogs.filter(l => l.id !== id);
    this.saveLogs();
  }

  public async resetToDefaults(): Promise<void> {
    this.populateDefaultExercises();
    this.populateSampleData();
    this.activeSession = null;
    this.saveActiveSession();
  }
}

export const roomDb = new RoomDatabaseSimulator();
