import React from 'react';
import {
  Calendar,
  Code2,
  Dumbbell,
  BarChart3,
  Bell,
  RotateCcw,
  ShieldCheck,
  Plus,
  Layers,
} from 'lucide-react';

export type AppNavTab = 'workout' | 'report' | 'schedule' | 'kotlin';

interface TopAppBarProps {
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  onResetData: () => void;
  onOpenAddExercise: () => void;
  onOpenSessionHistory: () => void;
  sessionCount: number;
  hasOverload?: boolean;
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
    month: 'short',
  }).format(today);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:px-6">
        {/* Top line: Brand, date, quick actions & reset */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs shadow-xs">
                PO
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight leading-none">
                    Calisthenics Overload
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Room DB Offline
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>{dateFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons & Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenAddExercise}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              title="Tambah Gerakan Custom"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gerakan</span>
            </button>

            <button
              type="button"
              onClick={onOpenSessionHistory}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
              title="Riwayat Sesi Latihan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Riwayat Sesi</span>
              <span className="text-[11px] px-1 py-0.2 rounded bg-indigo-200/70 text-indigo-900 font-bold">
                {sessionCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onResetData}
              title="Reset data sample database"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors border border-neutral-200/60 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 mt-2.5 pt-2 border-t border-neutral-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'workout'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Latihan & Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Weekly Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Jadwal & Notif</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kotlin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'kotlin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kotlin Room Code</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

