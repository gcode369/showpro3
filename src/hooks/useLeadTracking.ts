import { useState, useEffect } from 'react';
import { leadScoringService } from '../services/leads/LeadScoringService';
import { automatedFollowupService } from '../services/leads/AutomatedFollowupService';
import type { LeadScore, AutomatedFollowup } from '../types/lead';

export function useLeadTracking(agentId: string) {
  const [leadScores, setLeadScores] = useState<Record<string, LeadScore>>({});
  const [followups, setFollowups] = useState<AutomatedFollowup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agentId) {
      fetchFollowups();
    }
  }, [agentId]);

  const fetchFollowups = async () => {
    try {
      const data = await automatedFollowupService.getFollowups(agentId);
      setFollowups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch followups');
    } finally {
      setLoading(false);
    }
  };

  const trackActivity = async (clientId: string, activityType: string, metadata?: any) => {
    try {
      await leadScoringService.trackActivity({
        client_id: clientId,
        agent_id: agentId,
        activity_type: activityType,
        metadata
      });

      // Fetch updated lead score
      const score = await leadScoringService.getLeadScore(clientId, agentId);
      if (score) {
        setLeadScores(prev => ({
          ...prev,
          [clientId]: score
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track activity');
      throw err;
    }
  };

  const completeFollowup = async (followupId: string) => {
    try {
      await automatedFollowupService.completeFollowup(followupId);
      setFollowups(prev => prev.filter(f => f.id !== followupId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete followup');
      throw err;
    }
  };

  return {
    leadScores,
    followups,
    loading,
    error,
    trackActivity,
    completeFollowup,
    refreshFollowups: fetchFollowups
  };
}