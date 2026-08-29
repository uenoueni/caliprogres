import React, { useState, useEffect } from 'react';
import { History, TrendingUp, CheckCircle2, ChevronRight, Trash2 } from 'lucide-react';
import { ExerciseEntity, WorkoutLogEntity } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseEntity;
  latestLog: WorkoutLogEntity | null;
  todayLog: WorkoutLogEntity | null;
  historyCount: number;
  onSave: (exerciseId: number, set1: number, set2: number, set3: number) => void;
  onOpenHistory: (exercise: ExerciseEntity) => void;
  onDeleteExercise?: (exerciseId: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  latestLog,
  todayLog,
  historyCount,
  onSave,
  onOpenHistory,
  onDeleteExercise,
}) => {
  const [set1, setSet1] = useState<string>('');
  const [set2, setSet2] = useState<string>('');
  const [set3, setSet3] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);

  // If today's log exists, pre-fill inputs
  useEffect(() => {
    if (todayLog) {
      setSet1(todayLog.set_1_reps.toString());
      setSet2(todayLog.set_2_reps.toString());
      setSet3(todayLog.set_3_reps.toString());
    }
  }, [todayLog]);

  const handleNumericInput = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const sanitized = val.replace(/\D/g, '');
    setter(sanitized);
    setJustSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const s1 = parseInt(set1, 10) || 0;
    const s2 = parseInt(set2, 10) || 0;
    const s3 = parseInt(set3, 10) || 0;

    if (s1 === 0 && s2 === 0 && s3 === 0) {
      return;
    }

    onSave(exercise.id, s1, s2, s3);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
    }, 3000);
  };

  const currentTotal = (parseInt(set1, 10) || 0) + (parseInt(set2, 10) || 0) + (parseInt(set3, 10) || 0);
  const previousTotal = latestLog
    ? latestLog.set_1_reps + latestLog.set_2_reps + latestLog.set_3_reps
    : null;

  const diffReps = previousTotal !== null && currentTotal > 0 ? currentTotal - previousTotal : null;

  return (
    <div
      id={`exercise-card-${exercise.id}`}
      className="bg-white rounded-xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        {/* Header: Exercise Name, Custom badge, Delete & History trigger */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenHistory(exercise)}
              className="group text-left flex items-center gap-2 focus:outline-hidden"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                {exercise.name}
              </h2>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {exercise.is_custom && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* History link badge */}
            <button
              type="button"
              onClick={() => onOpenHistory(exercise)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-100 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat ({historyCount})</span>
            </button>

            {/* Custom exercise delete option */}
            {exercise.is_custom && onDeleteExercise && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Hapus gerakan "${exercise.name}" beserta seluruh riwayatnya?`)) {
                    onDeleteExercise(exercise.id);
                  }
                }}
                title="Hapus gerakan custom ini"
                className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Previous session reference for progressive overload */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-3 py-2 bg-neutral-50 rounded-lg text-xs text-neutral-600 border border-neutral-100">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-500">Sesi Terakhir:</span>
            {latestLog ? (
              <span className="font-medium text-neutral-800">
                Set 1: <strong className="text-neutral-900">{latestLog.set_1_reps}</strong> • Set 2:{' '}
                <strong className="text-neutral-900">{latestLog.set_2_reps}</strong> • Set 3:{' '}
                <strong className="text-neutral-900">{latestLog.set_3_reps}</strong> (Total: {previousTotal} reps)
              </span>
            ) : (
              <span className="text-neutral-400 italic">Belum ada data sebelumnya (Baseline)</span>
            )}
          </div>

          {diffReps !== null && diffReps !== 0 && (
            <div
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                diffReps > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <TrendingUp className={`w-3 h-3 ${diffReps < 0 ? 'rotate-180' : ''}`} />
              <span>{diffReps > 0 ? `+${diffReps} reps (Progress!)` : `${diffReps} reps`}</span>
            </div>
          )}
        </div>

        {/* 3 Set Input Columns & Save Button Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 items-end">
            {/* Set 1 */}
            <div>
              <label
                htmlFor={`ex-${exercise.id}-set1`}
                className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1"
              >
                Set 1
              </label>
              <div className="relative">
                <input
                  id={`ex-${exercise.id}-set1`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={set1}
                  onChange={(e) => handleNumericInput(e.target.value, setSet1)}
                  className="w-full text-center py-2 px-2 bg-neutral-50 focus:bg-white text-neutral-900 font-bold text-base rounded-lg border border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-neutral-400 font-medium pointer-events-none hidden sm:inline">
                  reps
                </span>
              </div>
            </div>

            {/* Set 2 */}
            <div>
              <label
                htmlFor={`ex-${exercise.id}-set2`}
                className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1"
              >
                Set 2
              </label>
              <div className="relative">
                <input
                  id={`ex-${exercise.id}-set2`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={set2}
                  onChange={(e) => handleNumericInput(e.target.value, setSet2)}
                  className="w-full text-center py-2 px-2 bg-neutral-50 focus:bg-white text-neutral-900 font-bold text-base rounded-lg border border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-neutral-400 font-medium pointer-events-none hidden sm:inline">
                  reps
                </span>
              </div>
            </div>

            {/* Set 3 */}
            <div>
              <label
                htmlFor={`ex-${exercise.id}-set3`}
                className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1"
              >
                Set 3
              </label>
              <div className="relative">
                <input
                  id={`ex-${exercise.id}-set3`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={set3}
                  onChange={(e) => handleNumericInput(e.target.value, setSet3)}
                  className="w-full text-center py-2 px-2 bg-neutral-50 focus:bg-white text-neutral-900 font-bold text-base rounded-lg border border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-hidden"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-neutral-400 font-medium pointer-events-none hidden sm:inline">
                  reps
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="col-span-3 sm:col-span-1">
              <button
                id={`btn-save-${exercise.id}`}
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {justSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-pulse" />
                    <span>Saved!</span>
                  </>
                ) : todayLog ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                    <span>Update</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
