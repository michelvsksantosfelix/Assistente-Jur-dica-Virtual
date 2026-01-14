import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import DashboardLayout from './components/DashboardLayout';
import DashboardStats from './components/DashboardStats';
import ChatMonitor from './components/ChatMonitor';
import SettingsPanel from './components/SettingsPanel';

// Simulated Views
type AppView = 'login' | 'dashboard' | 'client_demo';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogin = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('login');
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardStats />;
      case 'chat-monitor': return <ChatMonitor />;
      case 'contacts': return <ChatMonitor />; // Reusing monitor for now as it lists contacts
      case 'settings': return <SettingsPanel />;
      case 'connection': return <LoginScreen onLogin={() => {}} />; // Show QR Code again
      default: return <div className="p-10 text-center text-slate-500">Módulo em desenvolvimento...</div>;
    }
  };

  if (view === 'login') {
    return (
      <div className="relative h-screen w-full">
         <LoginScreen onLogin={handleLogin} />
         {/* Button to simulate the "Client Side" for testing */}
         <button 
            onClick={() => setView('client_demo')}
            className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow text-xs opacity-50 hover:opacity-100"
         >
            Simular Cliente (Bot)
         </button>
      </div>
    );
  }

  if (view === 'client_demo') {
      return (
        <div className="w-full h-full min-h-screen bg-[#d1d7db] flex justify-center items-center font-sans relative">
            <button 
                onClick={() => setView('login')}
                className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow text-xs z-50"
            >
                &larr; Voltar
            </button>
            <div className="w-full h-full sm:h-[800px] sm:w-[400px] shadow-2xl">
                <ChatInterface />
            </div>
        </div>
      );
  }

  // Dashboard View
  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default App;
