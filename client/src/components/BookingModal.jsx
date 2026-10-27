import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  Tag,
  Shield,
  Printer,
  FileCheck,
  ChevronRight,
  Smartphone,
  Lock,
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
    desc: '5-course private chef menu with ocean/mountain views',
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

const BookingModal = ({ tour, isOpen, onClose, initialDate = null }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Step state: 1 = Selection & Add-ons, 2 = Guest Info, 3 = Payment Method, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Booking fields
  const [selectedDate, setSelectedDate] = useState(
    initialDate || tour.availableDates?.[0] || ''
  );
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

  // UPI state
  const [upiApp, setUpiApp] = useState('GPay');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card state
  const [cardData, setCardData] = useState({
    number: '4532 8920 4821 7890',
    name: user?.name || 'Aarav Mehta',
    expiry: '08/28',
    cvv: '892',
  });

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // EMI state
  const [emiMonths, setEmiMonths] = useState(6);

  // Live capacity state
  const [bookedSeatsState, setBookedSeatsState] = useState(tour.bookedSeats || []);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Sync user details
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

  // Live Socket.io capacity listener
  useEffect(() => {
    const handleCapacityUpdate = (data) => {
      if (data.tourId === tour._id) {
        setBookedSeatsState(data.bookedSeats || []);
      }
    };

    socket.on('tourCapacityUpdated', handleCapacityUpdate);
    return () => {
      socket.off('tourCapacityUpdated', handleCapacityUpdate);
    };
  }, [tour._id]);

  if (!isOpen) return null;

  // Remaining seats calculation
  const bookedRecord = bookedSeatsState.find((b) => b.date === selectedDate);
  const currentBookedCount = bookedRecord ? bookedRecord.count : 0;
  const remainingSeats = Math.max(0, tour.capacity - currentBookedCount);

  // Price calculations
  const basePrice = tour.price * travelers;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const insuranceAmount = insuranceAdded ? 999 * travelers : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPrice = Math.max(0, basePrice + addOnsTotal + insuranceAmount - discountAmount);

  // Toggle add-on
  const handleToggleAddOn = (addOn) => {
    if (selectedAddOns.some((item) => item.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  // Validate coupon
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

  // Card detection
  const getCardBrand = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6')) return 'RUPAY';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  // Format card number grouping
  const handleCardNumberChange = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardData({ ...cardData, number: parts.join(' ') });
  };

  // Proceed to Step 2
  const handleProceedToStep2 = () => {
    if (!isAuthenticated) {
      addToast('Please sign in or register to reserve this journey.', 'info');
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
    setStep(2);
  };

  // Proceed to Step 3
  const handleProceedToStep3 = (e) => {
    e.preventDefault();
    if (!contactDetails.name || !contactDetails.email || !contactDetails.phone) {
      addToast('Please complete all contact fields.', 'error');
      return;
    }
    setStep(3);
  };

  // Submit and confirm booking with payment processing
  const handleFinalBooking = async () => {
    try {
      setLoading(true);
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
        setBookingSuccess(res.data.booking);
        setStep(4);
        addToast('Payment authorized and reservation confirmed!', 'success');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error processing reservation.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                Wanderly Luxury Checkout
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] font-semibold text-amber-400">
                Step {step} of {step === 4 ? 4 : 3}
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-white truncate max-w-sm sm:max-w-md">
              {tour.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Progress Stepper */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
              <div
                className={`py-1.5 rounded-xl border transition-all ${
                  step === 1
                    ? 'bg-teal-500/10 text-teal-700 border-teal-500/30'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                1. Date & Add-Ons
              </div>
              <div
                className={`py-1.5 rounded-xl border transition-all ${
                  step === 2
                    ? 'bg-teal-500/10 text-teal-700 border-teal-500/30'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                2. Guest Details
              </div>
              <div
                className={`py-1.5 rounded-xl border transition-all ${
                  step === 3
                    ? 'bg-teal-500/10 text-teal-700 border-teal-500/30'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                3. Payment Method
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* ================= STEP 1: DATES, GUESTS & ADD-ONS ================= */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Departure Date Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Select Departure Date</span>
                  <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live Seat Sync
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tour.availableDates?.map((date) => {
                    const record = bookedSeatsState.find((b) => b.date === date);
                    const bookedCount = record ? record.count : 0;
                    const seatsLeft = Math.max(0, tour.capacity - bookedCount);
                    const isSelected = selectedDate === date;
                    const isSoldOut = seatsLeft <= 0;

                    return (
                      <button
                        type="button"
                        key={date}
                        disabled={isSoldOut}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                            : isSoldOut
                            ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{date}</p>
                        <p
                          className={`text-[10px] font-semibold mt-0.5 ${
                            isSoldOut
                              ? 'text-rose-500'
                              : seatsLeft <= 4
                              ? 'text-amber-600'
                              : 'text-teal-600'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : `${seatsLeft} seats left`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travelers Counter */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Number of Travelers
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Remaining capacity for date: {remainingSeats} seats
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={travelers <= 1}
                    onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-slate-900 text-sm">
                    {travelers}
                  </span>
                  <button
                    type="button"
                    disabled={travelers >= remainingSeats}
                    onClick={() => setTravelers((prev) => Math.min(remainingSeats, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bespoke Add-On Experiences */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Custom Add-On Experiences (Optional)
                  </label>
                  <span className="text-[11px] text-teal-600 font-medium">Bespoke Perks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_ADD_ONS.map((addOn) => {
                    const isChecked = selectedAddOns.some((item) => item.id === addOn.id);
                    return (
                      <div
                        key={addOn.id}
                        onClick={() => handleToggleAddOn(addOn)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{addOn.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {addOn.name}
                            </h5>
                            <span className="text-xs font-extrabold text-teal-700 shrink-0 ml-1">
                              +{formatPrice(addOn.price)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                            {addOn.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Travel Shield Insurance Toggle */}
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
                      insuranceAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
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
                      Emergency hospital cover, baggage loss protection, 100% trip cancellation refund
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

              {/* Coupon / Promo Code Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Promo Code / Privilege Voucher</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="WANDERLY10, FIRSTTRIP, FESTIVE2026..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono uppercase"
                  />
                  <button
                    type="button"
                    disabled={couponLoading || !couponInput.trim()}
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>

                {/* Quick clickable demo coupon badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Try demo coupons:</span>
                  {['WANDERLY10', 'FIRSTTRIP', 'FESTIVE2026'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCouponInput(code);
                        handleApplyCoupon(code);
                      }}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-teal-500 text-teal-700 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    <span>
                      ✓ {appliedCoupon.code} ({appliedCoupon.description})
                    </span>
                    <span>-{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}
              </div>

              {/* Order Summary Breakdown Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Base Tour ({formatPrice(tour.price)} × {travelers} guest{travelers > 1 ? 's' : ''})
                  </span>
                  <span>{formatPrice(basePrice)}</span>
                </div>

                {addOnsTotal > 0 && (
                  <div className="flex items-center justify-between text-xs text-teal-300">
                    <span>Add-On Experiences ({selectedAddOns.length})</span>
                    <span>+{formatPrice(addOnsTotal)}</span>
                  </div>
                )}

                {insuranceAdded && (
                  <div className="flex items-center justify-between text-xs text-emerald-300">
                    <span>Travel Shield Insurance ({travelers} guest(s))</span>
                    <span>+{formatPrice(insuranceAmount)}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-amber-300">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                  <span className="text-white">Total Amount</span>
                  <span className="text-amber-400 text-base font-extrabold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={remainingSeats <= 0}
                  onClick={handleProceedToStep2}
                  className="w-2/3 py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: GUEST DETAILS ================= */}
          {step === 2 && (
            <form onSubmit={handleProceedToStep3} className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Lead Guest Information
                </h3>
                <p className="text-xs text-slate-500">
                  Your official travel voucher and real-time updates will be sent to these
                  contacts.
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
                    onChange={(e) =>
                      setContactDetails({ ...contactDetails, name: e.target.value })
                    }
                    placeholder="Aarav Mehta"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactDetails.email}
                    onChange={(e) =>
                      setContactDetails({ ...contactDetails, email: e.target.value })
                    }
                    placeholder="aarav@wanderly.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
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
                    onChange={(e) =>
                      setContactDetails({ ...contactDetails, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
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
                    placeholder="Vegetarian, high floor, anniversary..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Trip Snapshot Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Selected Departure Date</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Party Size</span>
                  <span>{travelers} Traveler(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-On Experiences</span>
                  <span>{selectedAddOns.length > 0 ? selectedAddOns.map((a) => a.name).join(', ') : 'None'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-slate-900">
                  <span>Final Payable Amount</span>
                  <span className="text-teal-700 text-sm">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: FEATURE-WISE PAYMENT METHODS ================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Select Payment Method
                </h3>
                <p className="text-xs text-slate-500">
                  Choose your preferred simulated transaction rail for instant booking reference
                  issuance.
                </p>
              </div>

              {/* Payment Methods Tab Pills */}
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
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
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

              {/* METHOD 1: UPI & DYNAMIC QR CODE */}
              {paymentMethod === 'UPI' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Simulated Dynamic QR Code */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-teal-500 shadow-sm text-center shrink-0">
                      <div className="w-32 h-32 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-white relative overflow-hidden">
                        <QrCode className="w-24 h-24 text-teal-400 opacity-90" />
                        <span className="text-[8px] tracking-widest font-mono uppercase text-amber-300">
                          SCAN TO PAY
                        </span>
                      </div>
                      <span className="block text-[9px] text-slate-400 font-semibold mt-1">
                        Expires in 09:59
                      </span>
                    </div>

                    {/* App Badges & VPA input */}
                    <div className="space-y-3 flex-1 w-full">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Popular UPI Applications
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
                          Enter UPI Virtual ID (VPA)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okaxis"
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUpiVerified(true);
                              addToast('UPI ID Verified successfully!', 'success');
                            }}
                            className="px-3 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-xs"
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

              {/* METHOD 2: CREDIT / DEBIT CARD WITH LIVE 3D CARD PREVIEW */}
              {paymentMethod === 'Credit/Debit Card' && (
                <div className="space-y-5">
                  {/* Live Interactive 3D Card Visual */}
                  <div className="w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950 p-5 text-white shadow-2xl border border-white/20 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl" />
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

                  {/* Card Form Inputs */}
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

              {/* METHOD 3: NET BANKING */}
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
                      Or Choose All Other Banks
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

              {/* METHOD 4: 0% EMI FINANCING */}
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

              {/* METHOD 5: CONCIERGE PAY LATER */}
              {paymentMethod === 'Pay Later' && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pay Later / Corporate Billing Guarantee</span>
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Reserve your expedition seats now with 0 advance payment. An official invoice with
                    your PNR code will be issued, payable 7 days prior to departure.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalBooking}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Authorize & Pay {formatPrice(totalPrice)} via {paymentMethod}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: CONFIRMATION & LUXURY VOUCHER ================= */}
          {step === 4 && bookingSuccess && (
            <div className="space-y-6 text-center py-2 animate-scale-up">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center mx-auto border border-teal-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                  Payment Successful • Reservation Confirmed
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Ready to Wander the World
                </h3>
              </div>

              {/* Luxury Official Ticket / Voucher Box (Printable) */}
              <div
                id="printable-voucher"
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4 shadow-sm"
              >
                {/* Voucher Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      Wanderly Official Travel Voucher
                    </span>
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {bookingSuccess.tourId?.title || tour.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Booking Reference
                    </span>
                    <span className="font-mono text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                      {bookingSuccess.bookingReference}
                    </span>
                  </div>
                </div>

                {/* Voucher Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Departure Date
                    </span>
                    <strong className="text-slate-800">{bookingSuccess.travelDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Guests
                    </span>
                    <strong className="text-slate-800">{bookingSuccess.travelers} Traveler(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Payment Rail
                    </span>
                    <strong className="text-slate-800">{bookingSuccess.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Transaction ID
                    </span>
                    <strong className="font-mono text-[11px] text-slate-800">
                      {bookingSuccess.paymentDetails?.transactionId || 'TXN-WND-COMPASS'}
                    </strong>
                  </div>
                </div>

                {/* Lead Traveler */}
                <div className="text-xs text-slate-600 border-t border-slate-200 pt-3 flex justify-between">
                  <span>
                    Lead Traveler: <strong className="text-slate-900">{bookingSuccess.contactDetails?.name}</strong>
                  </span>
                  <span>
                    Total Paid:{' '}
                    <strong className="text-slate-900 font-extrabold text-sm">
                      {formatPrice(bookingSuccess.totalPrice)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Travel Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
