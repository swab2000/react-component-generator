import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

interface LivePreviewProps {
  code: string;
  isStreaming?: boolean;
}

export function LivePreview({ code, isStreaming = false }: LivePreviewProps) {
  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
      </div>
      <div className="preview-content">
        {isStreaming ? (
          <div className="preview-streaming-placeholder">
            <div className="streaming-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
            <p>코드 생성 중...</p>
          </div>
        ) : (
          <LiveProvider code={code} noInline>
            <div className="preview-render">
              <ReactLivePreview />
            </div>
            <LiveError className="preview-error" />
          </LiveProvider>
        )}
      </div>
    </div>
  );
}
