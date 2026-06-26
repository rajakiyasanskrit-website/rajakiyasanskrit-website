import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/admin-auth';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Pin,
  Star,
  Save,
  X,
  ArrowLeft,
  FileText,
} from 'lucide-react';

interface Notice {
  id: string;
  title_np: string;
  title_en: string | null;
  content_np: string;
  content_en: string | null;
  slug: string | null;
  category: string;
  priority: string;
  status: string;
  is_pinned: boolean;
  is_featured: boolean;
  publish_date: string;
  expiry_date: string | null;
  pdf_url: string | null;
  thumbnail_url: string | null;
  views_count: number;
  created_at: string;
  deleted_at: string | null;
}

export default function AdminNotices() {
  const { user } = useAdminAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPage, setFilterPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, [filterStatus, filterPage]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cms_notices')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      if (searchQuery) {
        query = query.ilike('title_np', `%${searchQuery}%`);
      }

      query = query.range((filterPage - 1) * 15, filterPage * 15);
      const { data } = await query;
      if (data) setNotices(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return;
    setDeleteLoading(true);
    try {
      // Soft delete
      const { error } = await supabase
        .from('cms_notices')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', noticeToDelete.id);

      if (!error) {
        // Log activity
        await supabase.from('cms_activity_log').insert({
          user_id: user?.id,
          action: 'delete',
          resource_type: 'notice',
          resource_id: noticeToDelete.id,
          resource_title: noticeToDelete.title_np,
          details: { action: 'soft_delete' }
        });
      }
      setShowDeleteModal(false);
      setNoticeToDelete(null);
      fetchNotices();
    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePin = async (notice: Notice) => {
    try {
      await supabase
        .from('cms_notices')
        .update({ is_pinned: !notice.is_pinned })
        .eq('id', notice.id);
      fetchNotices();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleFeature = async (notice: Notice) => {
    try {
      await supabase
        .from('cms_notices')
        .update({ is_featured: !notice.is_featured })
        .eq('id', notice.id);
      fetchNotices();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-600',
    normal: 'bg-orange-100 text-orange-600',
    low: 'bg-slate-100 text-slate-600'
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    published: 'bg-green-100 text-green-600',
    archived: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="space-y-6">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Delete Notice?</h3>
                <p className="text-sm text-slate-500">This action moves it to trash.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete "{noticeToDelete?.title_np}"? You can restore it later from trash.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNotice}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notices</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage school announcements and notices</p>
        </div>
        <button
          onClick={() => navigate('/main_box/notices/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Notice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button
            onClick={fetchNotices}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Notices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
          </div>
        ) : notices.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      {notice.is_pinned && (
                        <Pin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{notice.title_np}</p>
                        {notice.title_en && (
                          <p className="text-sm text-slate-500">{notice.title_en}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {notice.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[notice.status]}`}>
                      {notice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm text-slate-500">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePin(notice)}
                        className={`p-2 rounded-lg transition-colors ${notice.is_pinned ? 'bg-orange-100 text-orange-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
                        title={notice.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFeature(notice)}
                        className={`p-2 rounded-lg transition-colors ${notice.is_featured ? 'bg-amber-100 text-amber-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
                        title={notice.is_featured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/main_box/notices/edit/${notice.id}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setNoticeToDelete(notice);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No notices found</p>
            <button
              onClick={() => navigate('/main_box/notices/new')}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              Create your first notice
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {notices.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing {notices.length} notices</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPage(p => Math.max(1, p - 1))}
              disabled={filterPage === 1}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilterPage(p => p + 1)}
              disabled={notices.length < 15}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
