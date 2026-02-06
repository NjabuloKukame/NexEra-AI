"use client"

import { useState, useRef } from 'react';
import { RotateCw, ZoomIn, RefreshCw, ZoomOut, Sparkles, Send, Loader2 } from 'lucide-react';
import AvatarViewer from '../components/AvatarViewer/AvatarViewer';

export default function Prototype2() {
  const [command, setCommand] = useState('');
  const [executedCommand, setExecutedCommand] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const viewerRef = useRef(null);

  const handleExecute = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/interpret-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const data = await res.json();

      setExecutedCommand(command);
      setAiExplanation(data.summary);


      viewerRef.current?.playAnimation(data.action);

    } catch (err) {
      console.error(err);
      setAiExplanation(
        'The avatar remains idle as the command could not be interpreted.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-sm text-black/80 font-medium">AI-Powered Avatar Control</span>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Command the Training Avatar
          </h1>
          <p className="text-black/60 text-lg max-w-2xl mx-auto">
            Use natural language to control avatar actions in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8 space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                  placeholder="Describe what the avatar should do..."
                  className="w-full px-6 py-4 bg-white/40 border border-black/20 rounded-xl text-black placeholder:text-black/40 focus:outline-none focus:border-black/40 transition-all"
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Command</span>
                  </>
                ) : (
                  <>
                    <span>Execute Command</span>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {executedCommand && (
              <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-black/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                      AI Response
                    </h3>
                    <p className="text-sm text-black/50">Interpreted: "{executedCommand}"</p>
                  </div>
                </div>
                <p className="text-black/80 leading-relaxed">{aiExplanation}</p>
              </div>
            )}

            <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8">
              <h3 className="text-lg font-semibold text-black mb-6">
                Quick Commands
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Wave',
                  'Jump',
                  'Dance',
                  'Walk',
                  'Walk Backwards',
                  'Point',
                  'Salute',
                  'Drop Kick',
                  'Climb',
                  'Jog',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setCommand(example)}
                    className="px-4 py-2.5 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 rounded-lg text-sm text-black/80 hover:text-black transition-all text-left"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/5 backdrop-blur-xl rounded-2xl border border-black/10 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">
                Live Preview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => viewerRef.current?.toggleRotate()}
                  className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5 text-black/80" />
                </button>

                <button
                  onClick={() => viewerRef.current?.zoomOut()}
                  className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-black/80" />
                </button>

                <button
                  onClick={() => viewerRef.current?.zoomIn()}
                  className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-black/80" />
                </button>

                <button
                  onClick={() => viewerRef.current?.reset()}
                  className="p-2.5 hover:bg-black/10 bg-black/5 border border-black/10 rounded-lg transition-all"
                  title="Reset"
                >
                  <RefreshCw className="w-5 h-5 text-black/80" />
                </button>
              </div>
            </div>

            <div className="aspect-square rounded-xl overflow-hidden bg-white/40 border border-black/10">
              <AvatarViewer ref={viewerRef} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-black/60">
                Real-time AI interpretation active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

