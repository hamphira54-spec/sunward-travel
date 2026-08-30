import prisma from '@/lib/db';


export default async function AuditLog({ contentType, contentId }: { contentType: string, contentId: string }) {
  if (contentId === 'new') return null;

  const logs = await prisma.publishingAudit.findMany({
    where: { contentType, contentId },
    orderBy: { createdAt: 'desc' }
  });

  if (logs.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-lg border border-[#E9D9CA] shadow-sm p-6 mb-32 max-w-4xl">
      <h3 className="text-lg font-bold text-[#2B221C] mb-4">Publishing Audit Log</h3>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="border-l-2 border-[#E9D9CA] pl-4 py-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-[#0D6E7A]">{log.action}</span>
              <span className="text-gray-500">by</span>
              <span className="font-medium text-[#2B221C]">{log.actorRole}</span>
              <span className="text-gray-400 text-xs ml-auto">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Transitioned from <span className="font-mono text-xs">{log.fromStatus || 'none'}</span> to <span className="font-mono text-xs">{log.toStatus}</span>
            </div>
            {log.note && <div className="text-sm italic text-gray-500 mt-1">&quot;{log.note}&quot;</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
