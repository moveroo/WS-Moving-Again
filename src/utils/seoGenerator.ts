/**
 * SEO Title and Description Generator
 *
 * Generates SEO-optimized titles and descriptions based on content analysis
 * and SEO best practices.
 */

const SITE_NAME = 'Moving Again';
const SITE_NAME_SUFFIX = ` | ${SITE_NAME}`;
const SITE_NAME_SUFFIX_LENGTH = SITE_NAME_SUFFIX.length; // 18 chars

// SEO Constraints
const TITLE_MAX_LENGTH = 60; // Google truncates at ~60 chars
const TITLE_MIN_LENGTH = 50; // Minimum for good SEO
const TITLE_WITHOUT_SUFFIX_MAX = TITLE_MAX_LENGTH - SITE_NAME_SUFFIX_LENGTH; // 42 chars

const DESC_TARGET_LENGTH = 155; // Sweet spot for search results
const DESC_MIN_LENGTH = 120;
const DESC_MAX_LENGTH = 160;

/**
 * Generate SEO-optimized title
 * Ensures final title (with suffix) is 50-60 characters
 */
export function generateSEOTitle(
  baseTitle: string,
  options: {
    includeSuffix?: boolean;
    keywords?: string[];
    location?: string;
  } = {}
): string {
  const { includeSuffix = true, keywords = [] } = options;

  // Remove existing suffix if present
  let cleanTitle = baseTitle.replace(/\s*\|\s*Moving Again\s*$/, '').trim();

  // If title already includes " | ", it might have multiple parts
  // Keep the most important part (usually first)
  if (cleanTitle.includes(' | ')) {
    const parts = cleanTitle.split(' | ');
    // Keep first part (main title) and maybe second if short enough
    cleanTitle = parts[0];
    if (parts[1] && cleanTitle.length + parts[1].length + 3 < TITLE_WITHOUT_SUFFIX_MAX) {
      cleanTitle = `${cleanTitle} | ${parts[1]}`;
    }
  }

  // Add keywords if provided and space allows
  if (keywords.length > 0 && cleanTitle.length < TITLE_WITHOUT_SUFFIX_MAX - 10) {
    const keyword = keywords[0];
    if (!cleanTitle.toLowerCase().includes(keyword.toLowerCase())) {
      const withKeyword = `${cleanTitle} ${keyword}`;
      if (withKeyword.length <= TITLE_WITHOUT_SUFFIX_MAX) {
        cleanTitle = withKeyword;
      }
    }
  }

  // Truncate if too long (before adding suffix)
  if (cleanTitle.length > TITLE_WITHOUT_SUFFIX_MAX) {
    cleanTitle = cleanTitle.substring(0, TITLE_WITHOUT_SUFFIX_MAX - 3) + '...';
  }

  // Ensure minimum length
  // Note: We don't add location/state abbreviations here to avoid confusion
  // (e.g., "Sydney to Melbourne NSW" would be wrong - Melbourne is in VIC)
  // If title is too short, it's better to keep it short than add incorrect info
  if (cleanTitle.length < TITLE_MIN_LENGTH - SITE_NAME_SUFFIX_LENGTH) {
    // Only add location if it's explicitly provided and makes sense
    // For route pages, we skip this to avoid state confusion
    // For city hub pages, location (state) can be added separately
  }

  // Add suffix
  if (includeSuffix) {
    const finalTitle = cleanTitle + SITE_NAME_SUFFIX;
    // Final check - if still too long, truncate more aggressively
    if (finalTitle.length > TITLE_MAX_LENGTH) {
      const maxBase = TITLE_MAX_LENGTH - SITE_NAME_SUFFIX_LENGTH - 3;
      return cleanTitle.substring(0, maxBase) + '...' + SITE_NAME_SUFFIX;
    }
    return finalTitle;
  }

  return cleanTitle;
}

/**
 * Generate attention-grabbing, SEO-optimized description
 * Targets 150-160 characters for optimal search result display
 */
