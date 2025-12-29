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
      description: 'Generate voice from text',
      body: `{
  "text": "Hello, world!",
  "voice_id": "ko_harry_ko",
  "language": "ko"
}`,
      example: `curl -X POST "${baseUrl}/generate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"text": "Hello", "voice_id": "ko_harry_ko", "language": "ko"}'`,
      response: `{
  "success": true,
  "job_id": "abc123",
  "status": "pending"
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
