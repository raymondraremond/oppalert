import {
  GraduationCap,
  Briefcase,
  Globe,
  Coins,
  FlaskConical,
  Rocket,
  Clock,
  AlertCircle,
  Check,
  Minus,
  Zap,
  Mail,
  Bell,
  Bookmark,
  MapPin,
  Calendar,
  Share2,
  BarChart3,
  User,
  Heart,
  Pin,
  Home,
  Star,
  Copy,
  ExternalLink,
  ArrowRight,
  type LucideProps,
} from 'lucide-react'
import type { Category } from './types'

const catIconMap: Record<Category, React.FC<LucideProps>> = {
  scholarship: GraduationCap,
  job: Briefcase,
  fellowship: Globe,
  grant: Coins,
  internship: FlaskConical,
  startup: Rocket,
}

export function CategoryIcon({
  cat,
  size = 20,
  ...props
}: { cat: Category; size?: number } & LucideProps) {
  const Icon = catIconMap[cat] || Globe
  return <Icon size={size} {...props} />
}

export {
  GraduationCap,
  Briefcase,
  Globe,
  Coins,
  FlaskConical,
  Rocket,
  Clock,
  AlertCircle,
  Check,
  Minus,
  Zap,
  Mail,
  Bell,
  Bookmark,
  MapPin,
  Calendar,
  Share2,
  BarChart3,
  User,
  Heart,
  Pin,
  Home,
  Star,
  Copy,
  ExternalLink,
  ArrowRight,
}
