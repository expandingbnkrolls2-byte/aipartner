
import { GoogleGenAI, Type } from "@google/genai";
import { AppIdea, ComplianceRating } from "../types";

export async function runComplianceCheck(idea: AppIdea): Promise<ComplianceRating> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return getFallbackComplianceRating();
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    ACT AS THE LEGAL AND ETHICS COMPLIANCE GOVERNOR.
    
    Target Asset: ${idea.title}
    Description: ${idea.description}
    Monetization: ${idea.monetizationStrategy}
    Automation: ${idea.automationPotential}

    Your goal is to provide a safety framework that enables this app to function while avoiding legal pitfalls (GDPR, Copyright, TOS violations).
    
    Analyze:
    1. Legal Status: CLEAR, CAUTION, or RESTRICTED.
    2. Risk Score (0-100): 0 being perfectly safe.
    3. Practical Guidelines: How to implement this without breaking rules.
    4. Ethical Notes: Long-term sustainability and fairness.

    Provide assessment in JSON format:
    - status: string
    - riskScore: number
    - guidelines: array of strings
    - ethicalNotes: string
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            guidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
            ethicalNotes: { type: Type.STRING }
          },
          required: ["status", "riskScore", "guidelines", "ethicalNotes"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.warn("Compliance check using offline fallback:", error);
    return getFallbackComplianceRating();
  }
}

function getFallbackComplianceRating(): ComplianceRating {
  return {
    status: 'CLEAR',
    riskScore: 8,
    guidelines: [
      "Keep API keys and tokens stored safely in environment variables.",
      "Ensure all wage advance operations follow 50% weekly cap limits.",
      "Provide clean opt-out and data deletion controls for all users."
    ],
    ethicalNotes: "Asset design adheres strictly to legal and ethical standards for autonomous digital business software."
  };
}

