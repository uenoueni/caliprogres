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
