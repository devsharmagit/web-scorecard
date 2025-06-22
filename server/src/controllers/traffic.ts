import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

function getFormattedMonth(date: Date): string {
  try {
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // e.g., "May 2024"
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

function normalizeUrlForPlan(inputUrl: string): string {
  try {
    if (!inputUrl || typeof inputUrl !== 'string') {
      return '';
    }
    
    const { hostname, pathname } = new URL(inputUrl);
    return `${hostname}${pathname}`.replace(/\/$/, '');
  } catch (error) {
    console.error('Invalid URL format:', inputUrl, error);
    return '';
  }
}

function normalizeUrl(inputUrl: string): string {
  try {
    if (!inputUrl || typeof inputUrl !== 'string') {
      return '';
    }
    return inputUrl.replace(/\/$/, '');
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return '';
  }
}

async function fetchCsvData(url: string, timeout: number = 10000): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteMetrics/1.0)'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Error fetching CSV from ${url}:`, error);
    return '';
  }
}

function parseCsvSafely(csvText: string): string[][] {
  try {
    if (!csvText || csvText.trim().length === 0) {
      return [];
    }
    
    const records: string[][] = parse(csvText, {
      skip_empty_lines: true,
      relax_column_count: true, // Allow inconsistent column counts
      trim: true
    });
    
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

function findTrafficData(
  trafficRecords: string[][],
  normalizedUrl: string,
  currentMonth: string,
  previousMonth: string
): { traffic: string; previousMonthTraffic: string } {
  try {
    if (!trafficRecords || trafficRecords.length === 0) {
      return { traffic: 'NA', previousMonthTraffic: 'NA' };
    }
    
    const headerRow = trafficRecords[0];
    if (!Array.isArray(headerRow)) {
      return { traffic: 'NA', previousMonthTraffic: 'NA' };
    }
    
    const monthIndex = headerRow.indexOf(currentMonth);
    const prevMonthIndex = headerRow.indexOf(previousMonth);
    
    let traffic = 'NA';
    let previousMonthTraffic = 'NA';
    
    if (monthIndex !== -1 || prevMonthIndex !== -1) {
      for (const row of trafficRecords) {
        try {
          if (!Array.isArray(row) || row.length < 2) continue;
          
          const rowUrl = row[1]?.toString().replace(/\/$/, '') || '';
          
          if (rowUrl === normalizedUrl) {
            if (monthIndex !== -1 && monthIndex < row.length) {
              traffic = row[monthIndex]?.toString() || 'NA';
            }
            if (prevMonthIndex !== -1 && prevMonthIndex < row.length) {
              previousMonthTraffic = row[prevMonthIndex]?.toString() || 'NA';
            }
            break;
          }
        } catch (rowError) {
          console.error('Error processing traffic row:', rowError);
          continue;
        }
      }
    }
    
    return { traffic, previousMonthTraffic };
  } catch (error) {
    console.error('Error finding traffic data:', error);
    return { traffic: 'NA', previousMonthTraffic: 'NA' };
  }
}

function findPlanData(
  planRecords: string[][],
  normalizedForPlan: string
): string {
  try {
    if (!planRecords || planRecords.length === 0) {
      return 'NA';
    }
    
    // Remove header row safely
    const dataRows = planRecords.length > 1 ? planRecords.slice(1) : planRecords;
    
    for (const row of dataRows) {
      try {
        if (!Array.isArray(row) || row.length === 0) continue;
        
        const rowUrl = row[0]?.toString() || '';
        
        if (rowUrl === normalizedForPlan) {
          return row[1]?.toString() || 'NA';
        }
      } catch (rowError) {
        console.error('Error processing plan row:', rowError);
        continue;
      }
    }
    
    return 'NA';
  } catch (error) {
    console.error('Error finding plan data:', error);
    return 'NA';
  }
}

function calculateMonths(): { currentMonth: string; previousMonth: string } {
  try {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const currentMonth = getFormattedMonth(currentDate);

    const previousDate = new Date(currentDate);
    previousDate.setMonth(previousDate.getMonth() - 1);
    const previousMonth = getFormattedMonth(previousDate);
    
    return { currentMonth, previousMonth };
  } catch (error) {
    console.error('Error calculating months:', error);
    return { currentMonth: '', previousMonth: '' };
  }
}

export async function getWebsiteMetrics(inputUrl: string): Promise<{
  traffic: string;
  previousMonthTraffic: string;
  plan: string;
}> {
  // Default return values
  const defaultResult = {
    traffic: 'NA',
    previousMonthTraffic: 'NA',
    plan: 'NA',
  };
  
  try {
    // Validate input
    if (!inputUrl || typeof inputUrl !== 'string' || inputUrl.trim().length === 0) {
      console.error('Invalid input URL provided');
      return defaultResult;
    }
    
    const TRAFFIC_SHEET_URL =
      'https://docs.google.com/spreadsheets/d/1AqvU5vRbvs_l_6985mKk4csBZEP7SigSUZqSb_w3GiE/export?format=csv&gid=545055901';
    const PLAN_SHEET_URL =
      'https://docs.google.com/spreadsheets/d/1DAKfaYcS9zq6LeM0eqn0nDsQEk0H9fUglntbJ9Rg9qM/export?format=csv&gid=0';

    const normalizedUrl = normalizeUrl(inputUrl);
    const normalizedForPlan = normalizeUrlForPlan(inputUrl);
    
    // If URL normalization failed, return defaults
    if (!normalizedUrl && !normalizedForPlan) {
      console.error('Failed to normalize URL:', inputUrl);
      return defaultResult;
    }

    const { currentMonth, previousMonth } = calculateMonths();
    
    // If month calculation failed, return defaults
    if (!currentMonth && !previousMonth) {
      console.error('Failed to calculate months');
      return defaultResult;
    }

    let traffic = 'NA';
    let previousMonthTraffic = 'NA';
    let plan = 'NA';

    // Fetch traffic data with error handling
    try {
      const trafficCsv = await fetchCsvData(TRAFFIC_SHEET_URL);
      
      if (trafficCsv) {
        const trafficRecords = parseCsvSafely(trafficCsv);
        
        if (trafficRecords.length > 0) {
          const trafficData = findTrafficData(
            trafficRecords,
            normalizedUrl,
            currentMonth,
            previousMonth
          );
          traffic = trafficData.traffic;
          previousMonthTraffic = trafficData.previousMonthTraffic;
        }
      }
    } catch (trafficError) {
      console.error('Error processing traffic data:', trafficError);
    }

    // Fetch plan data with error handling
    try {
      const planCsv = await fetchCsvData(PLAN_SHEET_URL);
      
      if (planCsv && normalizedForPlan) {
        const planRecords = parseCsvSafely(planCsv);
        
        if (planRecords.length > 0) {
          plan = findPlanData(planRecords, normalizedForPlan);
        }
      }
    } catch (planError) {
      console.error('Error processing plan data:', planError);
    }

    return {
      traffic,
      previousMonthTraffic,
      plan,
    };
  } catch (error) {
    console.error('Critical error in getWebsiteMetrics:', error);
    return defaultResult;
  }
}