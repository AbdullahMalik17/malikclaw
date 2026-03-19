"use client";

import { useState, useEffect } from 'react';

interface GitHubStats {
  stars: number;
  latestRelease: string;
  isLoading: boolean;
  error: string | null;
}

export function useGitHubStats(): GitHubStats {
  const [stats, setStats] = useState<GitHubStats>({
    stars: 0,
    latestRelease: 'v0.2.1',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Fetch repository info
        const repoResponse = await fetch('https://api.github.com/repos/AbdullahMalik17/malikclaw', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!repoResponse.ok) {
          throw new Error('Failed to fetch repository data');
        }

        const repoData = await repoResponse.json();

        // Fetch latest release
        const releaseResponse = await fetch('https://api.github.com/repos/AbdullahMalik17/malikclaw/releases/latest', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        let latestRelease = 'v0.2.1';
        if (releaseResponse.ok) {
          const releaseData = await releaseResponse.json();
          latestRelease = releaseData.tag_name || 'v0.2.1';
        }

        setStats({
          stars: repoData.stargazers_count || 0,
          latestRelease,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    fetchGitHubStats();

    // Refresh every 5 minutes
    const interval = setInterval(fetchGitHubStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
