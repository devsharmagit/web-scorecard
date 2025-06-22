import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { stopwords as stopwordsData } from '../stopwords'; 

async function getUrlContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    return '';
  }
}

function getTagContent($: cheerio.CheerioAPI, tag: string): string[] {
  try {
    return $(tag).map((_, el) => $(el).text().trim()).get().filter(text => text.length > 0);
  } catch (error) {
    console.error(`Error getting ${tag} content:`, error);
    return [];
  }
}

function getMetaTagContent($: cheerio.CheerioAPI, name: string): string[] {
  try {
    return $(`meta[name="${name}"]`).map((_, el) => $(el).attr('content') || '').get().filter(content => content.length > 0);
  } catch (error) {
    console.error(`Error getting meta tag ${name}:`, error);
    return [];
  }
}

function getCanonicalTag($: cheerio.CheerioAPI): string[] {
  try {
    return $('link[rel="canonical"]').map((_, el) => $(el).attr('href') || '').get().filter(href => href.length > 0);
  } catch (error) {
    console.error('Error getting canonical tag:', error);
    return [];
  }
}

function getOpenGraphMeta($: cheerio.CheerioAPI): string[] {
  try {
    return $('meta[property^="og:"]').map((_, el) => $(el).attr('content') || '').get().filter(content => content.length > 0);
  } catch (error) {
    console.error('Error getting OpenGraph meta:', error);
    return [];
  }
}

function getImagesMissingAlt($: cheerio.CheerioAPI): string[] {
  try {
    return $('img').filter((_, el) => !$(el).attr('alt') || $(el).attr('alt') === '').map((_, el) => $.html(el)).get();
  } catch (error) {
    console.error('Error checking images alt attributes:', error);
    return [];
  }
}

function getLinksInfo($: cheerio.CheerioAPI, baseUrl: string) {
  try {
    const base = new URL(baseUrl);
    let internal = 0;
    let external = 0;
    const seen = new Set();

    $('a[href]').each((_, el) => {
      try {
        const href = $(el).attr('href');
        const text = $(el).text().trim().toLowerCase();
        if (!href || seen.has(href + '|' + text)) return;
        seen.add(href + '|' + text);

        const linkUrl = new URL(href, base.href);
        if (linkUrl.hostname === base.hostname) internal++;
        else external++;
      } catch (linkError) {
        // Skip invalid URLs
      }
    });

    return { internal, external };
  } catch (error) {
    console.error('Error analyzing links:', error);
    return { internal: 0, external: 0 };
  }
}

function getCommonKeywordsFromDOM($: cheerio.CheerioAPI, topN = 10): Record<string, number> {
  try {
    const stopwords = new Set(stopwordsData);
    const freq: Record<string, number> = {};
    
    // Remove unwanted elements first
    $('script, style, noscript').remove();
    $('[class*="shortcode"], [class*="carousel"], [class*="grid"], [class*="dtcss"], [class*="portfolio"]').remove();
    $('[style*="display:none"], [aria-hidden="true"]').remove();
    
    // Process text nodes directly and count frequencies in one pass
    $('body *').contents().each((_, node) => {
      try {
        if (node.type === 'text') {
          const text = $(node).text().trim();
          if (text && !text.match(/^\s*\/\*\!/)) {
            const words = text.toLowerCase().split(/\s+/);
            words.forEach(word => {
              try {
                // Clean word: remove punctuation/numbers, keep only letters
                const cleanWord = word.replace(/[^\p{L}]/gu, '');
                if (cleanWord && cleanWord.length > 2 && !stopwords.has(cleanWord)) {
                  freq[cleanWord] = (freq[cleanWord] || 0) + 1;
                }
              } catch (wordError) {
                // Skip problematic words
              }
            });
          }
        }
      } catch (nodeError) {
        // Skip problematic nodes
      }
    });
    
    // Sort and return top N
    const sortedEntries = Object.entries(freq).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], undefined, { sensitivity: 'base' });
    });
    
    return Object.fromEntries(sortedEntries.slice(0, topN));
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return {};
  }
}

async function checkRobotsTxt(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    const robotsUrl = `${protocol}//${hostname}/robots.txt`;
    
    const res = await axios.get(robotsUrl, { timeout: 5000 });
    const content = res.data;
    
    if (content.includes('Disallow:')) {
      return { message: 'Your site has a robots.txt file which includes one or more Disallow: directives. Make sure that you only block parts you don\'t want to be indexed.', valid: 'true' };
    }
    return { message: 'No disallow directives found.', valid: 'true' };
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    return { message: 'robots.txt not found.', valid: 'false' };
  }
}

