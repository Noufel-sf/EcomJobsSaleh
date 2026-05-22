'use client';

import { type Language, useI18n } from '@/context/I18nContext';

type LocalizedSectionTitleProps = {
  id: string;
  labels: Record<Language, string>;
  className?: string;
};

const DEFAULT_TITLE_CLASS =
  'text-2xl lg:text-3xl font-bold text-primary';

export default function LocalizedSectionTitle({
  id,
  labels,
  className = '',
}: LocalizedSectionTitleProps) {
  const { language } = useI18n();

  return (
    <h2 
      id={id} 
      className={`${DEFAULT_TITLE_CLASS} ${className}`.trim()}
      suppressHydrationWarning
    >
      {labels[language]}
    </h2>
  );
}
