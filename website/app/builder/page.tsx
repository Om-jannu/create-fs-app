'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Terminal, Copy, Check, ArrowLeft, Sparkles } from 'lucide-react'
import StackBuilder from '@/components/StackBuilder'
import RandomStack from '@/components/RandomStack'
import TemplateGallery from '@/components/TemplateGallery'

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'random' | 'templates'>('builder')

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                create-fs-app
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Docs
              </Link>
              <Link href="/builder" className="text-white text-sm font-medium">
                Builder
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stack Builder
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Configure your perfect full-stack setup
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'builder'
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Terminal className="w-5 h-5" />
              <span className="hidden sm:inline">Stack Builder</span>
              <span className="sm:hidden">Build</span>
            </button>
            <button
              onClick={() => setActiveTab('random')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'random'
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">Random Stack</span>
              <span className="sm:hidden">Random</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Copy className="w-5 h-5" />
              <span className="hidden sm:inline">Templates</span>
              <span className="sm:hidden">Gallery</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'builder' && <StackBuilder />}
            {activeTab === 'random' && <RandomStack />}
            {activeTab === 'templates' && <TemplateGallery />}
          </div>
        </div>
      </div>
    </main>
  )
}
