'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, AlertCircle, Briefcase, GraduationCap, Globe } from 'lucide-react'

type SyncResult = {
  success?: boolean;
  error?: string;
  inserted?: number;
  skipped?: number;
  total_fetched?: number;
  feeds_processed?: number;
}

export default function AdminSyncPage() {
  const [lastSyncs, setLastSyncs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, SyncResult | null>>({})

  useEffect(() => {
    // Load last sync times
    try {
      const stored = localStorage.getItem('oppalert_last_syncs')
      if (stored) {
        setLastSyncs(JSON.parse(stored))
      }
    } catch (e) {}
  }, [])

  const handleSync = async (id: string, endpoint: string) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    setResults(prev => ({ ...prev, [id]: null }))

    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      
      setResults(prev => ({ ...prev, [id]: data }))
      
      if (data.success) {
        const newSyncs = { ...lastSyncs, [id]: new Date().toLocaleString() }
        setLastSyncs(newSyncs)
        localStorage.setItem('oppalert_last_syncs', JSON.stringify(newSyncs))
      }
    } catch (error: any) {
      setResults(prev => ({ ...prev, [id]: { success: false, error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const syncNodes = [
    {
      id: 'jobs',
      title: 'Remote Jobs Sync',
      description: 'Fetches jobs from the Remotive API (Software, Marketing, Design, etc.)',
      endpoint: '/api/cron/sync-jobs',
      icon: Briefcase
    },
    {
      id: 'scholarships',
      title: 'Scholarship Sync',
      description: 'Parses RSS feeds from Opportunity Desk and After School Africa',
      endpoint: '/api/cron/sync-scholarships',
      icon: GraduationCap
    },
    {
      id: 'grants',
      title: 'Grants & Fellowships Sync',
      description: 'Parses RSS feeds from Devex and ReliefWeb',
      endpoint: '/api/cron/sync-grants',
      icon: Globe
    }
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black font-syne mb-2">Automated Syncing</h1>
        <p className="text-muted">Trigger external API syncs manually. Cron jobs are configured in vercel.json.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {syncNodes.map((node) => (
          <div key={node.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber/10 rounded-xl text-amber">
                <node.icon size={24} />
              </div>
              <h2 className="font-bold text-lg">{node.title}</h2>
            </div>
            
            <p className="text-sm text-subtle mb-6 flex-1">
              {node.description}
            </p>

            <div className="text-xs text-muted mb-6">
              Last Synced: <span className="font-medium text-white">{lastSyncs[node.id] || 'Never'}</span>
            </div>

            {results[node.id] && (
              <div className={`p-4 rounded-xl mb-6 text-sm border flex items-start gap-2 ${
                results[node.id]?.success 
                  ? 'bg-emerald/10 border-emerald/20 text-emerald'
                  : 'bg-danger/10 border-danger/20 text-danger'
              }`}>
                {results[node.id]?.success ? (
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                )}
                <div>
                  {results[node.id]?.success ? (
                    <span>
                      ✅ {results[node.id]?.inserted} inserted, {results[node.id]?.skipped} skipped.
                      {results[node.id]?.feeds_processed ? ` Processed ${results[node.id]?.feeds_processed} feeds.` : ''}
                    </span>
                  ) : (
                    <span>Error: {results[node.id]?.error || 'Sync failed'}</span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => handleSync(node.id, node.endpoint)}
              disabled={loading[node.id]}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs disabled:opacity-50"
            >
              {loading[node.id] ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {loading[node.id] ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
