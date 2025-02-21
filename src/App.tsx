import React, { useState, useRef, useEffect } from 'react';
import { MessageInput } from './components/MessageInput';
import { Message as MessageComponent } from './components/Message';
import { Message, SupportedLanguage } from './types';
import { Bot } from 'lucide-react';
import { detectLanguage, summarizeText, translateText } from './services/api';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      console.log('Attempting to detect language for:', text);
      const detectedLanguage = await detectLanguage(text);
      console.log('Detected language:', detectedLanguage);

      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, detectedLanguage, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error in handleNewMessage:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, error: error instanceof Error ? error.message : 'Failed to process message', isLoading: false }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslation = async (messageId: string, targetLanguage: SupportedLanguage) => {
    console.log('Starting translation to:', targetLanguage);
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isLoading: true }
          : msg
      )
    );

    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message) throw new Error('Message not found');

      console.log('Translating text:', message.text);
      const translation = await translateText(message.text, targetLanguage);
      console.log('Translation result:', translation);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, translation, targetLanguage, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error in handleTranslation:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, error: error instanceof Error ? error.message : 'Translation failed', isLoading: false }
            : msg
        )
      );
    }
  };

  const handleSummary = async (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isLoading: true }
          : msg
      )
    );

    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message) throw new Error('Message not found');

      const summary = await summarizeText(message.text);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, summary, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, error: 'Summarization failed', isLoading: false }
            : msg
        )
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Language Assistant</h1>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-600 mb-2">Welcome to Language Assistant!</h2>
              <p className="text-gray-500">Start typing to detect language, translate, or get summaries.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageComponent
                key={message.id}
                message={message}
                onRequestTranslation={(targetLanguage) => handleTranslation(message.id, targetLanguage)}
                onRequestSummary={() => handleSummary(message.id)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <MessageInput onSendMessage={handleNewMessage} isLoading={isProcessing} />
    </div>
  );
}

export default App;