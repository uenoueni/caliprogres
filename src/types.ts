/**
 * Data structures mirroring the Android Room Database Entity schema.
 */

export interface ExerciseEntity {
  id: number;
  name: string;
  is_custom?: boolean;
}

export interface WorkoutSessionEntity {
  id: number;
  startTime: number; // Timestamp (Long)
  endTime: number; // Timestamp (Long)
  durationSeconds: number;
  totalExercisesCompleted: number;
  totalReps: number;
}

export interface WorkoutLogEntity {
  id: number;
  session_id?: number | null; // Foreign Key to workout_sessions
  date: number; // Timestamp (Long in Kotlin)
  exercise_id: number;
  set_1_reps: number;
  set_2_reps: number;
  set_3_reps: number;
}

export interface ExerciseWithLatestLog {
  exercise: ExerciseEntity;
  latestLog: WorkoutLogEntity | null;
  todayLog: WorkoutLogEntity | null;
  historyCount: number;
}

export interface ExerciseLogHistoryItem extends WorkoutLogEntity {
  totalReps: number;
  repsDiffFromPrevious?: number;
}

export interface WorkoutSessionWithLogs {
  session: WorkoutSessionEntity;
  logs: {
    log: WorkoutLogEntity;
    exerciseName: string;
  }[];
}

export interface WorkoutScheduleEntity {
  id: number;
  dayOfWeek: number; // 0: Minggu, 1: Senin, 2: Selasa, 3: Rabu, 4: Kamis, 5: Jumat, 6: Sabtu
  dayName: string;
  time: string; // HH:mm format, e.g. "06:30"
  reminderMinutesBefore: number; // e.g. 0, 10, 15, 30, 60
  isEnabled: boolean;
  exerciseFocus: string; // e.g. "Full Body", "Upper Calisthenics", "Push & Core"
}

export interface WeeklyMetricComparison {
  thisWeek: number;
  lastWeek: number;
  diff: number;
  percentageChange: number;
}

export interface ExerciseWeeklyMatrixRow {
  exerciseId: number;
  exerciseName: string;
  thisWeekReps: number;
  lastWeekReps: number;
  diffReps: number;
  percentageRepsChange: number;
  thisWeekSets: number;
  lastWeekSets: number;
  diffSets: number;
  status: 'overload' | 'maintained' | 'regressed' | 'new';
}

export interface WeeklyComparisonReport {
  thisWeekLabel: string;
  lastWeekLabel: string;
  totalDurationSeconds: WeeklyMetricComparison;
  totalReps: WeeklyMetricComparison;
  totalSets: WeeklyMetricComparison;
  totalSessions: WeeklyMetricComparison;
  averageRepsPerSet: WeeklyMetricComparison;
  exercisesMatrix: ExerciseWeeklyMatrixRow[];
  overallStatus: 'overload' | 'maintained' | 'regressed';
  summaryInsight: string;
}
