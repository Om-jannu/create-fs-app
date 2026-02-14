'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const templates = [
  {
    id: 'turborepo-nextjs-nestjs-postgresql-prisma',
    name: 'Turborepo + Next.js + NestJS',
    description: 'Production-ready SaaS starter with Next.js 14, NestJS, PostgreSQL, and Prisma',
    features: ['TypeScript', 'Tailwind CSS', 'Docker', 'ESLint', 'Prettier'],
    stack: {
      monorepo: 'turborepo',
      frontend: 'next.js',
      backend: 'nest.js',
      database: 'postgresql',
      orm: 'prisma',
    },
  },
  {
    id: 'turborepo-react-express-mongodb-mongoose',
    name: 'Turborepo + React + Express',
    description: 'Fast and flexible stack with React (Vite), Express, MongoDB, and Mongoose',
    features: ['TypeScript', 'Tailwind CSS', 'Docker', 'Testing'],
    stack: {
      monorepo: 'turborepo',
      frontend: 'react',
      backend: 'express',
      database: 'mongodb',
      orm: 'mongoose',
    },
  },
]

export default function TemplateGallery() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCommand = (templateId: string) => {
    const command = `npx create-fs-app my-app --template ${templateId}`
    navigator.clipboard.writeText(command)
    setCopiedId(templateId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Template Gallery</h3>
        <p className="text-gray-400">
          Browse our collection of production-ready templates
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="bg-black border-white/10 hover:border-purple-500/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-gray-400">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stack Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(template.stack).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-gray-300"
                  >
                    {value}
                  </Badge>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {template.features.map((feature) => (
                  <Badge
                    key={feature}
                    className="bg-purple-500/10 border-purple-500/20 text-purple-400"
                  >
                    ✓ {feature}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => copyCommand(template.id)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Command
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://github.com/Om-jannu/create-fs-app/tree/main/templates/${template.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contribute Section */}
      <Card className="bg-linear-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-semibold mb-3">Want to Contribute?</h3>
          <p className="text-gray-400 mb-6">
            Help us grow the template collection! Create your own template and share it with the community.
          </p>
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <a
              href="https://github.com/Om-jannu/create-fs-app/blob/main/TEMPLATE_CONTRIBUTION_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Contribution Guide
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
