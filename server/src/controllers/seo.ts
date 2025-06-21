import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { stopwords as stopwordsData } from '../stopwords'; 

async function getUrlContent(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

function getTagContent($: cheerio.CheerioAPI, tag: string): string[] {
  return $(tag).map((_, el) => $(el).text().trim()).get();
}

function getMetaTagContent($: cheerio.CheerioAPI, name: string): string[] {
  return $(`meta[name="${name}"]`).map((_, el) => $(el).attr('content') || '').get();
}

function getCanonicalTag($: cheerio.CheerioAPI): string[] {
  return $('link[rel="canonical"]').map((_, el) => $(el).attr('href') || '').get();
}

function getOpenGraphMeta($: cheerio.CheerioAPI): string[] {
  return $('meta[property^="og:"]').map((_, el) => $(el).attr('content') || '').get();
}

function getImagesMissingAlt($: cheerio.CheerioAPI): string[] {
  return $('img').filter((_, el) => !$(el).attr('alt') || $(el).attr('alt') === '').map((_, el) => $.html(el)).get();
}

function getLinksInfo($: cheerio.CheerioAPI, baseUrl: string) {
  const base = new URL(baseUrl);
  let internal = 0;
  let external = 0;
  const seen = new Set();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim().toLowerCase();
    if (!href || seen.has(href + '|' + text)) return;
    seen.add(href + '|' + text);

    try {
      const linkUrl = new URL(href, base.href);
      if (linkUrl.hostname === base.hostname) internal++;
      else external++;
    } catch (_) {}
  });

  return { internal, external };
}

function getCommonKeywordsFromDOM($: cheerio.CheerioAPI, topN = 10): Record<string, number> {
  const stopwords = new Set(stopwordsData);
  const freq: Record<string, number> = {};
  
  // Remove unwanted elements first
  $('script, style, noscript').remove();
  $('[class*="shortcode"], [class*="carousel"], [class*="grid"], [class*="dtcss"], [class*="portfolio"]').remove();
  $('[style*="display:none"], [aria-hidden="true"]').remove();
  
  // Process text nodes directly and count frequencies in one pass
  $('body *').contents().each((_, node) => {
    if (node.type === 'text') {
      const text = $(node).text().trim();
      if (text && !text.match(/^\s*\/\*\!/)) {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          // Clean word: remove punctuation/numbers, keep only letters
          const cleanWord = word.replace(/[^\p{L}]/gu, '');
          if (cleanWord && !stopwords.has(cleanWord)) {
            freq[cleanWord] = (freq[cleanWord] || 0) + 1;
          }
        });
      }
    }
  });
  
  // Sort and return top N
  const sortedEntries = Object.entries(freq).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0], undefined, { sensitivity: 'base' });
  });
  
  return Object.fromEntries(sortedEntries.slice(0, topN));
}

async function checkRobotsTxt(url: string) {
  const { protocol, hostname } = new URL(url);
  const robotsUrl = `${protocol}//${hostname}/robots.txt`;
  try {
    const res = await axios.get(robotsUrl);
    const content = res.data;
    if (content.includes('Disallow:')) {
      return { message: 'Your site has a robots.txt file which includes one or more Disallow: directives. Make sure that you only block parts you don\'t want to be indexed.', valid: 'true' };
    }
    return { message: 'No disallow directives found.', valid: 'true' };
  } catch {
    return { message: 'robots.txt not found.', valid: 'false' };
  }
}

async function getFinalUrl(url: string): Promise<string> {
  const res = await axios.get(url, { maxRedirects: 5 });
  return res.request.res.responseUrl || url;
}

async function checkCanonicalization(url: string) {
  try {
    const parsed = new URL(url);
    const wwwUrl = `${parsed.protocol}//www.${parsed.hostname}${parsed.pathname}`;
    const nonWwwUrl = `${parsed.protocol}//${parsed.hostname.replace(/^www\./, '')}${parsed.pathname}`;
  
    const [finalWww, finalNonWww] = await Promise.all([
      getFinalUrl(wwwUrl),
      getFinalUrl(nonWwwUrl)
    ]);
  
    if (finalWww === finalNonWww) {
      return { message: 'WWW and non-WWW redirect to the same site.', valid: 'true' };
    }
    return { message: 'Both www and non-www versions of your URL are not redirected to the same site.', valid: 'false' };
  } catch (error) {
    return { message: 'Both www and non-www versions of your URL are not redirected to the same site.', valid: 'false' };
  }
}

function checkMetaDescription(description: string[]): any {
  if (description.length === 0) {
    return {
      value: [],
      message: 'No meta description found.',
      valid: 'false'
    };
  }
  
  const desc = description[0];
  const length = desc.length;
  
  return {
    value: [],
    message: `Meta description was found and it is ${length} characters long. ${desc}`,
    valid: length >= 120 && length <= 160 ? 'true' : 'false'
  };
}

function checkTitle(titles: string[]): any {
  if (titles.length === 0) {
    return {
      value: [],
      message: 'No title found.',
      valid: 'false'
    };
  }
  
  const title = titles[0];
  const length = title.length;
  
  return {
    value: [title],
    message: `The title of your page has ${length} characters long.`,
    valid: length >= 30 && length <= 60 ? 'true' : 'false'
  };
}

function checkH1Tags(h1Tags: string[]): any {
  if (h1Tags.length === 0) {
    return {
      value: [],
      message: 'No H1 tag was found on your page.',
      valid: 'false'
    };
  } else if (h1Tags.length === 1) {
    return {
      value: h1Tags,
      message: 'One H1 tag was found on your page.',
      valid: 'true'
    };
  } else {
    return {
      value: h1Tags,
      message: `Multiple H1 tags (${h1Tags.length}) were found on your page.`,
      valid: 'false'
    };
  }
}

