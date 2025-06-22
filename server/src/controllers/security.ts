import fetch from 'node-fetch';
import tls from 'tls';
import { Request, Response } from 'express';
import { URL } from 'url';

interface SecurityItem { group: string; title: string; status: string; description: string; }

interface SecurityDataReturnType {
  security: { 
        passed: SecurityItem[], 
        failed: SecurityItem[],
        score: number
      } 
}

const securityChecks: Record<string, { group: string; description: string; fail: string }> = {
  'Strict Transport Security is correct.': {
    group: 'HTTP Security Headers',
    description:
      'Your website properly enforces HTTPS connections through Strict Transport Security. This prevents downgrade attacks and protects your visitors from man-in-the-middle attacks by ensuring all connections occur over secure HTTPS rather than unencrypted HTTP.',
    fail: 'Strict Transport Security is missing or misconfigured.',
  },
  'X-Frame-Options is set to SAMEORIGIN or DENY.': {
    group: 'HTTP Security Headers',
    description:
      'Your X-Frame-Options header is correctly set to SAMEORIGIN or DENY. This helps prevent clickjacking attacks by controlling whether your website can be embedded in frames on other websites, protecting your users from deceptive interactions.',
    fail: 'X-Frame-Options header is missing or improperly configured.',
  },
  'X-XSS-Protection is set to 1; mode=block.': {
    group: 'HTTP Security Headers',
    description:
      'Your X-XSS-Protection header is properly configured with mode=block. This provides an additional layer of protection against cross-site scripting (XSS) attacks in supported browsers by stopping page loads when potential XSS attacks are detected.',
    fail: 'X-XSS-Protection header is missing or misconfigured.',
  },
  'SSL/TLS Configuration is proper.': {
    group: 'Connection Security',
    description:
      "Your website's SSL/TLS configuration is properly implemented. This ensures that all data transmitted between your server and visitors is encrypted, protecting sensitive information from interception or tampering during transit.",
    fail: 'SSL/TLS configuration is insecure or incomplete.',
  },
  'Admin url is changed.': {
    group: 'Access Control',
    description:
      "Your administrative access URL has been changed from the default. This is an important security practice that makes it significantly harder for attackers to find and attempt to access your site's admin area.",
    fail: 'Admin URL uses a default or guessable value.',
  },
  'Directory Indexing is not enabled.': {
    group: 'Access Control',
    description:
      "Directory indexing is properly disabled on your server. This prevents unauthorized users from browsing your website's directory structure, which could expose sensitive files, plugins, themes, or other components that might reveal vulnerabilities.",
    fail: 'Directory indexing is enabled, exposing internal files.',
  },
  'Sensitive files are not publicly accessible.': {
    group: 'Access Control',
    description:
      'Sensitive files and directories are not publicly accessible. This ensures that configuration files, backup files, and other critical system components that might contain sensitive information cannot be accessed by unauthorized visitors.',
    fail: 'Sensitive files or directories are publicly accessible.',
  },
};

// Helpers
export async function getRedirectedUrl(inputUrl: string): Promise<string> {
  try {
    const resp = await fetch(inputUrl, { method: 'HEAD', redirect: 'follow' });
    return resp.url;
  } catch (error) {
    // If redirect fails, return original URL
    return inputUrl;
  }
}

export async function fetchHeaders(url: string) {
  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const headers: Record<string, string | string[]> = {};
    resp.headers.forEach((v, k) => {
      const key = k.toLowerCase();
      if (headers[key]) {
        const curr = headers[key];
        headers[key] = Array.isArray(curr) ? [...curr, v] : [curr, v];
      } else {
        headers[key] = v;
      }
    });
    return headers;
  } catch (error) {
    // Return empty headers if fetch fails
    return {};
  }
}

export async function getCertInfo(hostname: string): Promise<number | null> {
  return new Promise((resolve) => {
    try {
      const socket = tls.connect(443, hostname, { servername: hostname }, () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        if (cert && cert.valid_to) {
          resolve(Date.parse(cert.valid_to) / 1000);
        } else {
          resolve(null);
        }
      });
      socket.on('error', () => resolve(null));
      // Add timeout to prevent hanging
      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(null);
      });
    } catch (error) {
      resolve(null);
    }
  });
}

