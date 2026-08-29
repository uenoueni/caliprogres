import React from 'react';
import { X, Calendar, Clock, Flame, Dumbbell, Trash2, Layers } from 'lucide-react';
import { WorkoutSessionWithLogs } from '../types';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: WorkoutSessionWithLogs[];
  onDeleteSession: (sessionId: number) => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs} jam ${remMins} mnt`;
    }
    return `${mins} menit ${secs > 0 ? `${secs} dtk` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral-200 z-10 max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                Riwayat Sesi Workout
              </h3>
              <p className="text-xs text-neutral-500">
                Data rekaman latihan per 1 kali sesi penuh (Start s/d End Workout)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {sessions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-700">Belum ada sesi latihan</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Gunakan tombol <strong>Start Workout</strong> saat memulai latihan dan <strong>End Workout</strong> setelah selesai untuk mencatat riwayat sesi penuh di Room Database.
              </p>
            </div>
          ) : (
            sessions.map(({ session, logs }) => (
              <div
                key={session.id}
                className="bg-neutral-50/80 rounded-xl border border-neutral-200/90 p-4 space-y-3 hover:border-neutral-300 transition-all"
              >
                {/* Session Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-blue-100 text-blue-700 font-mono text-xs font-bold">
                      Sesi #{session.id}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-neutral-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatDate(session.startTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-md border border-neutral-200 text-xs text-neutral-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{formatDuration(session.durationSeconds)}</span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-900 font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>{session.totalReps} Reps</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteSession(session.id)}
                      title="Hapus riwayat sesi ini"
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Exercises performed during this session */}
                <div>
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Dumbbell className="w-3 h-3 text-neutral-400" />
                    <span>Gerakan yang Dilakukan ({logs.length}):</span>
                  </div>

                  {logs.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">
                      Tidak ada repetisi yang disimpan selama sesi ini.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {logs.map(({ log, exerciseName }) => {
                        const total = log.set_1_reps + log.set_2_reps + log.set_3_reps;
                        return (
                          <div
                            key={log.id}
                            className="bg-white p-2.5 rounded-lg border border-neutral-200 text-xs flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <span className="font-bold text-neutral-800 block">
                                {exerciseName}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                S1: <strong className="text-neutral-700">{log.set_1_reps}</strong> | S2: <strong className="text-neutral-700">{log.set_2_reps}</strong> | S3: <strong className="text-neutral-700">{log.set_3_reps}</strong>
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-black text-xs border border-blue-100">
                              {total} reps
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
          <span>Total {sessions.length} sesi latihan terekam</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-100 shadow-2xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
