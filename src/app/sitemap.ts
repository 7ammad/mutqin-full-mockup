import { MetadataRoute } from 'next';
import { INITIAL_EVENTS } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://event-med.ksa';
  const now = new Date();

  // Public, crawlable static routes
  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/events', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/events/browse', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/events/search', priority: 0.8, changeFrequency: 'weekly' as const },
    // Onboarding flows are public and SEO-friendly
    { path: '/onboarding/hcp', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/onboarding/organizer', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/onboarding/vendor', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/onboarding/regulator', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/onboarding/event-manager', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  // Dynamic, public event pages
  const eventRoutes = INITIAL_EVENTS.flatMap((event) => ([
    {
      url: `${baseUrl}/events/${event.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events/${event.id}/register`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]));

  // Note: Auth and dashboard routes are excluded to align with robots.txt
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [
    ...staticEntries,
    ...eventRoutes,
  ];
}
