import { useState } from 'react'
import { motion, useTime, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo/logo-inviteque.png'
import { templates } from '../templates/templates.js'
import { fadeUp, staggerChildren, viewportOnce } from '../motionVariants.js'
import { useAuth } from '../context/AuthContext'

const templateCardPop = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      duration: 2.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const templateGridStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
}

function InfiniteCarouselCard({ t, i, total }) {
  const time = useTime();
  const duration = 70000; // Adjusted for a balanced, slightly faster, but still elegant pace
  
  const pos = useTransform(time, tValue => {
    const rawPos = (tValue / duration) + (i / total);
    return rawPos % 1; // Loops infinitely from 0 to 1
  });

  // Mathematically perfect circular arc using Trigonometry
  const x = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI; // p=0 -> pi/2 (right). p=0.5 -> 0 (center). p=1 -> -pi/2 (left).
    return Math.sin(angle) * 1200; // Slightly wider radius to keep a clearer gap between cards
  });

  const z = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    return (Math.cos(angle) - 1) * 1200; // Deep 1200px pushback at the edges
  });

  const rotateY = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    // Right side (p < 0.5, positive angle) needs negative rotateY to face inward (Left)
    return -(angle / (Math.PI / 2)) * 55;
  });

  const scale = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    return 0.65 + 0.35 * Math.cos(angle); // Scale smoothly from 0.65 at edges to 1 at center
  });

  const opacity = useTransform(pos, p => {
    if (p < 0.05) return p / 0.05; // Fade in
    if (p > 0.95) return (1 - p) / 0.05; // Fade out
    return 1;
  });

  // Stable z-index ordering with a deterministic tie-breaker.
  // Prevents flicker/overlap when two cards compute the same z-index near the center.
  const zIndex = useTransform(pos, p => {
    const closeness = Math.max(0, 1 - Math.abs(p - 0.5) * 2); // 0..1
    const base = Math.floor(closeness * 1000); // 0..1000
    return base * 10 + (total - i);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-[120px] -mt-[180px] w-[240px] md:-ml-[160px] md:-mt-[240px] md:w-[320px]"
      style={{ x, z, rotateY, scale, opacity, zIndex, transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <article className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-iqBorder/30 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_30px_60px_-30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-6 hover:shadow-[0_70px_120px_-20px_rgba(0,0,0,0.4)]">
        <img
          src={t.thumbnail}
          alt={t.name}
          className="aspect-[3/4.5] w-full object-cover"
          loading="lazy"
        />
        {/* Clean, subtle glossy reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </article>
    </motion.div>
  )
}


function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-iqBorder bg-iqCard px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-iqText/70">
      {children}
    </span>
  )
}

function PrimaryButton({ to, children, disabled = false }) {
  const className = [
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition',
    disabled
      ? 'cursor-not-allowed bg-iqText/20 text-iqCard/80'
      : 'bg-iqText text-iqCard shadow-luxury hover:opacity-95',
  ].join(' ')

  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    )
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}


function OutlineButton({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-iqBorder bg-iqCard px-5 py-2.5 text-sm font-semibold text-iqText transition hover:bg-iqText/5"
    >
      {children}
    </a>
  )
}

function PricePill({ label }) {
  const isFree = String(label).toLowerCase().includes('free')
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        isFree
          ? 'border-iqBorder bg-iqCard text-iqText'
          : 'border-transparent bg-iqAccent text-iqCard',
      ].join(' ')}
    >
      {label}
    </span>
  )
}

function ComingSoonPill() {
  return (
    <span className="inline-flex items-center rounded-full border border-iqBorder bg-iqCard px-3 py-1 text-xs font-semibold text-iqText/70">
      Coming soon
    </span>
  )
}

export default function Landing() {
  const [showAll, setShowAll] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <main className="min-h-[100svh] w-full bg-iqBg font-saas text-iqText">
      <header className="sticky top-0 z-50 border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-6 w-auto" />
            <span className="text-xl font-extrabold tracking-tight text-iqText">Inviteque</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#templates" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              Templates
            </a>
            <a href="#about" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              FAQs
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-iqText">Hi, {user.name}</span>
                <button 
                  onClick={logout}
                  className="text-sm font-semibold text-iqText/50 hover:text-iqText transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden text-sm font-semibold text-iqText/70 hover:text-iqText md:block">
                Log In
              </Link>
            )}
            <PrimaryButton to={user ? "/builder/auraofelegance" : "/login"}>Get Started</PrimaryButton>
          </div>
        </nav>
      </header>

      {/* 1) Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF9F9] to-iqBg pt-20 pb-24 md:pt-32 md:pb-48">
        {/* Decorative subtle glow background */}
        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 bg-iqAccent/5 blur-[120px]" />
        
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-5xl px-5 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-bold tracking-tight text-iqText md:text-6xl lg:text-7xl"
          >
            Beautiful Wedding <br className="hidden md:block" /> Websites in Minutes
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 text-pretty text-lg font-medium leading-relaxed text-iqText/60 md:text-xl"
          >
            Choose a template, add your details, and share <br className="hidden sm:block" /> your love story instantly.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-12">
            <a
              href="#templates"
              className="inline-flex h-14 items-center justify-center rounded-full bg-black px-10 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-black/90 active:scale-95 shadow-xl"
            >
              Explore Templates
            </a>
          </motion.div>
        </motion.div>

        {/* Infinite Curved Full-Screen Carousel Layout */}
        <div className="mt-20 relative h-[450px] md:h-[600px] w-full overflow-hidden [perspective:2000px] [transform-style:preserve-3d]">
          {/* We duplicate the templates to have a dense, continuous loop */}
          {[...templates, ...templates].map((t, i, arr) => (
            <InfiniteCarouselCard key={`${t.id}-${i}`} t={t} i={i} total={arr.length} />
          ))}
        </div>
      </section>

      {/* 2) Template grid */}
      <section id="templates" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-7xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Templates</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Designed for Your Big Day
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Clean, minimal, premium templates—made for mobile and beautiful on desktop.
            </motion.p>
          </motion.div>

          <motion.div
            variants={templateGridStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {templates.map((t, index) => (
              <motion.article
                key={t.id}
                variants={templateCardPop}
                className={[
                  "overflow-hidden rounded-card border border-iqBorder bg-iqCard shadow-luxury transition hover:scale-[1.01]",
                  index > 2 ? (showAll ? 'block' : 'hidden md:block') : 'block'
                ].join(' ')}
              >
                <div className="relative">
                  <Link to={t.available ? t.href : '#templates'} className="block">
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <PricePill label={t.priceLabel} />
                    {t.popular ? (
                      <span className="inline-flex items-center rounded-full bg-iqText px-3 py-1 text-xs font-semibold text-iqCard">
                        Popular
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="px-5 py-5">
                  <h3 className="text-sm font-bold md:text-base">{t.name}</h3>
                  <p className="mt-1 text-xs text-iqText/70 line-clamp-2">{t.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {t.available ? null : <ComingSoonPill />}
                  </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <PrimaryButton to={t.available ? t.href : '#templates'} disabled={!t.available}>
                        Preview
                      </PrimaryButton>
                      <button
                        onClick={() => {
                          if (user) navigate(`/builder/${t.id}`)
                          else navigate('/login')
                        }}
                        className={[
                          'inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition',
                          t.available
                            ? 'border-iqBorder bg-iqCard text-iqText hover:bg-iqText/5'
                            : 'cursor-not-allowed border-iqBorder bg-iqCard text-iqText/40',
                        ].join(' ')}
                        aria-disabled={!t.available}
                      >
                        Use Template
                      </button>
                    </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="mt-12 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 rounded-full border border-iqBorder bg-white px-8 py-3 text-sm font-bold text-iqText shadow-luxury transition hover:bg-iqText hover:text-white"
            >
              {showAll ? 'Show Less' : 'Show More Templates'}
              <span className={`transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-y-1'}`}>
                ↓
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3) Value proposition */}
      <section id="about" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>About</SectionLabel>
              <h2 className="mt-6 text-3xl font-bold md:text-4xl">
                Create a Stunning Wedding Invite Website in Minutes
              </h2>
              <p className="mt-4 text-sm text-iqText/70 md:text-base">
                Start from a premium template, personalize everything, and share a single link with
                guests—RSVP, map, schedule, and more.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <OutlineButton href="#templates">Browse templates</OutlineButton>
                <PrimaryButton to="/templates/template-1">Preview now</PrimaryButton>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: '🎨 Easy Customization', desc: 'Edit names, date, venue, schedule, RSVP.' },
                { title: '⚡ Instant Sharing', desc: 'Send your link on WhatsApp & socials.' },
                { title: '📱 Mobile Optimized', desc: 'Looks perfect across devices.' },
              ].map((card) => (
                <article
                  key={card.title}
                  className="rounded-card border border-iqBorder bg-iqCard p-5 shadow-luxury"
                >
                  <p className="text-sm font-bold">{card.title}</p>
                  <p className="mt-2 text-xs text-iqText/70">{card.desc}</p>
                </article>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4) Comparison */}
      <section className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Better than Paper</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Everything in One Link
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Keep everything in one place—updates, RSVP, map, and animations.
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10 overflow-hidden rounded-card border border-iqBorder bg-iqCard shadow-luxury"
          >
            <div className="grid grid-cols-3 gap-0 border-b border-iqBorder text-xs font-semibold">
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3 text-center">Templates</div>
              <div className="px-4 py-3 text-center">Traditional</div>
            </div>
            {[
              { label: 'RSVP', a: '✔', b: '✖' },
              { label: 'Map', a: '✔', b: '✖' },
              { label: 'Animations', a: '✔', b: '✖' },
              { label: 'Instant updates', a: '✔', b: '✖' },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-b border-iqBorder text-sm last:border-b-0"
              >
                <div className="px-4 py-3 text-iqText/80">{row.label}</div>
                <div className="px-4 py-3 text-center font-semibold">{row.a}</div>
                <div className="px-4 py-3 text-center text-iqText/60">{row.b}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto mt-10 flex max-w-3xl items-center justify-center"
          >
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-full bg-iqText px-7 py-3 text-sm font-semibold text-iqCard shadow-luxury transition hover:opacity-95"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </section>

      {/* 5) Pricing */}
      <section id="pricing" className="border-t border-iqBorder bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Pricing</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl text-iqText">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              One-time payment for your perfect wedding website. No monthly subscriptions.
            </motion.p>
          </motion.div>

          <div className="mt-16 flex justify-center">
            <motion.article
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="w-full max-w-md rounded-[2.5rem] border border-iqBorder bg-white p-8 md:p-12 shadow-luxury text-center"
            >
              <h3 className="text-lg font-bold uppercase tracking-widest text-iqText/50">Premium Plan</h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-6xl font-extrabold text-iqText">₹999</span>
                <span className="text-lg font-medium text-iqText/40">/event</span>
              </div>
              <p className="mt-6 text-sm font-medium text-iqText/60">
                Everything you need to invite your guests in style.
              </p>
              
              <div className="mt-10 space-y-4 border-y border-iqBorder py-8 text-left">
                {[
                  'Premium Wedding Template',
                  'Custom URL / Name Link',
                  'Unlimited RSVP Management',
                  'Interactive Google Maps Venue',
                  'Cinematic Love Story Timeline',
                  'High-Res Photo Gallery',
                  '1 Year Hosting Included',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-iqText/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a
                  href="#templates"
                  className="flex h-14 items-center justify-center rounded-full bg-black text-base font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Choose Your Template
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* 6) Testimonials */}
      <section id="testimonials" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Testimonials</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Don’t Take Our Word for It
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Real couples. Real reactions. Premium templates.
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10"
          >
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">
              {[
                {
                  img: templates[0]?.thumbnail,
                  text: '“We set it up in minutes. Guests loved the RSVP + map.”',
                  name: 'Aarav & Kiara',
                },
                {
                  img: templates[1]?.thumbnail,
                  text: '“The templates feel premium and the link sharing was perfect.”',
                  name: 'Rohan & Anaya',
                },
                {
                  img: templates[2]?.thumbnail,
                  text: '“Clean design, super easy to customize. Looked great on mobile.”',
                  name: 'Vihaan & Saanvi',
                },
                {
                  img: templates[3]?.thumbnail,
                  text: '“Our schedule updates were instant—no reprinting stress.”',
                  name: 'Arjun & Isha',
                },
              ].map((t) => (
                <article
                  key={t.name}
                  className="relative w-[280px] flex-none snap-start overflow-hidden rounded-card border border-iqBorder bg-iqCard shadow-luxury"
                >
                  <img src={t.img} alt={t.name} className="h-[210px] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-iqText/30 to-transparent" />
                  <div className="px-5 py-5">
                    <p className="text-sm text-iqText/80">{t.text}</p>
                    <p className="mt-4 text-xs font-bold text-iqText/70">{t.name}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7) FAQ */}
      <section id="faq" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>FAQ</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Questions & Answers
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Everything you need to know.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto mt-10 max-w-3xl space-y-3"
          >
            {[
              {
                q: 'How does this work?',
                a: 'Pick a template, customize your details, and share your link with guests.',
              },
              {
                q: 'Can I customize everything?',
                a: 'Yes—names, date, venue, schedule, RSVP, and more (depending on template).',
              },
              {
                q: 'Is it mobile friendly?',
                a: 'Yes—templates are designed mobile-first and scale beautifully on desktop.',
              },
              {
                q: 'Can I include RSVP and map?',
                a: 'Yes—website invites can include RSVP, map, countdown, schedule, and updates.',
              },
            ].map((item) => (
              <motion.div key={item.q} variants={fadeUp}>
                <details className="group rounded-card border border-iqBorder bg-iqCard px-5 py-4 shadow-luxury">
                  <summary className="cursor-pointer list-none text-sm font-bold">
                    <span className="flex items-center justify-between gap-3">
                      <span>{item.q}</span>
                      <span className="text-iqText/60 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-iqText/70">{item.a}</p>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8) Footer */}
      <footer className="relative overflow-hidden border-t border-iqBorder bg-gradient-to-br from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14] px-6 py-10 md:py-12 text-center md:text-left">
        {/* Subtle radial glow background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,74,0.12)_0%,transparent_70%)]" />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="relative z-10 mx-auto w-full max-w-7xl"
        >
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-end">
            {/* Branding & Tagline */}
            <div className="flex flex-col items-center md:items-start">
              <motion.p
                variants={fadeUp}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#FFF6F0]/60"
              >
                Crafted with love by
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="mt-2 flex items-center gap-3"
              >
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <span className="font-pinyon text-5xl font-normal text-[#FFF6F0] md:text-6xl">
                    Inviteque
                  </span>
                  <svg viewBox="0 0 28 26" className="h-6 w-auto flex-shrink-0 fill-none" aria-hidden="true">
                    <path
                      d="M14 23S3 15.5 3 8.5A5.5 5.5 0 0114 5.8 5.5 5.5 0 0125 8.5C25 15.5 14 23 14 23z"
                      stroke="#C4974A"
                      strokeWidth="1.4"
                      fill="rgba(196,151,74,0.18)"
                    />
                  </svg>
                </Link>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-xs text-sm leading-relaxed text-[#FFF6F0]/60"
              >
                Create Beautiful Digital Invitations. Share Love.
              </motion.p>
            </div>

            {/* Nav & Socials */}
            <div className="flex flex-col items-center md:items-end">
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                {[
                  { id: 'ig', label: 'Instagram', icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  )},
                  { id: 'wa', label: 'WhatsApp', icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.22-1.632A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.042-1.378l-.361-.214-3.742.981.999-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106c5.471 0 9.894 4.424 9.894 9.894 0 5.471-4.423 9.894-9.894 9.894z"/></svg>
                  )},
                ].map((social) => (
                  <a
                    key={social.id}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#FFF6F0]/80 transition-all hover:bg-white/10 hover:text-white"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wide text-[#FFF6F0]/40 md:justify-end"
              >
                <a href="#templates" className="hover:text-white transition-colors">Templates</a>
                <a href="#about" className="hover:text-white transition-colors">How it Works</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-[10px] font-medium uppercase tracking-[0.15em] text-[#FFF6F0]/20"
              >
                © {new Date().getFullYear()} Inviteque • ALL RIGHTS RESERVED
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Leaf Sprigs in corners - tighter position */}
        <div className="absolute -bottom-2 -left-2 -rotate-12 opacity-30 md:bottom-2 md:left-2">
          <svg viewBox="0 0 90 50" width="70" height="40" fill="none" stroke="#C4974A" strokeWidth="1.2" strokeLinecap="round" className="opacity-50">
            <path d="M10 42 Q35 28 80 10" />
            <path d="M22 36 Q18 22 32 20 Q28 34 22 36Z" fill="#C4974A" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute -bottom-2 -right-2 rotate-12 scale-x-[-1] opacity-30 md:bottom-2 md:right-2">
          <svg viewBox="0 0 90 50" width="70" height="40" fill="none" stroke="#C4974A" strokeWidth="1.2" strokeLinecap="round" className="opacity-50">
            <path d="M10 42 Q35 28 80 10" />
            <path d="M22 36 Q18 22 32 20 Q28 34 22 36Z" fill="#C4974A" opacity="0.3" />
          </svg>
        </div>
      </footer>
    </main>
  )
}
