import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ApiDocs() {
  const [copied, setCopied] = useState(null);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const baseUrl = 'https://0gqxz2ps31.execute-api.ap-northeast-2.amazonaws.com/prod/v1/gendao/tts';

  const endpoints = [
    {
      method: 'GET',
      path: '/voices',
      description: 'Get list of available voices',
      params: 'language (optional): ko, en, ja, es, pt',
      example: `curl "${baseUrl}/voices?language=ko"`,
      response: `{
  "success": true,
  "total": 14,
  "voices": [
    {
      "voice_id": "ko_harry_ko",
      "name": "Harry KO",
      "language": "ko",
      "gender": "male"
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/voices/{voice_id}/audio',
      description: 'Get presigned URL for voice sample',
      example: `curl "${baseUrl}/voices/ko_harry_ko/audio"`,
      response: `{
  "success": true,
  "voice_id": "ko_harry_ko",
  "audio_url": "https://s3.amazonaws.com/...",
  "expires_in": 3600
}`
    },
    {
      method: 'POST',
      path: '/generate',
      description: 'Generate voice from text with emotion control',
      body: `{
  "text": "Hello, world!",
  "voice_id": "ko_harry_ko",
  "language": "ko",
  "exaggeration": 0.5,
  "cfg_weight": 0.5
}`,
      example: `curl -X POST "${baseUrl}/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello", "voice_id": "ko_harry_ko", "language": "ko", "exaggeration": 0.7, "cfg_weight": 0.3}'`,
      response: `{
  "success": true,
  "job_id": "abc123",
  "status": "completed",
  "audio_url": "https://...",
  "expires_in": 3600
}`
    },
    {
      method: 'GET',
      path: '/jobs/{job_id}',
      description: 'Get job status and result',
      example: `curl "${baseUrl}/jobs/abc123"`,
      response: `{
  "success": true,
  "job": {
    "job_id": "abc123",
    "status": "completed",
    "result_url": "https://..."
  }
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
          <p className="text-gray-600">Integrate Genesis Voice into your applications</p>
        </div>

        {/* Base URL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h2>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <code className="flex-1 text-sm text-gray-700 font-mono">{baseUrl}</code>
            <button
              onClick={() => copyCode(baseUrl, 'baseUrl')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied === 'baseUrl' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h2>
          <p className="text-gray-600 mb-4">
            Protected endpoints require a Bearer token in the Authorization header.
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <code className="text-sm text-green-400 font-mono">
              Authorization: Bearer YOUR_API_TOKEN
            </code>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Endpoints</h2>

          {endpoints.map((endpoint, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    endpoint.method === 'GET'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-gray-900 font-mono">{endpoint.path}</code>
                </div>
                <p className="text-gray-600">{endpoint.description}</p>
                {endpoint.params && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Parameters:</strong> {endpoint.params}
                  </p>
                )}
              </div>

              {endpoint.body && (
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Request Body:</p>
                  <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{endpoint.body}</pre>
                </div>
              )}

              <div className="p-4 bg-gray-900">
                <div className="flex items-start justify-between gap-4">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto flex-1">
                    {endpoint.example}
                  </pre>
                  <button
                    onClick={() => copyCode(endpoint.example, `example-${i}`)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied === `example-${i}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{endpoint.response}</pre>
              </div>
            </div>
          ))}
        </div>

        {/* Emotion Control */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotion & Style Control</h2>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Range</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Default</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-mono text-blue-600">exaggeration</td>
                    <td className="px-4 py-3">0.0 ~ 1.0+</td>
                    <td className="px-4 py-3">0.5</td>
                    <td className="px-4 py-3 text-gray-600">Emotion intensity. Higher = more emotional, faster speech</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-blue-600">cfg_weight</td>
                    <td className="px-4 py-3">0.0 ~ 1.0</td>
                    <td className="px-4 py-3">0.5</td>
                    <td className="px-4 py-3 text-gray-600">Speed/rhythm control. Lower = slower, more deliberate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Recommended Presets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Style</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">exaggeration</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">cfg_weight</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">Calm / News</td>
                    <td className="px-4 py-3 font-mono">0.3</td>
                    <td className="px-4 py-3 font-mono">0.5</td>
                    <td className="px-4 py-3 text-gray-600">Neutral, professional tone</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Normal</td>
                    <td className="px-4 py-3 font-mono">0.5</td>
                    <td className="px-4 py-3 font-mono">0.5</td>
                    <td className="px-4 py-3 text-gray-600">Natural conversation</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Friendly / Lively</td>
                    <td className="px-4 py-3 font-mono">0.7</td>
                    <td className="px-4 py-3 font-mono">0.3</td>
                    <td className="px-4 py-3 text-gray-600">Expressive, engaging</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Dramatic</td>
                    <td className="px-4 py-3 font-mono">0.8+</td>
                    <td className="px-4 py-3 font-mono">0.3</td>
                    <td className="px-4 py-3 text-gray-600">Strong emotion, storytelling</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Slow Narration</td>
                    <td className="px-4 py-3 font-mono">0.4</td>
                    <td className="px-4 py-3 font-mono">0.2</td>
                    <td className="px-4 py-3 text-gray-600">Audiobook, meditation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Higher exaggeration speeds up speech - lower cfg_weight to compensate</li>
              <li>• For fast-speaking reference audio, use cfg_weight around 0.3</li>
              <li>• Extreme values may cause instability - stay within 0.2 ~ 0.9</li>
            </ul>
          </div>

          {/* Emotion Tags */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Emotion Tags (Auto-parsing)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add emotion tags in brackets to automatically set parameters. Example: <code className="bg-gray-100 px-1 rounded">[excited] Hello!</code>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Actor Standard Tags */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Voice Actor Tags</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Tag</th>
                        <th className="px-2 py-1 text-left">Korean</th>
                        <th className="px-2 py-1 text-left">exag</th>
                        <th className="px-2 py-1 text-left">cfg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr><td className="px-2 py-1 font-mono">[deadpan]</td><td className="px-2 py-1">[무표정]</td><td className="px-2 py-1">0.2</td><td className="px-2 py-1">0.6</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[flatly]</td><td className="px-2 py-1">[단조롭게]</td><td className="px-2 py-1">0.25</td><td className="px-2 py-1">0.6</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[seriously]</td><td className="px-2 py-1">[진지하게]</td><td className="px-2 py-1">0.35</td><td className="px-2 py-1">0.55</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[confused]</td><td className="px-2 py-1">[혼란]</td><td className="px-2 py-1">0.55</td><td className="px-2 py-1">0.45</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[surprised]</td><td className="px-2 py-1">[놀람]</td><td className="px-2 py-1">0.85</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[whining]</td><td className="px-2 py-1">[칭얼]</td><td className="px-2 py-1">0.7</td><td className="px-2 py-1">0.35</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[thoughtfully]</td><td className="px-2 py-1">[생각하며]</td><td className="px-2 py-1">0.4</td><td className="px-2 py-1">0.35</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[hesitantly]</td><td className="px-2 py-1">[망설이며]</td><td className="px-2 py-1">0.45</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[whispers]</td><td className="px-2 py-1">[속삭임]</td><td className="px-2 py-1">0.3</td><td className="px-2 py-1">0.2</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[gasps]</td><td className="px-2 py-1">[헐떡]</td><td className="px-2 py-1">0.9</td><td className="px-2 py-1">0.25</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[excited]</td><td className="px-2 py-1">[신남]</td><td className="px-2 py-1">0.85</td><td className="px-2 py-1">0.25</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[worried]</td><td className="px-2 py-1">[걱정]</td><td className="px-2 py-1">0.6</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[nervous]</td><td className="px-2 py-1">[긴장]</td><td className="px-2 py-1">0.65</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[sadly]</td><td className="px-2 py-1">[슬픔]</td><td className="px-2 py-1">0.55</td><td className="px-2 py-1">0.35</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[sorrowful]</td><td className="px-2 py-1">[비통]</td><td className="px-2 py-1">0.5</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[calm]</td><td className="px-2 py-1">[차분]</td><td className="px-2 py-1">0.3</td><td className="px-2 py-1">0.5</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[hopefully]</td><td className="px-2 py-1">[희망]</td><td className="px-2 py-1">0.6</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[mysteriously]</td><td className="px-2 py-1">[신비]</td><td className="px-2 py-1">0.5</td><td className="px-2 py-1">0.35</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[pause]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.4</td><td className="px-2 py-1">0.3</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Basic Emotions & Style Tags */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Basic Emotions & Style</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Tag</th>
                        <th className="px-2 py-1 text-left">Korean</th>
                        <th className="px-2 py-1 text-left">exag</th>
                        <th className="px-2 py-1 text-left">cfg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr><td className="px-2 py-1 font-mono">[happy]</td><td className="px-2 py-1">[기쁨]</td><td className="px-2 py-1">0.8</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[sad]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.6</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[angry]</td><td className="px-2 py-1">[화남]</td><td className="px-2 py-1">0.9</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[fear]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.7</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[surprise]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.85</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[disgust]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.7</td><td className="px-2 py-1">0.5</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[neutral]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.5</td><td className="px-2 py-1">0.5</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[serious]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.4</td><td className="px-2 py-1">0.6</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[cheerful]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.75</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[gentle]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.4</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[warm]</td><td className="px-2 py-1">[따뜻]</td><td className="px-2 py-1">0.55</td><td className="px-2 py-1">0.4</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[whisper]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.3</td><td className="px-2 py-1">0.2</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[shout]</td><td className="px-2 py-1">[외침]</td><td className="px-2 py-1">0.95</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[slow]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.4</td><td className="px-2 py-1">0.2</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[fast]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.6</td><td className="px-2 py-1">0.7</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[news]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.35</td><td className="px-2 py-1">0.5</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[narration]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.45</td><td className="px-2 py-1">0.3</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[storytelling]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.7</td><td className="px-2 py-1">0.35</td></tr>
                      <tr><td className="px-2 py-1 font-mono">[conversation]</td><td className="px-2 py-1">-</td><td className="px-2 py-1">0.55</td><td className="px-2 py-1">0.45</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Example with emotion tag:</p>
            <code className="text-sm text-green-400 font-mono">
              {`curl -X POST "${baseUrl}/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "[excited] 정말 기뻐요!", "voice_id": "ko_harry_ko"}'`}
            </code>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rate Limits</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Free:</strong> 10 requests/minute</p>
            <p><strong>Starter:</strong> 60 requests/minute</p>
            <p><strong>Pro:</strong> 300 requests/minute</p>
            <p><strong>Enterprise:</strong> Custom limits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
