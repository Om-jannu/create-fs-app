'use client'

import { useState } from 'react'
import { Shuffle, Copy, Check } from 'lucide-react'

const options = {
  monorepo: ['turborepo', 'nx', 'lerna'],
  frontend: ['next.js', 'react', 'vue', 'nuxt', 'angular'],
  backend: ['nest.js', 'express', 'fastify', 'koa'],
  database: ['postgresql', 'mongodb', 'mysql', 'sqlite'],
  orm: ['prisma', 'typeorm', 'mongoose', 'drizzle'],
  packageManager: ['npm', 'yarn', 'pnpm', 'bun'],
}

export default function RandomStack() {
  const [stack, setStack] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const generateRandom = () => {
    setIsAnimating(true)
    
    let count = 0
    const interval = setInterval(() => {
      const randomStack = Object.entries(options).reduce((acc, [key, values]) => {
        acc[key] = values[Math.floor(Math.random() * values.length)]
        return acc
      }, {} as any)
      setStack(randomStack)
      count++
      
      if (count >= 15) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 80)
  }

  const generateCommand = () => {
    if (!stack) return ''
    return `npx create-fs-app my-app \\
  --monorepo ${stack.monorepo} \\
  --frontend ${stack.frontend} \\
  --backend ${stack.backend} \\
  --database ${stack.database} \\
  --orm ${stack.orm} \\
  --package-manager ${stack.packageManager}`
  }

  const copyCommand = () => {
    navigator.clipboard.writeText(generateCommand())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-semibold mb-3">🎲 Random Stack Generator</h3>
        <p className="text-gray-400">
          Feeling adventurous? Let fate decide your tech stack!
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={generateRandom}
          disabled={isAnimating}
          className="flex items-center gap-3 px-8 py-4 bg-purple-500/10 border-2 border-purple-500/50 hover:bg-purple-500/20 text-purple-400 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle className={`w-6 h-6 ${isAnimating ? 'animate-spin' : ''}`} />
          {isAnimating ? 'Shuffling...' : 'Generate Random Stack'}
        </button>
      </div>

      {stack && (
        <div className="space-y-8">
          {/* Stack Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(stack).map(([key, value]) => (
              <div
                key={key}
                className="bg-black border border-white/10 rounded-lg p-4"
              >
                <div className="text-xs text-gray-500 mb-2 capitalize font-mono">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-semibold text-white">
                  {value as string}
                </div>
              </div>
            ))}
          </div>

          {/* Generated Command */}
          <div className="bg-black border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 font-mono">Your random command</span>
              <button
                onClick={copyCommand}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto font-mono">
              {generateCommand()}
            </pre>
          </div>

          <div className="text-center">
            <button
              onClick={generateRandom}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Don&apos;t like it? Try again! 🎲
            </button>
          </div>
        </div>
      )}

      {!stack && (
        <div className="text-center text-gray-500 py-16 border border-white/5 rounded-lg">
          <Shuffle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Click the button above to generate a random stack!</p>
        </div>
      )}
    </div>
  )
}
