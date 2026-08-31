import { DESTINATIONS } from '@/lib/destinations-v2';
import { getGuidesByDestination, getEventsByDestination, getNewsByDestination } from '@/lib/content/repository';
import prisma from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'Editorial SEO Opportunities | Admin',
};

async function getCoverageData() {
  const data = [];
  for (const dest of DESTINATIONS) {
    // We check BOTH published (via repository) and Draft (via prisma) to show accurate editor state
    const publishedGuides = await getGuidesByDestination(dest.slug);
    const publishedEvents = await getEventsByDestination(dest.slug);
    const publishedNews = await getNewsByDestination(dest.slug);
    
    // Check drafts via prisma
    const allGuides = await prisma.guide.findMany({ where: { destinationSlug: dest.slug } });
    
    const hasWhereToStayPublished = publishedGuides.some(g => g.slug === `where-to-stay-in-${dest.slug}`);
    const hasWhereToStayDraft = !hasWhereToStayPublished && allGuides.some(g => g.slug === `where-to-stay-in-${dest.slug}` && g.publishStatus === 'draft');
    const hasGeneralGuide = publishedGuides.some(g => g.category !== 'where-to-stay');
    
    let coverage = 'Needs Guides';
    let coverageClass = 'bg-red-100 text-red-800';
    
    if (hasWhereToStayPublished && hasGeneralGuide && publishedEvents.length > 0) {
      coverage = 'Strong';
      coverageClass = 'bg-green-100 text-green-800';
    } else if (hasWhereToStayPublished || hasGeneralGuide) {
      coverage = 'Moderate';
      coverageClass = 'bg-yellow-100 text-yellow-800';
    }
    
    if (hasWhereToStayDraft) {
      coverage = 'Accommodation Draft';
      coverageClass = 'bg-purple-100 text-purple-800';
    }
    
    data.push({
      dest,
      publishedGuides: publishedGuides.length,
      publishedEvents: publishedEvents.length,
      publishedNews: publishedNews.length,
      hasWhereToStayPublished,
      hasWhereToStayDraft,
      hasGeneralGuide,
      coverage,
      coverageClass,
    });
  }
  return data;
}

export default async function SeoOpportunitiesPage() {
  const coverageData = await getCoverageData();
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editorial SEO Opportunities</h1>
          <p className="text-gray-500 mt-1">Identify content gaps and track destination topical authority.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editorial Coverage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Where to Stay</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">General Guides</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coverageData.map((row) => (
              <tr key={row.dest.slug}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{row.dest.name}</div>
                  <div className="text-sm text-gray-500">{row.dest.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.coverageClass}`}>
                    {row.coverage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.hasWhereToStayPublished ? '✅ Published' : row.hasWhereToStayDraft ? '✍️ Draft' : '❌ Missing'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.hasGeneralGuide ? '✅ Yes' : '❌ Missing'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.publishedEvents > 0 ? `✅ ${row.publishedEvents}` : '❌ Missing'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-bold mb-2">Travelpayouts Readiness</h3>
        <p className="text-blue-700 text-sm mb-4">
          Building original content and destination authority is required before re-applying for restricted programs (Booking.com, Agoda, Expedia).
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Original editorial content</li>
          <li>Published destination coverage</li>
          <li>Accommodation coverage</li>
          <li>Regular publishing</li>
        </ul>
      </div>
    </div>
  );
}