async function getFinalUrl(url: string): Promise<string> {
  try {
    const res = await axios.get(url, { 
      maxRedirects: 5, 
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (SEO-Checker)'
      }
    });
    return res.request.res.responseUrl || url;
  } catch (error) {
    console.error('Error getting final URL:', error);
    return url;
  }
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
    console.error('Error checking canonicalization:', error);
    return { message: 'Both www and non-www versions of your URL are not redirected to the same site.', valid: 'false' };
  }
}

function checkMetaDescription(description: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking meta description:', error);
    return {
      value: [],
      message: 'Error checking meta description.',
      valid: 'false'
    };
  }
}

function checkTitle(titles: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking title:', error);
    return {
      value: [],
      message: 'Error checking title.',
      valid: 'false'
    };
  }
}

function checkH1Tags(h1Tags: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking H1 tags:', error);
    return {
      value: [],
      message: 'Error checking H1 tags.',
      valid: 'false'
    };
  }
}

function checkH2Tags(h2Tags: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking H2 tags:', error);
    return {
      value: [],
      message: 'Error checking H2 tags.',
      valid: 'false'
    };
  }
}

function checkAltTags(missingAltImages: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking alt tags:', error);
    return {
      value: [],
      message: 'Error checking image alt attributes.',
      valid: 'false'
    };
  }
}

function checkKeywordMatch(keywords: Record<string, number>, title: string[], description: string[]): any {
  try {
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
  } catch (error) {
    console.error('Error checking keyword match:', error);
    return {
      value: [],
      message: 'Error checking keyword matches.',
      valid: 'false'
    };
  }
}

function checkLinks(links: { internal: number; external: number }): any {
  try {
    return {
      value: [`internal: ${links.internal}`, `external: ${links.external}`],
      message: 'Your page has a correct number of internal and external links.',
      valid: 'true'
    };
  } catch (error) {
    console.error('Error checking links:', error);
    return {
      value: ['internal: 0', 'external: 0'],
      message: 'Error analyzing links.',
      valid: 'false'
    };
  }
}

function generateSearchPreview(title: string[], description: string[], url: string): string {
  try {
    const titleText = title[0] || 'No Title';
    const descText = description[0] || 'No Description';
    
    return `<div class="serp-preview desktop-serp-preview"><div class="serp-title">${titleText}</div><div class="serp-url">${url}</div><div class="serp-description">${descText}</div></div>`;
  } catch (error) {
    console.error('Error generating search preview:', error);
    return `<div class="serp-preview desktop-serp-preview"><div class="serp-title">Error generating preview</div><div class="serp-url">${url}</div><div class="serp-description">Unable to generate preview</div></div>`;
  }
}

