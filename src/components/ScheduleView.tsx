import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  CalendarDays,
  ShieldCheck,
  Edit2,
  X,
  Sparkles,
} from 'lucide-react';
import { WorkoutScheduleEntity } from '../types';
import { DAY_NAMES } from '../db/roomDatabase';
import { requestNotificationPermission, sendLocalNotification } from '../utils/notificationService';

interface ScheduleViewProps {
  schedules: WorkoutScheduleEntity[];
  onSaveSchedule: (schedule: Omit<WorkoutScheduleEntity, 'id'> & { id?: number }) => Promise<void>;
  onToggleSchedule: (id: number, isEnabled: boolean) => Promise<void>;
  onDeleteSchedule: (id: number) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'info' | 'warning') => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedules,
  onSaveSchedule,
  onToggleSchedule,
  onDeleteSchedule,
  onShowToast,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(1); // Monday default
  const [time, setTime] = useState<string>('06:30');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number>(15);
  const [exerciseFocus, setExerciseFocus] = useState<string>('Upper Calisthenics Overload');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'default'
  );

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      onShowToast('Izin notifikasi berhasil diaktifkan!', 'success');
      sendLocalNotification('🔔 Pengingat Latihan Diaktifkan', {
        body: 'Notifikasi jadwal latihan calisthenics kini aktif.',
      });
    } else {
      onShowToast('Izin notifikasi ditolak oleh browser.', 'warning');
    }
  };

  const handleTestNotification = () => {
    sendLocalNotification('🏋️ Waktunya Latihan Kalistenik!', {
      body: 'Jadwal latihan Anda dimulai dalam 15 menit. Siapkan pull up bar dan matras!',
    });
    onShowToast('Notifikasi pengingat latihan berhasil diuji!', 'success');
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setSelectedDayOfWeek(1);
    setTime('06:30');
    setReminderMinutesBefore(15);
    setExerciseFocus('Pull & Push Focus');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (schedule: WorkoutScheduleEntity) => {
    setEditingId(schedule.id);
    setSelectedDayOfWeek(schedule.dayOfWeek);
    setTime(schedule.time);
    setReminderMinutesBefore(schedule.reminderMinutesBefore);
    setExerciseFocus(schedule.exerciseFocus);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dayName = DAY_NAMES[selectedDayOfWeek] || 'Senin';
    await onSaveSchedule({
      id: editingId || undefined,
      dayOfWeek: selectedDayOfWeek,
      dayName,
      time,
      reminderMinutesBefore: Number(reminderMinutesBefore),
      isEnabled: true,
      exerciseFocus: exerciseFocus.trim() || 'Calisthenics Session',
    });

    setIsFormOpen(false);
    onShowToast(
      editingId ? 'Jadwal latihan berhasil diperbarui!' : 'Jadwal latihan baru berhasil ditambahkan!',
      'success'
    );
  };

  const reminderOptions = [
    { value: 0, label: 'Tepat saat jam latihan (0 mnt)' },
    { value: 5, label: '5 menit sebelumnya' },
    { value: 10, label: '10 menit sebelumnya' },
    { value: 15, label: '15 menit sebelumnya (Rekomendasi)' },
    { value: 30, label: '30 menit sebelumnya' },
    { value: 60, label: '1 jam sebelumnya' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                Jadwal & Pengingat Latihan
              </span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Atur Hari & Jam Latihan Kalistenik
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Notifikasi otomatis akan muncul beberapa menit sebelum sesi latihan dimulai agar overload tetap konsisten.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestNotification}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-neutral-600" />
              <span>Tes Notifikasi</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          </div>
        </div>

        {/* Notification Permission State Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-neutral-600">
              Status Notifikasi Browser:
              <strong className="ml-1 text-neutral-900 capitalize">
                {permissionStatus === 'granted' ? 'Aktif (Diizinkan)' : permissionStatus === 'denied' ? 'Ditolak' : 'Belum Diizinkan'}
              </strong>
            </span>
          </div>

          {permissionStatus !== 'granted' && (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline text-xs"
            >
              Izinkan Notifikasi Sekarang
            </button>
          )}
        </div>
      </div>

      {/* Schedule Form Modal / Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-neutral-900 text-base">
                  {editingId ? 'Ubah Jadwal Latihan' : 'Tambah Jadwal Latihan'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Day Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Pilih Hari Latihan
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {DAY_NAMES.map((name, idx) => {
                    const isSelected = selectedDayOfWeek === idx;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedDayOfWeek(idx)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Picker & Reminder Offset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Jam Latihan
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Waktu Pengingat
                  </label>
                  <select
                    value={reminderMinutesBefore}
                    onChange={(e) => setReminderMinutesBefore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {reminderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Focus / Target Note */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Fokus Sesi / Catatan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pull Up & Dip Progression, Core"
                  value={exerciseFocus}
                  onChange={(e) => setExerciseFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
            <CalendarDays className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-neutral-600 text-sm font-semibold">Belum ada jadwal latihan</p>
            <p className="text-neutral-400 text-xs mt-1">
              Klik &quot;Tambah Jadwal&quot; untuk menentukan hari dan jam latihan rutin Anda.
            </p>
          </div>
        ) : (
          schedules.map((schedule) => {
            return (
              <div
                key={schedule.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  schedule.isEnabled ? 'border-neutral-200/90' : 'border-neutral-200/50 opacity-60 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                      schedule.isEnabled
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                    }`}
                  >
                    <span className="text-xs uppercase">{schedule.dayName.slice(0, 3)}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-neutral-900">{schedule.dayName}</h4>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-neutral-100 text-neutral-800">
                        <Clock className="w-3 h-3 text-blue-600" />
                        {schedule.time}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-neutral-500">
                      <span className="font-medium text-neutral-700">{schedule.exerciseFocus}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        {schedule.reminderMinutesBefore === 0
                          ? 'Tepat waktu'
                          : `Notif ${schedule.reminderMinutesBefore} mnt sebelum`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  {/* Active Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={schedule.isEnabled}
                      onChange={(e) => onToggleSchedule(schedule.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 relative"></div>
                    <span className="text-xs font-semibold text-neutral-600">
                      {schedule.isEnabled ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(schedule)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      title="Edit Jadwal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Android Architecture Reference Card */}
      <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 rounded-2xl border border-indigo-100 p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs text-neutral-700 space-y-1">
            <h4 className="font-bold text-neutral-900 text-sm">
              Arsitektur Notifikasi Android (WorkManager + AlarmManager)
            </h4>
            <p className="text-neutral-600 leading-relaxed">
              Di Android Kotlin, jadwal ini disimpan pada Room DB Table <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-700 font-mono">workout_schedules</code> dan dieksekusi secara presisi menggunakan <strong>AlarmManager.setExactAndAllowWhileIdle()</strong> serta <strong>WorkManager</strong> untuk memicu <em>NotificationCompat.Builder</em> beberapa menit sebelum jam latihan meski smartphone dalam kondisi terkunci (Doze Mode).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
