import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast('Thank you! Your message has been routed to our concierge desk.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          24/7 Global Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
          Connect With Wanderly
        </h1>
        <p className="text-xs text-slate-500">
          Have questions about a bespoke itinerary or need custom departure dates? Our travel
          designers are available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-8 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-2xl text-white">Concierge Desk</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              We provide tailored travel planning for private families, corporate retreats, and solo
              explorers.
            </p>
          </div>

          <div className="space-y-5 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Headquarters</p>
                <p className="text-slate-400">Level 8, One BKC, Bandra Kurla Complex, Mumbai, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Direct Line</p>
                <p className="text-slate-400">+91 (022) 8000-WNDR / +91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Email Inquiries</p>
                <p className="text-slate-400">concierge@wanderly.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Support Availability</p>
                <p className="text-slate-400">Monday - Sunday: 24 Hours Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500">
                Our concierge will get back to you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Mehta"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav@wanderly.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Private Tour Inquiry for Kashmir..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your dream destination, preferred dates, and party size..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
