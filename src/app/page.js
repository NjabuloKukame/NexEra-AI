import Link from 'next/link';
import { Box, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NexEra AI Training Prototypes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experimental AI-driven tools for human learning and training.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                AI-Generated 3D Learning Content
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Generate interactive 3D training assets from text or images using AI.
              </p>
            </div>
            <div className="mt-auto">
              <Link
                href="/prototype-1"
                className="block w-full bg-blue-600 text-white text-center font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open AI Tool
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                AI Avatar Command & Animation
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Control a learning avatar using natural language commands.
              </p>
            </div>
            <div className="mt-auto">
              <Link
                href="/prototype-2"
                className="block w-full bg-green-600 text-white text-center font-medium py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Open AI Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
