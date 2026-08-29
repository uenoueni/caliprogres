import React from 'react';
import { Calendar, Code2, Smartphone, RotateCcw, ShieldCheck, Plus, Layers } from 'lucide-react';

interface TopAppBarProps {
  activeTab: 'app' | 'kotlin';
  setActiveTab: (tab: 'app' | 'kotlin') => void;
  onResetData: () => void;
  onOpenAddExercise: () => void;
  onOpenSessionHistory: () => void;
  sessionCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  setActiveTab,
  onResetData,
  onOpenAddExercise,
  onOpenSessionHistory,
  sessionCount,
}) => {
  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Date */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs">
                  PO
                </span>
                <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-tight">
                  Calisthenics Overload
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Room DB Offline
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{dateFormatted}</span>
              </div>
            </div>

            {/* Quick actions for mobile */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenAddExercise}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenSessionHistory}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1"
              >
                <Layers className="w-4 h-4" />
                <span>({sessionCount})</span>
              </button>
            </div>
          </div>

          {/* Action Tabs & Controls */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenAddExercise}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Gerakan</span>
              </button>

              <button
                type="button"
                onClick={onOpenSessionHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Riwayat Sesi ({sessionCount})</span>
              </button>
            </div>

            {/* View Switcher: App vs Kotlin Code */}
            <div className="flex p-1 bg-neutral-100 rounded-lg border border-neutral-200/70">
              <button
                type="button"
                onClick={() => setActiveTab('app')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'app'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Layar Interaktif Aplikasi"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>App</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kotlin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'kotlin'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Arsitektur Room DB, DAO, dan ViewModel"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kotlin Code</span>
              </button>
            </div>

            {/* Reset Database button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset sample data ke default"
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors border border-neutral-200/60 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
