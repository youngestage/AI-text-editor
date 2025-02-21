export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  detectedLanguage?: string;
  summary?: string;
  translation?: string;
  targetLanguage?: SupportedLanguage;
  isLoading?: boolean;
  error?: string;
}

// Supported languages by the Google AI API
export type SupportedLanguage = 
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'ru' // Russian
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ar' // Arabic
  | 'hi' // Hindi
  | 'nl' // Dutch
  | 'pl' // Polish
  | 'tr' // Turkish
  | 'vi' // Vietnamese;

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese'
};