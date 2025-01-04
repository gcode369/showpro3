// src/hooks/useAgentSearch.ts
import { useState } from 'react';
import { searchAgentsByUsername } from '../services/auth/usernameService';
import type { Agent, AgentSearchResult } from '../types/agent';

export function useAgentSearch() {
  const [results, setResults] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAgents = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchAgentsByUsername(query);
      
      // Transform search results to Agent type
      const agents: Agent[] = searchResults.map((result: AgentSearchResult) => ({
        id: result.user_id,
        email: '', // Not included in search results
        name: result.name,
        username: result.username,
        phone: '', // Not included in search results
        areas: result.areas || [],
        photo: result.photo_url || undefined,
        subscriptionStatus: result.subscription_status,
        subscriptionTier: 'basic' // Default value
      }));

      setResults(agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search agents');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchAgents
  };
}
