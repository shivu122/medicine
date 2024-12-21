import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Pill className="h-8 w-8" />
            <span className="font-bold text-xl">MedIdentify</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/about" className="hover:text-blue-200">About</Link>
            <Link to="/privacy" className="hover:text-blue-200">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-200">Terms</Link>
            <Link to="/disclaimer" className="hover:text-blue-200">Medical Disclaimer</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;