// Microsoft Translator API configuration
const TRANSLATOR_API_KEY = '3b6cdc8c0c974602b14f2d8b2e660c81';
const TRANSLATOR_API_REGION = 'eastus';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const TRANSLATOR_API_ENDPOINT = CORS_PROXY + 'https://api.cognitive.microsofttranslator.com';

// Simple client-side language detection
function detectLanguageLocally(text: string): string {
  const commonPatterns = {
    en: /^[a-zA-Z\s.,!?]+$/,  // English (basic Latin characters)
    es: /[áéíóúñ¿¡]/i,        // Spanish
    fr: /[éèêëàâçîïôûùüÿ]/i,  // French
    de: /[äöüß]/i,            // German
    it: /[àèéìíîòóùú]/i,      // Italian
    pt: /[áâãàçéêíóôõú]/i,    // Portuguese
    ru: /[а-яА-ЯёЁ]/,         // Russian
    zh: /[\u4e00-\u9fff]/,    // Chinese
    ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/,  // Japanese
    ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,  // Korean
  };

  for (const [lang, pattern] of Object.entries(commonPatterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }

  return 'en'; // Default to English if no specific pattern is matched
}

// Function to detect language
export async function detectLanguage(text: string): Promise<string> {
  if (!text.trim()) {
    throw new Error('Text is required for language detection');
  }

  try {
    // Use client-side detection for better reliability
    return detectLanguageLocally(text);
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en'; // Default to English on error
  }
}

// Function to translate text
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text.trim()) {
    throw new Error('Text is required for translation');
  }

  // If target language is the same as detected language, return the original text
  const detectedLang = await detectLanguage(text);
  if (detectedLang === targetLanguage) {
    return text;
  }

  try {
    console.log('Translating to:', targetLanguage);
    const response = await fetch(
      `${TRANSLATOR_API_ENDPOINT}/translate?api-version=3.0&to=${targetLanguage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': TRANSLATOR_API_KEY,
          'Ocp-Apim-Subscription-Region': TRANSLATOR_API_REGION,
          'Origin': window.location.origin
        },
        body: JSON.stringify([{ text }])
      }
    );

    console.log('Translation response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Translation error response:', errorText);
      throw new Error('Translation failed');
    }

    const data = await response.json();
    console.log('Translation response:', data);
    return data[0].translations[0].text;
  } catch (error) {
    console.error('Translation failed:', error);
    // Fallback to a simpler translation service
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedLang}|${targetLanguage}`
      );
      const data = await response.json();
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      }
    } catch (fallbackError) {
      console.error('Fallback translation failed:', fallbackError);
    }
    throw new Error('Unable to translate text. Please try again.');
  }
}

// Function to summarize text
export async function summarizeText(text: string): Promise<string> {
  if (!text.trim()) {
    throw new Error('Text is required for summarization');
  }

  try {
    // Simple client-side summarization
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const numSentences = Math.max(1, Math.ceil(sentences.length * 0.3));
    const summary = sentences.slice(0, numSentences).join(' ').trim();
    console.log('Generated summary:', summary);
    return summary;
  } catch (error) {
    console.error('Text summarization failed:', error);
    throw new Error('Unable to summarize text. Please try again.');
  }
}