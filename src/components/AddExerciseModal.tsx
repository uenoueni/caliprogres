import React, { useState } from 'react';
import { X, Plus, Dumbbell, Sparkles } from 'lucide-react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (name: string) => void;
}

const PRESET_SUGGESTIONS = [
  'Muscle up',
  'Handstand push up',
  'Australian pull up',
  'Chin up',
  'L-sit pull up',
  'Bulgarian split squat',
  'Ring dip',
  'Archer push up',
  'Leg raise',
  'Hanging knee raise',
];

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onAddExercise,
}) => {
  const [exerciseName, setExerciseName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = exerciseName.trim();
    if (!trimmed) {
      setError('Nama gerakan tidak boleh kosong');
      return;
    }
    onAddExercise(trimmed);
    setExerciseName('');
    setError(null);
    onClose();
  };

  const handleSelectSuggestion = (name: string) => {
    onAddExercise(name);
    setExerciseName('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 z-10 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Tambah Gerakan Baru
              </h3>
              <p className="text-xs text-neutral-500">
                Tambahkan variasi latihan kalistenik ke database Room
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="custom-exercise-input"
              className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
            >
              Nama Gerakan
            </label>
            <input
              id="custom-exercise-input"
              type="text"
              placeholder="Contoh: Muscle up, Handstand push up"
              value={exerciseName}
              onChange={(e) => {
                setExerciseName(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white text-sm font-semibold text-neutral-900 rounded-lg border border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-hidden transition-all"
            />
            {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
          </div>

          {/* Quick Suggestions */}
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Saran Gerakan Kalistenik Populer:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectSuggestion(preset)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-neutral-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-neutral-200/70 text-neutral-700 font-medium transition-all"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Gerakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
