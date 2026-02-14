'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const options = {
  monorepo: ['turborepo', 'nx', 'lerna'],
  frontend: ['next.js', 'react', 'vue', 'nuxt', 'angular'],
  backend: ['nest.js', 'express', 'fastify', 'koa'],
  database: ['postgresql', 'mongodb', 'mysql', 'sqlite'],
  orm: ['prisma', 'typeorm', 'mongoose', 'drizzle'],
  packageManager: ['npm', 'yarn', 'pnpm', 'bun'],
}

export default function StackBuilder() {
  const [stack, setStack] = useState({
    monorepo: 'turborepo',
    frontend: 'next.js',
    backend: 'nest.js',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
  })
  const [copied, setCopied] = useState(false)

  const generateCommand = () => {
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
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Configure your stack</h3>
        <p className="text-gray-400 text-sm">
          Select your preferred technologies and generate a custom command
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {Object.entries(options).map(([key, values]) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-2 capitalize font-mono">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
              value={stack[key as keyof typeof stack]}
              onChange={(e) => setStack({ ...stack, [key]: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {values.map((value) => (
                <option key={value} value={value} className="bg-black">
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Generated Command */}
      <div className="bg-black border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400 font-mono">Generated command</span>
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

      {/* Stack Preview */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(stack).map(([key, value]) => (
          <span
            key={key}
            className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-mono"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  )
}
