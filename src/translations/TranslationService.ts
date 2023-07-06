import fr from './fr';
import en from './en';

export const langs = {
  fr,
  en,
};

export const defaultLang = 'en';

export default class TranslationService {
  static get(lang?: string | null) {
    if (lang) {
      const translation = langs[lang as keyof typeof langs];
      return translation || langs[defaultLang];
    } return langs[defaultLang];
  }
}
