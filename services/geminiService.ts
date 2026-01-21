import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;
  
  private constructor() {}

  static getInstance() {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async checkApiKey(): Promise<boolean> {
    // Assuming window.aistudio.hasSelectedApiKey is available in the environment
    if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
      return await (window as any).aistudio.hasSelectedApiKey();
    }
    return true; // Default true if not in the specific environment that requires selection
  }

  async openKeySelector() {
    if (typeof (window as any).aistudio?.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
    }
  }

  async generateImage(prompt: string): Promise<string> {
    // Instantiate with latest key from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received");
  }

  async generateVideo(prompt: string, onProgress: (msg: string) => void): Promise<string> {
    // Instantiate with latest key from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    onProgress("Initializing cinematic engine...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onProgress("Processing high-fidelity frames...");

    while (!operation.done) {
      // Changed to 10000ms (10s) as per Gemini SDK best practices
      await new Promise(resolve => setTimeout(resolve, 10000));
      onProgress("Applying Unreal Engine shaders & particles...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    onProgress("Finalizing render...");
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}