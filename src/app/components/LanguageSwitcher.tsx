'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Language, useI18n } from '@/context/I18nContext';

const switcherCopy: Record<Language, Record<string, string>> = {
  en: {
    label: 'Language',
    english: 'English',
    french: 'French',
    arabic: 'Arabic',
  },
  fr: {
    label: 'Langue',
    english: 'Anglais',
    french: 'Francais',
    arabic: 'Arabe',
  },
  ar: {
    label: 'اللغة',
    english: 'الانجليزية',
    french: 'الفرنسية',
    arabic: 'العربية',
  },
};

export default function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { language, setLanguage } = useI18n();
  const copy = switcherCopy[language];

  const options: { value: Language; label: string }[] = [
    { value: 'en', label: copy.english },
    { value: 'fr', label: copy.french },
    { value: 'ar', label: copy.arabic },
  ];

  const current = options.find((option) => option.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Globe className="h-4 w-4" />
          {!compact && <span className="hidden md:inline">{copy.label}</span>}
          <span className="hidden sm:inline">{current?.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}