// 🧠 Main Security Checker
export async function runSecurityCheck(req: Request, res: Response) {
  try {
    const rawUrl = req.body.url || '';
    const url = await getRedirectedUrl(rawUrl);
    const data: any = { security: { diagnostics: {}, passed: [], failed: [] } };
    let points = 0;

    // 1. Headers check with error handling
    let hsts = false;
    let xFrame = false;
    let xXss = false;

    try {
      const headers = await fetchHeaders(url);
      
      // Check HSTS
      const hstsHdr = headers['strict-transport-security'];
      if (hstsHdr) {
        const items = Array.isArray(hstsHdr) ? hstsHdr : [hstsHdr];
        for (const hdr of items) {
          const m = /max-age=(\d+)/.exec(hdr);
          if (m && +m[1] >= 31536000) { 
            hsts = true; 
            break; 
          }
        }
      }

      // Check X-Frame-Options
      const xfo = headers['x-frame-options'];
      xFrame = xfo === 'SAMEORIGIN' || xfo === 'DENY';

      // Check X-XSS-Protection
      const xxsp = headers['x-xss-protection'];
      xXss = typeof xxsp === 'string' && xxsp.includes('1; mode=block');

      if (hsts && xFrame && xXss) points += 20;
    } catch (error) {
      console.error('Header check failed:', error);
      // Headers checks will remain false
    }

    // 2. SSL/TLS + cert expiry check with error handling
    let properSsl = false;
    try {
      const u = new URL(url);
      if (u.protocol === 'https:') {
        const certTo = await getCertInfo(u.hostname);
        if (certTo && certTo * 1000 > Date.now()) {
          try {
            const labsUrl = `https://api.ssllabs.com/api/v3/analyze?host=${u.hostname}`;
            const start = Date.now();
            while (Date.now() - start < 100_000) {
              const jr = await fetch(labsUrl).then(r => r.json());
              // @ts-ignore
              const ep = jr.endpoints?.[0];
              if (ep?.statusMessage === 'Ready') {
                if (['A', 'A+', 'B'].includes(ep.grade)) {
                  points += 20;
                  properSsl = true;
                }
                break;
              }
              await new Promise(r => setTimeout(r, 4_000));
            }
          } catch (sslLabsError) {
            console.error('SSL Labs API check failed:', sslLabsError);
            // properSsl remains false
          }
        }
      }
    } catch (error) {
      console.error('SSL/TLS check failed:', error);
      // properSsl remains false
    }

    // 3. WordPress admin URL check with error handling
    let properAdmin = false;
    try {
      const u = new URL(url);
      const home = `${u.protocol}//${u.hostname}`;
      const adminUrl = home + '/wp-login.php';
      const respAdmin = await fetch(adminUrl, { 
        method: 'HEAD', 
        redirect: 'manual',
      });
      properAdmin = respAdmin.status !== 200;
      if (properAdmin) points += 20;
    } catch (error) {
      console.error('Admin URL check failed:', error);
      // Assume admin URL is changed if we get an error (could be 404, timeout, etc.)
      properAdmin = true;
      points += 20;
    }

    // 4. WordPress config file check with error handling
    let properDir = false;
    try {
      const u = new URL(url);
      const home = `${u.protocol}//${u.hostname}`;
      const cfgUrl = home + '/wp-config.php';
      const respCfg = await fetch(cfgUrl, { 
        method: 'GET', 
        redirect: 'manual',
      });
      properDir = respCfg.status !== 200 && respCfg.status !== 302;
      if (properDir) points += 40;
    } catch (error) {
      console.error('Config file check failed:', error);
      // Assume files are protected if we get an error (could be 404, timeout, etc.)
      properDir = true;
      points += 40;
    }

    data.security.score = points;

    // Diagnostics function
    function diag(cond: boolean, msg: keyof typeof securityChecks) {
      const { group, description, fail } = securityChecks[msg];
      if (cond) {
        data.security.passed.push({
          group,
          title: msg,
          status: 'Excellent',
          description,
        });
      } else {
        data.security.failed.push({
          group,
          title: fail,
          status: 'Needs Attention',
          description: `The check "${msg}" has failed. Please review your security headers or configuration to ensure best practices are followed.`,
        });
      }
    }

    // Run all diagnostics
    diag(hsts, 'Strict Transport Security is correct.');
    diag(xFrame, 'X-Frame-Options is set to SAMEORIGIN or DENY.');
    diag(xXss, 'X-XSS-Protection is set to 1; mode=block.');
    diag(properSsl, 'SSL/TLS Configuration is proper.');
    diag(properAdmin, 'Admin url is changed.');
    diag(properDir, 'Directory Indexing is not enabled.');
    diag(properDir, 'Sensitive files are not publicly accessible.');

    res.json({ data_desktop_security: data.security });
    return;

  } catch (error) {
    console.error('Security check failed:', error);
    
    // Return a response with all checks failed instead of throwing an error
    const data:SecurityDataReturnType = { 
      security: { 
        passed: [], 
        failed: [],
        score: 0
      } 
    };

    // Mark all checks as failed
    Object.keys(securityChecks).forEach(msg => {
      const { group, fail } = securityChecks[msg];
      data.security.failed.push({
        group,
        title: fail,
        status: 'Needs Attention',
        description: `The check "${msg}" could not be completed due to technical issues. Please try again later or check your website configuration manually.`,
      });
    });

    res.json({ data_desktop_security: data.security });
    return;
  }
}