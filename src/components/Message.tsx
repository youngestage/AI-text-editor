import React, { useState } from 'react';
import { RotateCcw, Languages, Loader2 } from 'lucide-react';
import { Message as MessageType, SUPPORTED_LANGUAGES, SupportedLanguage } from '../types';

interface MessageProps {
  message: MessageType;
  onRequestTranslation: (targetLanguage: SupportedLanguage) => void;
  onRequestSummary: () => void;
}

export function Message({ message, onRequestTranslation, onRequestSummary }: MessageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const needsSummary = message.text.length > 150 && !message.summary;

  const handleTranslation = async () => {
    if (isTranslating) return;
    setIsTranslating(true);
    try {
      await onRequestTranslation(selectedLanguage);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        <p className="text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed">{message.text}</p>
        
        {(message.isLoading || isTranslating) && (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        )}

        {message.error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
            <span className="text-sm font-medium">{message.error}</span>
          </div>
        )}

        {message.detectedLanguage && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Languages className="w-4 h-4" />
            <span>
              Detected: {SUPPORTED_LANGUAGES[message.detectedLanguage as SupportedLanguage] || message.detectedLanguage}
            </span>
          </div>
        )}

        {message.summary && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Summary</p>
            </div>
            <p className="text-sm text-blue-800">{message.summary}</p>
          </div>
        )}

        {message.translation && message.targetLanguage && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-900">
                Translation ({SUPPORTED_LANGUAGES[message.targetLanguage]})
              </p>
            </div>
            <p className="text-sm text-green-800">{message.translation}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-3">
          {needsSummary && (
            <button
              onClick={onRequestSummary}
              disabled={message.isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Summarize text"
            >
              <RotateCcw className="w-4 h-4" />
              Summarize
            </button>
          )}

          <div className="flex items-center gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              disabled={message.isLoading || isTranslating}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Select target language"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <button
              onClick={handleTranslation}
              disabled={message.isLoading || isTranslating}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Translate to ${SUPPORTED_LANGUAGES[selectedLanguage]}`}
            >
              <Languages className="w-4 h-4" />
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <time className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </time>
        </div>
      </div>
    </div>
  );
}