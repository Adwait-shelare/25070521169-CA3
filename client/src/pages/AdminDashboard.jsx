import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  DollarSign,
  Calendar,
  Users,
  Compass,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  // Add Tour Modal State
  const [isAddTourOpen, setIsAddTourOpen] = useState(false);
  const [newTour, setNewTour] = useState({
    title: '',
    destination: '',
    category: 'Luxury',
    duration: '5 Days / 4 Nights',
    price: 25000,
    capacity: 15,
    overview: '',
    availableDates: '2026-11-20, 2026-12-05, 2026-12-20',
    images: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, toursRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
        api.get('/tours'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (toursRes.data.success) setTours(toursRes.data.tours);
    } catch (error) {
      console.error('[Admin] Fetch error:', error);
      addToast('Failed to load administrative analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-slate-900">Administrator Access Only</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal requires administrator privileges. Please sign in with the admin evaluation
          account: <br />
          <strong className="text-slate-800">admin@wanderly.com / Admin@123</strong>
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(res.data.message, 'success');
        fetchAdminData();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Error updating status', 'error');
    }
  };

  const handleDeleteTour = async (tourId, title) => {
    if (!window.confirm(`Are you sure you want to delete tour "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/tours/${tourId}`);
      if (res.data.success) {
        addToast('Tour package removed successfully.', 'success');
        fetchAdminData();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete tour', 'error');
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTour,
        price: Number(newTour.price),
        capacity: Number(newTour.capacity),
        availableDates: newTour.availableDates.split(',').map((d) => d.trim()),
        images: newTour.images.split(',').map((img) => img.trim()),
      };

      const res = await api.post('/admin/tours', payload);
      if (res.data.success) {
        addToast('New expedition published successfully!', 'success');
        setIsAddTourOpen(false);
        fetchAdminData();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Error creating tour', 'error');
    }
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Security Level: Administrator
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
            Wanderly Executive Console
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ₹
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">
            {formatPrice(stats?.totalRevenue)}
          </p>
          <p className="text-xs text-slate-500">Confirmed Booking Revenue</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">
            {stats?.totalBookings || 0}
          </p>
          <p className="text-xs text-slate-500">Total Reservations Logged</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{stats?.totalTours || 0}</p>
          <p className="text-xs text-slate-500">Active Expeditions</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{stats?.totalUsers || 0}</p>
          <p className="text-xs text-slate-500">Registered Travelers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tours'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Manage Tours ({tours.length})
          </button>
        </div>

        {activeTab === 'tours' && (
          <button
            onClick={() => setIsAddTourOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expedition</span>
          </button>
        )}
      </div>

      {/* Tab 1: Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Lead Traveler</th>
                  <th className="px-6 py-4">Expedition</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Guests</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status & Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-teal-700">
                      {b.bookingReference}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.contactDetails?.name}</p>
                      <p className="text-[11px] text-slate-400">{b.contactDetails?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">
                      {b.tourId?.title || 'Tour'}
                    </td>
                    <td className="px-6 py-4">{b.travelDate}</td>
                    <td className="px-6 py-4">{b.travelers}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatPrice(b.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none cursor-pointer border ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tours Table */}
      {activeTab === 'tours' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Tour Title</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tours.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-serif font-bold text-slate-900 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="px-6 py-4">{t.destination}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-[11px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{t.duration}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatPrice(t.price)}
                    </td>
                    <td className="px-6 py-4">{t.capacity} Guests</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteTour(t._id, t.title)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Tour Modal */}
      {isAddTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Add New Tour Expedition
              </h3>
              <button
                onClick={() => setIsAddTourOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTour.title}
                  onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                  placeholder="e.g. Swiss Alps: Zermatt & Matterhorn Glacier"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={newTour.destination}
                    onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                    placeholder="Switzerland"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTour.category}
                    onChange={(e) => setNewTour({ ...newTour, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Spiritual">Spiritual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={newTour.duration}
                    onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                    placeholder="6 Days / 5 Nights"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newTour.price}
                    onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={newTour.capacity}
                    onChange={(e) => setNewTour({ ...newTour, capacity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Departure Dates (Comma-separated YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  required
                  value={newTour.availableDates}
                  onChange={(e) => setNewTour({ ...newTour, availableDates: e.target.value })}
                  placeholder="2026-11-20, 2026-12-05, 2026-12-20"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overview</label>
                <textarea
                  rows={3}
                  required
                  value={newTour.overview}
                  onChange={(e) => setNewTour({ ...newTour, overview: e.target.value })}
                  placeholder="Summary of itinerary highlights..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTourOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Save & Publish Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