function checkH2Tags(h2Tags: string[]): any {
  if (h2Tags.length === 0) {
    return {
      value: [],
      message: 'No H2 tags were found on your page.',
      valid: 'false'
    };
  } else if (h2Tags.length > 20) {
    return {
      value: h2Tags.slice(0, 5), // Show only first 5
      message: 'More than 20 H2 tags were found on your page.',
      valid: 'false'
    };
  } else {
    return {
      value: h2Tags,
      message: `${h2Tags.length} H2 tags were found on your page.`,
      valid: 'true'
    };
  }
}

function checkAltTags(missingAltImages: string[]): any {
  if (missingAltImages.length === 0) {
    return {
      value: [],
      message: 'All images have alt attributes.',
      valid: 'true'
    };
  } else {
    return {
      value: missingAltImages.slice(0, 5), // Show only first 5
      message: `Some images on your homepage have no alt attribute. (${missingAltImages.length}).`,
      valid: 'false'
    };
  }
}

function checkKeywordMatch(keywords: Record<string, number>, title: string[], description: string[]): any {
  const topKeywords = Object.keys(keywords).slice(0, 5);
  const titleText = title.join(' ').toLowerCase();
  const descText = description.join(' ').toLowerCase();
  
  const titleMatches = topKeywords.filter(keyword => titleText.includes(keyword));
  const descMatches = topKeywords.filter(keyword => descText.includes(keyword));
  
  const matches = [];
  if (titleMatches.length > 0) {
    matches.push(`title: ${titleMatches.join(', ')}`);
  }
  if (descMatches.length > 0) {
    matches.push(`description: ${descMatches.join(', ')}`);
  }
  
  return {
    value: matches,
    message: matches.length > 0 ? 'One or more common keywords were found in the title and description of your page.' : 'No common keywords found in title and description.',
    valid: matches.length > 0 ? 'true' : 'false'
  };
}

function checkLinks(links: { internal: number; external: number }): any {
  return {
    value: [`internal: ${links.internal}`, `external: ${links.external}`],
    message: 'Your page has a correct number of internal and external links.',
    valid: 'true'
  };
}

function generateSearchPreview(title: string[], description: string[], url: string): string {
  const titleText = title[0] || '';
  const descText = description[0] || '';
  
  return `<div class="serp-preview desktop-serp-preview"><div class="serp-title">${titleText}</div><div class="serp-url">${url}</div><div class="serp-description">${descText}</div></div>`;
}

function checkNoIndex($: cheerio.CheerioAPI): any {
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  
  return {
    value: [robotsMeta || 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'],
    message: 'Your page contains the index meta tag or header.',
    valid: !robotsMeta.includes('noindex') ? 'true' : 'false'
  };
}

function checkSchema($: cheerio.CheerioAPI): any {
  const jsonLd = $('script[type="application/ld+json"]').length;
  
  
  return {
    value: [],
    message: jsonLd > 0 ? 'Schema.org data has been found on your homepage.' : 'No Schema.org data found.',
    valid: jsonLd > 0 ? 'true' : 'false'
  };
}

export async function getSeoData(url: string) {
  const html = await getUrlContent(url);
  const $ = cheerio.load(html);

  const s_title = getTagContent($, 'title');
  const s_description = getMetaTagContent($, 'description');
  const h1 = getTagContent($, 'h1');
  const h2 = getTagContent($, 'h2');
  const alt = getImagesMissingAlt($);
  const links = getLinksInfo($, url);
  const keywords = getCommonKeywordsFromDOM($);
  const canonical = getCanonicalTag($);
  const og = getOpenGraphMeta($);
  const robots = await checkRobotsTxt(url);
  const canonicalization = await checkCanonicalization(url);

  return {
    status: "success",
    advance_seo: {
      basic_seo: {
        common_keywords: {
          value: keywords,
          message: "Here are the most common keywords we found on your page:",
          valid: "undecisive"
        },
        SEO_description: checkMetaDescription(s_description),
        H1_contents: checkH1Tags(h1),
        H2_contents: checkH2Tags(h2),
        Image_ALT_Attributes: checkAltTags(alt),
        Keywords_in_Title_and_Description: checkKeywordMatch(keywords, s_title, s_description),
        Links_Ratio: checkLinks(links),
        SEO_Title: checkTitle(s_title)
      },
      advance_seo: {
        search_preview: {
          value: [generateSearchPreview(s_title, s_description, url)],
          message: "Here is how your site may appear in search results:",
          valid: "undecisive"
        },
        mobile_search_preview: {
          value: [generateSearchPreview(s_title, s_description, url)],
          message: "Here is how your site may appear in search results:",
          valid: "undecisive"
        },
        mobile_scr_path: [],
        canonical_contents: {
          value: canonical,
          message: canonical.length > 0 ? "Your page is using the canonical link tag." : "No canonical link tag found.",
          valid: canonical.length > 0 ? "true" : "false"
        },
        noindex_description: checkNoIndex($),
        checkcanonicalization: {
          value: [],
          message: canonicalization.message,
          valid: canonicalization.valid
        },
        og_contents: {
          value: og,
          message: og.length > 0 ? "Opengraph meta tags have been found." : "No Opengraph meta tags found.",
          valid: og.length > 0 ? "true" : "false"
        },
        robot_text_analytics: {
          value: [],
          message: robots.message,
          valid: robots.valid
        },
        checkschemameta: checkSchema($)
      }
    }
  };
}

// Example
// getSeoData('https://example.com').then(console.log);