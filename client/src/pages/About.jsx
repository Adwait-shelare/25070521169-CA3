import React from 'react';
import { Compass, ShieldCheck, Award, Heart, Globe, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Our Heritage & Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900">
          The Wanderly Journey
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          Wanderly was created to redefine luxury tour exploration. Combining authentic local master
          storytellers with cutting-edge real-time departure verification.
        </p>
      </div>

      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden aspect-[21/9] shadow-luxury">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop&q=80"
          alt="Adventure"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Curated Escapes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every itinerary is vetted through on-ground inspections, ensuring 5-star standard
            accommodations and cultural immersion.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Guaranteed Departure</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our live database engine strictly prevents overbooking, guaranteeing every traveler
            their vehicle seat and hotel room.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Conscious Tourism</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We partner directly with local boatmen, guides, and heritage homestays to ensure
            tourism revenue enriches host communities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
