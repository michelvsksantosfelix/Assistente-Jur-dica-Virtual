export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  audioUrl?: string; 
  timestamp: Date;
  isAudioMessage?: boolean;
}

export type UserStatus = 'online' | 'offline' | 'busy';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  status: 'Lead' | 'Em Triagem' | 'Encaminhado' | 'Cliente';
  assignedTo?: 'Dr. Michel' | 'Dra. Luana' | 'Dra. Flávia' | 'Fabrícia' | null;
  lastMessageTime: Date;
  unreadCount: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Conversation {
  contactId: string;
  messages: ChatMessage[];
  summary?: string; // Auto-generated summary by Gemini
}

// Mock Data Types
export interface DashboardStats {
  totalLeads: number;
  activeTriages: number;
  forwardedToday: number;
  conversionRate: string;
}