"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Registration {
  _id: string;
  teamName: string;
  domain: string;
  teamSize: number;
  college: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    year: string;
  };
  members: { name: string; email: string; phone: string; year: string }[];
  transactionId: string;
  screenshotUrl: string;
  createdAt: string;
}

const domainLabels: Record<string, string> = {
  ai: "Agentic AI & Intelligent Automation",
  cyber: "Cybersecurity & Fintech",
  blockchain: "Blockchain / Web3 / IoT",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterDomain) params.set("domain", filterDomain);

      const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          setError("Invalid password");
          return;
        }
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setRegistrations(data.registrations);
    } catch {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [password, filterDomain]);

  useEffect(() => {
    if (authed) fetchRegistrations();
  }, [authed, filterDomain, fetchRegistrations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setAuthed(true);
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r._id !== id));
      }
    } catch {
      setError("Failed to delete registration");
    }
  };

  // Login screen
  if (!authed) {
    return (
      <main className="min-h-screen relative">
        <div className="pt-10 pb-20 px-4 sm:px-6 flex items-center justify-center min-h-screen">
          <div className="glass-card p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-[Gilroy-Heavy] text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-400 font-[Gilroy-Light] text-sm mb-8">
              Enter the admin password to view registrations
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                className="form-input text-center !text-lg tracking-widest"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="glow-btn w-full">
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen relative">
      <div className="pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-[Gilroy-Heavy] text-white mb-1">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 font-[Gilroy-Light]">
                {registrations.length} registration
                {registrations.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRegistrations}
                className="outline-btn !py-2 !px-4 !text-sm"
              >
                ↻ Refresh
              </button>
              <Link href="/" className="outline-btn !py-2 !px-4 !text-sm">
                ← Back to Site
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-[Gilroy-Bold] text-gray-400 mb-2 uppercase tracking-wider">
                  Domain
                </label>
                <select
                  className="form-input !py-2"
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                >
                  <option value="" className="bg-dark-200">
                    All Domains
                  </option>
                  <option value="ai" className="bg-dark-200">
                    Agentic AI
                  </option>
                  <option value="cyber" className="bg-dark-200">
                    Cybersecurity
                  </option>
                  <option value="blockchain" className="bg-dark-200">
                    Blockchain
                  </option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-[Gilroy-Bold] text-gray-400 mb-2 uppercase tracking-wider">
                  Total
                </label>
                <div className="flex gap-3">
                  <span className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-[Gilroy-Bold]">
                    {registrations.length} Registration
                    {registrations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 font-[Gilroy-Medium]">
                Loading registrations...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="glass-card p-6 text-center border-red-500/20">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Registration Cards */}
          {!loading && registrations.length === 0 && !error && (
            <div className="glass-card p-12 text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 font-[Gilroy-Medium]">
                No registrations found
              </p>
            </div>
          )}

          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg._id} className="glass-card overflow-hidden">
                {/* Card Header */}
                <div
                  className="p-5 sm:p-6 cursor-pointer hover:bg-white/[0.01] transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === reg._id ? null : reg._id)
                  }
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl flex-shrink-0">
                        {reg.domain === "ai"
                          ? "🤖"
                          : reg.domain === "cyber"
                            ? "🔒"
                            : "⛓️"}
                      </div>
                      <div>
                        <h3 className="font-[Gilroy-Bold] text-white text-lg">
                          {reg.teamName}
                        </h3>
                        <p className="text-sm text-gray-400 font-[Gilroy-Light]">
                          {domainLabels[reg.domain] || reg.domain} •{" "}
                          {reg.teamSize} members • {reg.college}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs font-[Gilroy-Medium]">
                        {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${expandedId === reg._id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === reg._id && (
                  <div className="border-t border-white/5 p-5 sm:p-6 space-y-6">
                    {/* Leader Info */}
                    <div>
                      <h4 className="text-xs font-[Gilroy-Bold] text-primary uppercase tracking-widest mb-3">
                        Team Leader
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 block">Name</span>
                          <span className="text-white font-[Gilroy-Medium]">
                            {reg.leader.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Email</span>
                          <span className="text-white font-[Gilroy-Medium]">
                            {reg.leader.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Phone</span>
                          <span className="text-white font-[Gilroy-Medium]">
                            {reg.leader.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Year</span>
                          <span className="text-white font-[Gilroy-Medium]">
                            {reg.leader.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Members */}
                    {reg.members.length > 0 && (
                      <div>
                        <h4 className="text-xs font-[Gilroy-Bold] text-secondary uppercase tracking-widest mb-3">
                          Team Members
                        </h4>
                        <div className="space-y-3">
                          {reg.members.map((m, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-white/[0.02] rounded-xl p-3"
                            >
                              <div>
                                <span className="text-gray-500 block">
                                  Name
                                </span>
                                <span className="text-white font-[Gilroy-Medium]">
                                  {m.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">
                                  Email
                                </span>
                                <span className="text-white font-[Gilroy-Medium]">
                                  {m.email}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">
                                  Phone
                                </span>
                                <span className="text-white font-[Gilroy-Medium]">
                                  {m.phone}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">
                                  Year
                                </span>
                                <span className="text-white font-[Gilroy-Medium]">
                                  {m.year}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div>
                      <h4 className="text-xs font-[Gilroy-Bold] text-accent uppercase tracking-widest mb-3">
                        Payment
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="text-gray-500">
                              Transaction ID:{" "}
                            </span>
                            <span className="text-white font-mono font-bold">
                              {reg.transactionId}
                            </span>
                          </div>
                        </div>
                        {reg.screenshotUrl && (
                          <a
                            href={reg.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <img
                              src={reg.screenshotUrl}
                              alt="Payment screenshot"
                              className="max-h-40 rounded-xl border border-white/10 hover:border-primary/30 transition-colors"
                            />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => deleteRegistration(reg._id)}
                        className="px-5 py-2 rounded-xl text-sm font-[Gilroy-Bold] transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      >
                        🗑 Delete Registration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
