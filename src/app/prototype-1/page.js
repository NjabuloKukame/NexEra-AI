"use client"

import { useState, useRef } from 'react';
import { Upload, RotateCw, ZoomIn, RefreshCw, ZoomOut } from 'lucide-react';
import ModelViewer from '../components/ModelViewer/ModelViewer';
import { ASSET_MAP } from '../lib/assets';

export default function Prototype1() {
    const [textInput, setTextInput] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [modelUrl, setModelUrl] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewerMessage, setViewerMessage] = useState(
        'Generate An Asset To View It Here'
    );
    const viewerRef = useRef(null);

    const generateFromObjectName = async (objectName) => {
        setIsLoading(true);
        setError('');
        setAiSummary('');
        setModelUrl(null);

        try {
            const response = await fetch('/api/ai-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objectName }),
            });

            const data = await response.json();

            setAiSummary(data.summary);

            if (data.assetKey !== 'unsupported' && ASSET_MAP[data.assetKey]) {
                setModelUrl(ASSET_MAP[data.assetKey].url);
                setViewerMessage('');
            } else {
                setViewerMessage(
                    'This object is not supported yet. Try a fire extinguisher or wet floor sign.'
                );
            }
        } catch {
            setError('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleGenerate = async () => {
        if (!textInput.trim()) {
            setError('Please describe an object or upload an image.');
            return;
        }

        generateFromObjectName(textInput);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError('');

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const response = await fetch('/api/image-classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: reader.result }),
                });

                const data = await response.json();

                if (!data.label) {
                    setViewerMessage('Could not identify the object in the image.');
                    setIsLoading(false);
                    return;
                }

                setTextInput(data.label);

                await generateFromObjectName(data.label);

            } catch {
                setError('Failed to analyze the image.');
                setIsLoading(false);
            }
        };

        reader.readAsDataURL(file);
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
                                Create Interactive 3D Models For Your Training Modules
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Describe An Object
                                </label>
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="e.g. Drill, Fire Extinguisher, Wet Floor Sign, Measuring Tape"
                                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or Upload An Image (Optional)
                                </label>
                                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
                                    {/* <Upload className="w-5 h-5" /> */}
                                    {/* <span>Upload Image</span> */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isLoading}
                                    />

                                </button>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className={`w-full font-medium py-3 px-6 rounded-lg transition-colors
                                    ${isLoading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {isLoading ? 'Generating…' : 'Generate Asset'}
                            </button>
                        </div>

                        {(isLoading || aiSummary || error) && (
                            <div className="rounded-lg border p-6 bg-blue-50 border-blue-200">

                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    AI Educational Summary
                                </h3>

                                {isLoading && (
                                    <p className="text-gray-600 animate-pulse">
                                        Generating Educational Summary…
                                    </p>
                                )}

                                {error && (
                                    <p className="text-red-600">{error}</p>
                                )}

                                {aiSummary && !isLoading && (
                                    <p className="text-gray-700 leading-relaxed">
                                        {aiSummary}
                                    </p>
                                )}
                            </div>
                        )}

                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                3D Viewer
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
                            {modelUrl ? (
                                <ModelViewer ref={viewerRef} modelUrl={modelUrl} />
                            ) : (
                                <p className="text-gray-500 flex items-center justify-center h-full">
                                    {viewerMessage}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 text-center">
                            Interactive 3D Model Prepared for Training Modules
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
