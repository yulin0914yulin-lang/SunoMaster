import { GoogleGenAI, Type } from "@google/genai";
import { ElementType, CanvasElement } from '../types';
import { COMPONENT_REGISTRY } from '../constants';

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Using gemini-3-flash-preview for structured output tasks as recommended
const MODEL_NAME = "gemini-3-flash-preview";

interface AIElementData {
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string; // Optional property from AI
  color?: string; // Optional property from AI
}

export const generateLayoutFromPrompt = async (prompt: string): Promise<CanvasElement[]> => {
  if (!API_KEY) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please configure your environment.");
  }

  const systemInstruction = `
  You are a UI prototyping expert. Generate a layout of UI elements based on the user's description.
  The available element types are: ${Object.values(ElementType).join(', ')}.
  Assume a canvas width of 800px and height of 600px.
  Position elements logically so they don't overlap too much unless intended (like text on a card).
  Use reasonable default sizes if not specified.
  Return a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: Object.values(ElementType),
                description: "The type of UI component"
              },
              content: {
                type: Type.STRING,
                description: "The text content or image URL"
              },
              x: { type: Type.INTEGER, description: "X position on canvas" },
              y: { type: Type.INTEGER, description: "Y position on canvas" },
              width: { type: Type.INTEGER, description: "Width in pixels" },
              height: { type: Type.INTEGER, description: "Height in pixels" },
              backgroundColor: { type: Type.STRING, description: "Hex color code for background", nullable: true },
              color: { type: Type.STRING, description: "Hex color code for text", nullable: true },
            },
            required: ["type", "x", "y", "width", "height"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const rawElements: AIElementData[] = JSON.parse(jsonText);

    // Map the AI response to our internal CanvasElement structure
    const newElements: CanvasElement[] = rawElements.map((item) => {
      // Get base defaults
      const baseMeta = COMPONENT_REGISTRY[item.type as ElementType] || COMPONENT_REGISTRY[ElementType.CONTAINER];
      
      const elementId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: elementId,
        type: item.type as ElementType,
        x: item.x,
        y: item.y,
        width: item.width || baseMeta.defaultWidth,
        height: item.height || baseMeta.defaultHeight,
        content: item.content || baseMeta.defaultContent,
        style: {
          ...baseMeta.defaultStyle,
          ...(item.backgroundColor ? { backgroundColor: item.backgroundColor } : {}),
          ...(item.color ? { color: item.color } : {}),
          // Ensure positioning is absolute for the canvas
          position: 'absolute', 
          left: 0, 
          top: 0 
        }
      };
    });

    return newElements;

  } catch (error) {
    console.error("Error generating layout:", error);
    throw error;
  }
};
