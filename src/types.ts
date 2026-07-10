export type ToolCategory =
  | 'text'
  | 'calculator'
  | 'developer'
  | 'generator'
  | 'converter';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string; // References lucide-react icon names
  globalKeywords: string[];
  howToUse: string[];
  formulaTitle?: string;
  formulaDescription?: string;
  faqs: FAQItem[];
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  estimatedTime: string;
  version: string;
  changelog: string[];
  averageLatency: string;
  popularScore: number;
  offlineReady: boolean;
  apiRequired: boolean;
  aiPowered: boolean;
  supportsDragDrop: boolean;
  supportsBatch: boolean;
  fileSizeLimit?: string;
  browserCompatibility: string;
  mobileReady: boolean;
  hasKeyboardShortcuts: boolean;
  isPlanned?: boolean;
  plannedSprint?: string;
}

export interface UserHistoryItem {
  toolId: string;
  timestamp: number;
}
