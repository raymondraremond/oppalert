'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chatInput, setChatInput] = useState('');
  const { messages, sendMessage, regenerate, status, error } = useChat({
    onFinish: (messageData: any) => {
      const msg = messageData?.message || messageData;
      console.log('[OppBot] Stream Finished:', (msg.content || '').substring(0, 50) + '...');
    },
    onError: (err) => {
      console.error('[OppBot] Stream Error:', err);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const onHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    const content = chatInput;
    setChatInput('');
    await sendMessage({ message: content } as any);
  };


  // Diagnostic logging for connection errors
  useEffect(() => {
    if (error) {
      console.error('[OppBot Diagnostic] Connection Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }, [error]);



  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '600px',
              width: isMinimized ? '250px' : '400px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "mb-4 bg-surface2/80 backdrop-blur-xl border border-border2/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
              isMinimized ? "cursor-pointer" : ""
            )}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Header */}
            <div className="p-4 bg-emerald/10 border-b border-border2/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald flex items-center justify-center shadow-glow-emerald">
                  <Bot size={18} className="text-bg" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary leading-tight">OppBot</h3>
                  <p className="text-[10px] text-emerald font-medium uppercase tracking-wider">Online Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="p-1.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-primary"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-primary"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border2 scrollbar-track-transparent"
                >
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                        <MessageSquare className="text-muted" size={24} />
                      </div>
                      <h4 className="text-sm font-medium text-primary mb-1">How can I help you today?</h4>
                      <p className="text-xs text-muted">Ask me about scholarships, remote jobs, or your event registrations.</p>
                      
                      <div className="grid grid-cols-1 gap-2 mt-6 w-full">
                        {[
                          "Find me startup grants",
                          "How to export CVs?",
                          "Check my event registrations"
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setChatInput(suggestion);
                            }}
                            className="text-xs text-left p-2.5 rounded-xl border border-border2/30 bg-surface/30 hover:bg-emerald/5 hover:border-emerald/30 transition-all text-muted hover:text-primary"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-3",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        m.role === 'user' ? "bg-surface border border-border" : "bg-emerald shadow-glow-emerald"
                      )}>
                        {m.role === 'user' ? <User size={14} className="text-primary" /> : <Bot size={14} className="text-bg" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-emerald text-bg font-medium rounded-tr-none shadow-premium" 
                          : "bg-surface border border-border2/50 text-primary rounded-tl-none shadow-premium"
                      )}>
                        <div className="whitespace-pre-wrap">
                          {m.parts && m.parts.length > 0 ? m.parts.map((part: any, i: number) => (
                            part.type === 'text' ? <span key={i}>{part.text}</span> : null
                          )) : (m as any).content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald flex items-center justify-center shadow-glow-emerald">
                        <Bot size={14} className="text-bg" />
                      </div>
                      <div className="bg-surface border border-border2/50 rounded-2xl rounded-tl-none p-3 shadow-premium">
                        <Loader2 size={16} className="animate-spin text-emerald" />
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-[11px] text-danger-light text-center flex flex-col gap-3 shadow-lg shadow-danger/5">
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-danger uppercase tracking-widest">Connection Interrupted</p>
                        <p className="opacity-90 leading-relaxed">
                          {error.message === 'Access Restricted' || error.message.includes('403') 
                            ? 'Access to the AI service is restricted in your region. VPN or Proxy usage may be required.'
                            : 'The connection timed out or was lost. This often happens on serverless platforms.'}
                        </p>
                      </div>

                      <button 
                        onClick={() => regenerate()}
                        className="w-full py-2 bg-danger/10 hover:bg-danger/20 border border-danger/30 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Try Again &rarr;
                      </button>

                      <div className="p-2 bg-bg/40 rounded-xl border border-danger/10 text-[9px] text-danger/70 break-all text-left font-mono">
                        <strong>Code:</strong> {error.name} <br/>
                        <strong>Detail:</strong> {error.message}
                      </div>
                      
                      <p className="text-[8px] opacity-40 uppercase tracking-tighter">Diagnostic Health Check: /api/health</p>
                    </div>
                  )}



                </div>

                {/* Input Area */}
                <form 
                  onSubmit={onHandleSubmit}
                  className="p-4 bg-surface border-t border-border2/50 flex gap-2"
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask OppBot anything..."
                    className="flex-grow bg-surface2/50 border border-border2/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:border-emerald transition-all placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !chatInput.trim()}
                    className={cn(
                      "p-2 rounded-xl flex items-center justify-center transition-all",
                      isLoading || !chatInput.trim() 
                        ? "bg-surface2 text-muted cursor-not-allowed" 
                        : "bg-emerald text-bg shadow-glow-emerald hover:bg-emerald-light active:scale-95"
                    )}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500",
          isOpen ? "bg-surface2 border border-border text-primary rotate-90" : "bg-emerald-gradient text-bg shadow-glow-emerald-strong"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-bg animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
}
