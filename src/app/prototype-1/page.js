"use client"

import { useState } from 'react';
import { Upload, RotateCw, ZoomIn, RefreshCw } from 'lucide-react';

export default function Prototype1() {
  const [textInput, setTextInput] = useState('');
  const [generatedAsset, setGeneratedAsset] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  const handleGenerate = () => {
    setGeneratedAsset(true);
    setAiSummary(
      `The ${textInput || 'specified object'} is a critical safety equipment item used in training scenarios. Understanding its proper usage, placement, and maintenance is essential for workplace safety compliance. This 3D model provides learners with an interactive way to examine the object from multiple angles, familiarize themselves with its components, and prepare for hands-on training exercises.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Generate 3D Training Asset
              </h1>
              <p className="text-gray-600">
                Create interactive 3D models for your training modules
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe an object
                </label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. yellow hard hat, fire extinguisher"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or upload an image (optional)
                </label>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
                  <Upload className="w-5 h-5" />
                  <span>Upload Image</span>
                </button>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Asset
              </button>
            </div>

            {generatedAsset && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  AI Educational Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                3D Viewer
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Rotate">
                  <RotateCw className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Zoom">
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Reset">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
              {generatedAsset ? (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mb-4 mx-auto animate-pulse"></div>
                  <p className="text-gray-600 font-medium">3D Model Preview</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {textInput || 'Generated object'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  Generate an asset to view it here
                </p>
              )}
            </div>

            <p className="text-sm text-gray-600 text-center">
              Interactive 3D model prepared for training modules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
