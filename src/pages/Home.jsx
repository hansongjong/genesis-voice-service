import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, auth } from '../lib/api';
import { Mic, Play, Pause, Loader2, Download, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

export default function Home() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [language, setLanguage] = useState('ko');
  const [text, setText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    loadVoices();
  }, [language]);

  const loadVoices = async () => {
    try {
      const res = await api.getVoices(language);
      setVoices(res.voices || []);
      if (res.voices?.length > 0) {
        setSelectedVoice(res.voices[0].voice_id);
      }
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  };

  const playVoiceSample = async (voiceId) => {
    if (playingVoiceId === voiceId) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
      return;
    }

    try {
      const res = await api.getVoiceAudioUrl(voiceId);
      if (res.success && res.audio_url) {
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = new Audio(res.audio_url);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingVoiceId(null);
        setPlayingVoiceId(voiceId);
      }
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim() || !selectedVoice) return;

    if (!auth.isLoggedIn()) {
      alert('Please login to generate voice');
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const token = auth.getToken();
      const res = await api.generateVoice(text, selectedVoice, language, token);

      if (res.success) {
        // Poll for completion
        const jobId = res.job_id;
        let attempts = 0;

        while (attempts < 30) {
          const jobRes = await api.getJob(jobId);

          if (jobRes.job?.status === 'completed') {
            setResult({
              jobId,
              audioUrl: jobRes.job.result_url
            });
            break;
          } else if (jobRes.job?.status === 'failed') {
            alert('Generation failed: ' + (jobRes.job.error || 'Unknown error'));
            break;
          }

          await new Promise(r => setTimeout(r, 2000));
          attempts++;
        }
      } else {
        alert(res.error || 'Failed to start generation');
      }
    } catch (err) {
      alert('Request failed');
    } finally {
      setGenerating(false);
    }
  };

  const playResult = () => {
    if (!result?.audioUrl) return;

    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    audioRef.current = new Audio(result.audioUrl);
    audioRef.current.play();
    audioRef.current.onended = () => setPlaying(false);
    setPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          AI Voice Cloning Technology
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Create Natural Voice<br />from Text
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          115+ premium voices in 5 languages. Perfect for content creators, developers, and businesses.
        </p>
      </div>

      {/* Demo Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Try It Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Voice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
              <div className="flex gap-2">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voices.map(v => (
                    <option key={v.voice_id} value={v.voice_id}>
                      {v.name} ({v.gender})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => playVoiceSample(selectedVoice)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Preview voice"
                >
                  {playingVoiceId === selectedVoice ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Text to Speak</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Enter the text you want to convert to speech..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-400 mt-1">{text.length} characters</p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !text.trim()}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                Generate Voice
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-100">
              <p className="font-medium text-green-700 mb-4">Voice generated successfully!</p>
              <div className="flex gap-3">
                <button
                  onClick={playResult}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {playing ? 'Stop' : 'Play'}
                </button>
                {result.audioUrl && (
                  <a
                    href={result.audioUrl}
                    download
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Login prompt */}
          {!auth.isLoggedIn() && (
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                <Link to="/login" className="text-blue-600 hover:underline">Login</Link> or{' '}
                <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link> to generate voice
              </p>
            </div>
          )}
        </div>

        {/* Voice Preview Grid */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Featured Voices</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {voices.slice(0, 8).map(v => (
              <button
                key={v.voice_id}
                onClick={() => playVoiceSample(v.voice_id)}
                className={`p-4 bg-white rounded-xl border transition-all ${
                  playingVoiceId === v.voice_id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{v.name}</span>
                  {playingVoiceId === v.voice_id ? (
                    <Pause className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {v.gender}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
