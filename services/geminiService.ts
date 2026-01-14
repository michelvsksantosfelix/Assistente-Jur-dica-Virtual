import { GoogleGenAI, Type } from "@google/genai";
import type { FunctionDeclaration } from "@google/genai";
import { CHAT_MODEL_NAME, SYSTEM_INSTRUCTION, OFFICE_PHONE_BOOK } from '../constants';
import { ChatMessage, MessageRole } from '../types';

// Initialize the client
// process.env.API_KEY is assumed to be available
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Definition of the tool/function Mara can use to handoff the client.
 */
const notifyStaffTool: FunctionDeclaration = {
  name: "notificar_equipe",
  description: "Envia os dados do cliente e o resumo do caso para o membro correto da equipe (Advogado ou Secretária). Use isso ao final da triagem.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      nome_cliente: {
        type: Type.STRING,
        description: "Nome do cliente identificado na conversa."
      },
      resumo_caso: {
        type: Type.STRING,
        description: "Um resumo breve e técnico do problema do cliente."
      },
      membro_destino: {
        type: Type.STRING,
        description: "Para quem enviar: 'Dr. Michel', 'Dra. Luana', 'Dra. Flávia' ou 'Fabrícia'.",
        enum: ["Dr. Michel", "Dra. Luana", "Dra. Flávia", "Fabrícia"]
      },
      prioridade: {
        type: Type.STRING,
        description: "Nível de urgência baseado no relato.",
        enum: ["Baixa", "Normal", "Alta"]
      }
    },
    required: ["nome_cliente", "resumo_caso", "membro_destino"]
  }
};

/**
 * Helper to convert Blob to Base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Simulates the backend logic of sending a message to the lawyer/secretary.
 */
const mockSendToWhatsAppAPI = async (data: any) => {
    console.log("🚀 [SISTEMA] Iniciando encaminhamento...");
    
    // Determine the phone number based on the destination
    let phone = "";
    if (data.membro_destino.includes("Michel")) phone = OFFICE_PHONE_BOOK.MICHEL;
    else if (data.membro_destino.includes("Luana")) phone = OFFICE_PHONE_BOOK.LUANA;
    else if (data.membro_destino.includes("Flávia")) phone = OFFICE_PHONE_BOOK.FLAVIA;
    else phone = OFFICE_PHONE_BOOK.FABRICIA;

    console.log(`📱 [WHATSAPP API] Enviando mensagem para ${data.membro_destino} (${phone})`);
    console.log(`📄 [CONTEÚDO]:\nCliente: ${data.nome_cliente}\nPrioridade: ${data.prioridade || 'Normal'}\nResumo: ${data.resumo_caso}`);
    
    // In a real app, here you would do: await fetch('https://api.whatsapp.com/...', { body: ... })
    // For now, we return a success string to the AI
    return { status: "sucesso", mensagem: `Dados enviados com sucesso para ${data.membro_destino}. Avise o cliente.` };
};

/**
 * Generates a chat response, handling text, audio, and function calls.
 */
export const generateChatResponse = async (
  history: ChatMessage[],
  currentInput: { text?: string; audioBase64?: string; audioMimeType?: string }
): Promise<string> => {
  const ai = getClient();

  // Format history
  const contents = history.map((msg) => ({
    role: msg.role === MessageRole.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Add current input
  const currentParts: any[] = [];
  if (currentInput.audioBase64 && currentInput.audioMimeType) {
    currentParts.push({
      inlineData: {
        mimeType: currentInput.audioMimeType,
        data: currentInput.audioBase64,
      },
    });
    currentParts.push({ text: "O usuário enviou este áudio. Ouça, extraia as informações e responda em texto." });
  } else if (currentInput.text) {
    currentParts.push({ text: currentInput.text });
  }

  contents.push({ role: 'user', parts: currentParts });

  try {
    // 1. First call: Check if model wants to reply text or call a function
    const result = await ai.models.generateContent({
      model: CHAT_MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [notifyStaffTool] }],
        thinkingConfig: { thinkingBudget: 1024 }, 
        maxOutputTokens: 2048, 
      },
    });

    // Check for function calls in the response
    const functionCalls = result.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);

    if (functionCalls && functionCalls.length > 0) {
        // The model wants to perform an action (Handoff)
        const call = functionCalls[0].functionCall!;
        const args = call.args as any;

        // Execute the "Backend Logic"
        const apiResponse = await mockSendToWhatsAppAPI(args);

        // 2. Send the result back to Gemini so it can generate the final confirmation to the user
        const functionResponseParts = [
            {
                functionResponse: {
                    name: "notificar_equipe",
                    response: { result: apiResponse }
                }
            }
        ];

        // We need to send the whole history + the model's function call + our response
        // Note: In a stateless REST call, we reconstruct the turn. 
        // Complex interactions usually require maintaining a full chat session object, 
        // but here we append to the current content flow for the second turn.
        
        const finalResponse = await ai.models.generateContent({
            model: CHAT_MODEL_NAME,
            contents: [
                ...contents, 
                { role: 'model', parts: result.candidates![0].content.parts }, // The model's intent to call function
                { role: 'user', parts: functionResponseParts } // The result of the function
            ],
            config: {
                 // No tools needed for the final confirmation message, usually
                 thinkingConfig: { thinkingBudget: 512 }, 
            }
        });

        return finalResponse.text || "Pronto, dados encaminhados.";
    }

    return result.text || "Desculpe, não entendi.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Tive um pequeno problema técnico. Podemos continuar?";
  }
};
