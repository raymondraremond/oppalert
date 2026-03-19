import { Stars } from 'lucide-react'

const testimonials = [
  {
    name: 'Chioma Eze',
    initials: 'CE',
    role: 'Final Year Student, UNILAG',
    text: 'OppAlert helped me discover the Chevening Scholarship weeks before my classmates. The alerts are a game-changer.',
    color: '#3DAA6A',
  },
  {
    name: 'Kwame Asante',
    initials: 'KA',
    role: 'Software Engineer, Accra',
    text: "I landed a remote job through opportunities found here. The filtering is excellent — I only see roles that match.",
    color: '#4A9EE8',
  },
  {
    name: 'Fatima Al-Hassan',
    initials: 'FA',
    role: 'Startup Founder, Nairobi',
    text: 'Finding grant funding used to take hours. OppAlert consolidates everything in one place. Truly efficient.',
    color: '#E8A020',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-32 px-6" style={{backgroundColor: 'var(--icon-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="section-title mb-6">
            Loved by <span>Thousands</span>
          </h2>
          <p className="text-subtle text-lg font-medium leading-relaxed">
            Real results from African students and professionals across the continent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div key={review.name} className="cat-card !p-10 !rounded-3xl group">
              <div className="flex gap-1 mb-6 text-amber">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-glow-amber"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-subtle italic text-base leading-relaxed mb-10 group-hover:text-primary transition-colors">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-syne font-black text-sm transition-transform group-hover:rotate-6"
                  style={{ background: `${review.color}20`, color: review.color, border: `1px solid ${review.color}40` }}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="font-extrabold text-primary text-sm">{review.name}</div>
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
