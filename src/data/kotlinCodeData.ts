export interface KotlinFile {
  filename: string;
  category: 'Entity' | 'Dao' | 'Database' | 'Repository' | 'ViewModel' | 'UI (Compose)' | 'Gradle';
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    filename: 'ExerciseEntity.kt',
    category: 'Entity',
    description: 'Room Entity for calisthenics exercises (5 default + custom exercises).',
    code: `package com.calisthenics.progressiveoverload.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entity Exercise: id, name, is_custom
 * Table: exercises
 */
@Entity(tableName = "exercises")
data class ExerciseEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    val name: String,
    
    @ColumnInfo(name = "is_custom", defaultValue = "0")
    val isCustom: Boolean = false
)`
  },
  {
    filename: 'WorkoutSessionEntity.kt',
    category: 'Entity',
    description: 'Room Entity for tracking a single complete workout session (Start to End).',
    code: `package com.calisthenics.progressiveoverload.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entity WorkoutSession: id, start_time, end_time, duration_seconds, total_reps, total_exercises
 * Table: workout_sessions
 */
@Entity(tableName = "workout_sessions")
data class WorkoutSessionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    @ColumnInfo(name = "start_time")
    val startTime: Long,
    
    @ColumnInfo(name = "end_time")
    val endTime: Long,
    
    @ColumnInfo(name = "duration_seconds")
    val durationSeconds: Long,
    
    @ColumnInfo(name = "total_exercises_completed")
    val totalExercisesCompleted: Int,
    
    @ColumnInfo(name = "total_reps")
    val totalReps: Int
)`
  },
  {
    filename: 'WorkoutLogEntity.kt',
    category: 'Entity',
    description: 'Room Entity for workout sets logs linked to both Exercise and WorkoutSession.',
    code: `package com.calisthenics.progressiveoverload.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Entity WorkoutLog: id, session_id, date, exercise_id, set_1_reps, set_2_reps, set_3_reps
 * Table: workout_logs
 */
@Entity(
    tableName = "workout_logs",
    foreignKeys = [
        ForeignKey(
            entity = ExerciseEntity::class,
            parentColumns = ["id"],
            childColumns = ["exercise_id"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = WorkoutSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["session_id"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [
        Index(value = ["exercise_id"]),
        Index(value = ["session_id"]),
        Index(value = ["date"])
    ]
)
data class WorkoutLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    @ColumnInfo(name = "session_id")
    val sessionId: Long? = null,
    
    val date: Long = System.currentTimeMillis(),
    
    @ColumnInfo(name = "exercise_id")
    val exerciseId: Long,
    
    @ColumnInfo(name = "set_1_reps")
    val set1Reps: Int,
    
    @ColumnInfo(name = "set_2_reps")
    val set2Reps: Int,
    
    @ColumnInfo(name = "set_3_reps")
    val set3Reps: Int
)`
  },
  {
    filename: 'WorkoutSessionWithLogs.kt',
    category: 'Entity',
    description: 'Room Relation model combining WorkoutSession with all associated WorkoutLogs and Exercises.',
    code: `package com.calisthenics.progressiveoverload.data.local.model

import androidx.room.Embedded
import androidx.room.Relation
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutSessionEntity

/**
 * 1-to-Many Relationship for full workout session history inspection
 */
data class WorkoutSessionWithLogs(
    @Embedded
    val session: WorkoutSessionEntity,
    
    @Relation(
        parentColumn = "id",
        entityColumn = "session_id"
    )
    val logs: List<WorkoutLogEntity>
)`
  },
  {
    filename: 'ExerciseDao.kt',
    category: 'Dao',
    description: 'DAO for querying, inserting default/custom exercises, and deletion.',
    code: `package com.calisthenics.progressiveoverload.data.local.dao

import androidx.room.*
import com.calisthenics.progressiveoverload.data.local.entity.ExerciseEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ExerciseDao {
    @Query("SELECT * FROM exercises ORDER BY id ASC")
    fun getAllExercises(): Flow<List<ExerciseEntity>>

    @Query("SELECT * FROM exercises WHERE id = :exerciseId LIMIT 1")
    suspend fun getExerciseById(exerciseId: Long): ExerciseEntity?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(exercises: List<ExerciseEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExercise(exercise: ExerciseEntity): Long

    @Delete
    suspend fun deleteExercise(exercise: ExerciseEntity)
    
    @Query("DELETE FROM exercises WHERE id = :exerciseId")
    suspend fun deleteExerciseById(exerciseId: Long)
}`
  },
  {
    filename: 'WorkoutSessionDao.kt',
    category: 'Dao',
    description: 'DAO for managing workout sessions and full session history queries.',
    code: `package com.calisthenics.progressiveoverload.data.local.dao

import androidx.room.*
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutSessionEntity
import com.calisthenics.progressiveoverload.data.local.model.WorkoutSessionWithLogs
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutSessionDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: WorkoutSessionEntity): Long

    @Transaction
    @Query("SELECT * FROM workout_sessions ORDER BY start_time DESC")
    fun getAllSessionsWithLogs(): Flow<List<WorkoutSessionWithLogs>>

    @Query("SELECT * FROM workout_sessions WHERE id = :sessionId LIMIT 1")
    suspend fun getSessionById(sessionId: Long): WorkoutSessionEntity?

    @Query("DELETE FROM workout_sessions WHERE id = :sessionId")
    suspend fun deleteSession(sessionId: Long)
}`
  },
  {
    filename: 'WorkoutLogDao.kt',
    category: 'Dao',
    description: 'DAO for per-exercise history, latest log comparisons, and session logs.',
    code: `package com.calisthenics.progressiveoverload.data.local.dao

import androidx.room.*
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutLogDao {
    /**
     * History per exercise (Progress History Bottom Sheet).
     */
    @Query("SELECT * FROM workout_logs WHERE exercise_id = :exerciseId ORDER BY date DESC")
    fun getLogsForExercise(exerciseId: Long): Flow<List<WorkoutLogEntity>>

    /**
     * Latest workout for progressive overload comparison.
     */
    @Query("SELECT * FROM workout_logs WHERE exercise_id = :exerciseId ORDER BY date DESC LIMIT 1")
    suspend fun getLatestLogForExercise(exerciseId: Long): WorkoutLogEntity?

    /**
     * Today's log for the given exercise.
     */
    @Query("SELECT * FROM workout_logs WHERE exercise_id = :exerciseId AND date >= :startOfDayTimestamp ORDER BY date DESC LIMIT 1")
    suspend fun getTodayLog(exerciseId: Long, startOfDayTimestamp: Long): WorkoutLogEntity?

    /**
     * All logs belonging to a specific session.
     */
    @Query("SELECT * FROM workout_logs WHERE session_id = :sessionId ORDER BY date ASC")
    suspend fun getLogsBySessionId(sessionId: Long): List<WorkoutLogEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: WorkoutLogEntity): Long

    @Query("DELETE FROM workout_logs WHERE id = :logId")
    suspend fun deleteLog(logId: Long)
}`
  },
  {
    filename: 'AppDatabase.kt',
    category: 'Database',
    description: 'Room Database with 3 entities and pre-population Callback for the 5 mandatory exercises.',
    code: `package com.calisthenics.progressiveoverload.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.calisthenics.progressiveoverload.data.local.dao.ExerciseDao
import com.calisthenics.progressiveoverload.data.local.dao.WorkoutLogDao
import com.calisthenics.progressiveoverload.data.local.dao.WorkoutSessionDao
import com.calisthenics.progressiveoverload.data.local.entity.ExerciseEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutSessionEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        ExerciseEntity::class,
        WorkoutSessionEntity::class,
        WorkoutLogEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun exerciseDao(): ExerciseDao
    abstract fun workoutLogDao(): WorkoutLogDao
    abstract fun workoutSessionDao(): WorkoutSessionDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, applicationScope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "calisthenics_overload.db"
                )
                .addCallback(DatabaseCallback(applicationScope))
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateDefaultExercises(database.exerciseDao())
                    }
                }
            }

            suspend fun populateDefaultExercises(exerciseDao: ExerciseDao) {
                val defaultExercises = listOf(
                    ExerciseEntity(name = "Pull up", isCustom = false),
                    ExerciseEntity(name = "Push up", isCustom = false),
                    ExerciseEntity(name = "Diamond push up", isCustom = false),
                    ExerciseEntity(name = "Pike push up", isCustom = false),
                    ExerciseEntity(name = "Dip", isCustom = false)
                )
                exerciseDao.insertAll(defaultExercises)
            }
        }
    }
}`
  },
  {
    filename: 'WorkoutRepository.kt',
    category: 'Repository',
    description: 'Repository coordinating Exercises, Live Sessions, and Set Logs.',
    code: `package com.calisthenics.progressiveoverload.data.repository

import com.calisthenics.progressiveoverload.data.local.dao.ExerciseDao
import com.calisthenics.progressiveoverload.data.local.dao.WorkoutLogDao
import com.calisthenics.progressiveoverload.data.local.dao.WorkoutSessionDao
import com.calisthenics.progressiveoverload.data.local.entity.ExerciseEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutSessionEntity
import com.calisthenics.progressiveoverload.data.local.model.WorkoutSessionWithLogs
import kotlinx.coroutines.flow.Flow

class WorkoutRepository(
    private val exerciseDao: ExerciseDao,
    private val workoutLogDao: WorkoutLogDao,
    private val workoutSessionDao: WorkoutSessionDao
) {
    val allExercises: Flow<List<ExerciseEntity>> = exerciseDao.getAllExercises()
    val allSessions: Flow<List<WorkoutSessionWithLogs>> = workoutSessionDao.getAllSessionsWithLogs()

    suspend fun addNewExercise(name: String): Long {
        return exerciseDao.insertExercise(ExerciseEntity(name = name, isCustom = true))
    }

    suspend fun deleteExercise(exerciseId: Long) {
        exerciseDao.deleteExerciseById(exerciseId)
    }

    fun getLogsForExercise(exerciseId: Long): Flow<List<WorkoutLogEntity>> =
        workoutLogDao.getLogsForExercise(exerciseId)

    suspend fun getLatestLogForExercise(exerciseId: Long): WorkoutLogEntity? =
        workoutLogDao.getLatestLogForExercise(exerciseId)

    suspend fun saveWorkoutLog(
        exerciseId: Long,
        sessionId: Long?,
        set1: Int,
        set2: Int,
        set3: Int
    ): Long {
        val log = WorkoutLogEntity(
            sessionId = sessionId,
            date = System.currentTimeMillis(),
            exerciseId = exerciseId,
            set1Reps = set1,
            set2Reps = set2,
            set3Reps = set3
        )
        return workoutLogDao.insertLog(log)
    }

    suspend fun saveWorkoutSession(
        startTime: Long,
        endTime: Long,
        durationSeconds: Long,
        totalExercises: Int,
        totalReps: Int
    ): Long {
        val session = WorkoutSessionEntity(
            startTime = startTime,
            endTime = endTime,
            durationSeconds = durationSeconds,
            totalExercisesCompleted = totalExercises,
            totalReps = totalReps
        )
        return workoutSessionDao.insertSession(session)
    }

    suspend fun deleteSession(sessionId: Long) {
        workoutSessionDao.deleteSession(sessionId)
    }
}`
  },
  {
    filename: 'WorkoutViewModel.kt',
    category: 'ViewModel',
    description: 'MVVM ViewModel managing active workout timer, adding custom exercises, and session records.',
    code: `package com.calisthenics.progressiveoverload.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.calisthenics.progressiveoverload.data.local.entity.ExerciseEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import com.calisthenics.progressiveoverload.data.local.model.WorkoutSessionWithLogs
import com.calisthenics.progressiveoverload.data.repository.WorkoutRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class ExerciseUiState(
    val exercise: ExerciseEntity,
    val set1Input: String = "",
    val set2Input: String = "",
    val set3Input: String = "",
    val lastLog: WorkoutLogEntity? = null,
    val isSavedToday: Boolean = false
)

data class ActiveSessionState(
    val startTime: Long,
    val loggedExerciseIds: Set<Long> = emptySet(),
    val totalSessionReps: Int = 0
)

data class WorkoutScreenUiState(
    val isLoading: Boolean = true,
    val exercises: List<ExerciseUiState> = emptyList(),
    val activeSession: ActiveSessionState? = null,
    val selectedExerciseForHistory: ExerciseEntity? = null,
    val historyLogs: List<WorkoutLogEntity> = emptyList(),
    val sessionHistory: List<WorkoutSessionWithLogs> = emptyList()
)

class WorkoutViewModel(
    private val repository: WorkoutRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(WorkoutScreenUiState())
    val uiState: StateFlow<WorkoutScreenUiState> = _uiState.asStateFlow()

    init {
        loadExercises()
        loadSessions()
    }

    private fun loadExercises() {
        viewModelScope.launch {
            repository.allExercises.collectLatest { exerciseEntities ->
                val uiList = exerciseEntities.map { entity ->
                    ExerciseUiState(
                        exercise = entity,
                        lastLog = repository.getLatestLogForExercise(entity.id)
                    )
                }
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    exercises = uiList
                )
            }
        }
    }

    private fun loadSessions() {
        viewModelScope.launch {
            repository.allSessions.collectLatest { sessions ->
                _uiState.value = _uiState.value.copy(sessionHistory = sessions)
            }
        }
    }

    fun startWorkout() {
        _uiState.value = _uiState.value.copy(
            activeSession = ActiveSessionState(startTime = System.currentTimeMillis())
        )
    }

    fun endWorkout() {
        val active = _uiState.value.activeSession ?: return
        val endTime = System.currentTimeMillis()
        val durationSec = (endTime - active.startTime) / 1000

        viewModelScope.launch {
            repository.saveWorkoutSession(
                startTime = active.startTime,
                endTime = endTime,
                durationSeconds = durationSec,
                totalExercises = active.loggedExerciseIds.size,
                totalReps = active.totalSessionReps
            )
            _uiState.value = _uiState.value.copy(activeSession = null)
        }
    }

    fun addCustomExercise(name: String) {
        viewModelScope.launch {
            repository.addNewExercise(name)
        }
    }

    fun deleteExercise(exerciseId: Long) {
        viewModelScope.launch {
            repository.deleteExercise(exerciseId)
        }
    }

    fun saveWorkout(exerciseId: Long) {
        val item = _uiState.value.exercises.find { it.exercise.id == exerciseId } ?: return
        val s1 = item.set1Input.toIntOrNull() ?: 0
        val s2 = item.set2Input.toIntOrNull() ?: 0
        val s3 = item.set3Input.toIntOrNull() ?: 0
        val totalRepsThisMove = s1 + s2 + s3

        viewModelScope.launch {
            repository.saveWorkoutLog(
                exerciseId = exerciseId,
                sessionId = null,
                set1 = s1,
                set2 = s2,
                set3 = s3
            )
            
            // Update active session stats if in progress
            val active = _uiState.value.activeSession
            val updatedActive = active?.copy(
                loggedExerciseIds = active.loggedExerciseIds + exerciseId,
                totalSessionReps = active.totalSessionReps + totalRepsThisMove
            )

            val updatedLast = repository.getLatestLogForExercise(exerciseId)
            val updatedList = _uiState.value.exercises.map {
                if (it.exercise.id == exerciseId) it.copy(isSavedToday = true, lastLog = updatedLast) else it
            }

            _uiState.value = _uiState.value.copy(
                exercises = updatedList,
                activeSession = updatedActive
            )
        }
    }

    fun openExerciseHistory(exercise: ExerciseEntity) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(selectedExerciseForHistory = exercise)
            repository.getLogsForExercise(exercise.id).collectLatest { logs ->
                _uiState.value = _uiState.value.copy(historyLogs = logs)
            }
        }
    }

    fun closeExerciseHistory() {
        _uiState.value = _uiState.value.copy(selectedExerciseForHistory = null)
    }
}`
  },
  {
    filename: 'WorkoutScheduleEntity.kt',
    category: 'Entity',
    description: 'Room Entity for storing workout schedule days, target hours, and reminder notification offsets.',
    code: `package com.calisthenics.progressiveoverload.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entity WorkoutSchedule: id, day_of_week, day_name, time, reminder_minutes_before, is_enabled, exercise_focus
 * Table: workout_schedules
 */
@Entity(tableName = "workout_schedules")
data class WorkoutScheduleEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,

    @ColumnInfo(name = "day_of_week")
    val dayOfWeek: Int, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    @ColumnInfo(name = "day_name")
    val dayName: String,

    @ColumnInfo(name = "time")
    val time: String, // HH:mm format e.g. "06:30"

    @ColumnInfo(name = "reminder_minutes_before", defaultValue = "15")
    val reminderMinutesBefore: Int = 15,

    @ColumnInfo(name = "is_enabled", defaultValue = "1")
    val isEnabled: Boolean = true,

    @ColumnInfo(name = "exercise_focus")
    val exerciseFocus: String = "Calisthenics Overload"
)`
  },
  {
    filename: 'WorkoutScheduleDao.kt',
    category: 'Dao',
    description: 'Room DAO for querying active workout schedules and configuring reminder alarms.',
    code: `package com.calisthenics.progressiveoverload.data.local.dao

import androidx.room.*
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutScheduleEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutScheduleDao {

    @Query("SELECT * FROM workout_schedules ORDER BY CASE WHEN day_of_week = 0 THEN 7 ELSE day_of_week END ASC, time ASC")
    fun getAllSchedules(): Flow<List<WorkoutScheduleEntity>>

    @Query("SELECT * FROM workout_schedules WHERE is_enabled = 1")
    suspend fun getActiveSchedules(): List<WorkoutScheduleEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateSchedule(schedule: WorkoutScheduleEntity): Long

    @Query("UPDATE workout_schedules SET is_enabled = :isEnabled WHERE id = :id")
    suspend fun toggleSchedule(id: Long, isEnabled: Boolean)

    @Delete
    suspend fun deleteSchedule(schedule: WorkoutScheduleEntity)

    @Query("DELETE FROM workout_schedules WHERE id = :id")
    suspend fun deleteScheduleById(id: Long)
}`
  },
  {
    filename: 'WeeklyReportDao.kt',
    category: 'Dao',
    description: 'Room DAO queries for calculating weekly comparison matrix (This Week vs Last Week).',
    code: `package com.calisthenics.progressiveoverload.data.local.dao

import androidx.room.Dao
import androidx.room.Query
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutLogEntity
import com.calisthenics.progressiveoverload.data.local.entity.WorkoutSessionEntity

data class ExerciseWeeklySum(
    val exercise_id: Long,
    val total_reps: Int,
    val total_sets: Int
)

@Dao
interface WeeklyReportDao {

    @Query("""
        SELECT * FROM workout_sessions 
        WHERE start_time BETWEEN :startTime AND :endTime 
        ORDER BY start_time DESC
    """)
    suspend fun getSessionsInRange(startTime: Long, endTime: Long): List<WorkoutSessionEntity>

    @Query("""
        SELECT * FROM workout_logs 
        WHERE date BETWEEN :startTime AND :endTime 
        ORDER BY date DESC
    """)
    suspend fun getLogsInRange(startTime: Long, endTime: Long): List<WorkoutLogEntity>

    @Query("""
        SELECT exercise_id, 
               SUM(set_1_reps + set_2_reps + set_3_reps) as total_reps,
               SUM(CASE WHEN set_1_reps > 0 THEN 1 ELSE 0 END +
                   CASE WHEN set_2_reps > 0 THEN 1 ELSE 0 END +
                   CASE WHEN set_3_reps > 0 THEN 1 ELSE 0 END) as total_sets
        FROM workout_logs
        WHERE date BETWEEN :startTime AND :endTime
        GROUP BY exercise_id
    """)
    suspend fun getExerciseSumsInRange(startTime: Long, endTime: Long): List<ExerciseWeeklySum>
}`
  },
  {
    filename: 'WorkoutReminderWorker.kt',
    category: 'UI (Compose)',
    description: 'Android WorkManager & NotificationCompat builder for triggering scheduled workout alarms.',
    code: `package com.calisthenics.progressiveoverload.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.calisthenics.progressiveoverload.MainActivity

class WorkoutReminderWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    companion object {
        const val CHANNEL_ID = "calisthenics_workout_reminders"
        const val KEY_DAY_NAME = "key_day_name"
        const val KEY_FOCUS = "key_focus"
        const val KEY_MINUTES_BEFORE = "key_minutes_before"
    }

    override suspend fun doWork(): Result {
        val dayName = inputData.getString(KEY_DAY_NAME) ?: "Hari Ini"
        val focus = inputData.getString(KEY_FOCUS) ?: "Calisthenics Overload"
        val minutesBefore = inputData.getInt(KEY_MINUTES_BEFORE, 15)

        showNotification(dayName, focus, minutesBefore)
        return Result.success()
    }

    private fun showNotification(dayName: String, focus: String, minutesBefore: Int) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Jadwal Latihan Kalistenik",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Pengingat jadwal latihan progressive overload"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notificationText = if (minutesBefore > 0) {
            "Sesi $focus dimulai dalam $minutesBefore menit. Siapkan pull up bar & mental Anda!"
        } else {
            "Waktunya latihan $focus sekarang! Buka app & mulai timer sesi."
        }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("🏋️ Jadwal Latihan $dayName")
            .setContentText(notificationText)
            .setStyle(NotificationCompat.BigTextStyle().bigText(notificationText))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}`
  }
];

