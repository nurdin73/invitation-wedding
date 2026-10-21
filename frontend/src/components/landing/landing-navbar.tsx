'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { NavItem } from './landing.types';

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Fitur', href: '#features' },
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Template', href: '#templates' },
  { label: 'Harga', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const;

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // IntersectionObserver: automatically detect currently visible section in viewport
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Map to keep track of all currently intersecting sections
    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // If user is at top of page (Hero section), reset active state
        if (window.scrollY < 120) {
          setActiveSection('');
          return;
        }

        // Pick the active section based on priority in document order
        if (visibleSections.size > 0) {
          for (const id of sectionIds) {
            if (visibleSections.has(id)) {
              setActiveSection(id);
              break;
            }
          }
        }
      },
      {
        root: null,
        // Trigger when section enters beneath sticky navbar (-80px) and before leaving viewport (-40%)
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    elements.forEach((element) => observer.observe(element));

    // Handle scroll to top reset for Hero area
    const handleScrollTop = () => {
      if (window.scrollY < 120) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollTop);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      closeMobileMenu();

      const targetId = href.replace('#', '');
      setActiveSection(targetId);

      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navbarHeight = 72; // height offset for sticky navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all"
      data-testid="landing-navbar"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          data-testid="landing-navbar-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Active State & Smooth Scrolling */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navigasi Utama"
        >
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative text-sm font-medium transition-all duration-200 cursor-pointer py-1 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`landing-navbar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-200"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Cluster */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              data-testid="landing-navbar-login-btn"
            >
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              data-testid="landing-navbar-register-btn"
            >
              <span>Buat Undangan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Tutup navigasi menu' : 'Buka navigasi menu'}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted md:hidden transition-colors"
          data-testid="landing-navbar-mobile-toggle"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu with Active State & Smooth Scrolling */}
      {isMobileMenuOpen && (
        <div
          className="border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          data-testid="landing-navbar-mobile-menu"
        >
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-accent-tint text-primary font-semibold border border-border-soft'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  data-testid={`landing-navbar-mobile-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  data-testid="landing-navbar-mobile-login-btn"
                >
                  Masuk ke Akun
                </Button>
              </Link>
              <Link href="/register" onClick={closeMobileMenu}>
                <Button
                  className="w-full justify-center gap-1.5"
                  data-testid="landing-navbar-mobile-register-btn"
                >
                  <span>Daftar Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
