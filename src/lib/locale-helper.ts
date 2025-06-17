
import { enUS, es, it } from 'date-fns/locale';
import type { Locale } from 'date-fns';

const locales: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  it: it,
};

export function getLang(language?: string): Locale {
  if (language) {
    const baseLang = language.split('-')[0];
    return locales[baseLang] || enUS;
  }
  return enUS;
}
