import React from 'react';
import { Users, UserCheck, MessageCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </span>
      <span className="text-xs text-slate-400">vs. mês anterior</span>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Atendimentos Totais" 
          value="1,248" 
          change="+12.5%" 
          trend="up"
          icon={MessageCircle} 
        />
        <StatCard 
          title="Novos Clientes" 
          value="84" 
          change="+8.2%" 
          trend="up"
          icon={Users} 
        />
        <StatCard 
          title="Taxa de Triagem" 
          value="92%" 
          change="+2.4%" 
          trend="up"
          icon={UserCheck} 
        />
        <StatCard 
          title="Custo por Lead" 
          value="R$ 4.50" 
          change="-5.1%" 
          trend="down" // Good for cost
          icon={TrendingUp} 
        />
      </div>

      {/* Simulated Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Volume de Atendimentos</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-emerald-100 dark:bg-emerald-900/20 rounded-t-lg relative group">
                        <div 
                            style={{ height: `${h}%` }} 
                            className="bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 rounded-t-lg w-full absolute bottom-0"
                        ></div>
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity">
                            {h}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 uppercase font-medium">
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Distribuição por Área</h3>
            <div className="flex flex-col gap-4 mt-8">
                {[
                    { label: 'Previdenciário (Dr. Michel)', val: '45%', color: 'bg-blue-500' },
                    { label: 'Trabalhista (Dra. Luana)', val: '30%', color: 'bg-purple-500' },
                    { label: 'Família (Dra. Flávia)', val: '15%', color: 'bg-pink-500' },
                    { label: 'Outros / Dúvidas', val: '10%', color: 'bg-gray-400' },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
                            <span>{item.label}</span>
                            <span className="font-bold">{item.val}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: item.val }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
