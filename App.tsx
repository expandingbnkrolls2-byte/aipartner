
import React, { useState, useRef, useMemo } from 'react';
import { 
  FileCode, 
  FolderOpen, 
  FolderDown,
  BarChart3, 
  Lightbulb, 
  Cpu, 
  Layout, 
  Code2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronDown,
  Settings2,
  Layers,
  X,
  Code,
  ShieldAlert,
  Zap,
  Bot,
  Terminal,
  Activity,
  DollarSign,
  Briefcase,
  TrendingUp,
  Globe,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  Server,
  Wallet,
  Scale,
  Gavel,
  ShieldCheck,
  Eye,
  Lock,
  Download,
  Hammer,
  Package,
  Search,
  FileJson,
  ListOrdered,
  BookOpen,
  Info,
  FileText,
  Star,
  Rocket,
  Target,
  Trophy,
  PieChart as PieIcon
} from 'lucide-react';
import { CodeFile, FileAnalysisResult, AnalysisSummary, AppIdea, FunctionAnalysis, OverseerDirective, OverseerReport, ComplianceRating } from './types';
import { analyzeFile } from './services/codeParser';
import { generateAppIdeas } from './services/geminiService';
import { runOverseerAnalysis } from './services/overseerService';
import { constructAssetSource } from './services/constructionService';
import { FEATURED_PORTFOLIO } from './services/featuredPortfolio';
import { getMLAICompanionResponse, MLAIMessage, runObstacleDecimator } from './services/mlaiCompanionService';
import EmployeePayroll from './EmployeePayroll';
import BackupModal from './BackupModal';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DIRECTIVES: OverseerDirective[] = [
  { id: 'wealth', label: 'Wealth Synthesis', prompt: 'Maximize digital asset value, passive income loops, and automated internet wealth scaling.', icon: 'Coins' },
  { id: 'portfolio', label: 'Portfolio Synthesis', prompt: 'Generate high-demand commercial-ready digital asset portfolios for trending niches like Eco-friendly branding and Hyper-local marketing.', icon: 'Briefcase' },
  { id: 'construct', label: 'Build Multi-Platform', prompt: 'Optimize architectures for React Native, Flutter, and Web synthesis with cross-platform automation.', icon: 'Hammer' },
  { id: 'compliance', label: 'Ethics Governor', prompt: 'Prioritize strict adherence to data privacy, ethical AI usage, and legal frameworks.', icon: 'Scale' },
  { id: 'market', label: 'Market Velocity', prompt: 'Focus on speed-to-market, viral growth loops, and competitor displacement strategies.', icon: 'Rocket' },
];

interface AppIdeaCardProps {
  idea: AppIdea;
  onConstruct: (id: string) => void | Promise<void>;
  onPromote: (id: string) => void;
}

