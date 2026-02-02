"use client"

import { useState, useRef } from 'react';
import { RotateCw, ZoomIn, RefreshCw, ZoomOut } from 'lucide-react';
import AvatarViewer from '../components/AvatarViewer/AvatarViewer';

export default function Prototype2() {
  const [command, setCommand] = useState('');
  const [executedCommand, setExecutedCommand] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');

  const viewerRef = useRef(null);

  const handleExecute = () => {
    setExecutedCommand(command);
    setAiExplanation(
      `The "${command}" action is valuable in training contexts for demonstrating clear communication and engagement with learners. Such gestures help establish rapport, direct attention to important safety equipment or hazards, and reinforce key learning objectives through physical demonstration. This type of interactive avatar behavior enhances learner engagement and retention in virtual training environments.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Command the Training Avatar
              </h1>
              <p className="text-gray-600">
                Use natural language to control avatar actions
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a command
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g. Wave hello, Point at the extinguisher"
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                onClick={handleExecute}
                className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Execute Command
              </button>
            </div>

            {executedCommand && (
              <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  AI Explanation
                </h3>
                <p className="text-gray-700 leading-relaxed">{aiExplanation}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Example Commands
              </h3>
              <ul className="space-y-2">
                {[
                  'Wave Hello',
                  'Jump Up And Down',
                  'Dance',
                  'Walk Forward',
                  'Walk Backwards',
                  'Gesture to the exit',
                ].map((example) => (
                  <li key={example}>
                    <button
                      onClick={() => setCommand(example)}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Avatar Scene
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => viewerRef.current?.rotate()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => viewerRef.current?.zoomOut()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => viewerRef.current?.zoomIn()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => viewerRef.current?.reset()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <AvatarViewer ref={viewerRef} />
            </div>

            <p className="text-sm text-gray-600 text-center">
              AI-driven avatar responding to natural language commands
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
