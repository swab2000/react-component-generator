import { useState } from 'react';
import type { GeneratedComponent } from '../types';
import { LivePreview } from './LivePreview';
import { CodeView } from './CodeView';
import { useViewportSize } from '../hooks/useViewportSize';

interface ComponentCardProps {
  component: GeneratedComponent;
  onRemove: (id: string) => void;
  onRegenerate: (prompt: string) => void;
  isLoading: boolean;
}

type Tab = 'preview' | 'code';

export function ComponentCard({ component, onRemove, onRegenerate, isLoading }: ComponentCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [previewKey, setPreviewKey] = useState(0);
  const { viewportSize, setViewportSize, width } = useViewportSize();

  return (
    <div className="component-card">
      <div className="card-header">
        <p className="card-prompt">{component.prompt}</p>
        <div className="card-actions">
          <button
            className="btn-refresh"
            onClick={() => setPreviewKey((k) => k + 1)}
            title="미리보기 새로고침"
          >
            ↻
          </button>
          <button
            className="btn-regenerate"
            onClick={() => onRegenerate(component.prompt)}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '재생성'}
          </button>
          <button
            className="btn-remove"
            onClick={() => onRemove(component.id)}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="card-tabs-row">
        <div className="card-tabs">
          <button
            className={`tab ${activeTab === 'preview' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            미리보기
          </button>
          <button
            className={`tab ${activeTab === 'code' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            코드
          </button>
        </div>
        {activeTab === 'preview' && (
          <div className="viewport-controls">
            {(['mobile', 'tablet', 'desktop'] as const).map((size) => (
              <button
                key={size}
                className={`viewport-btn ${viewportSize === size ? 'viewport-btn--active' : ''}`}
                onClick={() => setViewportSize(size)}
              >
                {size === 'mobile' && '📱 모바일'}
                {size === 'tablet' && '▣ 태블릿'}
                {size === 'desktop' && '🖥 데스크탑'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="card-content">
        {activeTab === 'preview' ? (
          <div className="preview-viewport-wrapper" style={{ maxWidth: width }}>
            <LivePreview key={previewKey} code={component.code} />
          </div>
        ) : (
          <CodeView code={component.code} />
        )}
      </div>
    </div>
  );
}
