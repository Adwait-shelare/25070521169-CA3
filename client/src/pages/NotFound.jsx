import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
          404 Error: Off The Beaten Path
        </span>
        <h1 className="text-4xl font-serif font-bold text-slate-900">Destination Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The coordinates or expedition page you are trying to reach does not exist or may have been
          relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-teal-600 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Wanderly Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
