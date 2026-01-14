import React from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { OFFICE_PHONE_BOOK, SYSTEM_INSTRUCTION } from '../constants';

const SettingsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt Editor */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Instruções do Sistema (Prompt)</h3>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded border border-blue-200">Gemini 3 Flash</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">Edite como a Mara se comporta. Cuidado: alterações aqui afetam todos os novos atendimentos.</p>
            
            <textarea 
                className="w-full h-96 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                defaultValue={SYSTEM_INSTRUCTION}
            />
            
            <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                    <Save size={18} /> Salvar Alterações
                </button>
            </div>
        </div>

        {/* Configurations */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Lista Telefônica (Encaminhamento)</h3>
                <div className="space-y-4">
                    {Object.entries(OFFICE_PHONE_BOOK).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1">{key}</label>
                            <input 
                                type="text" 
                                defaultValue={value} 
                                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800 dark:text-amber-400">Zona de Perigo</h4>
                        <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">
                            Desconectar o WhatsApp irá parar todos os atendimentos imediatamente.
                        </p>
                        <button className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 underline">
                            Desconectar Sessão
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsPanel;
