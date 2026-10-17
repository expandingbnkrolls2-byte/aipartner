
import { GoogleGenAI, Type } from "@google/genai";
import { AppIdea } from "../types";

export interface ConstructionResult {
  manifest: string;
  guide: string;
}

export async function constructAssetSource(idea: AppIdea): Promise<ConstructionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    ACT AS THE MASTER ARCHITECT & CONSTRUCTION ENGINE.
    
    Synthesize a complete source code manifest and a DETAILED STEP-BY-STEP IMPLEMENTATION GUIDE for the following wealth asset:
    Title: ${idea.title}
    Description: ${idea.description}
    Tech Stack: ${idea.techStack.join(', ')}
    Monetization: ${idea.monetizationStrategy}
    
    REQUIREMENTS:
    1. MANIFEST: Generate a high-level multi-platform source code blueprint. 
       Include directory structure, core logic modules (with automation loops), and UI boilerplate code.
       CRITICAL: Include automated publication hooks for Market Vault synchronization and resale liquidity.
    2. GUIDE: Provide a comprehensive, chronological guider for a developer or automated system to build this from scratch.
       Include:
       - Environment Setup (Prerequisites).
       - Initializing the core project.
       - Mapping the provided manifest to files.
       - Integrating API keys and environment variables.
       - Deployment and Automation testing steps.
       - Market Vault synchronization procedure.

    Format the output as a valid JSON object with 'manifest' and 'guide' properties.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          manifest: { type: Type.STRING },
          guide: { type: Type.STRING }
        },
        required: ["manifest", "guide"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Construction synthesis parsing error", error);
    return {
      manifest: "Synthesis failed to produce manifest.",
      guide: "Synthesis failed to produce guide."
    };
  }
}
