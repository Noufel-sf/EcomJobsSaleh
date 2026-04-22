'use client';

import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Globe, ChevronDown, Moon, Sun } from 'lucide-react';
import { type Language, useI18n } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';

const TopBar = () => {
  const { language, setLanguage, messages } = useI18n();
  const { setTheme } = useTheme();

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇩🇿' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
  ] as const;

  const currentLanguage = languages.find((lang) => lang.value === language);

  return (
    <div className="bg-orange-400 py-2  text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Left side - Contact info */}
          <div className="flex items-center gap-4 lg:gap-6">
            <a
              href="tel:+213555123456"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className=" text-sm sm:inline font-medium">
                +213 555 123 456
              </span>
            </a>

            <a
              href="mailto:support@store.com"
              className="hidden md:flex items-center gap-2 hover:opacity-80 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">support@store.com</span>
            </a>

            <div className="hidden lg:flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{messages.topBar.shipping}</span>
            </div>
          </div>

          {/* Right side - Links & Language switcher */}
          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              href="/about"
              className="hover:opacity-80 hidden md:block text-sm transition font-medium"
            >
              {messages.topBar.about}
            </Link>

            <Link
              href="/contact"
              className="hover:opacity-80 hidden md:block transition text-sm font-medium"
            >
              {messages.topBar.contact}
            </Link>

            <Link
              href="/help"
              className="hidden sm:inline hover:opacity-80 md:block transition text-sm font-medium"
            >
              {messages.topBar.helpCenter}
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {currentLanguage?.flag} {currentLanguage?.label}
                  </span>
                  <span className="sm:hidden">{currentLanguage?.flag}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={(value: string) => setLanguage(value as Language)}
                >
                  {languages.map((lang) => (
                    <DropdownMenuRadioItem className="" key={lang.value} value={lang.value}>
                      <span className="mr-2 text-sm">{lang.flag}</span>
                      {lang.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher (Mobile only) */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Sun className="h-[1.05rem] w-[1.05rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
                    <Moon className="absolute h-[1.05rem] w-[1.05rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
                    <span className="sr-only">{messages.navbar.toggleTheme}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    {messages.navbar.light}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    {messages.navbar.dark}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    {messages.navbar.system}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
