import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';



// Helper functions
async function getUrlContent(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

async function checkIfUrlExists(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url);
    return response.status < 400;
  } catch {
    return false;
  }
}

async function getElementContentById(html: string, id: string): Promise<string | null> {
  const $ = cheerio.load(html);
  const element = $(`#${id}`);
  if (element.length > 0) {
    return element.attr('data-id') || null;
  }
  return null;
}


export const getLeadData = async (req : Request, res : Response) => {

  const { url } = req.body;

  try {
    const finalUrl = url;
    const validUrl = await checkIfUrlExists(finalUrl);

    if (!validUrl) {
        res.json({ error: 'URL does not exist. Please enter a valid URL.' });
      return 
    }

    const htmlContent = await getUrlContent(finalUrl);
    const businessId = await getElementContentById(htmlContent, 'buisness-id');

    let leadData = null;
    try {
      const leadResponse = await axios.get('https://api.growth99.com/api/public/leads/dashboard/graph-data', {
        headers: {
          'x-tenantid': businessId || '',
        }
      });
      leadData = leadResponse.data;
    } catch (error) {
      leadData = null;
    }

   if (leadData && (!leadData.status || leadData.status !== 404)) {
  const {
    totalLeadCount,
    currentMonthLeadCount,
    lastMonthLeadCount,
    currentWeekLeadCount,
    lastWeekLeadCount,
    todayLeadCount,
    yesterdayLeadCount,
  } = leadData;

  function calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }

  const analytics = [
    {
      value: totalLeadCount,
      label: 'Total Leads',
      trend: calculateTrend(
        leadData.currentYearLeadCount + leadData.lastYearLeadCount,
        leadData.lastYearLeadCount * 2
      ),
      comparison: 'Last 12 months vs previous 12 months',
    },
    {
      value: currentMonthLeadCount,
      label: 'Leads in last 30 days',
      trend: calculateTrend(currentMonthLeadCount, lastMonthLeadCount),
      comparison: 'Last 30 days vs previous 30 days',
    },
    {
      value: currentWeekLeadCount,
      label: 'Leads in last 7 days',
      trend: calculateTrend(currentWeekLeadCount, lastWeekLeadCount),
      comparison: 'Last 7 days vs previous 7 days',
    },
    {
      value: todayLeadCount,
      label: 'Leads today',
      trend: calculateTrend(todayLeadCount, yesterdayLeadCount),
      comparison: 'Since yesterday',
    },
  ];

  res.json({
    leadAnlyticContent: null,
    analytics,
  });
  return;
}
 else {
        res.json({
          leadAnlyticContent: null,
          lead_content_html: null,
          analytics: null
        });
      return 
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    return 
  }
}