function checkNoIndex($: cheerio.CheerioAPI): any {
  try {
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    
    return {
      value: [robotsMeta || 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'],
      message: 'Your page contains the index meta tag or header.',
      valid: !robotsMeta.includes('noindex') ? 'true' : 'false'
    };
  } catch (error) {
    console.error('Error checking noindex:', error);
    return {
      value: ['follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'],
      message: 'Error checking index meta tag.',
      valid: 'false'
    };
  }
}

function checkSchema($: cheerio.CheerioAPI): any {
  try {
    const jsonLd = $('script[type="application/ld+json"]').length;
    
    return {
      value: [],
      message: jsonLd > 0 ? 'Schema.org data has been found on your homepage.' : 'No Schema.org data found.',
      valid: jsonLd > 0 ? 'true' : 'false'
    };
  } catch (error) {
    console.error('Error checking schema:', error);
    return {
      value: [],
      message: 'Error checking Schema.org data.',
      valid: 'false'
    };
  }
}

export async function getSeoData(url: string) {
  try {
    // Validate URL first
    new URL(url);
    
    const html = await getUrlContent(url);
    
    // If we couldn't fetch the HTML, return empty structure
    if (!html) {
      return {
        status: "error",
        advance_seo: {
          basic_seo: {
            common_keywords: {
              value: {},
              message: "Unable to fetch page content for keyword analysis.",
              valid: "false"
            },
            SEO_description: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            H1_contents: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            H2_contents: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            Image_ALT_Attributes: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            Keywords_in_Title_and_Description: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            Links_Ratio: {
              value: ['internal: 0', 'external: 0'],
              message: 'Unable to fetch page content.',
              valid: 'false'
            },
            SEO_Title: {
              value: [],
              message: 'Unable to fetch page content.',
              valid: 'false'
            }
          },
          advance_seo: {
            search_preview: {
              value: [`<div class="serp-preview desktop-serp-preview"><div class="serp-title">Unable to generate preview</div><div class="serp-url">${url}</div><div class="serp-description">Page content unavailable</div></div>`],
              message: "Unable to generate search preview:",
              valid: "false"
            },
            mobile_search_preview: {
              value: [`<div class="serp-preview desktop-serp-preview"><div class="serp-title">Unable to generate preview</div><div class="serp-url">${url}</div><div class="serp-description">Page content unavailable</div></div>`],
              message: "Unable to generate mobile search preview:",
              valid: "false"
            },
            mobile_scr_path: [],
            canonical_contents: {
              value: [],
              message: "Unable to check canonical link tag.",
              valid: "false"
            },
            noindex_description: {
              value: ['follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'],
              message: 'Unable to check index meta tag.',
              valid: 'false'
            },
            checkcanonicalization: {
              value: [],
              message: 'Unable to check canonicalization.',
              valid: 'false'
            },
            og_contents: {
              value: [],
              message: "Unable to check Opengraph meta tags.",
              valid: "false"
            },
            robot_text_analytics: {
              value: [],
              message: 'Unable to check robots.txt.',
              valid: 'false'
            },
            checkschemameta: {
              value: [],
              message: 'Unable to check Schema.org data.',
              valid: 'false'
            }
          }
        }
      };
    }

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
    
    // Handle async operations with proper error handling
    const [robots, canonicalization] = await Promise.allSettled([
      checkRobotsTxt(url),
      checkCanonicalization(url)
    ]);

    const robotsResult = robots.status === 'fulfilled' ? robots.value : { message: 'Error checking robots.txt.', valid: 'false' };
    const canonicalizationResult = canonicalization.status === 'fulfilled' ? canonicalization.value : { message: 'Error checking canonicalization.', valid: 'false' };

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
            message: canonicalizationResult.message,
            valid: canonicalizationResult.valid
          },
          og_contents: {
            value: og,
            message: og.length > 0 ? "Opengraph meta tags have been found." : "No Opengraph meta tags found.",
            valid: og.length > 0 ? "true" : "false"
          },
          robot_text_analytics: {
            value: [],
            message: robotsResult.message,
            valid: robotsResult.valid
          },
          checkschemameta: checkSchema($)
        }
      }
    };
  } catch (error) {
    console.error('Critical error in getSeoData:', error);
    
    // Return a complete error structure that matches the expected format
    return {
      status: "error",
      advance_seo: {
        basic_seo: {
          common_keywords: {
            value: {},
            message: "Error occurred during SEO analysis.",
            valid: "false"
          },
          SEO_description: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          H1_contents: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          H2_contents: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          Image_ALT_Attributes: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          Keywords_in_Title_and_Description: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          Links_Ratio: {
            value: ['internal: 0', 'external: 0'],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          },
          SEO_Title: {
            value: [],
            message: 'Error occurred during SEO analysis.',
            valid: 'false'
          }
        },
        advance_seo: {
          search_preview: {
            value: ['<div class="serp-preview desktop-serp-preview"><div class="serp-title">Error</div><div class="serp-url">N/A</div><div class="serp-description">Unable to generate preview</div></div>'],
            message: "Error generating search preview.",
            valid: "false"
          },
          mobile_search_preview: {
            value: ['<div class="serp-preview desktop-serp-preview"><div class="serp-title">Error</div><div class="serp-url">N/A</div><div class="serp-description">Unable to generate preview</div></div>'],
            message: "Error generating mobile search preview.",
            valid: "false"
          },
          mobile_scr_path: [],
          canonical_contents: {
            value: [],
            message: "Error checking canonical link tag.",
            valid: "false"
          },
          noindex_description: {
            value: ['follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'],
            message: 'Error checking index meta tag.',
            valid: 'false'
          },
          checkcanonicalization: {
            value: [],
            message: 'Error checking canonicalization.',
            valid: 'false'
          },
          og_contents: {
            value: [],
            message: "Error checking Opengraph meta tags.",
            valid: "false"
          },
          robot_text_analytics: {
            value: [],
            message: 'Error checking robots.txt.',
            valid: 'false'
          },
          checkschemameta: {
            value: [],
            message: 'Error checking Schema.org data.',
            valid: 'false'
          }
        }
      }
    };
  }
}

// Example
// getSeoData('https://example.com').then(console.log);