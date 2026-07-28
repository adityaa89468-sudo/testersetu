import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Coins,
  MessageSquare
} from 'lucide-react';
import { AppNotification } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from '../lib/firebase';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q, 
      (snapshot) => {
        const list: AppNotification[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification));
        list.sort((a, b) => b.createdAt - a.createdAt);
        setNotifications(list);
      },
      (err) => {
        console.warn("Notifications snapshot warning:", err.message);
      }
    );

    return () => unsub();
  }, [user]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      const unreadList = notifications.filter(n => !n.read);
      for (const n of unreadList) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-black">Notifications</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
              {notifications.filter(n => !n.read).length} New
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
              title="Mark All Read"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-1 ${
                  notif.read
                    ? 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800/80 opacity-80'
                    : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {notif.type === 'proof_accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {notif.type === 'proof_rejected' && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                    {notif.type === 'campaign_completed' && <Award className="w-3.5 h-3.5 text-amber-500" />}
                    {notif.type === 'chat_message' && <MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
                    <span>{notif.title}</span>
                  </h3>

                  <button
                    onClick={() => handleDeleteNotif(notif.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {notif.message}
                </p>

                <p className="text-[10px] text-slate-400 font-mono pt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
