export default function TermsPage() {
  const terms = [
    {
      title: '1. Platform Use',
      content: 'OppAlert provides information regarding educational and career opportunities. While we verify all listings, users are responsible for their applications and interactions with third-party organizations.'
    },
    {
      title: '2. Account Responsibility',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity originating from your account is your responsibility.'
    },
    {
      title: '3. Premium Subscriptions',
      content: 'Premium subscriptions provide enhanced features as listed on the pricing page. Subscriptions are billed monthly and can be cancelled at any time. Refunds are issued on a case-by-case basis.'
    },
    {
      title: '4. Limitation of Liability',
      content: 'OppAlert is not liable for any direct or indirect consequences resulting from your application to or acceptance of any opportunities found on our platform.'
    },
    {
      title: '5. Modifications',
      content: 'We reserve the right to modify these terms at any time. Continued use of the platform after updates constitutes acceptance of the new terms.'
    }
  ]

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 animate-fade-up">
           <h1 className="font-syne text-5xl md:text-7xl font-black tracking-tighter mb-6 text-primary">
             Terms of <span className="text-amber-gradient drop-shadow-glow-amber">Service</span>
           </h1>
           <p className="text-subtle text-lg font-medium">Last updated: March 17, 2026</p>
        </div>

        <div className="space-y-12 animate-fade-up animate-delay-100">
          {terms.map((term, idx) => (
            <div key={idx} className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 group hover:border-[var(--glass-border)] transition-all">
              <h2 className="font-syne text-2xl font-black text-primary mb-6 group-hover:text-amber transition-colors">{term.title}</h2>
              <p className="text-subtle text-lg leading-relaxed font-medium">
                {term.content}
              </p>
            </div>
          ))}

          <div className="bg-amber/5 border border-amber/20 rounded-[2.5rem] p-10 md:p-14 text-center">
            <h3 className="font-syne text-xl font-black text-primary mb-4">Agreement to Terms</h3>
            <p className="text-subtle font-medium mb-8">By creating an account or browsing OppAlert, you acknowledge that you have read and agreed to these terms.</p>
            <a href="mailto:hello@oppalert.com" className="text-amber font-black uppercase tracking-widest text-xs hover:underline underline-offset-8">I have a legal question</a>
          </div>
        </div>

        <p className="mt-20 text-[10px] text-center text-muted font-black uppercase tracking-widest leading-relaxed">
          © {new Date().getFullYear()} OppAlert Inc. All rights reserved. Registered in Lagos, Nigeria.
        </p>
      </div>
    </main>
  )
}
