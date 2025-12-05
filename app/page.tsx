'use client';

import { useState } from 'react';

interface VoiceInput {
  id: string;
  weight: number;
}

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [apiVersion, setApiVersion] = useState('2024-11-13');
  const [voices, setVoices] = useState<VoiceInput[]>([{ id: '', weight: 0.5 }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ voiceId?: string; error?: string } | null>(null);

  const addVoice = () => {
    setVoices([...voices, { id: '', weight: 0.5 }]);
  };

  const removeVoice = (index: number) => {
    setVoices(voices.filter((_, i) => i !== index));
  };

  const updateVoice = (index: number, field: 'id' | 'weight', value: string | number) => {
    const updated = [...voices];
    updated[index] = { ...updated[index], [field]: value };
    setVoices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Validate inputs
      if (!apiKey.trim()) {
        throw new Error('API key is required');
      }

      const validVoices = voices.filter(v => v.id.trim() !== '');
      if (validVoices.length === 0) {
        throw new Error('At least one voice ID is required');
      }

      // Call API route
      const response = await fetch('/api/create-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          apiVersion,
          voices: validVoices.map(v => ({
            id: v.id.trim(),
            weight: Number(v.weight),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create voice');
      }

      setResult({ voiceId: data.voiceId });
    } catch (error: any) {
      setResult({ error: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Cartesia Voice Mixer</h1>
        <p className="subtitle">Mix multiple voices and create a new voice</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey">API Key *</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Cartesia API key"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiVersion">API Version *</label>
            <select
              id="apiVersion"
              value={apiVersion}
              onChange={(e) => setApiVersion(e.target.value)}
              required
            >
              <option value="2024-06-10">2024-06-10</option>
              <option value="2024-11-13">2024-11-13</option>
              <option value="2025-04-16">2025-04-16</option>
            </select>
          </div>

          <div className="form-group">
            <div className="voices-header">
              <label>Voices *</label>
              <button type="button" onClick={addVoice} className="btn-add">
                + Add Voice
              </button>
            </div>

            {voices.map((voice, index) => (
              <div key={index} className="voice-row">
                <input
                  type="text"
                  placeholder="Voice ID"
                  value={voice.id}
                  onChange={(e) => updateVoice(index, 'id', e.target.value)}
                  required={index === 0}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="Weight"
                  value={voice.weight}
                  onChange={(e) => updateVoice(index, 'weight', parseFloat(e.target.value) || 0)}
                  required
                />
                {voices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVoice(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Creating Voice...' : 'Create Voice'}
          </button>
        </form>

        {result && (
          <div className={`result ${result.error ? 'error' : 'success'}`}>
            {result.error ? (
              <div>
                <strong>Error:</strong> {result.error}
              </div>
            ) : (
              <div>
                <strong>Success!</strong>
                <div className="voice-id">
                  Voice ID: <code>{result.voiceId}</code>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        h1 {
          margin: 0 0 8px 0;
          color: #1a202c;
          font-size: 28px;
          font-weight: 700;
        }

        .subtitle {
          color: #718096;
          margin: 0 0 24px 0;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #2d3748;
          font-weight: 600;
          font-size: 14px;
        }

        input[type='text'],
        input[type='password'],
        input[type='number'],
        select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #667eea;
        }

        .voices-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .voice-row {
          display: grid;
          grid-template-columns: 1fr 120px auto;
          gap: 8px;
          margin-bottom: 8px;
          align-items: center;
        }

        .btn-add,
        .btn-remove {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-add {
          background: #667eea;
          color: white;
        }

        .btn-add:hover {
          background: #5568d3;
        }

        .btn-remove {
          background: #fc8181;
          color: white;
        }

        .btn-remove:hover {
          background: #f56565;
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result {
          margin-top: 24px;
          padding: 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .result.success {
          background: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }

        .result.error {
          background: #fed7d7;
          color: #742a2a;
          border: 1px solid #fc8181;
        }

        .voice-id {
          margin-top: 12px;
          padding: 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #9ae6b4;
        }

        code {
          display: block;
          margin-top: 8px;
          padding: 8px;
          background: #f7fafc;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          word-break: break-all;
          color: #2d3748;
        }
      `}</style>
    </div>
  );
}

