import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import NewsPresentation from '@/components/content/NewsPresentation';

export const metadata = {
  title: 'Preview News | Sunward Admin',
  robots: 'noindex, nofollow',
};

export default async function NewsPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) notFound();

  const parsedNews = {
    ...news,
    publication: news.publication as any,
    author: news.author as any,
    sourceReferences: news.sourceReferences as any,
    tags: news.tags as any,
    heroImage: news.heroImage as any,
    seo: news.seo as any,
    body: news.body as any,
  };

  const countryEntry = parsedNews.countrySlug 
    ? await prisma.country.findUnique({ where: { slug: parsedNews.countrySlug } }) 
    : null;
    
  const destEntry = parsedNews.destinationSlug 
    ? await prisma.destination.findUnique({ where: { slug: parsedNews.destinationSlug } }) 
    : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2B221C] text-[#F0EDE8] px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="bg-[#E8622C] text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {parsedNews.publication?.status || 'DRAFT'} PREVIEW
          </span>
          <span className="text-sm font-medium opacity-80">
            {parsedNews.title}
          </span>
        </div>
        <Link 
          href={`/admin/news/${id}`}
          className="flex items-center gap-1.5 text-sm font-medium hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
      </div>
      <NewsPresentation 
        article={parsedNews} 
        countryEntry={countryEntry} 
        destEntry={destEntry} 
        relatedNews={[]}
        relatedGuides={[]} 
        previewMode={true} 
      />
    </div>
  );
}
