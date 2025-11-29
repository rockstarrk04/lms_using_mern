import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navLinks.map((item) => (
            <div key={item.name} className="pb-6">
              <Link to={item.path} className="text-sm leading-6 text-slate-400 hover:text-white">{item.name}</Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-slate-500">&copy; {new Date().getFullYear()} LMS Platform, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;