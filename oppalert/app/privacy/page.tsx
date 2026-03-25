export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Data Collection',
      content: 'We collect minimal personal data to provide our services. This includes your name, email address, country of residence, and professional status. We do not track your activity across other websites.'
    },
    {
      title: '2. How We Use Information',
      content: 'The primary purpose of data collection is to match you with relevant opportunities. We use your professional status and location to filter listings, and your email for notification alerts you have subscribed to.'
    },
    {
      title: '3. Third-Party Sharing',
      content: 'We never sell your data to advertisers. We share information only with trusted service providers essential to our operations, specifically Stripe (payments) and Resend (email delivery).'
    },
    {
      title: '4. Cookies & Tracking',
      content: 'We use essential cookies to maintain your login session. We do not use intrusive advertising trackers or third-party cookies that monitor your browsing behavior outside of OppFetch.'
    },
    {
      title: '5. Data Rights',
      content: 'You have the right to access, export, or delete your personal data at any time from your dashboard. For full account deletion requests, please contact our support team.'
    }
  ]

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 animate-fade-up">
           <h1 className="font-syne text-5xl md:text-7xl font-black tracking-tighter mb-6 text-primary">
             Privacy <span className="text-amber-gradient drop-shadow-glow-amber">Policy</span>
           </h1>
           <p className="text-subtle text-lg font-medium">Last updated: March 17, 2026</p>
        </div>

        <div className="space-y-12 animate-fade-up animate-delay-100">
          {sections.map((section, idx) => (
            <div key={idx} className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 group hover:border-[var(--glass-border)] transition-all">
              <h2 className="font-syne text-2xl font-black text-primary mb-6 group-hover:text-amber transition-colors">{section.title}</h2>
              <p className="text-subtle text-lg leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}

          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 md:p-14 text-center">
            <h3 className="font-syne text-xl font-black text-primary mb-4">Questions about your data?</h3>
            <p className="text-subtle font-medium mb-8">Detailed information about our security protocols and regional data compliance is available upon request.</p>
            <a href="mailto:privacy@OppFetch.com" className="text-primary font-black uppercase tracking-widest text-xs hover:underline underline-offset-8">Contact Security Team</a>
          </div>
        </div>

        <p className="mt-20 text-[10px] text-center text-muted font-black uppercase tracking-widest leading-relaxed">
          OppFetch complies with global data protection standards (GDPR / NDPR) to ensure your privacy is protected.
        </p>
      </div>
    </main>
  )
}
