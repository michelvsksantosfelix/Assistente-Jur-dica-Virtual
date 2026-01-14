import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  QrCode, 
  Moon, 
  Sun, 
  LogOut,
  PieChart
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'chat-monitor', icon: MessageSquare, label: 'Atendimentos' },
    { id: 'contacts', icon: Users, label: 'Contatos' },
    { id: 'flow', icon: PieChart, label: 'Fluxos' },
    { id: 'connection', icon: QrCode, label: 'Conexão' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white font-serif font-bold text-xl">
            M
          </div>
          <span className="font-serif font-bold text-lg tracking-wide text-slate-800 dark:text-slate-100">
            MARA <span className="text-gold-500 text-xs uppercase tracking-widest font-sans font-normal ml-1">Admin</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Theme Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Modo</span>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Dr+Michel&background=0D9488&color=fff" alt="User" />
             </div>
             <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Dr. Michel Felix</h4>
                <p className="text-xs text-slate-500 truncate">Administrador</p>
             </div>
             <LogOut size={16} className="text-slate-400 hover:text-red-500" onClick={onLogout} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto relative">
        {/* Background gradient blur */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="p-8 relative z-10 max-w-7xl mx-auto min-h-screen">
          <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {navItems.find(n => n.id === activeTab)?.label}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Gestão de atendimento em tempo real</p>
            </div>
            <div className="flex gap-3">
                 <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200">
                    Exportar Relatório
                 </button>
                 <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
                    <QrCode size={16} /> Novo Dispositivo
                 </button>
            </div>
          </header>
          
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
