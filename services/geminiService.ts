
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisSummary, AppIdea } from "../types";

export async function generateAppIdeas(summary: AnalysisSummary, directive: string = ""): Promise<AppIdea[]> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return getFallbackAppIdeas();
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze this codebase for "Digital Asset Wealth Automation" with integrated Compliance Guardrails.
    Statistics:
    - Files: ${summary.totalFiles}
    - Functions: ${summary.totalFunctions}
    - Languages: ${JSON.stringify(summary.languageDistribution)}

    DIRECTIVE: ${directive}

    Suggest 4-5 high-yield Android application ideas that function as "Automated Wealth Assets". 
    Focus on apps that run themselves and scale revenue with zero marginal cost.
    
    CRITICAL: For each idea, include a "Compliance Framework" and detailed "Market Metadata" for commercialization.
    
    For each idea, provide a detailed JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              relevanceScore: { type: Type.NUMBER },
              keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              monetizationStrategy: { type: Type.STRING },
              automationPotential: { type: Type.STRING },
              projectedAssetValue: { type: Type.STRING },
              wealthVelocity: { type: Type.STRING },
              compliance: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER },
                  guidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ethicalNotes: { type: Type.STRING }
                },
                required: ["status", "riskScore", "guidelines", "ethicalNotes"]
              },
              marketMetadata: {
                type: Type.OBJECT,
                properties: {
                  targetDemographic: { type: Type.STRING },
                  launchStatus: { type: Type.STRING },
                  marketStrategy: { type: Type.STRING },
                  competitorEdge: { type: Type.STRING },
                  seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  seoDescription: { type: Type.STRING },
                  publicationParameters: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING },
                      schedule: { type: Type.STRING },
                      automationHook: { type: Type.STRING }
                    },
                    required: ["platform", "schedule", "automationHook"]
                  }
                },
                required: ["targetDemographic", "launchStatus", "marketStrategy", "competitorEdge", "seoKeywords", "seoDescription", "publicationParameters"]
              }
            },
            required: ["title", "description", "relevanceScore", "keyFeatures", "techStack", "monetizationStrategy", "automationPotential", "projectedAssetValue", "wealthVelocity", "compliance", "marketMetadata"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.warn("Wealth Blueprint generation using offline fallback:", error);
    return getFallbackAppIdeas();
  }
}

function getFallbackAppIdeas(): AppIdea[] {
  return [
    {
      id: "67snipper-payroll-engine",
      title: "67SNIPPER Automated Payroll & Liquidity Engine",
      description: "Employee self-service checkout portal with a 50% weekly early access rule and automated Sunday settlement logic.",
      relevanceScore: 98,
      keyFeatures: [
        "Instant 50% accrued wage checkout",
        "Automated Sunday night liquidity settlement",
        "Corporate ledger audit logging",
        "Multi-employee roster management"
      ],
      techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Electron"],
      monetizationStrategy: "B2B SaaS subscription & instant micro-settlement transaction fee model",
      automationPotential: "100% Autonomous Ledger Sync",
      projectedAssetValue: "$250,000 ARR",
      wealthVelocity: "EXPONENTIAL",
      compliance: {
        status: "CLEAR",
        riskScore: 5,
        guidelines: [
          "Ensure local labor compliance for wage advances.",
          "Maintain strict client-side encryption on user records."
        ],
        ethicalNotes: "Protects worker financial wellness while maintaining corporate liquidity safety reserves."
      },
      marketMetadata: {
        targetDemographic: "SMBs, Tech Startups & Modern Employers",
        launchStatus: "PRODUCTION",
        marketStrategy: "Direct B2B outreach & App Store distribution",
        competitorEdge: "Integrated 50% weekly early access cash-velocity protocol",
        seoKeywords: ["employee payroll", "earned wage access", "payroll automation", "self service checkout"],
        seoDescription: "Automated employee payroll self-service checkout with 50% weekly early access rules.",
        publicationParameters: {
          platform: "Google Play / Desktop Windows (.EXE)",
          schedule: "Instant Commercial Distribution",
          automationHook: "Cron-triggered Sunday settlement"
        }
      }
    }
  ];
}


