import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

// Helper functions
async function getUrlContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    return '';
  }
}

async function checkIfUrlExists(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000, // 5 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.status < 400;
  } catch (error) {
    console.error('Error checking URL existence:', error);
    return false;
  }
}

async function getElementContentById(html: string, id: string): Promise<string | null> {
  try {
    if (!html || html.trim() === '') {
      return null;
    }
    
    const $ = cheerio.load(html);
    const element = $(`#${id}`);
    if (element.length > 0) {
      return element.attr('data-id') || null;
    }
    return null;
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    return null;
  }
}

export const getLeadData = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string') {
      res.json({
        leadAnlyticContent: null,
        analytics: null
      });
      return;
    }

    const finalUrl = url;
    const validUrl = await checkIfUrlExists(finalUrl);

    if (!validUrl) {
      res.json({
        leadAnlyticContent: null,
        analytics: null
      });
      return;
    }

    const htmlContent = await getUrlContent(finalUrl);
    const businessId = await getElementContentById(htmlContent, 'buisness-id');

    let leadData = null;
    
    // Only attempt API call if we have a business ID
    if (businessId) {
      try {
        const leadResponse = await axios.get('https://api.growth99.com/api/public/leads/dashboard/graph-data', {
          headers: {
            'x-tenantid': businessId,
          },
          timeout: 10000, // 10 second timeout
        });
        
        // Validate response structure
        if (leadResponse.data && typeof leadResponse.data === 'object') {
          leadData = leadResponse.data;
        }
      } catch (error) {
        console.error('Error fetching lead data from API:', error);
        leadData = null;
      }
    }

    // Process lead data if available and valid
    if (leadData && (!leadData.status || leadData.status !== 404)) {
      try {
        const {
          totalLeadCount = 0,
          currentMonthLeadCount = 0,
          lastMonthLeadCount = 0,
          currentWeekLeadCount = 0,
          lastWeekLeadCount = 0,
          todayLeadCount = 0,
          yesterdayLeadCount = 0,
          currentYearLeadCount = 0,
          lastYearLeadCount = 0,
        } = leadData;

        function calculateTrend(current: number, previous: number): number {
          try {
            // Ensure inputs are numbers
            const currentNum = Number(current) || 0;
            const previousNum = Number(previous) || 0;
            
            if (previousNum === 0) return currentNum === 0 ? 0 : 100;
            return ((currentNum - previousNum) / previousNum) * 100;
          } catch (error) {
            console.error('Error calculating trend:', error);
            return 0;
          }
        }

        const analytics = [
          {
            value: Number(totalLeadCount) || 0,
            label: 'Total Leads',
            trend: calculateTrend(
              (Number(currentYearLeadCount) || 0) + (Number(lastYearLeadCount) || 0),
              (Number(lastYearLeadCount) || 0) * 2
            ),
            comparison: 'Last 12 months vs previous 12 months',
          },
          {
            value: Number(currentMonthLeadCount) || 0,
            label: 'Leads in last 30 days',
            trend: calculateTrend(currentMonthLeadCount, lastMonthLeadCount),
            comparison: 'Last 30 days vs previous 30 days',
          },
          {
            value: Number(currentWeekLeadCount) || 0,
            label: 'Leads in last 7 days',
            trend: calculateTrend(currentWeekLeadCount, lastWeekLeadCount),
            comparison: 'Last 7 days vs previous 7 days',
          },
          {
            value: Number(todayLeadCount) || 0,
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
      } catch (error) {
        console.error('Error processing lead analytics:', error);
        // Fall through to return empty data
      }
    }

    // Return empty data structure when no valid lead data is available
    res.json({
      leadAnlyticContent: null,
      analytics: null
    });
    return;

  } catch (err) {
    console.error('Unexpected error in getLeadData:', err);
    // Return empty data structure instead of error to user
    res.json({
      leadAnlyticContent: null,
      analytics: null
    });
    return;
  }
}