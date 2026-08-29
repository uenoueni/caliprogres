import React from 'react';
import { X, Calendar, TrendingUp, TrendingDown, Minus, Trash2, Dumbbell } from 'lucide-react';
import { ExerciseEntity, WorkoutLogEntity } from '../types';

interface HistoryBottomSheetProps {
  exercise: ExerciseEntity | null;
  logs: WorkoutLogEntity[];
  onClose: () => void;
  onDeleteLog: (logId: number) => void;
}

export const HistoryBottomSheet: React.FC<HistoryBottomSheetProps> = ({
  exercise,
  logs,
  onClose,
  onDeleteLog,
}) => {
  if (!exercise) return null;

  // Format log timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div
        id="history-bottom-sheet"
        className="relative w-full max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral-200/80 z-10 max-h-[88vh] flex flex-col overflow-hidden animate-slide-up"
      >
        {/* Handle for drag indicator on mobile */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                Riwayat: {exercise.name}
              </h3>
              <p className="text-xs text-neutral-500">
                Riwayat progres repetisi (diurutkan dari yang terbaru)
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

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-neutral-100">
          {logs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-700">Belum ada riwayat</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Isi repetisi Set 1, 2, dan 3 pada layar utama lalu klik Simpan untuk memulai log progresif gerakan ini.
              </p>
            </div>
          ) : (
            logs.map((log, index) => {
              const currentTotal = log.set_1_reps + log.set_2_reps + log.set_3_reps;
              const nextOlderLog = logs[index + 1];
              const olderTotal = nextOlderLog
                ? nextOlderLog.set_1_reps + nextOlderLog.set_2_reps + nextOlderLog.set_3_reps
                : null;
              const diff = olderTotal !== null ? currentTotal - olderTotal : null;

              return (
                <div
                  key={log.id}
                  className={`pt-3 first:pt-0 ${
                    index === 0 ? 'bg-blue-50/40 -mx-3 px-3 py-3 rounded-xl border border-blue-100/60 mb-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatDate(log.date)}</span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                          Terbaru
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Progressive Overload Delta Badge */}
                      {diff !== null ? (
                        diff > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            <TrendingUp className="w-3 h-3" />
                            +{diff} reps vs sebelumnya
                          </span>
                        ) : diff < 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            <TrendingDown className="w-3 h-3" />
                            {diff} reps vs sebelumnya
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                            <Minus className="w-3 h-3" />
                            Sama dengan sebelumnya
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">
                          Sesi Awal (Baseline)
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteLog(log.id)}
                        title="Hapus log ini"
                        className="p-1 text-neutral-300 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Sets Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center bg-white p-2.5 rounded-lg border border-neutral-200/80 shadow-2xs">
                    <div className="border-r border-neutral-100">
                      <span className="block text-[10px] uppercase font-bold text-neutral-400">Set 1</span>
                      <span className="text-sm font-bold text-neutral-800">{log.set_1_reps} <span className="text-[10px] font-normal text-neutral-400">reps</span></span>
                    </div>
                    <div className="border-r border-neutral-100">
                      <span className="block text-[10px] uppercase font-bold text-neutral-400">Set 2</span>
                      <span className="text-sm font-bold text-neutral-800">{log.set_2_reps} <span className="text-[10px] font-normal text-neutral-400">reps</span></span>
                    </div>
                    <div className="border-r border-neutral-100">
                      <span className="block text-[10px] uppercase font-bold text-neutral-400">Set 3</span>
                      <span className="text-sm font-bold text-neutral-800">{log.set_3_reps} <span className="text-[10px] font-normal text-neutral-400">reps</span></span>
                    </div>
                    <div className="bg-neutral-50 rounded-md py-0.5">
                      <span className="block text-[10px] uppercase font-bold text-blue-600">Total</span>
                      <span className="text-sm font-black text-blue-700">{currentTotal}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
          <span>Total {logs.length} catatan latihan tersimpan</span>
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
