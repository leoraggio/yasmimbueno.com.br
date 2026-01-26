"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sprout } from "lucide-react";

const navLinks = [
  { href: "/#about", label: "Sobre" },
  { href: "/#services", label: "Serviços" },
  { href: "/#approach", label: "Abordagem" },
  { href: "/#faq", label: "Dúvidas" },
  { href: "/blog", label: "Blog" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm"
          : "bg-sand-50/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="#"
              className="font-serif text-2xl text-brand-700 tracking-wide font-semibold flex items-center"
            >
              <Sprout className="mr-2 h-6 w-6 text-brand-500" />
              Yasmim Bueno
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-brand-600 transition-colors text-sm uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#agendamento"
              className="bg-brand-600 text-white px-6 py-2.5 rounded-full hover:bg-brand-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
            >
              Agendar Consulta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-brand-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden bg-sand-50 border-t border-gray-200 absolute w-full shadow-lg transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-100 rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#agendamento"
            onClick={() => setIsOpen(false)}
            className="block mt-4 text-center px-3 py-3 text-base font-medium bg-brand-600 text-white rounded-md hover:bg-brand-700"
          >
            Agendar Consulta
          </Link>
        </div>
      </div>
    </nav>
  );
}
