export interface RecognitionResult {
  transcribedText: string;
  detectedLanguage: string;
  confidenceScore: number;
}

export interface HistoryItem extends RecognitionResult {
  id: string;
  timestamp: number;
  imageUrl: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum AppMode {
  SCAN = 'SCAN',
  WRITE = 'WRITE'
}