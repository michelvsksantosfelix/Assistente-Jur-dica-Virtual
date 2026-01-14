import React, { useState } from 'react';
import { Contact, ChatMessage, MessageRole } from '../types';
import { Search, Filter, MoreVertical, Send, Mic, Phone, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface'; // Reusing the chat interface for the view

// Mock Contacts
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Maria da Silva', phoneNumber: '+55 11 99999-8888', status: 'Em Triagem', lastMessageTime: new Date(), unreadCount: 2, sentiment: 'neutral', avatar: 'https://ui-avatars.com/api/?name=Maria+Silva&background=random' },
  { id: '2', name: 'João Souza', phoneNumber: '+55 11 98888-7777', status: 'Encaminhado', assignedTo: 'Dr. Michel', lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), unreadCount: 0, sentiment: 'positive', avatar: 'https://ui-avatars.com/api/?name=Joao+Souza&background=random' },
  { id: '3', name: 'Ana Pereira', phoneNumber: '+55 11 97777-6666', status: 'Lead', lastMessageTime: new Date(Date.now() - 1000 * 60 * 120), unreadCount: 1, sentiment: 'negative', avatar: 'https://ui-avatars.com/api/?name=Ana+Pereira&background=random' },
];

const ChatMonitor: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(MOCK_CONTACTS[0]);
  const [viewMode, setViewMode] = useState<'monitor' | 'takeover'>('monitor');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Encaminhado': return 'bg-green-100 text-green-700 border-green-200';
      case 'Em Triagem': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Lead': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Contact List (Left) */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar contato, CPF ou caso..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium whitespace-nowrap dark:text-slate-300">Todos</button>
                <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium whitespace-nowrap border border-emerald-200">Não Lidos (3)</button>
                <button className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-full text-xs font-medium whitespace-nowrap dark:text-slate-300">Em Triagem</button>
                <button className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-full text-xs font-medium whitespace-nowrap dark:text-slate-300">Encaminhados</button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {MOCK_CONTACTS.map(contact => (
                <div 
                    key={contact.id} 
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800
                        ${selectedContact?.id === contact.id ? 'bg-emerald-50 dark:bg-slate-800/50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'}
                    `}
                >
                    <div className="relative">
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full" />
                        {contact.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                                {contact.unreadCount}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-slate-800 dark:text-white truncate">{contact.name}</h4>
                            <span className="text-[10px] text-slate-400">{contact.lastMessageTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
                            {contact.assignedTo ? `Encaminhado para: ${contact.assignedTo}` : 'Mara: Aguardando resposta...'}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(contact.status)}`}>
                                {contact.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Chat Area (Right) */}
      <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-slate-950 relative">
        {selectedContact ? (
            <>
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img src={selectedContact.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{selectedContact.name}</h3>
                            <span className="text-xs text-slate-500">{selectedContact.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setViewMode(viewMode === 'monitor' ? 'takeover' : 'monitor')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border
                                ${viewMode === 'takeover' 
                                    ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse' 
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}
                            `}
                        >
                            {viewMode === 'takeover' ? '⚠️ Intervenção Humana Ativa' : '🤖 Modo Automático (Mara)'}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* The Chat Interface (Reused) */}
                <div className="flex-1 relative">
                    <div className="absolute inset-0 pb-16"> 
                        {/* We use a slight hack here: we render ChatInterface but we hide its header since we built a custom one above */}
                        <style>{`.chat-header-hidden .bg-\\[\\#008069\\] { display: none !important; }`}</style>
                        <div className="h-full w-full chat-header-hidden">
                            <ChatInterface />
                        </div>
                    </div>
                </div>
                
                {/* Mock Intervention Input (Only visible if Takeover) */}
                {viewMode === 'takeover' && (
                    <div className="absolute bottom-4 left-4 right-4 bg-amber-50 p-2 rounded-xl shadow-lg border border-amber-200 flex gap-2 items-center z-20">
                         <input className="flex-1 bg-transparent border-none outline-none text-amber-900 placeholder-amber-700/50 px-2" placeholder="Escreva como advogado (Mara pausada)..." />
                         <button className="p-2 bg-amber-600 text-white rounded-lg"><Send size={18} /></button>
                    </div>
                )}
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageCircle size={48} className="mb-4 opacity-20" />
                <p>Selecione uma conversa para monitorar</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMonitor;