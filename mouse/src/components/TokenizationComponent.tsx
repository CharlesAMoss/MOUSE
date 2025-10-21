import React, { useState, useMemo } from 'react';
import { tokenize } from '../utils/tokenize';
import Vocab from '../utils/vocab';
import type { Token, TokenType } from '../utils/tokenTypes';

type TokenizationMode = 'basic' | 'advanced';
const TokenizationComponent: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<TokenizationMode>('advanced');
  const [includeIds, setIncludeIds] = useState(false);
  // simple in-memory vocab instance for input_ids
  const [vocab] = useState(() => new Vocab());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // Memoize tokens for performance
  const tokens = useMemo<Token[]>(() => {
    if (mode === 'basic') {
      // Basic: split by whitespace only
      return inputText
        .split(/\s+/)
        .filter(Boolean)
        .map((value: string) => ({ value, type: 'word' as TokenType }));
    }
    // Advanced: use regex and types
    return tokenize(inputText);
  }, [inputText, mode]);

  // Helper to format sample tokens for display
  function formatSampleTokens(tokens: Token[]) {
    return tokens.slice(0, 10).map(t => `${t.value} [${t.type}]`).join(', ');
  }

  // Output summary details
  const showWarning = inputText.length > 50000;
  const isEmpty = !inputText.trim();

  const input_ids = includeIds ? vocab.encodeTokens(tokens) : undefined;
  // build a token_map when ids are included for traceability
  const token_map = includeIds && input_ids ? tokens.map((t, i) => ({ value: t.value, type: t.type, id: input_ids[i] })) : undefined;
  const outputObj: any = { tokens, count: tokens.length };
  if (includeIds) {
    outputObj.input_ids = input_ids;
    outputObj.token_map = token_map;
  }
  const outputJSON = JSON.stringify(outputObj, null, 2);

  // Debug: log output when ids are included to help diagnose missing ids
  React.useEffect(() => {
    if (includeIds) {
      // eslint-disable-next-line no-console
      console.log('Tokenization output:', outputObj);
    }
  }, [includeIds, outputObj]);

  // Download output as JSON file
  const handleDownload = () => {
    const blob = new Blob([outputJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenization_output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, marginTop: 24 }}>
      <h2>Tokenization Input</h2>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="mode-select">Tokenization mode: </label>
        <select
          id="mode-select"
          value={mode}
          onChange={e => setMode(e.target.value as TokenizationMode)}
          style={{ marginLeft: 8 }}
        >
          <option value="basic">Basic (whitespace only)</option>
          <option value="advanced">Advanced (regex/types)</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="file-upload">Upload .txt file: </label>
        <input id="file-upload" type="file" accept=".txt" onChange={handleFileChange} />
        {fileName && <span style={{ marginLeft: 8 }}>Loaded: {fileName}</span>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" checked={includeIds} onChange={e => setIncludeIds(e.target.checked)} />
          <span style={{ marginLeft: 8 }}>Include input_ids (token ids)</span>
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="text-input">Or enter text:</label>
        <textarea
          id="text-input"
          rows={6}
          style={{ width: '100%', marginTop: 4 }}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type or paste your text here..."
        />
      </div>
      <div style={{ marginTop: 16, fontSize: 13, color: '#555' }}>
        {isEmpty ? (
          <span style={{ color: '#b00' }}>No input provided.</span>
        ) : (
          <>
            <strong>Token count:</strong> {tokens.length}
            <br />
            <strong>Sample tokens:</strong> {formatSampleTokens(tokens)}
            <br />
            {includeIds && input_ids && (
              <>
                <strong>Sample input_ids:</strong> {input_ids.slice(0, 10).join(', ')}
                <br />
              </>
            )}
            <br />
            <details style={{ marginTop: 8 }}>
              <summary>Show output JSON</summary>
              <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{outputJSON}</pre>
            </details>
            {includeIds && token_map && (
              <details style={{ marginTop: 8 }}>
                <summary>Show token_map (value,type,id)</summary>
                <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{JSON.stringify(token_map, null, 2)}</pre>
              </details>
            )}
            <button
              onClick={handleDownload}
              style={{
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 4,
                border: '1px solid #222',
                background: '#222',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: 0.5,
              }}
            >
              Download JSON
            </button>
            {showWarning && (
              <div style={{ color: '#b00', marginTop: 8 }}>
                Warning: Large input may affect performance.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TokenizationComponent;