export function generateSEODescription(
  content: {
    route?: string;
    origin?: string;
    destination?: string;
    service?: string;
    benefits?: string[];
    savings?: string;
    transitTime?: string;
    keyFeatures?: string[];
  },
  options: {
    tone?: 'professional' | 'friendly' | 'urgent';
    includeCTA?: boolean;
  } = {}
): string {
  const { includeCTA = true } = options;

  // Build description components
  const parts: string[] = [];

  // Opening hook (attention-grabbing, question format works well)
  if (content.route && content.origin && content.destination) {
    // Route-specific: "Moving from X to Y?"
    parts.push(`Moving from ${content.origin} to ${content.destination}?`);
  } else if (content.service) {
    parts.push(`${content.service} services`);
  }

  // Value proposition (savings/benefits) - make it compelling
  if (content.savings) {
    parts.push(`Save ${content.savings} with backloading`);
  } else if (content.benefits && content.benefits.length > 0) {
    parts.push(content.benefits[0]);
  }

  // Key features (transit time, insurance, etc.) - concise
  const features: string[] = [];
  if (content.transitTime) {
    features.push(`${content.transitTime} transit`);
  }
  if (content.keyFeatures) {
    // Prioritize insurance and door-to-door
    const priorityFeatures = content.keyFeatures.filter(
      (f) => f.includes('insurance') || f.includes('door')
    );
    features.push(
      ...(priorityFeatures.length > 0
        ? priorityFeatures.slice(0, 1)
        : content.keyFeatures.slice(0, 1))
    );
  }

  if (features.length > 0) {
    parts.push(features.join(', '));
  }

  // Add professional assurance
  if (content.route) {
    parts.push('Professional interstate removals');
  }

  // CTA (if space allows)
  if (includeCTA) {
    parts.push('Get your free quote today');
  }

  // Combine into description
  let description = parts
    .join('. ')
    .replace(/\.\s*\./g, '.')
    .replace(/\?\s*\./g, '?'); // Clean up double periods and question mark periods

  // Optimize length to target
  if (description.length > DESC_MAX_LENGTH) {
    // Remove less important parts first
    if (description.length > DESC_MAX_LENGTH && includeCTA) {
      description = description.replace(/\s*Get your free quote today\.?\s*/i, '');
    }
    if (description.length > DESC_MAX_LENGTH) {
      // Truncate at word boundary
      const truncated = description.substring(0, DESC_MAX_LENGTH - 3);
      const lastSpace = truncated.lastIndexOf(' ');
      const lastPeriod = truncated.lastIndexOf('.');
      const cutPoint = lastPeriod > lastSpace - 10 ? lastPeriod + 1 : lastSpace;
      description = truncated.substring(0, cutPoint).trim() + '...';
    }
  } else if (description.length < DESC_TARGET_LENGTH) {
    // Expand to target length if too short
    const remaining = DESC_TARGET_LENGTH - description.length;

    if (remaining > 20 && !description.includes('insurance')) {
      description += '. Transit insurance included';
    }
    if (remaining > 40 && !description.includes('professional')) {
      description += '. Professional handling';
    }
    if (remaining > 15 && description.length < DESC_TARGET_LENGTH) {
      description += '. Free quotes';
    }
  }

  // Final length check and trim
  if (description.length > DESC_MAX_LENGTH) {
    const truncated = description.substring(0, DESC_MAX_LENGTH - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    description = truncated.substring(0, lastSpace).trim() + '...';
  }

  // Ensure minimum length
  if (description.length < DESC_MIN_LENGTH) {
    if (content.route) {
      description += '. Professional interstate removals service';
    } else {
      description += '. Get your free quote today';
    }
  }

  return description.trim();
}

/**
 * Generate title and description for a route page
 */
export function generateRouteSEO(route: {
  origin: string;
  destination: string;
  originState?: string;
  destinationState?: string;
  transitDays?: string;
  title?: string;
}): {
  title: string;
  description: string;
  titleLength: number;
  descriptionLength: number;
} {
  // Generate title
  // For route pages, don't add state abbreviations - the route itself is clear
  // e.g., "Backloading Sydney to Melbourne" not "Backloading Sydney to Melbourne NSW"
  const baseTitle = route.title || `Backloading ${route.origin} to ${route.destination}`;
  const title = generateSEOTitle(baseTitle, {
    includeSuffix: true,
    keywords: [], // Don't add extra keywords for routes - keep it simple
    location: undefined, // Don't add state abbreviations to route titles
  });

  // Generate description
  const description = generateSEODescription(
    {
      route: `${route.origin} to ${route.destination}`,
      origin: route.origin,
      destination: route.destination,
      service: 'Interstate backloading',
      savings: 'up to 60%',
      transitTime: route.transitDays || '3-7 business days',
      keyFeatures: ['transit insurance included', 'door-to-door service', 'professional handling'],
    },
    {
      tone: 'professional',
      includeCTA: true,
    }
  );

  return {
    title,
    description,
    titleLength: title.length,
    descriptionLength: description.length,
  };
}

/**
 * Analyze existing title/description and suggest improvements
 */
export function analyzeSEO(
  currentTitle: string,
  currentDescription: string
): {
  title: {
    current: string;
    currentLength: number;
    optimized: string;
    optimizedLength: number;
    issues: string[];
    recommendations: string[];
  };
  description: {
    current: string;
    currentLength: number;
    optimized: string;
    optimizedLength: number;
    issues: string[];
    recommendations: string[];
  };
} {
  const titleIssues: string[] = [];
  const titleRecommendations: string[] = [];
  const descIssues: string[] = [];
  const descRecommendations: string[] = [];

  // Analyze title
  const titleWithSuffix = currentTitle.includes(SITE_NAME)
    ? currentTitle
    : currentTitle + SITE_NAME_SUFFIX;
  const titleLength = titleWithSuffix.length;

  if (titleLength > TITLE_MAX_LENGTH) {
    titleIssues.push(`Too long (${titleLength} chars, max: ${TITLE_MAX_LENGTH})`);
    titleRecommendations.push('Truncate before adding suffix');
  } else if (titleLength < TITLE_MIN_LENGTH) {
    titleIssues.push(`Too short (${titleLength} chars, min: ${TITLE_MIN_LENGTH})`);
    titleRecommendations.push('Add more descriptive keywords');
  }

  // Analyze description
  const descLength = currentDescription.length;

  if (descLength > DESC_MAX_LENGTH) {
    descIssues.push(`Too long (${descLength} chars, max: ${DESC_MAX_LENGTH})`);
    descRecommendations.push('Truncate to 160 chars for optimal display');
  } else if (descLength < DESC_MIN_LENGTH) {
    descIssues.push(`Too short (${descLength} chars, min: ${DESC_MIN_LENGTH})`);
    descRecommendations.push('Add more detail about benefits and services');
  } else if (descLength < DESC_TARGET_LENGTH) {
    descRecommendations.push(
      `Consider expanding to ${DESC_TARGET_LENGTH} chars for optimal display`
    );
  }

  // Generate optimized versions
  const optimizedTitle = generateSEOTitle(currentTitle);
  const optimizedDescription = generateSEODescription({
    service: 'Interstate backloading',
    savings: 'up to 60%',
  });

  return {
    title: {
      current: currentTitle,
      currentLength: titleLength,
      optimized: optimizedTitle,
      optimizedLength: optimizedTitle.length,
      issues: titleIssues,
      recommendations: titleRecommendations,
    },
    description: {
      current: currentDescription,
      currentLength: descLength,
      optimized: optimizedDescription,
      optimizedLength: optimizedDescription.length,
      issues: descIssues,
      recommendations: descRecommendations,
    },
  };
}
