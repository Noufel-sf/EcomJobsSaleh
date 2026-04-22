
'use client';

import React from 'react';
import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';

const Footer = () => {
  const { messages } = useI18n();

  return (
    <footer className="border-t bg-primary p-3 md:p-12 text-shadow-black/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Shopping Jobs</h3>
            <p className="">
              {messages.footer.tagline}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="cursor-pointer rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="cursor-pointer rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="cursor-pointer rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="cursor-pointer rounded-full bg-muted hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{messages.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className=" transition-colors cursor-pointer">
                  {messages.topBar.about}
                </Link>
              </li>
              <li>
                <Link href="/products" className=" transition-colors cursor-pointer">
                  {messages.footer.products}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className=" transition-colors cursor-pointer">
                  {messages.footer.jobs}
                </Link>
              </li>
              <li>
                <Link href="/help" className=" transition-colors cursor-pointer">
                  {messages.topBar.helpCenter}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{messages.footer.categories}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className=" transition-colors cursor-pointer">
                  {messages.footer.electronics}
                </Link>
              </li>
              <li>
                <Link href="/products" className=" transition-colors cursor-pointer">
                  {messages.footer.fashion}
                </Link>
              </li>
              <li>
                <Link href="/products" className=" transition-colors cursor-pointer">
                  {messages.footer.homeGarden}
                </Link>
              </li>
              <li>
                <Link href="/products" className=" transition-colors cursor-pointer">
                  {messages.footer.sports}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{messages.footer.support}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className=" transition-colors cursor-pointer">
                  {messages.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link href="/help" className=" transition-colors cursor-pointer">
                  {messages.footer.faqs}
                </Link>
              </li>
              <li>
                <Link href="/help" className=" transition-colors cursor-pointer">
                  {messages.footer.shippingInfo}
                </Link>
              </li>
              <li>
                <Link href="/help" className=" transition-colors cursor-pointer">
                  {messages.footer.returns}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="">
            © 2026 Saleh Store. {messages.footer.copyright}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className=" transition-colors cursor-pointer">
              {messages.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className=" transition-colors cursor-pointer">
              {messages.footer.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
