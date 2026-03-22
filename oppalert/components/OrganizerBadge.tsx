export default function OrganizerBadge({ 
  name, 
  verified, 
  size = "md" 
}: { 
  name: string, 
  verified?: boolean, 
  size?: "sm" | "md" | "lg" 
}) {
  const textClass = size === "sm" ? "text-[12px]" : size === "lg" ? "text-[16px]" : "text-[14px]"
  const initialSize = size === "sm" ? "w-6 h-6 text-[10px]" : size === "lg" ? "w-10 h-10 text-[16px]" : "w-8 h-8 text-[12px]"

  return (
    <div className="flex items-center gap-2">
      <div className={`${initialSize} rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold uppercase`}>
        {name?.charAt(0) || "?"}
      </div>
      <div className={`flex items-center ${textClass} text-muted font-medium`}>
        <span>by {name}</span>
        {verified && (
          <span className="verified-badge" title="Verified Organizer">
            ✓
          </span>
        )}
      </div>
    </div>
  )
}
