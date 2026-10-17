
export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface FunctionAnalysis {
  name: string;
  type: 'UI' | 'Logic' | 'API' | 'Database' | 'Utility' | 'Unknown';
  snippet: string;
}

export interface FileAnalysisResult {
  fileName: string;
  language: string;
  functionCount: number;
  functions: FunctionAnalysis[];
  linesOfCode: number;
}

export interface ComplianceRating {
  status: 'CLEAR' | 'CAUTION' | 'RESTRICTED';
  riskScore: number;
  guidelines: string[];
  ethicalNotes: string;
}

export interface MarketMetadata {
  targetDemographic: string;
  launchStatus: 'BETA' | 'PRODUCTION' | 'PRE-LAUNCH';
  marketStrategy: string;
  competitorEdge: string;
  seoKeywords?: string[];
  seoDescription?: string;
  publicationParameters?: {
    platform: string;
    schedule: string;
    automationHook: string;
  };
}

export interface AppIdea {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  keyFeatures: string[];
  techStack: string[];
  monetizationStrategy?: string;
  automationPotential?: string;
  projectedAssetValue?: string;
  wealthVelocity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPONENTIAL';
  compliance?: ComplianceRating;
  isConstructing?: boolean;
  constructionComplete?: boolean;
  synthesizedSource?: string;
  constructionGuide?: string;
  isMarketReady?: boolean;
  marketMetadata?: MarketMetadata;
}

export interface OverseerDirective {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface OverseerReport {
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  constructibilityScore: number;
  wealthVelocityScore: number;
  intelligenceInsights: string[];
  suggestedAutomations: string[];
  digitalAssetValuation: string;
  complianceBrief?: string;
}

export interface AnalysisSummary {
  totalFiles: number;
  totalFunctions: number;
  languageDistribution: Record<string, number>;
  functionTypeDistribution: Record<string, number>;
  topFiles: FileAnalysisResult[];
  overseerReport?: OverseerReport;
}
