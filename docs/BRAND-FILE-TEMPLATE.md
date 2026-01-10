# Brand File Template

**Purpose:** Standard template for `brand.ts` files across all projects  
**Location:** `src/utils/brand.ts`

---

## Template Structure

```typescript
/**
 * [Project Name] Brand Constants
 *
 * Centralized brand information that can be imported and used
 * across all pages and components to avoid hardcoding.
 *
 * Update this file when brand information changes.
 * All changes will automatically propagate across the site.
 */

// ============================================
// FOUNDING & HISTORY
// ============================================

// Founding year - used to calculate years in business
export const FOUNDING_YEAR = 1995;

// Calculate years in business dynamically
export const YEARS_IN_BUSINESS = new Date().getFullYear() - FOUNDING_YEAR;

// ============================================
// BRAND INFORMATION
// ============================================

export const BRAND = {
  // Basic Info
  name: '[Company Name]',
  legalName: '[Legal Company Name]', // Optional
  tagline: `${YEARS_IN_BUSINESS} Years of [Service Description]`,
  shortTagline: `Since ${FOUNDING_YEAR}`,

  // Contact
  email: 'info@example.com',
  telephone: '+61 X XXXX XXXX',
  fax: '+61 X XXXX XXXX', // Optional

  // History
  foundingYear: FOUNDING_YEAR,
  yearsInBusiness: YEARS_IN_BUSINESS,

  // URLs
  website: 'https://example.com',
  quoteUrl: 'https://quotes.example.com/quote',
  bookingUrl: 'https://booking.example.com', // Optional
  supportUrl: 'https://support.example.com', // Optional

  // Social Media
  socialMedia: {
    facebook: 'https://www.facebook.com/[page]',
    twitter: 'https://twitter.com/[handle]', // Optional
    linkedin: 'https://linkedin.com/company/[company]', // Optional
    instagram: 'https://instagram.com/[handle]', // Optional
  },

  // Address
  address: {
    street: '[Street Address]',
    city: '[City]',
    state: '[State]',
    postcode: '[Postcode]',
    country: 'Australia',
    // For schema.org
    schema: {
      '@type': 'PostalAddress',
      streetAddress: '[Street Address]',
      addressLocality: '[City]',
      addressRegion: '[State]',
      postalCode: '[Postcode]',
      addressCountry: 'AU',
    },
  },

  // Business Details
  abn: 'XX XXX XXX XXX', // Optional
  acn: 'XXX XXX XXX', // Optional

  // Service Areas
  serviceAreas: ['Australia'], // Or specific regions

  // Key Services
  services: ['[Service 1]', '[Service 2]', '[Service 3]'],

  // Key Features/Benefits
  keyFeatures: ['[Feature 1]', '[Feature 2]', '[Feature 3]'],
};

// ============================================
// SCHEMA.ORG DATA
// ============================================

// Pre-formatted Organization schema data
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BRAND.website}/#organization`,
  name: BRAND.name,
  url: BRAND.website,
  logo: {
    '@type': 'ImageObject',
    url: `${BRAND.website}/logo.svg`,
    width: 200,
    height: 50,
  },
  description: `[Company description]. ${BRAND.yearsInBusiness} years of experience.`,
  telephone: BRAND.telephone,
  email: BRAND.email,
  foundingDate: BRAND.foundingYear.toString(),
  address: BRAND.address.schema,
  areaServed: {
    '@type': 'Country',
    name: 'Australia',
  },
  serviceArea: {
    '@type': 'Country',
    name: 'Australia',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BRAND.telephone,
    contactType: 'Customer Service',
    email: BRAND.email,
    areaServed: 'AU',
    availableLanguage: 'English',
  },
  sameAs: Object.values(BRAND.socialMedia).filter(Boolean),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get formatted years in business text
 */
export function getYearsText(): string {
  return `${BRAND.yearsInBusiness} years`;
}

/**
 * Get "Since [YEAR]" text
 */
export function getSinceText(): string {
  return `Since ${BRAND.foundingYear}`;
}

/**
 * Get full tagline
 */
export function getTagline(): string {
  return BRAND.tagline;
}

/**
 * Get social media links for schema
 */
export function getSocialMediaLinks(): string[] {
  return Object.values(BRAND.socialMedia).filter(Boolean);
}
```

---

## Usage Examples

### In Components:

```typescript
import { BRAND, ORGANIZATION_SCHEMA } from '../utils/brand';

// Use brand name
<h1>{BRAND.name}</h1>

// Use years in business
<p>{BRAND.yearsInBusiness} years of experience</p>

// Use contact info
<a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>

// Use in schema
<Schema type="Organization" data={ORGANIZATION_SCHEMA} />
```

### In Pages:

```typescript
import { BRAND } from '../utils/brand';

<Layout
  title={`${BRAND.name} | ${BRAND.tagline}`}
  description={`${BRAND.name} - ${BRAND.yearsInBusiness} years of experience...`}
>
```

---

## Maintenance

### When to Update:

- ✅ Company name changes
- ✅ Contact information changes
- ✅ Founding year corrections
- ✅ New services added
- ✅ Social media accounts added/changed
- ✅ Address changes

### Update Process:

1. Edit `src/utils/brand.ts`
2. All pages automatically use new values
3. Test a few pages to verify
4. Commit changes

---

## Benefits

1. **Consistency** - Same data everywhere
2. **Maintainability** - Update once, changes everywhere
3. **Accuracy** - No typos or outdated info
4. **Type Safety** - TypeScript catches errors
5. **Reusability** - Easy to copy to new projects

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-10
