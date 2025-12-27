import { defineCollection, z } from 'astro:content';

const routes = defineCollection({
  type: 'content',
  schema: z.object({
    // URL slugs - note: 'slug' conflicts with Astro's built-in, using optional
    slug: z.string().optional(), // /sydney-to-brisbane/
    slugFs: z.string(), // sydney-to-brisbane (filesystem-safe)
    
    // Display info
    title: z.string(),
    metaDescription: z.string().optional(),
    
    // Route details
    origin: z.string(),
    destination: z.string(),
    originState: z.string(),
    destinationState: z.string(),
    
    // Estimated data
    distanceKm: z.number().optional(),
    transitDays: z.string().optional(), // "3-5 business days"
    
    // SEO & linking
    canonicalUrl: z.string().optional(),
    relatedSlugs: z.array(z.string()).optional(),
    
    // Timestamps
    lastUpdated: z.string().optional()
  })
});

export const collections = { routes };

