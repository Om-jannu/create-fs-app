import { UserList } from "@/components/UserList";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">test-nestjs-app</h1>
        <p className="text-gray-500 mb-8">Next.js · NestJS · PostgreSQL · Prisma</p>
        <UserList />
      </div>
    </main>
  );
}
