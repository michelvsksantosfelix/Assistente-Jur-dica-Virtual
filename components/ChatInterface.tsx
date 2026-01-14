import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, MessageRole } from '../types';
import { generateChatResponse, blobToBase64 } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import AudioRecorder from './AudioRecorder';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.MODEL,
      text: "Olá. Sou a Mara, assistente virtual do escritório. \n\nFaço a triagem para o Dr. Michel (Previdenciário), Dra. Luana (Trabalhista) e Dra. Flávia (Família).\n\nPor favor, relate brevemente o seu caso para que eu possa direcionar ao advogado correto.",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text?: string, audioBlob?: Blob) => {
    if ((!text && !audioBlob) || isLoading) return;

    const newMessageId = uuidv4();
    const timestamp = new Date();

    // 1. Add User Message to State
    const userMessage: ChatMessage = {
      id: newMessageId,
      role: MessageRole.USER,
      text: text || "", 
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
      timestamp: timestamp,
      isAudioMessage: !!audioBlob
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 2. Prepare Input for Gemini
      let audioBase64: string | undefined;
      let audioMimeType: string | undefined;

      if (audioBlob) {
        audioBase64 = await blobToBase64(audioBlob);
        audioMimeType = audioBlob.type || 'audio/webm';
      }

      // 3. Get Text Response from Gemini (Mara Persona) with Reasoning
      const responseText = await generateChatResponse(messages, {
        text: text,
        audioBase64,
        audioMimeType
      });

      // 4. Create and Add Text Message Bubble
      const botTextMessage: ChatMessage = {
        id: uuidv4(),
        role: MessageRole.MODEL,
        text: responseText,
        timestamp: new Date(),
        isAudioMessage: false,
      };
      setMessages(prev => [...prev, botTextMessage]);

    } catch (error) {
      console.error("Failed to process message:", error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: MessageRole.MODEL,
        text: "Houve uma instabilidade na conexão. Por favor, poderia repetir a última informação?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText, undefined);
  };

  const handleAudioRecorded = (blob: Blob) => {
    handleSendMessage(undefined, blob);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#E5E5E5] shadow-2xl relative overflow-hidden">
        
      {/* Header (WhatsApp Style) */}
      <div className="bg-[#008069] p-3 flex items-center shadow-md z-10 text-white">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden mr-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E5E5E5" className="w-12 h-12 mt-2">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
             </svg>
        </div>
        <div className="flex flex-col">
            <h1 className="font-semibold text-lg leading-tight">Mara - Escritório</h1>
            <span className="text-xs text-green-100">Online agora</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-repeat"
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', opacity: 0.95 }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start mb-4">
                <div className="bg-white rounded-lg px-4 py-2 rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 z-10">
        <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-teal-500">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-transparent outline-none text-gray-700"
                    disabled={isLoading}
                />
            </div>
            {inputText.trim() ? (
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="p-3 bg-[#008069] text-white rounded-full shadow-md hover:bg-[#006e5a] transition-colors"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            ) : (
                <AudioRecorder onAudioRecorded={handleAudioRecorded} disabled={isLoading} />
            )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
