
import { CodeFile, FileAnalysisResult, FunctionAnalysis } from '../types';

const LANGUAGE_MAP: Record<string, string> = {
  'js': 'JavaScript',
  'jsx': 'JavaScript React',
  'ts': 'TypeScript',
  'tsx': 'TypeScript React',
  'py': 'Python',
  'java': 'Java',
  'kt': 'Kotlin',
  'cpp': 'C++',
  'c': 'C',
  'swift': 'Swift',
  'go': 'Go',
  'dart': 'Dart'
};

const FUNCTION_REGEXES = {
  JavaScript: /(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/g,
  TypeScript: /(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|public\s+([a-zA-Z0-9_$]+)\s*\(|private\s+([a-zA-Z0-9_$]+)\s*\(|protected\s+([a-zA-Z0-9_$]+)\s*\()/g,
  Python: /def\s+([a-zA-Z0-9_$]+)\s*\(/g,
  Java: /(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+([a-zA-Z0-9_$]+)\s*\([^\)]*\)\s*\{/g,
  Kotlin: /fun\s+([a-zA-Z0-9_$]+)\s*\(/g,
};

export function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return LANGUAGE_MAP[ext] || 'Unknown';
}

export function analyzeFile(file: CodeFile): FileAnalysisResult {
  const language = detectLanguage(file.name);
  const lines = file.content.split('\n');
  const functions: FunctionAnalysis[] = [];
  
  const regex = (FUNCTION_REGEXES as any)[language];
  if (regex) {
    let match;
    while ((match = regex.exec(file.content)) !== null) {
      const name = match[1] || match[2] || match[3] || match[4] || match[5] || 'anonymous';
      
      // Heuristic for type categorization
      let type: FunctionAnalysis['type'] = 'Utility';
      const lowercaseContent = file.content.toLowerCase();
      const lowercaseName = name.toLowerCase();

      if (lowercaseName.includes('render') || lowercaseName.includes('view') || lowercaseContent.includes('ui') || lowercaseContent.includes('style')) {
        type = 'UI';
      } else if (lowercaseName.includes('get') || lowercaseName.includes('fetch') || lowercaseName.includes('api') || lowercaseContent.includes('http')) {
        type = 'API';
      } else if (lowercaseName.includes('save') || lowercaseName.includes('db') || lowercaseName.includes('query') || lowercaseContent.includes('sql')) {
        type = 'Database';
      } else if (lowercaseName.includes('calculate') || lowercaseName.includes('process') || lowercaseName.includes('handle')) {
        type = 'Logic';
      }

      functions.push({
        name,
        type,
        snippet: file.content.substring(match.index, match.index + 200) + '...'
      });
    }
  }

  return {
    fileName: file.name,
    language,
    functionCount: functions.length,
    functions,
    linesOfCode: lines.length
  };
}
