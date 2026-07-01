import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import type { FounderProfile } from "@/lib/founder.functions";

export function FounderSection({ f, compact = false }: { f: FounderProfile; compact?: boolean }) {
  return (
    <section className="bg-ink text-bone mt-24">
      <div className="container-luxe py-24 grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-gold/30">
            <img
              src={f.image_url}
              alt={`${f.name} — ${f.designation}`}
              width={1200}
              height={1500}
              loading="lazy"
              className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="eyebrow text-gold">{f.designation}</div>
              <div className="font-display text-3xl text-bone mt-1">{f.name}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="eyebrow text-gold mb-4">Meet the Founder</div>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            25 years of <span className="italic text-gold">craftsmanship,</span><br />
            one relentless vision.
          </h2>
          <div className="rule-gold mt-6 w-16" />

          <div className="mt-8 space-y-4 text-bone/80 leading-relaxed max-w-2xl">
            {(compact ? f.bio.split(/\n+/).slice(0, 1) : f.bio.split(/\n+/)).filter(Boolean).map((p, i) => (
              <p key={i} className="text-[15px]">{p}</p>
            ))}
          </div>

          {f.quote && (
            <figure className="mt-10 border-l-2 border-gold pl-6 max-w-xl">
              <span className="text-gold font-display text-4xl leading-none">"</span>
              <blockquote className="italic font-display text-lg text-bone/90 mt-2">{f.quote}</blockquote>
              <figcaption className="eyebrow text-bone/60 mt-3">— {f.name}</figcaption>
            </figure>
          )}

          <div className="mt-10 flex flex-wrap gap-3 items-center">
            {f.website_url && (
              <a href={f.website_url} target="_blank" rel="noreferrer" className="btn-gold hover:brightness-95">
                Visit RajanMehta.in <ExternalLink size={14} />
              </a>
            )}
            {compact && (
              <Link to="/founder" className="btn-outline-bone hover:bg-bone hover:text-ink">
                Full Profile <ArrowRight size={14} />
              </Link>
            )}
            <SocialLinks f={f} />
          </div>
        </div>
      </div>

      {f.achievements.length > 0 && (
        <div className="border-t border-bone/10">
          <div className="container-luxe py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {f.achievements.map((a) => (
              <div key={a.label} className="text-center md:text-left group">
                <div className="font-display text-4xl md:text-5xl text-gold group-hover:scale-105 transition-transform origin-left">{a.value}</div>
                <div className="eyebrow text-bone/60 mt-2 text-[10px] leading-snug">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function SocialLinks({ f }: { f: FounderProfile }) {
  const socials = [
    { href: f.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { href: f.instagram_url, icon: Instagram, label: "Instagram" },
    { href: f.facebook_url, icon: Facebook, label: "Facebook" },
    { href: f.youtube_url, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);
  if (!socials.length) return null;
  return (
    <div className="flex gap-2 ml-1">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="w-10 h-10 border border-bone/30 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
        >
          <s.icon size={16} />
        </a>
      ))}
    </div>
  );
}
