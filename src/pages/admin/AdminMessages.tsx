import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MailOpen, Trash2, User, Clock, Search, Check, X, Reply } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase.from('cms_contact_messages').select('*').order('created_at', { ascending: false });
      if (filterStatus === 'unread') query = query.eq('is_read', false);
      if (filterStatus === 'read') query = query.eq('is_read', true);
      const { data } = await query;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (msg: Message) => {
    try {
      await supabase.from('cms_contact_messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', msg.id);
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await supabase.from('cms_contact_messages').delete().eq('id', id);
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Contact form submissions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1.5 text-sm">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-2">
          {loading ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" /></div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) markAsRead(msg);
                  }}
                className={`p-4 rounded-xl cursor-pointer border ${selectedMessage?.id === msg.id ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.is_read ? 'bg-slate-100 text-slate-400' : 'bg-orange-100 text-orange-500'}`}>
                    {msg.is_read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{msg.name}</p>
                    <p className="text-sm text-slate-500 truncate">{msg.email}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">No messages</div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedMessage.name}</h2>
                    <p className="text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMessage.phone && (
                    <a href={`tel:${selectedMessage.phone}`} className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium">
                      Call
                    </a>
                  )}
                  <a href={`mailto:${selectedMessage.email}`} className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Reply className="w-4 h-4" /> Reply
                  </a>
                  <button onClick={() => deleteMessage(selectedMessage.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Phone</p>
                  <p className="font-medium">{selectedMessage.phone || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Subject</p>
                  <p className="font-medium">{selectedMessage.subject || 'General Inquiry'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Received</p>
                  <p className="font-medium">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Message</p>
                <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
