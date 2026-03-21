export default function EventRegistrationCount({ 
  current, 
  max 
}: { 
  current: number, 
  max: number | null 
}) {
  if (max === null || max === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[#EDE8DF]">
          {current} registered
        </span>
      </div>
    )
  }

  const percentage = Math.min((current / max) * 100, 100)
  
  let fillClass = "reg-fill-low"
  if (percentage >= 80) fillClass = "reg-fill-high"
  else if (percentage >= 50) fillClass = "reg-fill-medium"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#9A9C8E]">
        <span>Registration</span>
        <span>{current} / {max}</span>
      </div>
      <div className="reg-progress">
        <div 
          className={`reg-progress-fill ${fillClass}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
