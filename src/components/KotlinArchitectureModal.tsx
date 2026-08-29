import React, { useState } from 'react';
import { Copy, Check, FileCode, Layers, Database, Shield, BookOpen } from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../data/kotlinCodeData';

export const KotlinArchitectureModal: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Entity':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dao':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Database':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Repository':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ViewModel':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'UI (Compose)':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Database className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-neutral-900">
                Struktur Arsitektur Room Database & MVVM (Kotlin Android)
              </h2>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
              Berikut adalah kode lengkap dan siap pakai (production-ready) untuk implementasi Room Database tahap pertama:
              Entity <code>ExerciseEntity</code> & <code>WorkoutLogEntity</code>, DAO (<code>ExerciseDao</code>, <code>WorkoutLogDao</code>), Database class dengan callback pre-populasi 5 gerakan wajib, Repository, dan ViewModel.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-neutral-500 font-mono">
            <span className="px-2.5 py-1 bg-neutral-100 rounded-md border border-neutral-200">
              Room 2.6.1 + Jetpack Compose
            </span>
          </div>
        </div>

        {/* 5 Mandatory exercises badge */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-neutral-500 mr-1">5 Gerakan Default:</span>
          {['Pull up', 'Push up', 'Diamond push up', 'Pike push up', 'Dip'].map((name) => (
            <span
              key={name}
              className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-medium text-[11px] border border-neutral-200/60"
            >
              ✓ {name}
            </span>
          ))}
        </div>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* File Navigator */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 shadow-xs p-3 space-y-1">
          <div className="px-2 py-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Project Files</span>
            <Layers className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-1">
            {KOTLIN_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-200 shadow-2xs text-blue-900 font-semibold'
                      : 'bg-transparent border-transparent hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 font-mono text-[12px]">
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-neutral-400'}`} />
                      <span>{file.filename}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-medium border ${getCategoryColor(
                        file.category
                      )}`}
                    >
                      {file.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 line-clamp-1 font-sans font-normal">
                    {file.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg overflow-hidden text-neutral-100 font-mono">
          {/* Code Viewer Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 font-bold text-neutral-300">{selectedFile.filename}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-sans transition-colors border border-neutral-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy Kotlin Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-neutral-850 border-b border-neutral-800/80 text-neutral-400 text-xs font-sans">
            <span className="text-neutral-300 font-medium">{selectedFile.category}:</span> {selectedFile.description}
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto text-[12.5px] leading-relaxed max-h-[520px] overflow-y-auto selection:bg-blue-600 selection:text-white">
            <pre className="text-neutral-200 font-['JetBrains_Mono',monospace]">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Quick Setup Instructions Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-neutral-900">Cara Integrasi di Android Studio:</h3>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-700 leading-relaxed pl-1">
          <li>
            Tambahkan plugin <strong>ksp</strong> dan dependencies Room ke file <code>build.gradle.kts (Module :app)</code> seperti yang tertera di tab <strong>build.gradle.kts</strong>.
          </li>
          <li>
            Buat package <code>data/local/entity</code> dan letakkan <code>ExerciseEntity.kt</code> & <code>WorkoutLogEntity.kt</code>.
          </li>
          <li>
            Buat package <code>data/local/dao</code> dan letakkan <code>ExerciseDao.kt</code> & <code>WorkoutLogDao.kt</code>.
          </li>
          <li>
            Buat <code>AppDatabase.kt</code>. Callback <code>RoomDatabase.Callback</code> otomatis memuat 5 gerakan default saat pertama kali database dibuat.
          </li>
          <li>
            Gunakan <code>WorkoutRepository</code> dan <code>WorkoutViewModel</code> untuk menghubungkan database ke UI Jetpack Compose.
          </li>
        </ol>
      </div>
    </div>
  );
};
