import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, addDoc, sendNotification } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderRole: 'tester' | 'developer';
  text: string;
  timestamp: number;
}

interface TestingChatBoxProps {
  assignmentId: string;
  appName?: string;
  otherPartyName?: string;
  otherPartyId?: string;
  userRole: 'tester' | 'developer';
  compact?: boolean;
}

export const TestingChatBox: React.FC<TestingChatBoxProps> = ({
  assignmentId,
  appName = 'App Testing',
  otherPartyName = 'Developer/Tester',
  otherPartyId,
  userRole,
  compact = false
}) => {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserName = userProfile?.displayName || userProfile?.developerName || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (!assignmentId) return;

    const messagesRef = collection(db, `assignments/${assignmentId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        setMessages(msgs);
      },
      (error) => {
        console.warn('Chat snapshot listener warning:', error);
      }
    );

    return () => unsubscribe();
  }, [assignmentId]);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !assignmentId) return;

    const textToSend = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const chatDoc: ChatMessage = {
        senderId: user.uid,
        senderName: currentUserName,
        senderRole: userRole,
        text: textToSend,
        timestamp: Date.now()
      };

      await addDoc(collection(db, `assignments/${assignmentId}/messages`), chatDoc);

      // Send in-app notification to the other party if recipient ID is provided
      if (otherPartyId) {
        const roleTitle = userRole === 'tester' ? 'Tester' : 'Developer';
        sendNotification(
          otherPartyId,
          `New Message on ${appName} 💬`,
          `${currentUserName} (${roleTitle}): "${textToSend.length > 50 ? textToSend.slice(0, 50) + '...' : textToSend}"`,
          'chat_message',
          assignmentId
        ).catch((err) => console.warn('Failed to send chat notification:', err));
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 overflow-hidden shadow-sm transition-all">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 flex items-center justify-between cursor-pointer transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Live Chat with {userRole === 'tester' ? 'App Owner' : 'Tester'}
              </span>
              {messages.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black">
                  {messages.length}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Direct message regarding {appName} testing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[10px] font-medium hidden sm:inline">
            {isExpanded ? 'Hide Chat' : 'Open Chat'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Message History Window */}
          <div className="max-h-48 min-h-[120px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-6 px-4 space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  No chat messages yet.
                </p>
                <p className="text-[11px] text-slate-400">
                  Ask questions, report issues, or discuss testing progress here!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === user?.uid;
                const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </div>
                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${userRole === 'tester' ? 'App Owner' : 'Tester'}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
