import React, { useState, useEffect } from 'react';
import { Play, Square, Timer, Flame, CheckCircle2, X } from 'lucide-react';

interface WorkoutSessionTrackerProps {
  activeSession: { id: number; startTime: number } | null;
  onStartSession: () => void;
  onEndSession: () => void;
  onCancelSession: () => void;
  sessionRepsCount: number;
  sessionExercisesCount: number;
}

export const WorkoutSessionTracker: React.FC<WorkoutSessionTrackerProps> = ({
  activeSession,
  onStartSession,
  onEndSession,
  onCancelSession,
  sessionRepsCount,
  sessionExercisesCount,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showEndConfirm, setShowEndConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }

    // Calculate initial elapsed
    const updateElapsed = () => {
      const seconds = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setElapsedSeconds(seconds > 0 ? seconds : 0);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (!activeSession) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 leading-tight">
              Sesi Latihan Belum Dimulai
            </h2>
            <p className="text-xs text-neutral-500">
              Mulai sesi latihan untuk merekam durasi dan progres dalam 1 riwayat sesi utuh.
            </p>
          </div>
        </div>

        <button
          id="btn-start-workout"
          type="button"
          onClick={onStartSession}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-sm transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Workout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 sm:p-5 shadow-md border border-blue-800 animate-slide-up relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Timer & Live Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
              Sesi Latihan Aktif
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formatTimer(elapsedSeconds)}
            </div>
            <div className="text-xs text-blue-200">
              Durasi Latihan
            </div>
          </div>
        </div>

        {/* Live Session Stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-white/15 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-neutral-300 block text-[10px]">Gerakan</span>
              <span className="font-bold text-white text-sm">{sessionExercisesCount}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/20" />

          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-neutral-300 block text-[10px]">Total Reps</span>
              <span className="font-bold text-white text-sm">{sessionRepsCount}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!showEndConfirm ? (
            <>
              <button
                type="button"
                onClick={() => onCancelSession()}
                title="Batalkan Sesi"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                id="btn-end-workout"
                type="button"
                onClick={() => setShowEndConfirm(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-red-700 bg-white hover:bg-red-50 active:scale-98 shadow-sm transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-red-600 text-red-600" />
                <span>End Workout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-red-950/80 p-1.5 rounded-xl border border-red-500/50">
              <span className="text-xs font-semibold px-2 text-red-200">Akhiri Sesi?</span>
              <button
                type="button"
                onClick={() => {
                  setShowEndConfirm(false);
                  onEndSession();
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Ya, Selesai
              </button>
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
