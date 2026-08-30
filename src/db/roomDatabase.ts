import {
  ExerciseEntity,
  WorkoutLogEntity,
  WorkoutSessionEntity,
  WorkoutSessionWithLogs,
  WorkoutScheduleEntity,
  WeeklyComparisonReport,
  ExerciseWeeklyMatrixRow,
} from '../types';

export const DEFAULT_EXERCISES: Omit<ExerciseEntity, 'id'>[] = [
  { name: 'Pull up', is_custom: false },
  { name: 'Push up', is_custom: false },
  { name: 'Diamond push up', is_custom: false },
  { name: 'Pike push up', is_custom: false },
  { name: 'Dip', is_custom: false },
];

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const DEFAULT_SCHEDULES: WorkoutScheduleEntity[] = [
  { id: 1, dayOfWeek: 1, dayName: 'Senin', time: '06:30', reminderMinutesBefore: 15, isEnabled: true, exerciseFocus: 'Pull Up & Dip Strength' },
  { id: 2, dayOfWeek: 3, dayName: 'Rabu', time: '16:45', reminderMinutesBefore: 15, isEnabled: true, exerciseFocus: 'Push Up & Core Progression' },
  { id: 3, dayOfWeek: 5, dayName: 'Jumat', time: '06:30', reminderMinutesBefore: 15, isEnabled: true, exerciseFocus: 'Full Calisthenics Overload' },
  { id: 4, dayOfWeek: 6, dayName: 'Sabtu', time: '08:00', reminderMinutesBefore: 30, isEnabled: false, exerciseFocus: 'Endurance & Volume Challenge' },
];

const EXERCISES_STORAGE_KEY = 'room_db_exercises_v3';
const WORKOUT_LOGS_STORAGE_KEY = 'room_db_workout_logs_v3';
const WORKOUT_SESSIONS_STORAGE_KEY = 'room_db_workout_sessions_v3';
const ACTIVE_SESSION_STORAGE_KEY = 'room_db_active_session_v3';
const SCHEDULES_STORAGE_KEY = 'room_db_schedules_v3';

/**
 * Simulates Room Database & DAOs with LocalStorage offline persistence.
 */
class RoomDatabaseSimulator {
  private exercises: ExerciseEntity[] = [];
  private workoutLogs: WorkoutLogEntity[] = [];
  private workoutSessions: WorkoutSessionEntity[] = [];
  private workoutSchedules: WorkoutScheduleEntity[] = [];
  private activeSession: { id: number; startTime: number } | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const storedExercises = localStorage.getItem(EXERCISES_STORAGE_KEY);
    const storedLogs = localStorage.getItem(WORKOUT_LOGS_STORAGE_KEY);
    const storedSessions = localStorage.getItem(WORKOUT_SESSIONS_STORAGE_KEY);
    const storedActiveSession = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    const storedSchedules = localStorage.getItem(SCHEDULES_STORAGE_KEY);

    if (storedExercises) {
      try {
        this.exercises = JSON.parse(storedExercises);
      } catch {
        this.populateDefaultExercises();
      }
    } else {
      this.populateDefaultExercises();
    }

    if (storedLogs && storedSessions) {
      try {
        this.workoutLogs = JSON.parse(storedLogs);
        this.workoutSessions = JSON.parse(storedSessions);
      } catch {
        this.populateSampleData();
      }
    } else {
      this.populateSampleData();
    }

    if (storedActiveSession) {
      try {
        this.activeSession = JSON.parse(storedActiveSession);
      } catch {
        this.activeSession = null;
      }
    }

