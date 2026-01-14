import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate QR Code generation/refresh
  useEffect(() => {
    // Just a placeholder QR code API or static image
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MaraAssistant-Session-${Date.now()}&color=128C7E`);
    
    const interval = setInterval(() => {
        // Refresh QR code effect
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MaraAssistant-Session-${Date.now()}&color=128C7E`);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleQrClick = () => {
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 text-gray-800 relative overflow-hidden font-sans">
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-[#00a884] z-0"></div>

        <div className="z-10 flex flex-col items-center justify-center h-full px-4 w-full max-w-5xl mx-auto">
            
            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full overflow-hidden max-h-[80vh] md:h-[70%]">
                
                {/* Left Side: Instructions */}
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-3xl font-light text-[#41525d] mb-2">Mara Assistente</h1>
                        <p className="text-lg text-gray-600">Conecte seu WhatsApp para iniciar o atendimento automático.</p>
                    </div>

                    <ol className="list-decimal list-inside space-y-4 text-lg text-[#3b4a54]">
                        <li>Abra o WhatsApp no seu celular</li>
                        <li>Toque em <strong>Mais opções</strong> <span className="inline-block align-middle"><svg viewBox="0 0 24 24" width="16" height="16" fill="#54656f"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg></span> no Android ou em <strong>Configurações</strong> <span className="inline-block align-middle"><svg viewBox="0 0 24 24" width="16" height="16" fill="#54656f"><path d="M19.137 13.062c-.066-.757-.278-1.464-.594-2.112l1.973-1.63a.856.856 0 0 0 .22-.977l-2.078-4.015a.853.853 0 0 0-.943-.432l-2.607.726a8.55 8.55 0 0 0-3.326-1.848l-.707-2.45A.853.853 0 0 0 10.252 0H5.748a.854.854 0 0 0-.824.615l-.707 2.45a8.497 8.497 0 0 0-3.326 1.848l-2.607-.726a.854.854 0 0 0-.943.432L-4.737 8.634a.856.856 0 0 0 .22.977l1.973 1.63a9.073 9.073 0 0 0-.002 4.225l-1.973 1.63a.856.856 0 0 0-.22.977l2.078 4.015a.853.853 0 0 0 .943.432l2.607-.726a8.55 8.55 0 0 0 3.326 1.848l.707 2.45a.854.854 0 0 0 .824.615h4.504a.854.854 0 0 0 .824-.615l.707-2.45a8.536 8.536 0 0 0 3.326-1.848l2.607.726a.853.853 0 0 0 .943-.432l2.078-4.015a.856.856 0 0 0-.22-.977l-1.973-1.63c.318-.65.53-1.357.594-2.112zM8 12.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"></path></svg></span> no iPhone</li>
                        <li>Toque em <strong>Aparelhos conectados</strong> e depois em <strong>Conectar um aparelho</strong></li>
                        <li>Aponte seu celular para esta tela para capturar o código</li>
                    </ol>
                    
                    <div className="mt-8 text-teal-600 font-medium text-sm cursor-pointer hover:underline">
                        Precisa de ajuda para começar?
                    </div>
                </div>

                {/* Right Side: QR Code */}
                <div className="p-8 md:p-12 border-l border-gray-200 flex flex-col items-center justify-center relative">
                    {isLoading ? (
                         <div className="flex flex-col items-center">
                             <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                             <p className="text-gray-500 font-medium">Conectando à Mara...</p>
                         </div>
                    ) : (
                        <div className="relative group cursor-pointer" onClick={handleQrClick} title="Clique para simular a leitura do QR Code">
                            <img 
                                src={qrCode} 
                                alt="QR Code de Acesso" 
                                className="w-64 h-64 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg font-medium">
                                    Simular Leitura
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                                    <input type="checkbox" defaultChecked className="accent-teal-600 w-4 h-4" />
                                    <label>Manter conectado</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer info */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Simulação de Interface Web para Assistente Jurídica • Desenvolvido com Gemini API</p>
                <p className="mt-2 text-xs opacity-75">Sua chave API é processada de forma segura.</p>
            </div>
        </div>
    </div>
  );
};

export default LoginScreen;
