import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, ShieldCheck, Heart, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Wanderly
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Wanderly curates bespoke, ultra-luxury travel expeditions across breathtaking
              Indian landscapes and premier international destinations. Designed with transparent
              pricing, verified departure capacities, and personalized 24/7 concierge support.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 max-w-fit">
              <Award className="w-4 h-4 shrink-0" />
              <span>Full-Stack College Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Expeditions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tours?category=Beach" className="hover:text-teal-400 transition-colors">
                  Goa & Tropical Beaches
                </Link>
              </li>
              <li>
                <Link to="/tours?category=Mountain" className="hover:text-teal-400 transition-colors">
                  Kashmir & Himalayas
                </Link>
              </li>
              <li>
                <Link to="/tours?category=Honeymoon" className="hover:text-teal-400 transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link to="/tours?category=Luxury" className="hover:text-teal-400 transition-colors">
                  Bali Island Odyssey
                </Link>
              </li>
              <li>
                <Link to="/tours?category=Adventure" className="hover:text-teal-400 transition-colors">
                  Ladakh High Passes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Wanderly
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Concierge Desk
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-teal-400 transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors">
                  Evaluation Demo Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Bandra Kurla Complex, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 (022) 8000-WNDR</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>concierge@wanderly.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Local MongoDB 27017</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Wanderly – Explore the World. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>React 19 & Vite 6</span>
            <span>Node.js & Express 4.21</span>
            <span>MongoDB Compass Connected</span>
            <span className="text-slate-400">Simulated Booking Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