    if (storedSchedules) {
      try {
        this.workoutSchedules = JSON.parse(storedSchedules);
      } catch {
        this.workoutSchedules = [...DEFAULT_SCHEDULES];
        this.saveSchedules();
      }
    } else {
      this.workoutSchedules = [...DEFAULT_SCHEDULES];
      this.saveSchedules();
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

    // === MINGGU LALU (7 - 12 hari lalu) ===
    // Sesi 1 Minggu Lalu: 11 hari lalu (Durasi: 38 min, 110 reps, 15 sets)
    const lastWeekTime1 = now - (11 * dayMs);
    const sessionLW1: WorkoutSessionEntity = {
      id: 1,
      startTime: lastWeekTime1 - (38 * 60 * 1000),
      endTime: lastWeekTime1,
      durationSeconds: 38 * 60,
      totalExercisesCompleted: 5,
      totalReps: 110,
    };

    // Sesi 2 Minggu Lalu: 9 hari lalu (Durasi: 40 min, 119 reps, 15 sets)
    const lastWeekTime2 = now - (9 * dayMs);
    const sessionLW2: WorkoutSessionEntity = {
      id: 2,
      startTime: lastWeekTime2 - (40 * 60 * 1000),
      endTime: lastWeekTime2,
      durationSeconds: 40 * 60,
      totalExercisesCompleted: 5,
      totalReps: 119,
    };

    // Sesi 3 Minggu Lalu: 7 hari lalu (Durasi: 42 min, 125 reps, 15 sets)
    const lastWeekTime3 = now - (7 * dayMs);
    const sessionLW3: WorkoutSessionEntity = {
      id: 3,
      startTime: lastWeekTime3 - (42 * 60 * 1000),
      endTime: lastWeekTime3,
      durationSeconds: 42 * 60,
      totalExercisesCompleted: 5,
      totalReps: 125,
    };

    // === MINGGU INI (1 - 4 hari lalu) ===
    // Sesi 1 Minggu Ini: 4 hari lalu (Durasi: 45 min, 138 reps, 15 sets)
    const thisWeekTime1 = now - (4 * dayMs);
    const sessionTW1: WorkoutSessionEntity = {
      id: 4,
      startTime: thisWeekTime1 - (45 * 60 * 1000),
      endTime: thisWeekTime1,
      durationSeconds: 45 * 60,
      totalExercisesCompleted: 5,
      totalReps: 138,
    };

    // Sesi 2 Minggu Ini: 2 hari lalu (Durasi: 48 min, 152 reps, 15 sets)
    const thisWeekTime2 = now - (2 * dayMs);
    const sessionTW2: WorkoutSessionEntity = {
      id: 5,
      startTime: thisWeekTime2 - (48 * 60 * 1000),
      endTime: thisWeekTime2,
      durationSeconds: 48 * 60,
      totalExercisesCompleted: 5,
      totalReps: 152,
    };

    // Sesi 3 Minggu Ini: Hari ini / kemarin (Durasi: 50 min, 164 reps, 15 sets)
    const thisWeekTime3 = now - (0.5 * dayMs);
    const sessionTW3: WorkoutSessionEntity = {
      id: 6,
      startTime: thisWeekTime3 - (50 * 60 * 1000),
      endTime: thisWeekTime3,
      durationSeconds: 50 * 60,
      totalExercisesCompleted: 5,
      totalReps: 164,
    };

    this.workoutSessions = [sessionTW3, sessionTW2, sessionTW1, sessionLW3, sessionLW2, sessionLW1];
    this.saveSessions();

    this.workoutLogs = [
      // Sesi 1 Minggu Lalu (11 hari lalu)
      { id: 1, session_id: 1, date: lastWeekTime1, exercise_id: 1, set_1_reps: 5, set_2_reps: 4, set_3_reps: 4 }, // Pull up (13)
      { id: 2, session_id: 1, date: lastWeekTime1, exercise_id: 2, set_1_reps: 12, set_2_reps: 10, set_3_reps: 10 }, // Push up (32)
      { id: 3, session_id: 1, date: lastWeekTime1, exercise_id: 3, set_1_reps: 8, set_2_reps: 7, set_3_reps: 7 }, // Diamond (22)
      { id: 4, session_id: 1, date: lastWeekTime1, exercise_id: 4, set_1_reps: 7, set_2_reps: 6, set_3_reps: 6 }, // Pike (19)
      { id: 5, session_id: 1, date: lastWeekTime1, exercise_id: 5, set_1_reps: 9, set_2_reps: 8, set_3_reps: 7 }, // Dip (24)

      // Sesi 2 Minggu Lalu (9 hari lalu)
      { id: 6, session_id: 2, date: lastWeekTime2, exercise_id: 1, set_1_reps: 6, set_2_reps: 5, set_3_reps: 4 }, // Pull up (15)
      { id: 7, session_id: 2, date: lastWeekTime2, exercise_id: 2, set_1_reps: 14, set_2_reps: 12, set_3_reps: 10 }, // Push up (36)
      { id: 8, session_id: 2, date: lastWeekTime2, exercise_id: 3, set_1_reps: 9, set_2_reps: 8, set_3_reps: 7 }, // Diamond (24)
      { id: 9, session_id: 2, date: lastWeekTime2, exercise_id: 4, set_1_reps: 8, set_2_reps: 7, set_3_reps: 5 }, // Pike (20)
      { id: 10, session_id: 2, date: lastWeekTime2, exercise_id: 5, set_1_reps: 9, set_2_reps: 8, set_3_reps: 7 }, // Dip (24)

      // Sesi 3 Minggu Lalu (7 hari lalu)
      { id: 11, session_id: 3, date: lastWeekTime3, exercise_id: 1, set_1_reps: 6, set_2_reps: 5, set_3_reps: 4 }, // Pull up (15)
      { id: 12, session_id: 3, date: lastWeekTime3, exercise_id: 2, set_1_reps: 15, set_2_reps: 12, set_3_reps: 10 }, // Push up (37)
      { id: 13, session_id: 3, date: lastWeekTime3, exercise_id: 3, set_1_reps: 10, set_2_reps: 8, set_3_reps: 7 }, // Diamond (25)
      { id: 14, session_id: 3, date: lastWeekTime3, exercise_id: 4, set_1_reps: 8, set_2_reps: 7, set_3_reps: 6 }, // Pike (21)
      { id: 15, session_id: 3, date: lastWeekTime3, exercise_id: 5, set_1_reps: 10, set_2_reps: 9, set_3_reps: 8 }, // Dip (27)

      // === MINGGU INI (Overload signifikan!) ===
      // Sesi 1 Minggu Ini (4 hari lalu)
      { id: 16, session_id: 4, date: thisWeekTime1, exercise_id: 1, set_1_reps: 7, set_2_reps: 6, set_3_reps: 5 }, // Pull up (18)
      { id: 17, session_id: 4, date: thisWeekTime1, exercise_id: 2, set_1_reps: 16, set_2_reps: 14, set_3_reps: 12 }, // Push up (42)
      { id: 18, session_id: 4, date: thisWeekTime1, exercise_id: 3, set_1_reps: 11, set_2_reps: 9, set_3_reps: 8 }, // Diamond (28)
      { id: 19, session_id: 4, date: thisWeekTime1, exercise_id: 4, set_1_reps: 9, set_2_reps: 8, set_3_reps: 7 }, // Pike (24)
      { id: 20, session_id: 4, date: thisWeekTime1, exercise_id: 5, set_1_reps: 10, set_2_reps: 9, set_3_reps: 7 }, // Dip (26)

      // Sesi 2 Minggu Ini (2 hari lalu)
      { id: 21, session_id: 5, date: thisWeekTime2, exercise_id: 1, set_1_reps: 8, set_2_reps: 7, set_3_reps: 5 }, // Pull up (20)
      { id: 22, session_id: 5, date: thisWeekTime2, exercise_id: 2, set_1_reps: 18, set_2_reps: 15, set_3_reps: 14 }, // Push up (47)
      { id: 23, session_id: 5, date: thisWeekTime2, exercise_id: 3, set_1_reps: 12, set_2_reps: 10, set_3_reps: 8 }, // Diamond (30)
      { id: 24, session_id: 5, date: thisWeekTime2, exercise_id: 4, set_1_reps: 10, set_2_reps: 8, set_3_reps: 7 }, // Pike (25)
      { id: 25, session_id: 5, date: thisWeekTime2, exercise_id: 5, set_1_reps: 12, set_2_reps: 10, set_3_reps: 8 }, // Dip (30)

      // Sesi 3 Minggu Ini (Hari ini / kemarin)
      { id: 26, session_id: 6, date: thisWeekTime3, exercise_id: 1, set_1_reps: 9, set_2_reps: 7, set_3_reps: 6 }, // Pull up (22)
      { id: 27, session_id: 6, date: thisWeekTime3, exercise_id: 2, set_1_reps: 19, set_2_reps: 16, set_3_reps: 15 }, // Push up (50)
      { id: 28, session_id: 6, date: thisWeekTime3, exercise_id: 3, set_1_reps: 13, set_2_reps: 11, set_3_reps: 9 }, // Diamond (33)
      { id: 29, session_id: 6, date: thisWeekTime3, exercise_id: 4, set_1_reps: 10, set_2_reps: 9, set_3_reps: 8 }, // Pike (27)
      { id: 30, session_id: 6, date: thisWeekTime3, exercise_id: 5, set_1_reps: 13, set_2_reps: 11, set_3_reps: 8 }, // Dip (32)
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

  private saveSchedules() {
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(this.workoutSchedules));
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
    this.workoutLogs = this.workoutLogs.map(l => l.session_id === sessionId ? { ...l, session_id: null } : l);
    this.saveSessions();
    this.saveLogs();
  }

  // --- WorkoutLog DAO Methods ---
  public async getLogsForExercise(exerciseId: number): Promise<WorkoutLogEntity[]> {
    return this.workoutLogs
      .filter(log => log.exercise_id === exerciseId)
      .sort((a, b) => b.date - a.date);
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

  // --- WorkoutSchedule DAO Methods ---
  public async getAllSchedules(): Promise<WorkoutScheduleEntity[]> {
    return [...this.workoutSchedules].sort((a, b) => {
      // Sort Monday (1) to Sunday (0)
      const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      if (dayA !== dayB) return dayA - dayB;
      return a.time.localeCompare(b.time);
    });
  }

  public async insertOrUpdateSchedule(
    schedule: Omit<WorkoutScheduleEntity, 'id'> & { id?: number }
  ): Promise<WorkoutScheduleEntity> {
    let savedSchedule: WorkoutScheduleEntity;

    if (schedule.id) {
      const index = this.workoutSchedules.findIndex(s => s.id === schedule.id);
      if (index >= 0) {
        savedSchedule = {
          ...this.workoutSchedules[index],
          ...schedule,
          id: schedule.id,
        };
        this.workoutSchedules[index] = savedSchedule;
      } else {
        const newId = this.workoutSchedules.length > 0 ? Math.max(...this.workoutSchedules.map(s => s.id)) + 1 : 1;
        savedSchedule = { ...schedule, id: newId };
        this.workoutSchedules.push(savedSchedule);
      }
    } else {
      const newId = this.workoutSchedules.length > 0 ? Math.max(...this.workoutSchedules.map(s => s.id)) + 1 : 1;
      savedSchedule = { ...schedule, id: newId };
      this.workoutSchedules.push(savedSchedule);
    }

    this.saveSchedules();
    return savedSchedule;
  }

  public async toggleSchedule(id: number, isEnabled: boolean): Promise<void> {
    const index = this.workoutSchedules.findIndex(s => s.id === id);
    if (index >= 0) {
      this.workoutSchedules[index].isEnabled = isEnabled;
      this.saveSchedules();
    }
  }

  public async deleteSchedule(id: number): Promise<void> {
    this.workoutSchedules = this.workoutSchedules.filter(s => s.id !== id);
    this.saveSchedules();
  }

  // --- Weekly Comparison Report Analytics DAO Method ---
  public async getWeeklyComparisonReport(): Promise<WeeklyComparisonReport> {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - (7 * dayMs);
    const fourteenDaysAgo = now - (14 * dayMs);

    // Filter logs for this week (0 - 7 days ago) and last week (7 - 14 days ago)
    const thisWeekLogs = this.workoutLogs.filter(l => l.date >= sevenDaysAgo && l.date <= now);
    const lastWeekLogs = this.workoutLogs.filter(l => l.date >= fourteenDaysAgo && l.date < sevenDaysAgo);

    // Filter sessions for this week and last week
    const thisWeekSessions = this.workoutSessions.filter(s => s.startTime >= sevenDaysAgo && s.startTime <= now);
    const lastWeekSessions = this.workoutSessions.filter(s => s.startTime >= fourteenDaysAgo && s.startTime < sevenDaysAgo);

    // 1. Duration
    const thisWeekDuration = thisWeekSessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const lastWeekDuration = lastWeekSessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const durationDiff = thisWeekDuration - lastWeekDuration;
    const durationPct = lastWeekDuration > 0 ? (durationDiff / lastWeekDuration) * 100 : (thisWeekDuration > 0 ? 100 : 0);

    // 2. Reps calculation
    const calcReps = (logs: WorkoutLogEntity[]) =>
      logs.reduce((acc, l) => acc + l.set_1_reps + l.set_2_reps + l.set_3_reps, 0);
    const thisWeekReps = calcReps(thisWeekLogs);
    const lastWeekReps = calcReps(lastWeekLogs);
    const repsDiff = thisWeekReps - lastWeekReps;
    const repsPct = lastWeekReps > 0 ? (repsDiff / lastWeekReps) * 100 : (thisWeekReps > 0 ? 100 : 0);

    // 3. Sets calculation (each set > 0 reps counts as a completed set)
    const calcSets = (logs: WorkoutLogEntity[]) =>
      logs.reduce((acc, l) => {
        let count = 0;
        if (l.set_1_reps > 0) count++;
        if (l.set_2_reps > 0) count++;
        if (l.set_3_reps > 0) count++;
        return acc + count;
      }, 0);
    const thisWeekSets = calcSets(thisWeekLogs);
    const lastWeekSets = calcSets(lastWeekLogs);
    const setsDiff = thisWeekSets - lastWeekSets;
    const setsPct = lastWeekSets > 0 ? (setsDiff / lastWeekSets) * 100 : (thisWeekSets > 0 ? 100 : 0);

    // 4. Sessions
    const thisWeekSessionCount = thisWeekSessions.length;
    const lastWeekSessionCount = lastWeekSessions.length;
    const sessionDiff = thisWeekSessionCount - lastWeekSessionCount;
    const sessionPct = lastWeekSessionCount > 0 ? (sessionDiff / lastWeekSessionCount) * 100 : 0;

    // 5. Avg Reps Per Set
    const thisWeekAvgReps = thisWeekSets > 0 ? +(thisWeekReps / thisWeekSets).toFixed(1) : 0;
    const lastWeekAvgReps = lastWeekSets > 0 ? +(lastWeekReps / lastWeekSets).toFixed(1) : 0;
    const avgRepsDiff = +(thisWeekAvgReps - lastWeekAvgReps).toFixed(1);
    const avgRepsPct = lastWeekAvgReps > 0 ? (avgRepsDiff / lastWeekAvgReps) * 100 : 0;

    // 6. Matrix Comparison per Exercise
    const exercisesMatrix: ExerciseWeeklyMatrixRow[] = this.exercises.map(exercise => {
      const exThisWeekLogs = thisWeekLogs.filter(l => l.exercise_id === exercise.id);
      const exLastWeekLogs = lastWeekLogs.filter(l => l.exercise_id === exercise.id);

      const twReps = calcReps(exThisWeekLogs);
      const lwReps = calcReps(exLastWeekLogs);
      const diffR = twReps - lwReps;
      const pctR = lwReps > 0 ? (diffR / lwReps) * 100 : (twReps > 0 ? 100 : 0);

      const twSets = calcSets(exThisWeekLogs);
      const lwSets = calcSets(exLastWeekLogs);
      const diffS = twSets - lwSets;

      let status: 'overload' | 'maintained' | 'regressed' | 'new' = 'maintained';
      if (lwReps === 0 && twReps > 0) {
        status = 'new';
      } else if (diffR > 0) {
        status = 'overload';
      } else if (diffR < 0) {
        status = 'regressed';
      } else {
        status = 'maintained';
      }

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        thisWeekReps: twReps,
        lastWeekReps: lwReps,
        diffReps: diffR,
        percentageRepsChange: +pctR.toFixed(1),
        thisWeekSets: twSets,
        lastWeekSets: lwSets,
        diffSets: diffS,
        status,
      };
    });

    // Determine overall overload progression status
    let overallStatus: 'overload' | 'maintained' | 'regressed' = 'maintained';
    if (repsDiff > 0 || durationDiff > 0) {
      overallStatus = 'overload';
    } else if (repsDiff < 0 && durationDiff < 0) {
      overallStatus = 'regressed';
    }

    // Insight summary text
    let summaryInsight = '';
    if (overallStatus === 'overload') {
      const topOverload = [...exercisesMatrix].sort((a, b) => b.diffReps - a.diffReps)[0];
      summaryInsight = `Luar biasa! Minggu ini Anda berhasil mencapai Progressive Overload dengan kenaikan total +${repsDiff} repetisi (+${repsPct.toFixed(1)}%) dan durasi latihan bertambah +${Math.round(durationDiff / 60)} menit. Peningkatan terbesar tercatat pada gerakan ${topOverload ? topOverload.exerciseName : 'kalistenik'}.`;
    } else if (overallStatus === 'maintained') {
      summaryInsight = `Performa minggu ini stabil dan terjaga konsisten dibanding minggu sebelumnya (${thisWeekReps} reps vs ${lastWeekReps} reps). Pertahankan konsistensi ini atau tambahkan 1-2 repetisi pada set pertama sesi berikutnya untuk memicu overload baru.`;
    } else {
      summaryInsight = `Volume minggu ini tercatat lebih rendah dibanding minggu lalu (-${Math.abs(repsDiff)} repetisi). Hal ini wajar saat fase recovery/deload atau jadwal padat. Jadwalkan kembali sesi latihan Anda untuk memulihkan intensitas.`;
    }

    return {
      thisWeekLabel: '7 Hari Terakhir (Minggu Ini)',
      lastWeekLabel: '7 Hari Sebelumnya (Minggu Kemarin)',
      totalDurationSeconds: {
        thisWeek: thisWeekDuration,
        lastWeek: lastWeekDuration,
        diff: durationDiff,
        percentageChange: +durationPct.toFixed(1),
      },
      totalReps: {
        thisWeek: thisWeekReps,
        lastWeek: lastWeekReps,
        diff: repsDiff,
        percentageChange: +repsPct.toFixed(1),
      },
      totalSets: {
        thisWeek: thisWeekSets,
        lastWeek: lastWeekSets,
        diff: setsDiff,
        percentageChange: +setsPct.toFixed(1),
      },
      totalSessions: {
        thisWeek: thisWeekSessionCount,
        lastWeek: lastWeekSessionCount,
        diff: sessionDiff,
        percentageChange: +sessionPct.toFixed(1),
      },
      averageRepsPerSet: {
        thisWeek: thisWeekAvgReps,
        lastWeek: lastWeekAvgReps,
        diff: avgRepsDiff,
        percentageChange: +avgRepsPct.toFixed(1),
      },
      exercisesMatrix,
      overallStatus,
      summaryInsight,
    };
  }

  public async resetToDefaults(): Promise<void> {
    this.populateDefaultExercises();
    this.populateSampleData();
    this.workoutSchedules = [...DEFAULT_SCHEDULES];
    this.saveSchedules();
    this.activeSession = null;
    this.saveActiveSession();
  }
}

export const roomDb = new RoomDatabaseSimulator();
