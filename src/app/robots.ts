import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thearchitectureofreality.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/library', '/library/*', '/news', '/news/*', '/why', '/audit', '/offers', '/contact', '/privacy'],
        disallow: ['/operator', '/operator/*', '/admin', '/admin/*', '/portal', '/portal/*', '/api', '/api/*', '/checkout', '/checkout/*', '/members', '/members/*'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'ClaudeBot',
          'anthropic-ai',
          'Bytespider',
          'PetalBot',
          'Omgilibot',
          'Diffbot',
          'Scrapy',
          'PerplexityBot',
          'cohere-ai',
        ],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
