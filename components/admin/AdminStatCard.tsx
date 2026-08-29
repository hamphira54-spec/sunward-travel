interface AdminStatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  sublabel?: string;
}

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  sublabel,
}: AdminStatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E9D9CA] p-5 flex items-start gap-4 shadow-sm">
      <div className={`${iconBg} rounded-lg p-3 shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-[#2B221C] tabular-nums">{value}</p>
        <p className="text-sm font-medium text-[#2B221C] mt-0.5">{label}</p>
        {sublabel && (
          <p className="text-xs text-[#76675D] mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
