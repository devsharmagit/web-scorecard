import React, { useEffect, useState } from 'react';

const apiKey = 'AIzaSyBzJvs04SfVeePcm6QkVuR2U8GMHbkU_Ok';
const targetUrl = 'https://ruma.com';

type Strategy = 'mobile' | 'desktop';

interface ScoreResult {
  strategy: Strategy;
  performance: number;
  seo: number;
}

const buildOptimizedApiUrl = (url: string, strategy: Strategy): string => {
  const params = new URLSearchParams();
  params.append('url', url);
  params.append('key', apiKey);
  params.append('strategy', strategy);
  params.append('category', 'performance');
  params.append('category', 'seo');

  return `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
};

const PageSpeedScores: React.FC = () => {
  const [scores, setScores] = useState<ScoreResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScores = async (strategy: Strategy): Promise<ScoreResult | null> => {
    try {
      const url = buildOptimizedApiUrl(targetUrl, strategy);
      const response = await fetch(url);
      const data = await response.json();

      const performance = data.lighthouseResult.categories.performance.score * 100;
      const seo = data.lighthouseResult.categories.seo.score * 100;

      return { strategy, performance, seo };
    } catch (error) {
      console.log(error)
      return null;
    }
  };

  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      const [mobile, desktop] = await Promise.all([
        fetchScores('mobile'),
        fetchScores('desktop'),
      ]);

      const validScores = [mobile, desktop].filter(Boolean) as ScoreResult[];
      setScores(validScores);
      setLoading(false);
    };

    loadScores();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h2>PageSpeed Scores for {targetUrl}</h2>
      {loading ? (
        <p>Loading scores...</p>
      ) : (
        <ul>
          {scores.map((score) => (
            <li key={score.strategy}>
              <strong>{score.strategy.toUpperCase()}:</strong>{' '}
              Performance: {score.performance}, SEO: {score.seo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PageSpeedScores;