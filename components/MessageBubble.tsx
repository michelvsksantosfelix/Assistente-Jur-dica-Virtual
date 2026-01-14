import React from 'react';
import { ChatMessage, MessageRole } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isOnlyAudio = message.isAudioMessage && !message.text;

  // Format time (HH:MM)
  const timeString = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg px-2 py-2 shadow-sm text-sm sm:text-base
          ${isUser ? 'bg-[#D9FDD3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}
          ${isOnlyAudio ? 'min-w-[200px]' : ''}
        `}
      >
        {/* User Name / Bot Name - Only show if not audio only, to save space, or keep consistent */}
        {!isUser && !isOnlyAudio && (
          <div className="text-xs font-bold text-teal-600 mb-1 px-1">
            Mara
          </div>
        )}

        {/* Text Content */}
        {message.text && (
            <p className="whitespace-pre-wrap leading-relaxed break-words px-1">
                {message.text}
            </p>
        )}

        {/* Audio Content (Voice Note Style) */}
        {message.audioUrl && (
          <div className={`flex items-center gap-2 ${message.text ? 'mt-2' : ''}`}>
             <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full p-1 pr-3">
                 {/* Simulated Profile/Icon for Audio */}
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-teal-500' : 'bg-gray-400'} text-white`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                    </svg>
                 </div>
                 <audio controls src={message.audioUrl} className="h-8 w-40 max-w-full" style={{ outline: 'none' }} />
             </div>
          </div>
        )}

        {/* Timestamp & Status Check */}
        <div className="flex justify-end items-center mt-1 space-x-1 px-1">
          <span className="text-[10px] text-gray-500">
            {timeString}
          </span>
          {isUser && (
            <span className="text-blue-500">
                <svg viewBox="0 0 16 15" width="16" height="15" className="w-3 h-3">
                    <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-7.04a.366.366 0 0 0-.064-.54zm-4.72 2.708l-.479-.372a.365.365 0 0 0-.51.063L4.566 12.33a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515-.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l3.272-3.67a.365.365 0 0 0-.063-.54z"/>
                </svg>
            </span>
          )}
        </div>

        {/* Little Tail for bubble */}
        {isUser ? (
             <div className="absolute top-0 right-[-8px] w-0 h-0 border-t-[10px] border-t-[#D9FDD3] border-r-[10px] border-r-transparent"></div>
        ) : (
             <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
