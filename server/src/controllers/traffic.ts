import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

function getFormattedMonth(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // e.g., "May 2024"
}

function normalizeUrlForPlan(inputUrl: string): string {
  try {
    const { hostname, pathname } = new URL(inputUrl);
    return `${hostname}${pathname}`.replace(/\/$/, '');
  } catch (err) {
    console.error('Invalid URL format:', inputUrl);
    return '';
  }
}

export async function getWebsiteMetrics(inputUrl: string): Promise<{
  traffic: string;
  previousMonthTraffic: string;
  plan: string;
}> {
  const TRAFFIC_SHEET_URL =
    'https://docs.google.com/spreadsheets/d/1AqvU5vRbvs_l_6985mKk4csBZEP7SigSUZqSb_w3GiE/export?format=csv&gid=545055901';
  const PLAN_SHEET_URL =
    'https://docs.google.com/spreadsheets/d/1DAKfaYcS9zq6LeM0eqn0nDsQEk0H9fUglntbJ9Rg9qM/export?format=csv&gid=0';

  const normalizeUrl = inputUrl.replace(/\/$/, '');
  const normalizedForPlan = normalizeUrlForPlan(inputUrl);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const currentMonth = getFormattedMonth(currentDate);

  const previousDate = new Date(currentDate);
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previousMonth = getFormattedMonth(previousDate);

  let traffic = 'NA';
  let previousMonthTraffic = 'NA';
  let plan = 'NA';

  try {
    const trafficRes = await fetch(TRAFFIC_SHEET_URL);
    const trafficCsv = await trafficRes.text();
    const trafficRecords: string[][] = parse(trafficCsv, {
      skip_empty_lines: true,
    });

    const headerRow = trafficRecords[0];
    const monthIndex = headerRow.indexOf(currentMonth);
    const prevMonthIndex = headerRow.indexOf(previousMonth);

    if (monthIndex !== -1 || prevMonthIndex !== -1) {
      for (const row of trafficRecords) {
        if (row[1]?.replace(/\/$/, '') === normalizeUrl) {
          if (monthIndex !== -1) {
            traffic = row[monthIndex] || 'NA';
          }
          if (prevMonthIndex !== -1) {
            previousMonthTraffic = row[prevMonthIndex] || 'NA';
          }
          break;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching traffic data:', err);
  }

  try {
    const planRes = await fetch(PLAN_SHEET_URL);
    const planCsv = await planRes.text();
    const planRecords: string[][] = parse(planCsv, {
      skip_empty_lines: true,
    });

    planRecords.shift(); // remove header
    for (const row of planRecords) {
      if (row[0] === normalizedForPlan) {
        plan = row[1] || 'NA';
        break;
      }
    }
  } catch (err) {
    console.error('Error fetching plan data:', err);
  }

  return {
    traffic,
    previousMonthTraffic,
    plan,
  };
}
