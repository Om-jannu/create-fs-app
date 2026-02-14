'use client'

import { useState } from 'react'
import { 
  Terminal, Sparkles, Grid3x3, Github, Package, 
  Zap, Shield, Boxes, Code2, Database, Layers,
  CheckCircle2, Copy, Check, Download,
  Rocket, GitBranch, FileCode, Settings, Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import StackBuilder from '@/components/StackBuilder'
import RandomStack from '@/components/RandomStack'
import TemplateGallery from '@/components/TemplateGallery'

export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyCommand = () => {
    navigator.clipboard.writeText('npx create-fs-app my-app')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">create-fs-app</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#builder" className="hover:text-white transition-colors">Builder</a>
              <a href="#templates" className="hover:text-white transition-colors">Templates</a>
              <a href="https://github.com/Om-jannu/create-fs-app/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Docs</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Om-jannu/create-fs-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.npmjs.com/package/create-fs-app" target="_blank" rel="noopener noreferrer">
                <Package className="w-4 h-4 mr-2" />
                npm
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-purple-500/50 text-purple-400">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></span>
            v0.1.0 - Production Ready
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tight">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent pixel-text">
              CREATE YOUR OWN STACK
            </span>
          </h1>
          
          <p className="text-gray-400 text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
            Production-ready full-stack monorepo applications. One command to start building.
          </p>
          
          <p className="text-gray-500 text-sm mb-12">
            Template-based • Lightning Fast • TypeScript Only • Community Driven
          </p>

          {/* Command Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-black border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-mono">Quick Start</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCommand}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <code className="text-green-400 font-mono text-lg block">
                  $ npx create-fs-app my-app
                </code>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="bg-black border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">39.5 KB</div>
                <div className="text-xs text-gray-500">Package Size</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">10x</div>
                <div className="text-xs text-gray-500">Faster (Cached)</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">100%</div>
                <div className="text-xs text-gray-500">TypeScript</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-lg">
            Production-grade features out of the box
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Template-based architecture. First run ~60s, cached runs ~6s. 10x faster than traditional scaffolding.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Boxes className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>Monorepo Ready</CardTitle>
              <CardDescription>
                Choose from Turborepo, Nx, or Lerna. Optimized workspace configuration with shared packages.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Code2 className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>TypeScript Only</CardTitle>
              <CardDescription>
                100% TypeScript. No JavaScript option. Type-safe from day one with proper configurations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Layers className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>Full-Stack Templates</CardTitle>
              <CardDescription>
                Complete frontend + backend + database setups. React, Next.js, Vue, Angular with Express, NestJS, Fastify.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Database className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>Database & ORM</CardTitle>
              <CardDescription>
                PostgreSQL, MongoDB, MySQL, SQLite with Prisma, TypeORM, Mongoose, or Drizzle pre-configured.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black border-white/10 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Shield className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle>Production Ready</CardTitle>
              <CardDescription>
                Docker, ESLint, Prettier, Testing, CI/CD templates. Everything configured and ready to deploy.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CLI Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Three Ways to Create</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Mode</h3>
                  <p className="text-gray-400">
                    Beautiful prompts guide you through configuration. Perfect for exploring options.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/50 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">CLI Options</h3>
                  <p className="text-gray-400">
                    Pass all options as flags. Ideal for automation and CI/CD pipelines.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/50 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Direct Template</h3>
                  <p className="text-gray-400">
                    Use a specific template by name. Fastest way when you know what you want.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-black border-white/10">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2 font-mono">Interactive</div>
                  <code className="text-green-400 text-sm block">$ npx create-fs-app my-app</code>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-gray-500 mb-2 font-mono">CLI Options</div>
                  <code className="text-green-400 text-sm block">
                    $ npx create-fs-app my-app \<br/>
                    &nbsp;&nbsp;--monorepo turborepo \<br/>
                    &nbsp;&nbsp;--frontend next.js \<br/>
                    &nbsp;&nbsp;--backend nest.js \<br/>
                    &nbsp;&nbsp;--database postgresql
                  </code>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-gray-500 mb-2 font-mono">Direct Template</div>
                  <code className="text-green-400 text-sm block">
                    $ npx create-fs-app my-app \<br/>
                    &nbsp;&nbsp;--template turborepo-nextjs-nestjs
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Advanced Features
          </h2>
          <p className="text-gray-400 text-lg">
            Power tools for professional developers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <Settings className="w-8 h-8 text-purple-400 mb-3" />
              <CardTitle>Configuration Presets</CardTitle>
              <CardDescription className="text-gray-300">
                Save your favorite stack configurations. Built-in presets: saas-starter, ecommerce, minimal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="text-xs text-green-400 block bg-black/50 p-3 rounded">
                $ create-fs-app my-app \<br/>
                &nbsp;&nbsp;--preset saas-starter
              </code>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <GitBranch className="w-8 h-8 text-purple-400 mb-3" />
              <CardTitle>Template Caching</CardTitle>
              <CardDescription className="text-gray-300">
                Templates cached locally. First run ~60s, subsequent runs ~6s. Clear cache anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="text-xs text-green-400 block bg-black/50 p-3 rounded">
                $ create-fs-app cache stats<br/>
                $ create-fs-app cache clear
              </code>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <FileCode className="w-8 h-8 text-purple-400 mb-3" />
              <CardTitle>Health Check</CardTitle>
              <CardDescription className="text-gray-300">
                Verify project setup. Checks dependencies, configs, structure, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="text-xs text-green-400 block bg-black/50 p-3 rounded">
                $ create-fs-app health<br/>
                <span className="text-gray-500">✓ 8/8 checks passed</span>
              </code>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Builder */}
      <section id="builder" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <Tabs defaultValue="builder" className="w-full">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2">Try It Now</h2>
              <p className="text-gray-400">Build your stack and generate the command</p>
            </div>
            <TabsList className="bg-black border border-white/10">
              <TabsTrigger value="builder">
                <Terminal className="w-4 h-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="random">
                <Sparkles className="w-4 h-4 mr-2" />
                Random
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Grid3x3 className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>
          </div>

          <Card className="bg-black border-white/10">
            <CardContent className="p-8">
              <TabsContent value="builder" className="mt-0">
                <StackBuilder />
              </TabsContent>
              <TabsContent value="random" className="mt-0">
                <RandomStack />
              </TabsContent>
              <TabsContent value="templates" className="mt-0">
                <TemplateGallery />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </section>

      {/* Tech Stack Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Supported Technologies
          </h2>
          <p className="text-gray-400 text-lg">
            Mix and match your favorite tools
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Monorepo</h3>
            <div className="space-y-2">
              {['Turborepo', 'Nx', 'Lerna'].map(tech => (
                <Badge key={tech} variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Frontend</h3>
            <div className="space-y-2">
              {['Next.js', 'React', 'Vue', 'Nuxt', 'Angular'].map(tech => (
                <Badge key={tech} variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Backend</h3>
            <div className="space-y-2">
              {['NestJS', 'Express', 'Fastify', 'Koa'].map(tech => (
                <Badge key={tech} variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Database</h3>
            <div className="space-y-2">
              {['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'].map(tech => (
                <Badge key={tech} variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <Card className="bg-linear-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Start your next project in seconds with production-ready templates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600" asChild>
                <a href="https://github.com/Om-jannu/create-fs-app/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                  <Download className="w-5 h-5 mr-2" />
                  Get Started
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/Om-jannu/create-fs-app" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span className="font-bold">create-fs-app</span>
              </div>
              <p className="text-sm text-gray-400">
                Production-ready full-stack applications in seconds.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#builder" className="hover:text-white transition-colors">Builder</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com/Om-jannu/create-fs-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discussions</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com/Om-jannu/create-fs-app/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">README</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/blob/main/docs/CLI_USAGE.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">CLI Usage</a></li>
                <li><a href="https://github.com/Om-jannu/create-fs-app/blob/main/docs/TEMPLATE_GUIDE.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Template Guide</a></li>
                <li><a href="https://www.npmjs.com/package/create-fs-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">npm Package</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-400" /> by the create-fs-app community
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="https://github.com/Om-jannu/create-fs-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://www.npmjs.com/package/create-fs-app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                npm
              </a>
              <span className="text-gray-600">v0.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
