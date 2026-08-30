import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Repeat,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Share2,
  Check,
  Zap,
} from 'lucide-react';
import { WeeklyComparisonReport } from '../types';

interface WeeklyReportViewProps {
  report: WeeklyComparisonReport | null;
  onRefresh: () => void;
  onClose?: () => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  report,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
        <p className="text-neutral-500 text-sm">Memuat perbandingan mingguan...</p>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}j ${remMins}m`;
    }
    return `${mins} menit`;
  };

  const handleCopySummary = () => {
    const summaryText = `📊 CALISTHENICS WEEKLY PROGRESS REPORT\n\n` +
      `Minggu Ini vs Minggu Kemarin:\n` +
      `⏱️ Total Durasi: ${formatDuration(report.totalDurationSeconds.thisWeek)} (${report.totalDurationSeconds.diff >= 0 ? '+' : ''}${Math.round(report.totalDurationSeconds.diff / 60)}m / ${report.totalDurationSeconds.percentageChange}%)\n` +
      `🔁 Total Repetisi: ${report.totalReps.thisWeek} reps (${report.totalReps.diff >= 0 ? '+' : ''}${report.totalReps.diff} reps / ${report.totalReps.percentageChange}%)\n` +
      `📦 Total Set: ${report.totalSets.thisWeek} set (${report.totalSets.diff >= 0 ? '+' : ''}${report.totalSets.diff} set)\n` +
      `⚡ Rata-rata Reps/Set: ${report.averageRepsPerSet.thisWeek} reps/set\n\n` +
      `Detail Gerakan:\n` +
      report.exercisesMatrix.map(ex => `• ${ex.exerciseName}: ${ex.thisWeekReps} reps (${ex.diffReps >= 0 ? '+' : ''}${ex.diffReps} reps, ${ex.percentageRepsChange}%)`).join('\n') +
      `\n\n💡 Catatan:\n${report.summaryInsight}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Report Header Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Laporan Mingguan & Progressive Overload
              </span>
              {report.overallStatus === 'overload' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Overload Naik!
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Perbandingan Minggu Ini vs Minggu Kemarin
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Matriks Evaluasi Volume & Intensitas 7 Hari</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-neutral-300" />
                  <span>Salin Ringkasan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/15 text-xs transition-colors cursor-pointer"
              title="Perbarui Data"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Insight Summary Banner */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-white mb-0.5">Ringkasan Analisis Progresi</p>
            <p className="text-neutral-300">{report.summaryInsight}</p>
          </div>
        </div>
      </div>

      {/* KPI Matrix Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Durasi */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Total Durasi
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                report.totalDurationSeconds.diff > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : report.totalDurationSeconds.diff < 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {report.totalDurationSeconds.diff > 0 && <TrendingUp className="w-3 h-3" />}
              {report.totalDurationSeconds.diff < 0 && <TrendingDown className="w-3 h-3" />}
              {report.totalDurationSeconds.diff === 0 && <Minus className="w-3 h-3" />}
              {report.totalDurationSeconds.diff >= 0 ? '+' : ''}
              {report.totalDurationSeconds.percentageChange}%
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {formatDuration(report.totalDurationSeconds.thisWeek)}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mt-1 pt-1.5 border-t border-neutral-100">
              <span>Minggu Lalu:</span>
              <span className="font-medium text-neutral-700">
                {formatDuration(report.totalDurationSeconds.lastWeek)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Total Repetisi */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-indigo-600" />
              Total Repetisi
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                report.totalReps.diff > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : report.totalReps.diff < 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {report.totalReps.diff > 0 && <TrendingUp className="w-3 h-3" />}
              {report.totalReps.diff < 0 && <TrendingDown className="w-3 h-3" />}
              {report.totalReps.diff === 0 && <Minus className="w-3 h-3" />}
              {report.totalReps.diff >= 0 ? '+' : ''}
              {report.totalReps.diff} reps ({report.totalReps.percentageChange}%)
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {report.totalReps.thisWeek}{' '}
              <span className="text-xs font-normal text-neutral-400">reps</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mt-1 pt-1.5 border-t border-neutral-100">
              <span>Minggu Lalu:</span>
              <span className="font-medium text-neutral-700">
                {report.totalReps.lastWeek} reps
              </span>
            </div>
          </div>
        </div>

        {/* 3. Total Set */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Total Set Selesai
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                report.totalSets.diff > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : report.totalSets.diff < 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {report.totalSets.diff >= 0 ? `+${report.totalSets.diff}` : `${report.totalSets.diff}`} set
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {report.totalSets.thisWeek}{' '}
              <span className="text-xs font-normal text-neutral-400">sets</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mt-1 pt-1.5 border-t border-neutral-100">
              <span>Minggu Lalu:</span>
              <span className="font-medium text-neutral-700">
                {report.totalSets.lastWeek} sets
              </span>
            </div>
          </div>
        </div>

        {/* 4. Rata-Rata Reps/Set */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Reps / Set Rata-rata
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                report.averageRepsPerSet.diff > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : report.averageRepsPerSet.diff < 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {report.averageRepsPerSet.diff >= 0 ? `+${report.averageRepsPerSet.diff}` : `${report.averageRepsPerSet.diff}`}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {report.averageRepsPerSet.thisWeek}{' '}
              <span className="text-xs font-normal text-neutral-400">reps/set</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mt-1 pt-1.5 border-t border-neutral-100">
              <span>Minggu Lalu:</span>
              <span className="font-medium text-neutral-700">
                {report.averageRepsPerSet.lastWeek} reps/set
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">
              Tabel Matriks Pembanding per Gerakan
            </h3>
            <p className="text-xs text-neutral-500">
              Perbandingan detail repetisi dan set tiap gerakan antara Minggu Ini dan Minggu Kemarin
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {report.exercisesMatrix.length} Gerakan Terpantau
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4 sm:px-6">Gerakan (Exercise)</th>
                <th className="py-3 px-4 text-center">Minggu Kemarin</th>
                <th className="py-3 px-4 text-center">Minggu Ini</th>
                <th className="py-3 px-4 text-center">Perubahan Overload</th>
                <th className="py-3 px-4 sm:px-6 text-right">Status Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {report.exercisesMatrix.map((row) => {
                const isOverload = row.status === 'overload';
                const isRegressed = row.status === 'regressed';
                const isNew = row.status === 'new';

                return (
                  <tr key={row.exerciseId} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Exercise Name & Sets */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-neutral-900">{row.exerciseName}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {row.thisWeekSets} set dikerjakan minggu ini
                      </div>
                    </td>

                    {/* Last Week */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-semibold text-neutral-700">
                        {row.lastWeekReps} <span className="text-[11px] text-neutral-400 font-normal">reps</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {row.lastWeekSets} sets
                      </div>
                    </td>

                    {/* This Week */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-black text-neutral-900">
                        {row.thisWeekReps} <span className="text-[11px] text-neutral-400 font-normal">reps</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        {row.thisWeekSets} sets
                      </div>
                    </td>

                    {/* Delta Overload */}
                    <td className="py-3.5 px-4 text-center">
                      <div
                        className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                          isOverload
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isRegressed
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isNew
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {isOverload && <TrendingUp className="w-3 h-3" />}
                        {isRegressed && <TrendingDown className="w-3 h-3" />}
                        {row.diffReps >= 0 ? `+${row.diffReps}` : `${row.diffReps}`} reps{' '}
                        {row.lastWeekReps > 0 && `(${row.percentageRepsChange > 0 ? '+' : ''}${row.percentageRepsChange}%)`}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {isOverload && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100/70 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Overload Sukses
                        </span>
                      )}
                      {isRegressed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100/70 text-rose-800">
                          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                          Perlu Ditingkatkan
                        </span>
                      )}
                      {isNew && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100/70 text-blue-800">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Gerakan Baru
                        </span>
                      )}
                      {!isOverload && !isRegressed && !isNew && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700">
                          <Minus className="w-3.5 h-3.5 text-neutral-500" />
                          Volume Terjaga
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Volume Comparison Bars */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
        <h3 className="font-bold text-neutral-900 text-base mb-1">
          Visualisasi Distribusi Repetisi Mingguan
        </h3>
        <p className="text-xs text-neutral-500 mb-5">
          Perbandingan proporsi volume repetisi Minggu Ini (biru) vs Minggu Kemarin (abu-abu)
        </p>

        <div className="space-y-4">
          {report.exercisesMatrix.map((item) => {
            const maxReps = Math.max(item.thisWeekReps, item.lastWeekReps, 1);
            const thisWeekWidth = Math.min(100, Math.round((item.thisWeekReps / (maxReps * 1.15)) * 100));
            const lastWeekWidth = Math.min(100, Math.round((item.lastWeekReps / (maxReps * 1.15)) * 100));

            return (
              <div key={item.exerciseId} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-800">{item.exerciseName}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-neutral-500">Kemarin: <b className="text-neutral-700">{item.lastWeekReps}</b></span>
                    <span className="text-blue-700 font-bold">Minggu Ini: {item.thisWeekReps} reps</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {/* Last Week Bar */}
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-neutral-400 rounded-full transition-all duration-500"
                      style={{ width: `${lastWeekWidth}%` }}
                    />
                  </div>
                  {/* This Week Bar */}
                  <div className="h-2.5 bg-blue-50 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${thisWeekWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
