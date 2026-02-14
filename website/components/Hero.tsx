import { Terminal, Zap, Package } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              create-fs-app
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Create production-ready full-stack monorepo applications with your preferred tech stack
          </p>
          
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto mb-12">
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Quick Start</span>
            </div>
            <code className="text-green-400 text-lg font-mono">
              npx create-fs-app my-app
            </code>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Template-based architecture for instant project setup
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <Package className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tiny Package</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Only 39.5 KB - templates fetched on demand
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <Terminal className="w-10 h-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                TypeScript, Docker, Testing - all configured
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
