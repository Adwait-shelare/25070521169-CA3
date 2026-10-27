import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  Tag,
  Shield,
  Printer,
  FileCheck,
  Lock,
  MapPin,
  Star,
  Check,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

const AVAILABLE_ADD_ONS = [
  {
    id: 'helicopter',
    name: 'Private Scenic Helicopter Tour',
    price: 6500,
    icon: '🚁',
    desc: 'Breathtaking 20-min aerial view of destination landmarks',
  },
  {
    id: 'dinner',
    name: 'Candlelight Gourmet Dinner Experience',
    price: 3500,
    icon: '🕯️',
    desc: '5-course private chef menu with panoramic views',
  },
  {
    id: 'photographer',
    name: 'Personal Travel Photographer & 4K Reel',
    price: 4000,
    icon: '📸',
    desc: 'Professional 1-hour photoshoot with 50 edited photos & reel',
  },
  {
    id: 'limousine',
    name: 'VIP Airport Chauffeur Limousine',
    price: 2500,
    icon: '🚘',
    desc: 'Private Mercedes/BMW executive airport pickup and drop-off',
  },
];

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [bookedSeatsState, setBookedSeatsState] = useState([]);

  // Checkout form state
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [insuranceAdded, setInsuranceAdded] = useState(true);

  // Promo code
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Contact details
  const [contactDetails, setContactDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, Credit/Debit Card, Net Banking, EMI, Pay Later

  // UPI
  const [upiApp, setUpiApp] = useState('GPay');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card
  const [cardData, setCardData] = useState({
    number: '4532 8920 4821 7890',
    name: user?.name || 'Aarav Mehta',
    expiry: '08/28',
    cvv: '892',
  });

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // EMI
  const [emiMonths, setEmiMonths] = useState(6);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);

  // Fetch tour
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoadingTour(true);
        const res = await api.get(`/tours/${id}`);
        if (res.data.success) {
          setTour(res.data.tour);
          setBookedSeatsState(res.data.tour.bookedSeats || []);
          if (res.data.tour.availableDates?.length > 0) {
            setSelectedDate(res.data.tour.availableDates[0]);
          }
        }
      } catch (error) {
        console.error('[Checkout] Fetch error:', error);
        addToast('Unable to load expedition for checkout.', 'error');
      } finally {
        setLoadingTour(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  // Sync user info if available
  useEffect(() => {
    if (user) {
      setContactDetails((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      setCardData((prev) => ({
        ...prev,
        name: prev.name || user.name || 'Aarav Mehta',
      }));
    }
  }, [user]);

  // Socket sync
  useEffect(() => {
    if (!id) return;
    const handleCapacityUpdate = (data) => {
      if (data.tourId === id) {
        setBookedSeatsState(data.bookedSeats || []);
      }
    };
    socket.on('tourCapacityUpdated', handleCapacityUpdate);
    return () => socket.off('tourCapacityUpdated', handleCapacityUpdate);
  }, [id]);

  // Capacity check
  const bookedRecord = bookedSeatsState.find((b) => b.date === selectedDate);
  const currentBookedCount = bookedRecord ? bookedRecord.count : 0;
  const remainingSeats = tour ? Math.max(0, tour.capacity - currentBookedCount) : 0;

  // Price calculations
  const basePrice = tour ? tour.price * travelers : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const insuranceAmount = insuranceAdded ? 999 * travelers : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPrice = Math.max(0, basePrice + addOnsTotal + insuranceAmount - discountAmount);

  const toggleAddOn = (addOn) => {
    if (selectedAddOns.some((i) => i.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((i) => i.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleApplyCoupon = async (codeToApply = couponInput) => {
    if (!codeToApply.trim()) return;
    try {
      setCouponLoading(true);
      const res = await api.post('/bookings/validate-coupon', {
        code: codeToApply,
        basePrice,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data);
        setCouponInput(res.data.code);
        addToast(res.data.message, 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Invalid coupon code', 'error');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const getCardBrand = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6')) return 'RUPAY';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const handleCardNumberChange = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardData({ ...cardData, number: parts.join(' ') });
  };

  const handleCompletePurchase = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in or create an account to finalize your purchase.', 'info');
      navigate('/login');
      return;
    }
    if (!selectedDate) {
      addToast('Please select a departure travel date.', 'error');
      return;
    }
    if (travelers > remainingSeats) {
      addToast(`Only ${remainingSeats} seats available for ${selectedDate}.`, 'error');
      return;
    }
    if (!contactDetails.name || !contactDetails.email || !contactDetails.phone) {
      addToast('Please provide your full contact details.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        tourId: tour._id,
        travelDate: selectedDate,
        travelers,
        contactDetails,
        addOns: selectedAddOns.map((a) => ({ name: a.name, price: a.price })),
        insuranceAdded,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        paymentMethod,
        paymentDetails: {
          upiId: paymentMethod === 'UPI' ? upiId : '',
          cardLast4: paymentMethod === 'Credit/Debit Card' ? cardData.number.slice(-4) : '',
          bankName: paymentMethod === 'Net Banking' ? selectedBank : '',
          emiMonths: paymentMethod === 'EMI' ? emiMonths : 0,
        },
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setPurchaseSuccess(res.data.booking);
        addToast('Payment authorized and reservation confirmed!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error processing reservation purchase.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTour) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3 mx-auto" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-900">Expedition Not Found</h2>
        <p className="text-xs text-slate-500">Please choose an expedition from our curated collection.</p>
        <Link
          to="/tours"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          View All Expeditions
        </Link>
      </div>
    );
  }

  // Confirmation Success View
  if (purchaseSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Payment Completed • Instant Confirmation
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Your Journey Is Booked!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Thank you, <strong className="text-slate-900">{purchaseSuccess.contactDetails?.name}</strong>. An official booking voucher and confirmation invoice has been generated for your expedition.
          </p>
        </div>

        {/* Printable Boarding Voucher */}
        <div
          id="printable-boarding-pass"
          className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-luxury space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                Wanderly Official Travel Voucher & Boarding Pass
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                {tour.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {tour.destination}
                </span>
                <span>•</span>
                <span>{tour.duration}</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Booking Reference
              </span>
              <span className="font-mono text-base font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 inline-block mt-0.5">
                {purchaseSuccess.bookingReference}
              </span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Departure Date
              </span>
              <strong className="text-slate-900 text-sm">{purchaseSuccess.travelDate}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Party Size
              </span>
              <strong className="text-slate-900 text-sm">{purchaseSuccess.travelers} Guest(s)</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Payment Method
              </span>
              <strong className="text-slate-900 text-sm">{purchaseSuccess.paymentMethod}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Total Paid
              </span>
              <strong className="text-teal-700 text-base font-extrabold">
                {formatPrice(purchaseSuccess.totalPrice)}
              </strong>
            </div>
          </div>

          {/* Passenger & Transaction Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-2">
            <div>
              <p>
                <span className="text-slate-400 font-medium">Lead Guest:</span>{' '}
                <strong className="text-slate-900">{purchaseSuccess.contactDetails?.name}</strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Email:</span>{' '}
                <span className="text-slate-800">{purchaseSuccess.contactDetails?.email}</span>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Phone:</span>{' '}
                <span className="text-slate-800">{purchaseSuccess.contactDetails?.phone}</span>
              </p>
            </div>
            <div>
              <p>
                <span className="text-slate-400 font-medium">Transaction ID:</span>{' '}
                <span className="font-mono text-slate-800">
                  {purchaseSuccess.paymentDetails?.transactionId || 'TXN-WND-COMPASS'}
                </span>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Status:</span>{' '}
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {purchaseSuccess.status}
                </span>
              </p>
              {purchaseSuccess.addOns?.length > 0 && (
                <p>
                  <span className="text-slate-400 font-medium">Add-Ons:</span>{' '}
                  <span className="text-slate-800 font-semibold">
                    {purchaseSuccess.addOns.map((a) => a.name).join(', ')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Verified & Guaranteed by Wanderly Luxury Concierge
            </span>
            <span>Support: +91 99887 76655</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-teal-600" />
            <span>Print Travel Boarding Pass</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Go to My Dashboard & Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          to={`/tours/${tour._id}`}
          className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expedition Details</span>
        </Link>
        <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
          <Lock className="w-3.5 h-3.5" />
          256-Bit SSL Encrypted Purchase
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Instant Booking & Purchase Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
          Complete Your Expedition Purchase
        </h1>
      </div>

      {/* Main Split Grid: Left Form (2 cols) + Right Order Summary (1 col) */}
      <form onSubmit={handleCompletePurchase} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Selected Tour Banner Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={tour.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 w-full">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase text-[10px]">
                  {tour.category}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {tour.destination}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {tour.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {tour.rating || 4.9}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                {tour.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">{tour.overview}</p>
            </div>
          </div>

          {/* Section 1: Travel Date & Party Size */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>1. Select Departure Date & Guests</span>
              </h3>
              <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Capacity Sync
              </span>
            </div>

            {/* Departure Dates Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Available Departure Dates *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tour.availableDates?.map((date) => {
                  const record = bookedSeatsState.find((b) => b.date === date);
                  const booked = record ? record.count : 0;
                  const remaining = Math.max(0, tour.capacity - booked);
                  const isSelected = selectedDate === date;

                  return (
                    <div
                      key={date}
                      onClick={() => remaining > 0 && setSelectedDate(date)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                          : remaining === 0
                          ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{date}</span>
                          <span className="text-[10px] text-slate-500">Verified Departure</span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          remaining === 0 ? 'text-rose-500' : 'text-teal-700'
                        }`}
                      >
                        {remaining === 0 ? 'Sold Out' : `${remaining} seats left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Travelers Count Control */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Number of Travelers</span>
                <span className="text-[11px] text-slate-500">
                  {formatPrice(tour.price)} per adult guest
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-10 text-center font-extrabold text-base text-slate-900">
                  {travelers}
                </span>
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.min(remainingSeats || 10, prev + 1))}
                  disabled={travelers >= remainingSeats}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Bespoke Luxury Upgrades */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. Bespoke Luxury Add-Ons & Protection</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_ADD_ONS.map((addOn) => {
                const isSelected = selectedAddOns.some((i) => i.id === addOn.id);
                return (
                  <div
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{addOn.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{addOn.name}</h4>
                        <span className="text-xs font-extrabold text-teal-700 shrink-0">
                          +{formatPrice(addOn.price)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{addOn.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Travel Shield Toggle */}
            <div
              onClick={() => setInsuranceAdded(!insuranceAdded)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                insuranceAdded
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    insuranceAdded ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Wanderly Travel & Medical Shield</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Emergency hospital cover, baggage loss protection & 100% cancellation refund
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-extrabold text-slate-900">
                  +{formatPrice(999 * travelers)}
                </span>
                <span className="block text-[9px] text-slate-400">
                  {formatPrice(999)} × {travelers} guest(s)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Lead Guest Information */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>3. Lead Guest Contact Details</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your official travel voucher, tickets, and itinerary updates will be sent here.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactDetails.name}
                  onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                  placeholder="Aarav Mehta"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                  placeholder="aarav@wanderly.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Special Requests (Optional)
                </label>
                <input
                  type="text"
                  value={contactDetails.specialRequests}
                  onChange={(e) =>
                    setContactDetails({ ...contactDetails, specialRequests: e.target.value })
                  }
                  placeholder="Vegetarian meals, high floor, anniversary..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Interactive Payment Gateways */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>4. Select Simulated Payment Method</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your transaction rail for instant booking confirmation.
              </p>
            </div>

            {/* Payment Method Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: <QrCode className="w-4 h-4" /> },
                { id: 'Credit/Debit Card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'Net Banking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
                { id: 'EMI', label: '0% EMI', icon: <Clock className="w-4 h-4" /> },
                { id: 'Pay Later', label: 'Pay Later', icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === m.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* UPI View */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-teal-500 shadow-sm text-center shrink-0">
                    <div className="w-32 h-32 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-white relative">
                      <QrCode className="w-24 h-24 text-teal-400 opacity-90" />
                      <span className="text-[8px] tracking-widest font-mono uppercase text-amber-300">
                        SCAN TO PAY
                      </span>
                    </div>
                    <span className="block text-[9px] text-slate-400 font-semibold mt-1">
                      Expires in 09:59
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Select UPI Application
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setUpiApp(app)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              upiApp === app
                                ? 'bg-teal-500 text-white border-teal-500'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Virtual Payment Address (VPA)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okhdfcbank"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUpiVerified(true);
                            addToast('UPI ID Verified!', 'success');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-xs"
                        >
                          Verify
                        </button>
                      </div>
                      {upiVerified && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified: Aarav Mehta (Axis Bank)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card View */}
            {paymentMethod === 'Credit/Debit Card' && (
              <div className="space-y-5">
                {/* 3D Card Preview */}
                <div className="w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950 p-5 text-white shadow-2xl border border-white/20 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <div className="w-10 h-7 rounded bg-amber-400/90 border border-amber-300 flex items-center justify-center">
                      <div className="w-5 h-4 border border-amber-600/50 rounded-sm" />
                    </div>
                    <span className="font-mono text-xs font-extrabold tracking-widest text-teal-400">
                      {getCardBrand(cardData.number)}
                    </span>
                  </div>

                  <div className="z-10 py-1">
                    <p className="font-mono text-base tracking-widest font-semibold drop-shadow">
                      {cardData.number || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex items-end justify-between z-10 text-[10px]">
                    <div>
                      <span className="block text-slate-400 uppercase text-[8px]">Cardholder</span>
                      <span className="font-bold tracking-wider uppercase text-white truncate block max-w-[150px]">
                        {cardData.name || 'YOUR NAME'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-slate-400 uppercase text-[8px]">Expires</span>
                      <span className="font-mono font-bold text-white">{cardData.expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardData.number}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4532 8920 4821 7890"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      placeholder="Aarav Mehta"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking View */}
            {paymentMethod === 'Net Banking' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Popular Indian Banks
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                            selectedBank === bank
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Or Select From All Other Banks
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                    <option value="IDFC FIRST Bank">IDFC FIRST Bank</option>
                    <option value="Yes Bank">Yes Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* EMI View */}
            {paymentMethod === 'EMI' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>0% Interest No-Cost EMI Available (Wanderly Subsidized)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[3, 6, 9, 12].map((months) => {
                    const monthly = Math.round(totalPrice / months);
                    const isSelected = emiMonths === months;
                    return (
                      <div
                        key={months}
                        onClick={() => setEmiMonths(months)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-slate-900 block">
                          {months} Months
                        </span>
                        <span className="text-sm font-extrabold text-teal-700 block mt-1">
                          {formatPrice(monthly)}
                          <span className="text-[10px] font-normal text-slate-500">/mo</span>
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">
                          0% Interest
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pay Later View */}
            {paymentMethod === 'Pay Later' && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Concierge Pay Later Guarantee</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Reserve your seats now with zero advance payment. An official invoice with your booking reference will be generated, payable up to 7 days before departure.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="sticky top-28 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-luxury space-y-5">
            <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans text-teal-600 font-bold">{travelers} Traveler(s)</span>
            </h3>

            {/* Promo Code Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="WANDERLY10, FIRSTTRIP..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                />
                <button
                  type="button"
                  disabled={couponLoading || !couponInput.trim()}
                  onClick={() => handleApplyCoupon()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>

              {/* Clickable demo coupon chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['WANDERLY10', 'FIRSTTRIP', 'FESTIVE2026'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCouponInput(code);
                      handleApplyCoupon(code);
                    }}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <span>✓ {appliedCoupon.code}</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}
            </div>

            {/* Math Breakdown */}
            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Base Tour ({formatPrice(tour.price)} × {travelers})</span>
                <span className="font-semibold text-slate-900">{formatPrice(basePrice)}</span>
              </div>

              {addOnsTotal > 0 && (
                <div className="flex justify-between text-teal-700">
                  <span>Selected Add-Ons ({selectedAddOns.length})</span>
                  <span className="font-semibold">+{formatPrice(addOnsTotal)}</span>
                </div>
              )}

              {insuranceAdded && (
                <div className="flex justify-between text-emerald-700">
                  <span>Travel Shield Insurance ({travelers}x)</span>
                  <span className="font-semibold">+{formatPrice(insuranceAmount)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400">All taxes & fees included</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={submitting || remainingSeats <= 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay {formatPrice(totalPrice)}</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Refundable up to 7 days before departure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Instant confirmed booking reference issued</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>24/7 dedicated personal concierge support</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
