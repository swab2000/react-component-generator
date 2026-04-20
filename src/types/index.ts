export type Provider = 'anthropic' | 'google';

export interface GeneratedComponent {
  id: string;
  prompt: string;
  code: string;
  streamingCode?: string;
  isStreaming?: boolean;
  createdAt: Date;
}
