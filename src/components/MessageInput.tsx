import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4 sticky bottom-0 shadow-lg shadow-gray-900/5"
    >
      <div className="flex items-end gap-3 max-w-4xl mx-auto relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="flex-1 resize-none rounded-2xl border border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[52px] max-h-[200px] text-[15px] leading-normal placeholder:text-gray-400"
          aria-label="Message input"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed h-[52px] w-[52px] flex items-center justify-center transition-colors duration-200"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-400">
          {isLoading ? 'Processing your message...' : 'Messages are processed in real-time'}
        </span>
      </div>
    </form>
  );
}