export function extractDesktopData(data) {
  if (!data.lighthouseResult) return null;

  const desktopAudits = data.lighthouseResult.audits;
  const desktopCategories = data.lighthouseResult.categories;

  const desktopData = {
    performance: {
      analytics: {
        'speed-index': desktopAudits['speed-index'],
        'total-blocking-time': desktopAudits['total-blocking-time'],
      },
      score: Math.ceil(desktopCategories.performance.score * 100),
      diagnostics: { passed: [], failed: [] },
      final_image: desktopAudits['final-screenshot']?.details?.data || ''
    },
    seo: {
      score: Math.ceil(desktopCategories.seo.score * 100),
      diagnostics: { passed: [], failed: [] }
    }
  };

  // Diagnostics (Performance)
  const diagnostics = desktopCategories.performance.auditRefs.filter(
    (ref) => ref.group === 'diagnostics'
  );

  let passedCount = 0;
  let failedCount = 0;

  for (const diag of diagnostics) {
    if (passedCount >= 2 && failedCount >= 2) break;

    const audit = desktopAudits[diag.id];
    if (audit) {
      const auditData = {
        title: audit.title,
        description: audit.description,
        displayValue: audit.displayValue || '',
        recommended_details: audit.details,
      };

      if (audit.score !== null && audit.score > 0.5) {
        if (passedCount < 2) {
          desktopData.performance.diagnostics.passed.push(auditData);
          passedCount++;
        }
      } else {
        if (failedCount < 2) {
          desktopData.performance.diagnostics.failed.push(auditData);
          failedCount++;
        }
      }
    }
  }

  // SEO Diagnostics
  for (const seo of desktopCategories.seo.auditRefs) {
    const audit = desktopAudits[seo.id];
    if (audit) {
      const auditData = {
        title: audit.title,
        description: audit.description || '',
        displayValue: audit.displayValue || '',
        recommended_details: audit.details || ''
      };

      if (audit.score !== null && audit.score > 0.5) {
        desktopData.seo.diagnostics.passed.push(auditData);
      } else {
        desktopData.seo.diagnostics.failed.push(auditData);
      }
    }
  }

  return desktopData;
}
