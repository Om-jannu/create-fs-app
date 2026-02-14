'use client'

import Link from 'next/link'
import { Terminal, ArrowLeft, Book, Zap, Package, Settings, Code, Rocket } from 'lucide-react'

export default function DocsPage() {
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
              <Link href="/docs" className="text-white text-sm font-medium">
                Docs
              </Link>
              <Link href="/builder" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Getting Started
                </h3>
                <nav className="space-y-2">
                  <a href="#quick-start" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    Quick Start
                  </a>
                  <a href="#installation" className="block text-gray-400 hover:text-white transition-colors">
                    Installation
                  </a>
                  <a href="#usage" className="block text-gray-400 hover:text-white transition-colors">
                    Usage
                  </a>
                </nav>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Features
                </h3>
                <nav className="space-y-2">
                  <a href="#templates" className="block text-gray-400 hover:text-white transition-colors">
                    Templates
                  </a>
                  <a href="#caching" className="block text-gray-400 hover:text-white transition-colors">
                    Caching
                  </a>
                  <a href="#presets" className="block text-gray-400 hover:text-white transition-colors">
                    Presets
                  </a>
                </nav>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Advanced
                </h3>
                <nav className="space-y-2">
                  <a href="#custom-templates" className="block text-gray-400 hover:text-white transition-colors">
                    Custom Templates
                  </a>
                  <a href="#contributing" className="block text-gray-400 hover:text-white transition-colors">
                    Contributing
                  </a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-invert max-w-none">
              {/* Quick Start */}
              <section id="quick-start" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Quick Start</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  Get started with create-fs-app in seconds. No configuration required.
                </p>
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-6">
                  <code className="text-purple-400">npx create-fs-app my-app</code>
                </div>
                <p className="text-gray-400">
                  This will create a new full-stack application with your chosen configuration.
                  The CLI will guide you through selecting your preferred frameworks and tools.
                </p>
              </section>

              {/* Installation */}
              <section id="installation" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Installation</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  You can use create-fs-app with npx (recommended) or install it globally.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Using npx (Recommended)</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app my-app</code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Global Installation</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-2">
                      <div><code className="text-purple-400">npm install -g create-fs-app</code></div>
                      <div><code className="text-purple-400">create-fs-app my-app</code></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Usage */}
              <section id="usage" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Usage</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  create-fs-app supports both interactive and CLI modes.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white">Interactive Mode</h3>
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-6">
                  <code className="text-purple-400">npx create-fs-app my-app</code>
                </div>
                <p className="text-gray-400 mb-6">
                  The CLI will prompt you to select your preferred frameworks and tools.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-white">CLI Mode</h3>
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-6">
                  <pre className="text-purple-400 text-sm overflow-x-auto">
{`npx create-fs-app my-app \\
  --monorepo turborepo \\
  --frontend next.js \\
  --backend nest.js \\
  --database postgresql \\
  --orm prisma`}
                  </pre>
                </div>
              </section>

              {/* Templates */}
              <section id="templates" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Book className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Templates</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  Use pre-configured templates to get started even faster.
                </p>
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-6">
                  <code className="text-purple-400">npx create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma</code>
                </div>
                <p className="text-gray-400">
                  Browse available templates in the <Link href="/builder" className="text-purple-400 hover:text-purple-300">Stack Builder</Link>.
                </p>
              </section>

              {/* Caching */}
              <section id="caching" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Caching</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  create-fs-app caches templates locally for faster subsequent runs.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Cache Stats</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app cache stats</code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Clear Cache</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app cache clear</code>
                    </div>
                  </div>
                </div>
              </section>

              {/* Presets */}
              <section id="presets" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Presets</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  Save your favorite configurations as presets for quick reuse.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Save Preset</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app preset save my-stack</code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Use Preset</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app my-app --preset my-stack</code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">List Presets</h3>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
                      <code className="text-purple-400">npx create-fs-app preset list</code>
                    </div>
                  </div>
                </div>
              </section>

              {/* Custom Templates */}
              <section id="custom-templates" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Custom Templates</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  Use your own templates from any Git repository.
                </p>
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-6">
                  <code className="text-purple-400">npx create-fs-app my-app --template-url https://github.com/user/template</code>
                </div>
              </section>

              {/* Contributing */}
              <section id="contributing" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Book className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold m-0">Contributing</h2>
                </div>
                <p className="text-gray-400 text-lg mb-6">
                  We welcome contributions! Help us grow the template collection.
                </p>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    Check out our contribution guide to learn how to create and submit your own templates.
                  </p>
                  <a
                    href="https://github.com/Om-jannu/create-fs-app/blob/main/TEMPLATE_CONTRIBUTION_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all"
                  >
                    View Contribution Guide
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
