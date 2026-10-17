import React, { useState } from 'react';
import { 
  FolderDown, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  Cpu, 
  HardDrive, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Loader2, 
  FileCode, 
  ShieldCheck,
  Layers,
  Sparkles,
  Laptop
} from 'lucide-react';
import { generateProjectZipBackup, downloadBlob } from './services/backupExporter';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadBackup = async () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const blob = await generateProjectZipBackup();
      downloadBlob(blob, `67SNIPPER_Full_Project_Backup_${new Date().toISOString().slice(0, 10)}.zip`);
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Backup download error:", err);
      alert("Error building backup ZIP file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const winScriptCode = `@echo off
echo Building 67SNIPPER Standalone Executable...
npm install
npm run build
npx electron-builder --win nsis
pause`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(winScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative scrollbar-thin">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400 shrink-0">
            <FolderDown className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
              Export & Standalone Installer Hub
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mt-1">
              Project Backup & .EXE Package
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Download the complete, fully customizable, real source code backup folder of this entire project (including <code className="text-indigo-300 font-mono">App.tsx</code>, <code className="text-emerald-300 font-mono">EmployeePayroll.tsx</code>, services, and Vite config), or use our 1-click installer scripts to compile a standalone Windows <code className="text-amber-400 font-mono">.exe</code> executable desktop installer.
        </p>

        {/* Action 1: Download ZIP Backup */}
        <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <h4 className="font-black text-white text-sm uppercase italic">1-Click Full Project ZIP Backup</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Generates a clean <code className="text-slate-200 font-mono">.zip</code> archive containing all source files, Electron desktop wrappers, and setup scripts.
              </p>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Backup ZIP downloaded successfully to your computer!
            </div>
          )}

          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Archiving Source Files...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-indigo-200" />
                Download Complete Project Backup (.ZIP)
              </>
            )}
          </button>
        </div>

        {/* Action 2: Standard Platform Export Option */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-black text-white text-sm uppercase italic">Platform Direct Export Menu</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            You can also export this repository directly to GitHub or download as ZIP anytime using the AI Studio top bar menu: <br />
            <strong className="text-slate-200">AI Studio Top Bar &rarr; Settings Icon &rarr; "Export to GitHub" / "Download ZIP"</strong>.
          </p>
        </div>

        {/* Action 3: Windows .EXE Standalone Build Guide */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-400" />
              <h4 className="font-black text-white text-sm uppercase italic">Windows (.EXE) Desktop Installer Build Instructions</h4>
            </div>
            <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black px-2 py-0.5 rounded uppercase">
              Customizable EXE
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            To build a customizable, live desktop application installer for Windows:
          </p>

          <ol className="text-[11px] text-slate-300 space-y-2 list-decimal list-inside bg-slate-900 p-4 rounded-2xl border border-slate-800 font-medium">
            <li>Download and unzip the project ZIP file above on your Windows PC.</li>
            <li>Ensure Node.js (v18+) is installed on Windows from <span className="text-indigo-400 font-mono">nodejs.org</span>.</li>
            <li>Double-click the included <code className="text-amber-400 font-mono">build-exe.bat</code> file inside the extracted directory.</li>
            <li>Your compiled <code className="text-emerald-400 font-mono">.exe</code> setup installer will be saved in <code className="text-white font-mono">dist-electron/</code>!</li>
          </ol>

          {/* Code snippet display */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
              <span>Included 1-Click Windows Batch Script (build-exe.bat)</span>
              <button 
                onClick={handleCopyScript}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
            <pre className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto">
              {winScriptCode}
            </pre>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