const AppIdeaCard: React.FC<AppIdeaCardProps> = ({ idea, onConstruct, onPromote }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadFile = (content: string, filename: string, suffix: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${suffix}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-slate-900 border-2 transition-all duration-500 rounded-[3rem] overflow-hidden flex flex-col h-fit shadow-3xl ${isExpanded ? 'border-emerald-500/60 ring-4 ring-emerald-500/10' : 'border-slate-800 hover:border-emerald-500/30'}`}>
      <div className="p-10 relative">
        {idea.isConstructing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            <p className="font-black text-emerald-400 uppercase tracking-widest text-sm animate-pulse text-center px-6">Synthesizing Architecture & Build Guider...</p>
          </div>
        )}
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase tracking-[0.3em] flex items-center gap-2">
            <Zap className="w-3 h-3" />
            POTENTIAL: {idea.relevanceScore}%
          </div>
          <div className="flex gap-3">
             {idea.constructionComplete && (
               <div className="px-4 py-2 bg-emerald-600 border border-emerald-400 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3" />
                 SYNTHESIZED
               </div>
             )}
          </div>
        </div>

        <h3 className="text-4xl font-black text-white mb-6 tracking-tighter italic leading-none">{idea.title}</h3>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">{idea.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <p className="text-[9px] font-black text-emerald-500 uppercase mb-1 tracking-widest">Est. Valuation</p>
            <p className="text-xl font-black text-white tracking-tighter">{idea.projectedAssetValue}</p>
          </div>
          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest text-right">Wealth Velocity</p>
            <p className="text-xl font-black text-white tracking-tighter uppercase text-right">{idea.wealthVelocity}</p>
          </div>
        </div>

        {idea.constructionComplete && (
          <button 
            onClick={() => onPromote(idea.id)}
            className="w-full py-4 mb-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-2xl"
          >
            <Rocket className="w-6 h-6" />
            PROMOTE TO MARKET READY
          </button>
        )}
      </div>

      <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-10 pb-10 space-y-10 border-t border-slate-800 pt-10 bg-slate-950/30">
          {idea.constructionComplete ? (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => idea.synthesizedSource && downloadFile(idea.synthesizedSource, idea.title, 'source_pack')}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-6 h-6" />
                GET SOURCE PACK
              </button>
              <button 
                onClick={() => idea.constructionGuide && downloadFile(idea.constructionGuide, idea.title, 'build_guide')}
                className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6" />
                GET BUILD GUIDE
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onConstruct(idea.id)}
              disabled={idea.isConstructing}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Hammer className="w-6 h-6" />
              INITIALIZE BUILD
            </button>
          )}
        </div>
      </div>

      <div className="px-10 pb-10 mt-auto">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-4 text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:text-white transition-colors"
        >
          {isExpanded ? 'Collapse Architecture' : 'View Architecture Detail'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

const MarketProductCard: React.FC<{ idea: AppIdea }> = ({ idea }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-emerald-500/20 rounded-[3rem] p-10 shadow-3xl group relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">{idea.title}</h3>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-1">{idea.marketMetadata?.launchStatus || 'MARKET READY'}</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl">
           <p className="text-[8px] text-slate-500 font-black uppercase">Asset Valuation</p>
           <p className="text-xl font-black text-emerald-400 tabular-nums">{idea.projectedAssetValue}</p>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Market Strategy</h4>
          </div>
          <p className="text-sm text-slate-300 font-medium italic">"{idea.marketMetadata?.marketStrategy}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Demographic</h4>
            <p className="text-xs text-slate-100 font-bold">{idea.marketMetadata?.targetDemographic}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Competitive Edge</h4>
            <p className="text-xs text-slate-100 font-bold">{idea.marketMetadata?.competitorEdge}</p>
          </div>
        </div>

        {idea.marketMetadata?.seoDescription && (
          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Search className="w-3 h-3" />
              SEO Optimized Description
            </h4>
            <p className="text-xs text-slate-300 italic">"{idea.marketMetadata.seoDescription}"</p>
            {idea.marketMetadata.seoKeywords && (
              <div className="flex flex-wrap gap-1 mt-3">
                {idea.marketMetadata.seoKeywords.map((kw, i) => (
                  <span key={i} className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">#{kw}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {idea.marketMetadata?.publicationParameters && (
          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Publication & Resale Liquidity
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] text-slate-500 uppercase">Platform</p>
                <p className="text-[10px] font-bold text-white">{idea.marketMetadata.publicationParameters.platform}</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase">Schedule</p>
                <p className="text-[10px] font-bold text-white">{idea.marketMetadata.publicationParameters.schedule}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-500/10">
              <p className="text-[8px] text-slate-500 uppercase">Automation Hook</p>
              <p className="text-[9px] font-mono text-indigo-300 truncate">{idea.marketMetadata.publicationParameters.automationHook}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {idea.techStack.map((tech, idx) => (
          <span key={idx} className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black rounded-lg border border-white/5">
            {tech}
          </span>
        ))}
      </div>

      <button className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl">
        <Rocket className="w-6 h-6 text-emerald-600" />
        LAUNCH TO PRODUCTION
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'governor' | 'market' | 'roi' | 'payroll'>('governor');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [overseerLoading, setOverseerLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResult[]>([]);
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeDirective, setActiveDirective] = useState(DIRECTIVES[0]);
  const [overseerReport, setOverseerReport] = useState<OverseerReport | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MLAI Companion States
  const [mlaiEnabled, setMlaiEnabled] = useState(true);
  const [mlaiPanelOpen, setMlaiPanelOpen] = useState(true);
  const [mlaiDirective, setMlaiDirective] = useState('');
  const [mlaiSending, setMlaiSending] = useState(false);
  const [mlaiChatHistory, setMlaiChatHistory] = useState<MLAIMessage[]>([
    {
      role: 'model',
      content: 'Hello Partner! I am your MLAI Command Chair Companion & Ride-Along Intern. My mission is to analyze our AI Studio projects, run autonomous optimization sweeps in your absence, and tackle any obstacles blockading our path to "payday". Direct me below, or let me operate in the background while you are elsewhere!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [mlaiSkills, setMlaiSkills] = useState([
    { name: "Autonomous SEO Sweeper", level: 1, description: "Crawls web listings & indexes green keywords for sustainable search domination." },
    { name: "Lead Distribution Optimizer", level: 1, description: "Bypasses slow lead capture times by intelligently rerouting leads via SMS API loops." },
    { name: "Liquidity Vault Handshaker", level: 1, description: "Negotiates continuous asset liquidity exchange rates on the Market Vault network." },
    { name: "API Obstacle Decimator", level: 1, description: "Resolves missing schemas, rate-limiting blockers, and database query latency." }
  ]);
  const [mlaiActionLog, setMlaiActionLog] = useState([
    { id: '1', timestamp: '11:00 AM', action: 'MLAI Core Initialized', impact: 'Command chair active, standing by to fill in.' }
  ]);

  const allProjects = useMemo(() => {
    const list = [...appIdeas];
    FEATURED_PORTFOLIO.forEach(p => {
      if (!list.some(item => item.id === p.id)) {
        list.push(p);
      }
    });
    return list;
  }, [appIdeas]);

  const [mlaiLearnedProjects, setMlaiLearnedProjects] = useState<{ id: string; name: string; status: 'Visually Inspected' | 'Optimized for Payday' | 'Fully Autonomous' }[]>([]);

  // Expand the Command Chair States
  const [mlaiStrategy, setMlaiStrategy] = useState<'Default Partner' | 'Hyper-Velocity Scale' | 'Compliance Fortress' | 'API Decimator'>('Default Partner');
  const [decimatorCode, setDecimatorCode] = useState('');
  const [decimatorObstacle, setDecimatorObstacle] = useState('');
  const [decimatorResult, setDecimatorResult] = useState<{ solution: string; actionTaken: string; impact: string } | null>(null);
  const [decimating, setDecimating] = useState(false);

  // Runway Defense Simulator States
  const [drillActive, setDrillActive] = useState(false);
  const [drillScenario, setDrillScenario] = useState<'seo' | 'surge' | 'cpc' | 'audit' | null>(null);
  const [drillStep, setDrillStep] = useState(0);
  const [drillLogs, setDrillLogs] = useState<string[]>([]);
  const [drillProgress, setDrillProgress] = useState(0);
  const [drillResult, setDrillResult] = useState<{ preservedIncome: number; valuationGrowth: number; skillBoosted: string; levelUp: number } | null>(null);
  const [passiveMultiplier, setPassiveMultiplier] = useState(1.0);

  const handleStrategyChange = (strategy: typeof mlaiStrategy) => {
    setMlaiStrategy(strategy);
    
    const strategyDescriptions: Record<string, { action: string; impact: string }> = {
      'Default Partner': {
        action: "Shifted Command Chair Strategy to Balanced Partner Assist.",
        impact: "Continuous standard scans, stable passive revenue projections active."
      },
      'Hyper-Velocity Scale': {
        action: "⚡ Unleashed Hyper-Velocity Scale Strategy!",
        impact: "Prioritizing aggressive monetization routing, raising background payout metrics."
      },
      'Compliance Fortress': {
        action: "🛡️ Hardened Command Strategy to Ethics & Compliance Fortress.",
        impact: "Continuous sandbox isolation audits, minimizing ecosystem risk vectors."
      },
      'API Decimator': {
        action: "🔧 Configured Operating Strategy to API & Code Decimation Mode.",
        impact: "Readying real-time code optimization compilers, prioritizing technical blockers."
      }
    };

    const desc = strategyDescriptions[strategy];
    setMlaiActionLog(prev => [{
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action: desc.action,
      impact: desc.impact
    }, ...prev].slice(0, 15));
  };

  const handleDecimateObstacle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decimatorObstacle.trim() || decimating) return;

    setDecimating(true);
    setDecimatorResult(null);

    try {
      const res = await runObstacleDecimator(decimatorCode, decimatorObstacle, mlaiStrategy);
      setDecimatorResult(res);

      // Log success event
      setMlaiActionLog(prev => [{
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action: `🔧 DECIMATED OBSTACLE: ${res.actionTaken}`,
        impact: res.impact
      }, ...prev].slice(0, 15));

      // Append companion message
      setMlaiChatHistory(prev => [...prev, {
        role: 'model',
        content: `Obstacle Decimated successfully under "${mlaiStrategy}" strategy!\n\n**Action taken**: ${res.actionTaken}\n**Impact**: ${res.impact}\n\nI have fully refactored and updated our knowledge-base. View the Sandbox results for full code correction details!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Level up API Obstacle Decimator skill specifically
      setMlaiSkills(prev => prev.map(skill => {
        if (skill.name === "API Obstacle Decimator") {
          return { ...skill, level: skill.level + 2 };
        }
        return skill;
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setDecimating(false);
    }
  };

  const handleInitiateDefenseDrill = (scenario: 'seo' | 'surge' | 'cpc' | 'audit') => {
    if (drillActive) return;

    setDrillActive(true);
    setDrillScenario(scenario);
    setDrillStep(0);
    setDrillProgress(0);
    setDrillResult(null);

    const scenarioConfigs = {
      seo: {
        name: "Google Algorithm Core SEO Sweeper Update",
        logs: [
          "[0.5s] 🚨 WARNING: Google core ranking update detected. Competitor indexing algorithms shifting.",
          "[2.0s] 🔍 Crawling organic metadata indexes... Found high friction score in header attributes.",
          "[4.0s] 🎓 Triggering Level-up Sweep: Autonomous SEO Sweeper recalculating optimal keyword density.",
          "[6.5s] ⚡ SEO parameters injected into local file build configuration directly. Metadata updated.",
          "[8.0s] 🟢 DEFENSE ESTABLISHED: Site ranking locked on Page 1. Core traffic shielded."
        ],
        skillBoost: "Autonomous SEO Sweeper",
        multiplierGain: 0.05
      },
      surge: {
        name: "Viral Inflow Congestion (HN/Reddit/TikTok Surge)",
        logs: [
          "[0.5s] 🚨 TRAFFIC ALERT: High volume connection surge detected (12,400 hits/sec).",
          "[2.0s] 🚧 Server connection pooling saturating. Memory usage escalating rapidly.",
          "[4.5s] 🔧 API Obstacle Decimator deploying lazy initialization and debouncing queries.",
          "[6.8s] ⚡ Lead routing pipeline bypassed directly to SMS notification channels. Load alleviated.",
          "[8.5s] 🟢 DEFENSE ESTABLISHED: High-volume request handling verified. Monetization channels unblocked."
        ],
        skillBoost: "Lead Distribution Optimizer",
        multiplierGain: 0.07
      },
      cpc: {
        name: "Ad CPC Price Gouging Inflation wave",
        logs: [
          "[0.5s] 🚨 AD MARKET WAVE: Competitor ad spend bid war detected. Customer Acquisition Cost up 180%.",
          "[2.2s] 🪙 Interrogating Market Vault Network. Analyzing arbitrage and liquidity yield offsets.",
          "[4.8s] 🤝 Liquidity Vault Handshaker negotiating peer-to-peer liquidity discount loops.",
          "[7.0s] ⚡ Direct arbitrage revenue channels established to offset CAC inflation.",
          "[8.8s] 🟢 DEFENSE ESTABLISHED: Competitor ad spend war mitigated. High profitability preserved."
        ],
        skillBoost: "Liquidity Vault Handshaker",
        multiplierGain: 0.06
      },
      audit: {
        name: "Hostile Competitor Compliance Audit Sweep",
        logs: [
          "[0.5s] 🚨 SECURITY DETECTED: External audit crawlers running compliance checks.",
          "[2.2s] 🛡️ Activating Ethics Governor protocols. Scanning codebase for privacy/exceptions.",
          "[4.5s] ⚖️ Refactoring and patching non-compliant dependencies. Hardening container firewall.",
          "[7.2s] 🔒 Strict sanitization controls applied. Audit verified complete with 100% security rating.",
          "[9.0s] 🟢 DEFENSE ESTABLISHED: Legal risk decimated. Complete portfolio integrity certified."
        ],
        skillBoost: "API Obstacle Decimator",
        multiplierGain: 0.05
      }
    };

    const config = scenarioConfigs[scenario];
    setDrillLogs([config.logs[0]]);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < config.logs.length) {
        setDrillStep(currentStep);
        setDrillLogs(prev => [...prev, config.logs[currentStep]]);
        setDrillProgress((currentStep / (config.logs.length - 1)) * 100);
      } else {
        clearInterval(interval);
        // Complete drill
        const incomeBoost = Math.round(12500 * config.multiplierGain);
        const valuationBoost = Math.round(5000000 * (config.multiplierGain * 1.5));
        
        setDrillResult({
          preservedIncome: incomeBoost,
          valuationGrowth: valuationBoost,
          skillBoosted: config.skillBoost,
          levelUp: 2
        });

        // Boost active states
        setPassiveMultiplier(p => p + config.multiplierGain);
        setMlaiSkills(prev => prev.map(s => {
          if (s.name === config.skillBoost) {
            return { ...s, level: s.level + 2 };
          }
          return s;
        }));

        setMlaiActionLog(prev => [{
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          action: `🛡️ DRILL RESOLVED: Shielded against ${config.name}!`,
          impact: `Preserved $${incomeBoost.toLocaleString()}/mo stream. Skill Upgraded: ${config.skillBoost} (+2 LVL).`
        }, ...prev].slice(0, 15));

        setDrillActive(false);
      }
    }, 1800);
  };

  React.useEffect(() => {
    setMlaiLearnedProjects(allProjects.map(p => ({
      id: p.id,
      name: p.title,
      status: p.isMarketReady ? 'Fully Autonomous' : 'Optimized for Payday'
    })));
  }, [allProjects]);

  React.useEffect(() => {
    setMlaiLearnedProjects(allProjects.map(p => ({
      id: p.id,
      name: p.title,
      status: p.isMarketReady ? 'Fully Autonomous' : 'Optimized for Payday'
    })));
  }, [allProjects]);

  React.useEffect(() => {
    if (!mlaiEnabled) return;

    const interval = setInterval(() => {
      const actions = [
        { action: "Optimized lead-routing parameters for local service dispatchers.", impact: "Reduced customer friction, boosting velocity." },
        { action: "Conducted automated SEO metadata sweep with high-volume trending search keywords.", impact: "Secured page 1 visibility ranking estimate." },
        { action: "Completed API handshake with Market Vault network nodes.", impact: "Immediate resale liquidity status confirmed." },
        { action: "Checked codebase parsing integrity for compliance exceptions.", impact: "0 errors found. Ethics governor satisfied." },
        { action: "Executed automated micro-payment sandbox transaction test.", impact: "Monetization rails fully responsive." }
      ];

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const newLog = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action: randomAction.action,
        impact: randomAction.impact
      };

      setMlaiActionLog(prev => [newLog, ...prev].slice(0, 15));

      // Growing technical skill check: 30% chance of leveling up a skill!
      if (Math.random() < 0.3) {
        setMlaiSkills(prev => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          return prev.map((skill, idx) => {
            if (idx === randomIndex) {
              const newLevel = skill.level + 1;
              // Add skill up action log entry
              setMlaiActionLog(p => [{
                id: Math.random().toString(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                action: `🎓 SKILL UPGRADED: ${skill.name} reached Level ${newLevel}!`,
                impact: "Greater operational efficiency on path to payday."
              }, ...p].slice(0, 15));
              return { ...skill, level: newLevel };
            }
            return skill;
          });
        });
      }
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, [mlaiEnabled]);

  const handleSendMlaiDirective = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mlaiDirective.trim() || mlaiSending || !mlaiEnabled) return;

    const userMessage: MLAIMessage = {
      role: 'user',
      content: mlaiDirective,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMlaiChatHistory(prev => [...prev, userMessage]);
    setMlaiDirective('');
    setMlaiSending(true);

    try {
      const stateSummary = mlaiLearnedProjects.map(p => `- Project: ${p.name} (Status: ${p.status})`).join('\n') || "No current active projects discovered.";
      
      const chatForSDK = mlaiChatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const companionResponseText = await getMLAICompanionResponse(chatForSDK, userMessage.content, stateSummary);
      
      setMlaiChatHistory(prev => [...prev, {
        role: 'model',
        content: companionResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      setMlaiActionLog(prev => [{
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action: `Processed User Directive: "${userMessage.content.slice(0, 40)}${userMessage.content.length > 40 ? '...' : ''}"`,
        impact: "Adjusting command chair parameters according to custom partner guidance."
      }, ...prev]);

      // Skill growth on prompt interaction
      setMlaiSkills(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((skill, idx) => {
          if (idx === randomIndex) {
            return { ...skill, level: skill.level + 1 };
          }
          return skill;
        });
      });

    } catch (err) {
      console.error(err);
    } finally {
      setMlaiSending(false);
    }
  };

  const handleExportLogs = () => {
    const logHeader = `========================================================================\n` +
                      `              67SNIPPER LABS - MLAI COMMAND CHAIR EXPORTED LOGS          \n` +
                      `              Exported at: ${new Date().toLocaleString()}                \n` +
                      `========================================================================\n\n`;
    const logContent = mlaiActionLog.map(log => 
      `[${log.timestamp}] ACTION: ${log.action}\nIMPACT: ${log.impact}\n------------------------------------------------------------------------`
    ).join('\n\n');
    const fullLog = logHeader + logContent;
    const blob = new Blob([fullLog], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MLAI_CommandChair_Logs_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const mlaiCompetencyScore = useMemo(() => {
    return mlaiSkills.reduce((sum, s) => sum + s.level, 0);
  }, [mlaiSkills]);

  const passiveMonthlyRevenue = useMemo(() => {
    return 12500 * (1 + mlaiCompetencyScore * 0.15) * passiveMultiplier;
  }, [mlaiCompetencyScore, passiveMultiplier]);

  const cumulativeAssetValue = useMemo(() => {
    let sum = 0;
    allProjects.forEach(proj => {
      const valStr = proj.projectedAssetValue || "$0";
      const numericValue = parseFloat(valStr.replace(/[^0-9.]/g, ''));
      if (valStr.toUpperCase().includes('M')) {
        sum += numericValue * 1000000;
      } else if (valStr.toUpperCase().includes('K')) {
        sum += numericValue * 1000;
      } else {
        sum += numericValue;
      }
    });
    return (sum || 4450000) * passiveMultiplier;
  }, [allProjects, passiveMultiplier]);

  const chartData = useMemo(() => {
    return [
      { month: 'Month 1', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.4), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 0.6) },
      { month: 'Month 2', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.45), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 0.72) },
      { month: 'Month 3', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.5), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 0.88) },
      { month: 'Month 4', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.52), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 1.05) },
      { month: 'Month 5', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.55), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 1.25) },
      { month: 'Month 6', 'Organic Income': Math.round(passiveMonthlyRevenue * 0.6), 'MLAI Automated Booster': Math.round(passiveMonthlyRevenue * 1.5) },
    ];
  }, [passiveMonthlyRevenue]);

  const assetBreakdownData = useMemo(() => {
    return allProjects.map(proj => {
      const valStr = proj.projectedAssetValue || "$0";
      let numericValue = parseFloat(valStr.replace(/[^0-9.]/g, ''));
      if (valStr.toUpperCase().includes('M')) {
        numericValue = numericValue * 1000000;
      } else if (valStr.toUpperCase().includes('K')) {
        numericValue = numericValue * 1000;
      }
      return {
        name: proj.title.slice(0, 15) + (proj.title.length > 15 ? '...' : ''),
        'Valuation ($)': numericValue || 500000
      };
    });
  }, [allProjects]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setAnalyzing(true);
    setError(null);
    setAnalysisResults([]);
    setAppIdeas([]);
    setOverseerReport(null);
    try {
      const newFiles: CodeFile[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const content = await file.text();
        newFiles.push({
          name: file.name,
          path: (file as any).webkitRelativePath || file.name,
          content,
          language: file.name.split('.').pop() || 'txt',
          size: file.size
        });
      }
      setFiles(newFiles);
      const results = newFiles.map(analyzeFile);
      setAnalysisResults(results);
    } catch (err) {
      setError("Failed to read files.");
    } finally {
      setAnalyzing(false);
    }
  };

  const summary = useMemo<AnalysisSummary | null>(() => {
    if (analysisResults.length === 0) return null;
    const langDist: Record<string, number> = {};
    const funcTypeDist: Record<string, number> = {};
    let totalFuncs = 0;
    analysisResults.forEach(res => {
      langDist[res.language] = (langDist[res.language] || 0) + 1;
      totalFuncs += res.functionCount;
      res.functions.forEach(f => {
        funcTypeDist[f.type] = (funcTypeDist[f.type] || 0) + 1;
      });
    });
    return {
      totalFiles: analysisResults.length,
      totalFunctions: totalFuncs,
      languageDistribution: langDist,
      functionTypeDistribution: funcTypeDist,
      topFiles: [...analysisResults].sort((a, b) => b.functionCount - a.functionCount).slice(0, 10),
      overseerReport: overseerReport || undefined
    };
  }, [analysisResults, overseerReport]);

  const marketLineup = useMemo(() => appIdeas.filter(i => i.isMarketReady), [appIdeas]);

  const handleGenerateIdeas = async () => {
    if (!summary) return;
    setGenerating(true);
    try {
      const ideas = await generateAppIdeas(summary, activeDirective.prompt);
      setAppIdeas(ideas.map((idea, idx) => ({ ...idea, id: `idea-${idx}` })));
    } catch (err) {
      setError("Idea synthesis failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleConstructIdea = async (id: string) => {
    setAppIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, isConstructing: true } : idea));
    const targetIdea = appIdeas.find(i => i.id === id);
    if (!targetIdea) return;
    try {
      const result = await constructAssetSource(targetIdea);
      setAppIdeas(prev => prev.map(idea => idea.id === id ? { 
        ...idea, 
        isConstructing: false, 
        constructionComplete: true,
        synthesizedSource: result.manifest,
        constructionGuide: result.guide
      } : idea));
    } catch (err) {
      setAppIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, isConstructing: false } : idea));
      setError("Master synthesis failed.");
    }
  };

  const handlePromoteToMarket = (id: string) => {
    setAppIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, isMarketReady: true } : idea));
    setActiveTab('market');
  };

  const handleInjectFeaturedPortfolio = () => {
    setAppIdeas(prev => [...prev, ...FEATURED_PORTFOLIO]);
    setActiveTab('market');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter text-white uppercase italic leading-none">67Snipper Lab</h1>
              <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.3em]">Wealth Synthesis v7.0</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800/50 p-1 rounded-2xl border border-slate-700">
            <button 
              onClick={() => setActiveTab('governor')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'governor' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Synthesis Lab
            </button>
            <button 
              onClick={() => setActiveTab('market')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'market' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Market Vault
              {marketLineup.length > 0 && <span className="bg-white text-indigo-950 w-4 h-4 rounded-full flex items-center justify-center text-[8px]">{marketLineup.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('roi')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'roi' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              ROI Analytics
            </button>
            <button 
              onClick={() => setActiveTab('payroll')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'payroll' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Employee Payroll
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBackupModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 transition-all rounded-lg text-sm font-bold border border-amber-500/40 text-amber-300 shadow-md"
            >
              <FolderDown className="w-4 h-4 text-amber-400 animate-bounce" />
              Backup & .EXE
            </button>

            <button 
              onClick={() => setMlaiPanelOpen(!mlaiPanelOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${mlaiPanelOpen ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-indigo-500/20 text-indigo-300 hover:bg-slate-800'}`}
            >
              <Bot className="w-4 h-4" />
              MLAI Partner {mlaiEnabled ? "(ON)" : "(OFF)"}
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg text-sm font-bold border border-emerald-500/20 text-emerald-100"
            >
              <FileJson className="w-4 h-4" />
              Ingest Assets
            </button>
          </div>
          {/* Fix: Bypassing TypeScript error for non-standard 'webkitdirectory' and 'directory' attributes by using an object spread with type assertion. */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            {...({ webkitdirectory: "", directory: "" } as any)} 
            onChange={handleFileUpload} 
          />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto relative px-4 lg:px-8 gap-8 items-stretch">
        <main className="flex-1 py-8 overflow-hidden min-w-0">
          {activeTab === 'governor' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Analysis Summary & Blueprint Projection */}
              {!summary ? (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-10">
                  <Hammer className="w-24 h-24 text-slate-800 animate-pulse" />
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Synthesize Wealth.</h2>
                  <p className="text-slate-500 max-w-xl text-xl font-medium">Ingest a codebase to analyze functional patterns and project automated market-ready applications.</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-12 py-5 bg-emerald-600 rounded-[2rem] font-black text-xl shadow-2xl border-b-8 border-emerald-800 hover:scale-[1.02] transition-transform"
                  >
                    INITIALIZE SYNTHESIS
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <section className="bg-slate-900/50 border border-emerald-500/30 rounded-[3rem] p-10 flex flex-col lg:flex-row gap-16 relative overflow-hidden group">
                    <div className="flex-1 space-y-8">
                      <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Wealth Directive</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {DIRECTIVES.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setActiveDirective(d)}
                            className={`p-6 rounded-3xl border-2 text-left transition-all ${activeDirective.id === d.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}
                          >
                            <p className={`font-black uppercase text-xs tracking-widest mb-1 ${activeDirective.id === d.id ? 'text-emerald-400' : 'text-slate-500'}`}>{d.label}</p>
                            <p className="text-xs text-slate-400 font-medium">{d.prompt}</p>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={handleGenerateIdeas}
                        disabled={generating}
                        className="w-full py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-5 shadow-3xl border-b-[12px] border-emerald-800 disabled:opacity-50"
                      >
                        {generating ? <Loader2 className="w-10 h-10 animate-spin" /> : <Rocket className="w-10 h-10" />}
                        PROJECT ARCHITECTURES
                      </button>
                    </div>
                    <div className="flex-1 bg-slate-950 p-10 rounded-[3rem] border border-slate-800 flex flex-col justify-center text-center opacity-50">
                      <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Lab Stats</p>
                      <p className="text-5xl font-black text-white tracking-tighter mt-4">{summary.totalFunctions} Handlers Found</p>
                      <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mt-2">Ready for Multi-Platform Synthesis</p>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {appIdeas.map((idea) => (
                      <AppIdeaCard key={idea.id} idea={idea} onConstruct={handleConstructIdea} onPromote={handlePromoteToMarket} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'market' ? (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="p-6 bg-indigo-600/20 rounded-[2.5rem] border border-indigo-500/30 text-indigo-400">
                    <Star className="w-12 h-12" />
                 </div>
                 <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">Market Lineup</h2>
                 <p className="text-slate-400 max-w-xl text-lg font-medium">Verified automated assets ready for commercial deployment and launch.</p>
                 <button 
                   onClick={handleInjectFeaturedPortfolio}
                   className="mt-4 px-6 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                 >
                   Inject High-Demand Portfolio
                 </button>
              </div>

              {marketLineup.length === 0 ? (
                <div className="py-20 flex flex-col items-center text-slate-700 space-y-4">
                  <Trophy className="w-16 h-16 opacity-20" />
                  <p className="font-black uppercase tracking-[0.4em]">Vault Currently Empty</p>
                  <button onClick={() => setActiveTab('governor')} className="text-emerald-500 font-bold hover:underline">Return to Lab to Synthesize Assets</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {marketLineup.map((idea) => (
                    <MarketProductCard key={idea.id} idea={idea} />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'roi' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-6 bg-emerald-600/20 rounded-[2.5rem] border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">ROI Analytics</h2>
                <p className="text-slate-400 max-w-xl text-lg font-medium">Real-time valuation forecasts, passive income scaling metrics, and MLAI competency gains.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Cumulative Portfolio Value</span>
                    <h3 className="text-3xl font-black text-white mt-1">
                      ${(cumulativeAssetValue / 1000000).toFixed(2)}M
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Real-time updated</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Projected Monthly Revenue</span>
                    <h3 className="text-3xl font-black text-emerald-400 mt-1">
                      ${passiveMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span>Baseline: $12,500 + {((passiveMonthlyRevenue / 12500 - 1) * 100).toFixed(0)}% skill boost</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">MLAI Competency Level</span>
                    <h3 className="text-3xl font-black text-indigo-400 mt-1">
                      Level {mlaiCompetencyScore}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span>Sum of active command skills</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Payday Streams</span>
                    <h3 className="text-3xl font-black text-white mt-1">
                      {mlaiLearnedProjects.length} Scanned
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span>Autonomous sweeps: ON</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 6-Month Income Projection Chart */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl">
                  <div className="mb-4">
                    <h3 className="font-black text-white uppercase italic text-sm tracking-tight">Cumulative Income Forecast (6-Months)</h3>
                    <p className="text-xs text-slate-500">Autonomous growth multiplier applied to active digital assets.</p>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMLAI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', fontSize: '12px' }}
                          labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="Organic Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                        <Area type="monotone" dataKey="MLAI Automated Booster" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorMLAI)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Individual Asset Valuations */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl">
                  <div className="mb-4">
                    <h3 className="font-black text-white uppercase italic text-sm tracking-tight">Active Portfolio Asset Valuations</h3>
                    <p className="text-xs text-slate-500">Commercial resale and liquidity appraisal based on market parameters.</p>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assetBreakdownData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', fontSize: '12px' }}
                          labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Valuation']}
                        />
                        <Bar dataKey="Valuation ($)" fill="#6366f1" radius={[10, 10, 0, 0]} maxBarSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Extra Interactive Analytics Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="font-black text-white uppercase italic text-lg tracking-tight mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Continuous Optimization & Monetization Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Zap className="w-4 h-4" />
                      <span className="font-black text-xs uppercase tracking-wider">Automated Arbitrage</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">MLAI processes real-time transaction fees and liquidity differentials across verified Market Vault nodes.</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Target className="w-4 h-4" />
                      <span className="font-black text-xs uppercase tracking-wider">Green SEO Capture</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">High-volume organic search visibility terms are continuous-injected into codebase metadata dynamically.</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-black text-xs uppercase tracking-wider">Rerouted Leads Pipeline</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">Local customer dispatch velocity optimized with immediate automated SMS notifications bypassing delays.</p>
                  </div>
                </div>
              </div>

              {/* MLAI Runway Stress Test & Defense Simulator */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                <div>
                  <h3 className="font-black text-white uppercase italic text-lg tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    MLAI Stress Test Runway & Defense Drill
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Stress-test your active portfolio under extreme market scenarios. Trigger real-time autonomous defenses to protect your income and increase your performance multipliers.
                  </p>
                </div>

                {/* Drill Scenarios Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'seo', name: 'Google Algorithm Update', desc: 'Core search indexes update unexpectedly.', color: 'text-amber-400', border: 'border-amber-500/20' },
                    { id: 'surge', name: 'Viral Traffic Spike', desc: 'Congestion from viral Reddit/TikTok inflow.', color: 'text-sky-400', border: 'border-sky-500/20' },
                    { id: 'cpc', name: 'CPC Ad Bid Inflation', desc: 'Competitor ad inflation wave hits CAC.', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                    { id: 'audit', name: 'Competitor Compliance Audit', desc: 'Hostile risk and validation scans.', color: 'text-rose-400', border: 'border-rose-500/20' }
                  ].map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleInitiateDefenseDrill(scenario.id as any)}
                      disabled={drillActive || !mlaiEnabled}
                      className={`bg-slate-950 p-5 rounded-2xl border ${scenario.border} text-left hover:border-indigo-500/30 transition-all hover:bg-slate-950/80 disabled:opacity-50 disabled:hover:bg-slate-950 group`}
                    >
                      <span className={`text-[10px] font-black uppercase ${scenario.color} tracking-widest block mb-1 group-hover:translate-x-0.5 transition-transform`}>
                        {scenario.name}
                      </span>
                      <p className="text-xs text-slate-400 font-medium leading-normal">{scenario.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Running Simulation Progress */}
                {drillActive && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        <span className="text-xs font-black uppercase text-slate-300">Defense Simulation Active</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold">{Math.round(drillProgress)}%</span>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${drillProgress}%` }}
                      />
                    </div>

                    {/* Simulated terminal logs */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-[10px] text-slate-300 space-y-1.5 h-36 overflow-y-auto">
                      {drillLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result Card */}
                {drillResult && (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-black text-xs uppercase tracking-wider">Defense Complete</span>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic">Stress Shield Verified</h4>
                      <p className="text-xs text-slate-400">MLAI has secured all payload routes against simulated degradation triggers.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Revenue Protected</span>
                        <div className="text-sm font-black text-emerald-400">+${drillResult.preservedIncome.toLocaleString()}/mo</div>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Valuation Lift</span>
                        <div className="text-sm font-black text-indigo-400">+${(drillResult.valuationGrowth / 1000).toFixed(0)}k</div>
                      </div>
                    </div>

                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-indigo-400 font-black">Skill Upgraded</span>
                        <div className="text-xs font-bold text-white">{drillResult.skillBoosted}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-black">Boost</span>
                        <div className="text-sm font-black text-emerald-400">+{drillResult.levelUp} LVL</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EmployeePayroll 
              corporateCashReserve={cumulativeAssetValue}
              onLogAction={(action, impact) => {
                const newLog = {
                  id: Math.random().toString(),
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  action,
                  impact
                };
                setMlaiActionLog(prev => [newLog, ...prev].slice(0, 15));
              }}
            />
          )}
        </main>

        {/* MLAI Companion Panel */}
        {mlaiPanelOpen && (
          <aside className="w-full lg:w-[420px] shrink-0 py-8 flex flex-col gap-6 animate-in slide-in-from-right duration-300 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col h-full shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight text-white uppercase italic">MLAI Partner</h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Command Chair Intern</p>
                  </div>
                </div>

                {/* ON/OFF Switch */}
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-wider ${mlaiEnabled ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                    {mlaiEnabled ? "ONLINE" : "STANDBY"}
                  </span>
                  <button
                    onClick={() => setMlaiEnabled(!mlaiEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${mlaiEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    id="mlai-toggle"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mlaiEnabled ? 'translate-x-4' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Operating Strategy Selector */}
              <div className="mb-6 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                    Active Command Strategy
                  </h4>
                  <span className="text-[7px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 font-black rounded-md uppercase tracking-wider">
                    {mlaiStrategy}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Default Partner', 'Hyper-Velocity Scale', 'Compliance Fortress', 'API Decimator'] as const).map((strategy) => (
                    <button
                      key={strategy}
                      onClick={() => handleStrategyChange(strategy)}
                      disabled={!mlaiEnabled}
                      className={`px-2 py-1.5 rounded-lg text-[9px] font-bold text-left transition-all ${
                        mlaiStrategy === strategy
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-300 border border-slate-900/40'
                      } disabled:opacity-30`}
                    >
                      {strategy === 'Default Partner' && '🤝 Balanced Partner'}
                      {strategy === 'Hyper-Velocity Scale' && '⚡ Hyper-Velocity'}
                      {strategy === 'Compliance Fortress' && '🛡️ Risk Governor'}
                      {strategy === 'API Decimator' && '🔧 API Decimator'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Log / Command Chair Feed */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    Command Chair Background Feed
                  </h4>
                  <button
                    onClick={handleExportLogs}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.1)]"
                    title="Export logs to text file"
                  >
                    <Download className="w-2.5 h-2.5" />
                    Export Log
                  </button>
                </div>
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 h-28 overflow-y-auto font-mono text-[9px] space-y-2 scrollbar-thin">
                  {mlaiEnabled ? (
                    mlaiActionLog.map((log) => (
                      <div key={log.id} className="border-b border-white/5 pb-1 last:border-0">
                        <div className="flex justify-between text-slate-500 mb-0.5">
                          <span>[{log.timestamp}]</span>
                          <span className="text-emerald-500 font-bold">SUCCESS</span>
                        </div>
                        <p className="text-slate-300 font-medium">{log.action}</p>
                        <p className="text-[8px] text-indigo-400 italic">Impact: {log.impact}</p>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-1">
                      <Lock className="w-5 h-5 text-rose-500/50" />
                      <p className="font-black uppercase tracking-wider text-[8px]">Partner Offline</p>
                      <p className="text-[8px]">Activate toggle to start background wealth sweeping.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Dialogue box */}
              <div className="flex-1 flex flex-col mb-6 min-h-[180px]">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-400" />
                  Dialogue & Directives
                </h4>
                <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-y-auto max-h-[220px] space-y-3 scrollbar-thin mb-3">
                  {mlaiChatHistory.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs ${m.role === 'user' ? 'bg-indigo-600/10 border border-indigo-500/20 text-slate-200 ml-auto' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className="text-[8px] font-black uppercase text-indigo-400 tracking-wider">
                          {m.role === 'user' ? 'You' : 'MLAI Partner'}
                        </span>
                        <span className="text-[7px] text-slate-500">{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                    </div>
                  ))}
                  {mlaiSending && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium italic animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Partner is executing directive in the chair...
                    </div>
                  )}
                </div>

                {/* Prompt input box */}
                <form onSubmit={handleSendMlaiDirective} className="flex gap-2">
                  <input 
                    type="text"
                    value={mlaiDirective}
                    onChange={(e) => setMlaiDirective(e.target.value)}
                    disabled={!mlaiEnabled || mlaiSending}
                    placeholder={mlaiEnabled ? "Issue direct wealth directive..." : "Companion offline - toggle ON"}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!mlaiEnabled || mlaiSending || !mlaiDirective.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Obstacle Decimator Sandbox */}
              <div className="mb-6 border border-indigo-500/10 rounded-2xl bg-slate-950/40 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Code className="w-3 h-3 text-indigo-400" />
                    API Obstacle Decimator Sandbox
                  </h4>
                  <span className="text-[7px] text-indigo-400 font-bold uppercase">LVL {mlaiSkills.find(s => s.name === "API Obstacle Decimator")?.level || 1} Compilers</span>
                </div>
                
                <form onSubmit={handleDecimateObstacle} className="space-y-2">
                  <input 
                    type="text"
                    value={decimatorObstacle}
                    onChange={(e) => setDecimatorObstacle(e.target.value)}
                    disabled={!mlaiEnabled || decimating}
                    placeholder="Describe API error or blockage..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                  />
                  <textarea 
                    value={decimatorCode}
                    onChange={(e) => setDecimatorCode(e.target.value)}
                    disabled={!mlaiEnabled || decimating}
                    placeholder="Paste problematic code snippet or raw error log..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[9px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!mlaiEnabled || decimating || !decimatorObstacle.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    {decimating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Decimating Blockers...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                        Decimate Obstacle
                      </>
                    )}
                  </button>
                </form>

                {decimatorResult && (
                  <div className="mt-3 bg-slate-950 border border-indigo-500/20 p-3 rounded-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase">
                      <span className="text-emerald-400">Resolution Output</span>
                      <button 
                        onClick={() => {
                          setDecimatorResult(null);
                          setDecimatorObstacle('');
                          setDecimatorCode('');
                        }}
                        className="text-slate-500 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="text-[9px] font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded border border-white/5 font-mono">
                      {decimatorResult.actionTaken}
                    </div>
                    <div className="text-[8px] text-indigo-400 italic">
                      Impact: {decimatorResult.impact}
                    </div>
                    <div className="text-[10px] text-slate-300 whitespace-pre-wrap font-sans border-t border-white/5 pt-2 prose prose-invert leading-normal">
                      {decimatorResult.solution}
                    </div>
                  </div>
                )}
              </div>

              {/* Skill Matrix */}
              <div className="mb-6">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  Growing Technical Skill Matrix
                </h4>
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {mlaiSkills.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-emerald-400">LVL {skill.level}</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1 border border-white/5">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, skill.level * 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ride-along Memory */}
              <div>
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  Studied & learned Projects
                </h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto scrollbar-thin space-y-2">
                  {mlaiLearnedProjects.length === 0 ? (
                    <p className="text-[9px] text-slate-600 italic">No projects scanned in current path.</p>
                  ) : (
                    mlaiLearnedProjects.map((proj) => (
                      <div key={proj.id} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1 last:border-0 last:pb-0">
                        <span className="text-slate-300 font-bold truncate max-w-[200px]">{proj.name}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${proj.status === 'Fully Autonomous' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                          {proj.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </aside>
        )}
      </div>

      <footer className="border-t border-slate-900 py-20 mt-32 text-center">
        <div className="max-w-7xl mx-auto px-4 opacity-30 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4">
             <Hammer className="w-6 h-6" />
             <p className="font-black text-xl uppercase tracking-tighter italic">67Snipper Art AI</p>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Commercial Grade Wealth Synthesis Protocol</p>
        </div>
      </footer>

      <BackupModal isOpen={backupModalOpen} onClose={() => setBackupModalOpen(false)} />
    </div>
  );
}
