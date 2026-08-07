"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import type { Settings } from "@/types";

const navLinkKeys = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/blog", key: "nav.blog" },
  { href: "/contact", key: "nav.contact" },
];

interface NavbarProps {
  settings: Settings | null;
}

export function Navbar({ settings }: NavbarProps) {
  const { tr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ type: string; title: string; description?: string; slug?: string }>>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-premium py-2" : "bg-transparent py-4"
        )}
      >
        <div className="container-custom flex items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <Image src={settings.logo_url} alt={settings.clinic_name} width={48} height={48} className="rounded-xl object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center text-white font-display font-bold text-lg">
                SC
              </div>
            )}
            <div>
              <h1 className="font-display font-bold text-xl text-primary-900">{settings?.clinic_name || "SKIN CURE"}</h1>
              <p className="text-xs text-primary-600">{tr("nav.premiumDermatology")}</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-800 font-medium hover:text-gold-600 transition-colors relative group"
              >
                {tr(link.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-primary-700" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-gold-500" /> : <Moon className="w-5 h-5 text-primary-700" />}
            </button>
            <Link href={`tel:${settings?.phone || "07828093301"}`}>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
                {tr("nav.call")}
              </Button>
            </Link>
            <Link href="/appointment">
              <Button variant="gold" size="sm">{tr("nav.bookAppointment")}</Button>
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 glass p-4 shadow-premium"
            >
              <input
                type="search"
                placeholder={tr("nav.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full max-w-2xl mx-auto block px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              {searchResults.length > 0 && (
                <div className="max-w-2xl mx-auto mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
                  {searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.type === "blog" ? `/blog/${result.slug}` : result.type === "service" ? "/services" : "/about"}
                      className="block px-4 py-3 hover:bg-primary-50 border-b last:border-0"
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className="text-xs text-gold-600 uppercase">{result.type}</span>
                      <p className="font-medium text-primary-900">{result.title}</p>
                      {result.description && <p className="text-sm text-gray-500 truncate">{result.description}</p>}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 glass p-6 pt-20">
              <div className="flex flex-col gap-4">
                {navLinkKeys.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-primary-800 py-2 border-b border-primary-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {tr(link.key)}
                  </Link>
                ))}
                <Link href="/appointment" onClick={() => setIsOpen(false)}>
                  <Button variant="gold" className="w-full mt-4">{tr("nav.bookAppointment")}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
