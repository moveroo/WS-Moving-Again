import rss from '@astrojs/rss';

const feedEntries = [
  {
    title: 'Moving Interstate',
    description: 'Practical interstate moving guidance and planning advice from Moving Again.',
    link: '/moving-interstate/',
  },
  {
    title: 'Backloading',
    description: 'How backloading works and when it is the right fit for an interstate move.',
    link: '/backloading/',
  },
  {
    title: 'Questions',
    description:
      'Frequently asked moving questions covering timing, packing, and booking expectations.',
    link: '/questions/',
  },
  {
    title: 'Car Transport',
    description: 'Vehicle transport guidance for customers moving cars with Moving Again.',
    link: '/car-transport/',
  },
  {
    title: 'Reviews',
    description: 'Customer feedback and social proof from completed Moving Again jobs.',
    link: '/reviews/',
  },
];

export function GET(context: { site?: string | URL }) {
  return rss({
    title: 'Moving Again Guides',
    description: 'Interstate moving guides, FAQs, and planning content from Moving Again.',
    site: context.site ?? 'https://movingagain.com.au',
    items: feedEntries,
  });
}
