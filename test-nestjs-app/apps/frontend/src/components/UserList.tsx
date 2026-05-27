"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json() as User[];
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => { void fetchUsers(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const body = await res.json() as { message?: string };
        throw new Error(body.message ?? "Failed to create user");
      }
      setName("");
      setEmail("");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-xl font-semibold">Create User</h2>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1 text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border rounded px-3 py-2 flex-1 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-3">Users ({users.length})</h2>
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm">No users yet. Create one above.</p>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id} className="border rounded p-3 text-sm">
                <span className="font-medium">{u.name}</span>{" "}
                <span className="text-gray-500">&lt;{u.email}&gt;</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
