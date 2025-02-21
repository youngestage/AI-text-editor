/// <reference types="vite/client" />

interface Window {
  chrome: {
    ml: {
      LanguageDetector: any;
      TextSummarizer: any;
      Translator: any;
    };
  };
}