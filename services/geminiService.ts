import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RecognitionResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recognitionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcribedText: {
      type: Type.STRING,
      description: "The exact text content transcribed from the handwritten image.",
    },
    detectedLanguage: {
      type: Type.STRING,
      description: "The full name of the language detected in the text (e.g., 'English', 'Hindi', 'French').",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A confidence score between 0 and 100 regarding the accuracy of the transcription.",
    },
  },
  required: ["transcribedText", "detectedLanguage", "confidenceScore"],
};

export const analyzeHandwriting = async (base64Image: string, mimeType: string): Promise<RecognitionResult> => {
  try {
    const modelId = "gemini-3-flash-preview"; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image containing handwritten text. 
            1. Transcribe the text exactly as it appears, preserving line breaks if possible.
            2. Detect the language of the text.
            3. Provide a confidence score (0-100) based on legibility.
            
            Return the result in JSON format.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recognitionSchema,
        temperature: 0.1, // Low temperature for more deterministic/accurate OCR
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response received from AI model.");
    }

    const result = JSON.parse(jsonText) as RecognitionResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to process the handwriting. Please try again with a clearer image.");
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLanguage}. Return ONLY the translated text without any explanations or markdown.\n\nText: ${text}`,
    });
    
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("Failed to translate text.");
  }
};

/**
 * Helper to convert File to Base64 string (without the data URL prefix for the API)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/png;base64, prefix
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};