
import { GoogleGenAI, Type } from "@google/genai";
import { Idea } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const expandIdea = async (prompt: string): Promise<Partial<Idea>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform this simple idea into a structured business or creative concept: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          expandedTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["title", "content"]
            }
          },
          imagePrompt: { type: Type.STRING, description: "A detailed prompt for image generation based on this idea" }
        },
        required: ["expandedTitle", "description", "sections", "imagePrompt"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return result;
};

export const generateImageForIdea = async (imagePrompt: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }]
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
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
};
