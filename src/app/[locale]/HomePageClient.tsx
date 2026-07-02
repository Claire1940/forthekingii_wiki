"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Crown,
  Gift,
  Globe,
  Lightbulb,
  Map as MapIcon,
  Skull,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Module heading: icon chip + theme-name title + intro
function ModuleHeading({
  icon: Icon,
  linkKey,
  title,
  intro,
  moduleLinkMap,
  locale,
}: {
  icon: React.ComponentType<{ className?: string }>;
  linkKey: string;
  title: string;
  intro: string;
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
        <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
        </span>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          <LinkedTitle
            linkData={moduleLinkMap[linkKey]}
            locale={locale}
          >
            {title}
          </LinkedTitle>
        </h2>
      </div>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// Tier badge styling uses only the global theme color, scaled by tier weight
function tierBadgeClass(tier: string): string {
  const base =
    "flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full text-xl md:text-2xl font-extrabold flex-shrink-0";
  if (tier === "S") {
    return `${base} text-white bg-[hsl(var(--nav-theme))] shadow-lg shadow-[hsl(var(--nav-theme)/0.35)]`;
  }
  if (tier === "A") {
    return `${base} text-white bg-[hsl(var(--nav-theme)/0.55)]`;
  }
  return `${base} text-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme)/0.22)]`;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.forthekingii.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "For The King II Wiki",
        description:
          "Complete For The King II Wiki covering classes, builds, gear, campaigns, dungeons, multiplayer, DLC, and achievements for the turn-based roguelite tabletop RPG on Steam, Xbox, and PlayStation.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "For The King II - Turn-Based Roguelite Tabletop RPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "For The King II Wiki",
        alternateName: "For The King II",
        url: siteUrl,
        description:
          "Complete For The King II Wiki resource hub for classes, builds, gear, campaigns, dungeons, multiplayer, DLC, and achievements",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "For The King II Wiki - Turn-Based Roguelite Tabletop RPG",
        },
        sameAs: [
          "https://store.steampowered.com/app/1676840/For_The_King_II/",
          "https://discord.com/invite/9ukAYPuSzg",
          "https://www.reddit.com/r/ForTheKing/",
          "https://www.youtube.com/@CurveGamesOfficial",
        ],
      },
      {
        "@type": "VideoGame",
        name: "For The King II",
        gamePlatform: ["PC", "Steam", "PlayStation", "Xbox"],
        applicationCategory: "Game",
        genre: ["RPG", "Roguelite", "Turn-Based", "Strategy", "Tabletop"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1676840/For_The_King_II/",
        },
      },
      {
        "@type": "VideoObject",
        name: "For The King II - Join The Fight - Trailer",
        description:
          "Official For The King II trailer from Curve Games featuring turn-based combat, co-op dungeon runs, and Battle Grid tactics.",
        uploadDate: "2023-11-02",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/9l4neyX7a90",
        url: "https://www.youtube.com/watch?v=9l4neyX7a90",
      },
    ],
  };

  // Accordion state for the combat & loadouts module
  const [combatExpanded, setCombatExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1676840/For_The_King_II/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，max-w-5xl 与工具网格对齐 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <VideoFeature
            videoId="9l4neyX7a90"
            title="For The King II - Join The Fight - Trailer"
          />
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (video 之后、最新更新之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "beginner-guide",
                "class-tier-list",
                "best-party-builds",
                "lore-store-codes",
                "combat-loadouts",
                "multiplayer-crossplay",
                "campaign-chapters",
                "dark-carnival",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端方形，桌面端横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: For The King II Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={BookOpen}
            linkKey="forTheKingIIBeginnerGuide"
            title={t.modules.forTheKingIIBeginnerGuide.title}
            intro={t.modules.forTheKingIIBeginnerGuide.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.forTheKingIIBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base font-medium text-[hsl(var(--nav-theme-light))] mb-3">
                      {step.goal}
                    </p>
                    <ul className="space-y-1.5 mb-3">
                      {step.details.map((d: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                      <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{step.tip}</span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.forTheKingIIBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: For The King II Class Tier List */}
      <section
        id="class-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Crown}
            linkKey="forTheKingIIClassTierList"
            title={t.modules.forTheKingIIClassTierList.title}
            intro={t.modules.forTheKingIIClassTierList.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {t.modules.forTheKingIIClassTierList.tiers.map(
              (tier: any, ti: number) => (
                <div key={ti}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={tierBadgeClass(tier.tier)}>{tier.tier}</span>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">
                        {tier.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tier.classes.map((cls: any, ci: number) => (
                      <div
                        key={ci}
                        className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                            {cls.name}
                          </h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                            {cls.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {cls.role}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                            Stat: {cls.stat}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                            {cls.unlock}
                          </span>
                        </div>
                        <ul className="space-y-1.5 mb-3">
                          {cls.strengths.map((s: string, si: number) => (
                            <li key={si} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {s}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm mb-1">
                          <span className="font-semibold">Best for: </span>
                          <span className="text-muted-foreground">
                            {cls.bestFor}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Watch out: </span>
                          <span className="text-muted-foreground">
                            {cls.watchOut}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: For The King II Best Party Builds */}
      <section id="best-party-builds" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Users}
            linkKey="forTheKingIIBestPartyBuilds"
            title={t.modules.forTheKingIIBestPartyBuilds.title}
            intro={t.modules.forTheKingIIBestPartyBuilds.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.forTheKingIIBestPartyBuilds.builds.map(
              (b: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {b.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                      {b.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {b.party.map((p: string, pi: number) => (
                      <span
                        key={pi}
                        className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {b.roles.map((r: any, ri: number) => (
                      <div
                        key={ri}
                        className="p-3 rounded-lg bg-white/5 border border-border"
                      >
                        <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-0.5">
                          {r.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{r.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)] mb-3">
                    <p className="text-xs font-semibold mb-1 text-[hsl(var(--nav-theme-light))]">
                      Game Plan
                    </p>
                    <p className="text-sm">{b.gamePlan}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-1.5">Loot Priority</p>
                    <ul className="space-y-1">
                      {b.lootPriority.map((l: string, li: number) => (
                        <li key={li} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.bestFor.map((bf: string, bi: number) => (
                      <span
                        key={bi}
                        className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground"
                      >
                        {bf}
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: For The King II Lore Store Codes and Unlocks */}
      <section
        id="lore-store-codes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Gift}
            linkKey="forTheKingIILoreStoreCodes"
            title={t.modules.forTheKingIILoreStoreCodes.title}
            intro={t.modules.forTheKingIILoreStoreCodes.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.forTheKingIILoreStoreCodes.cards.map(
              (c: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                      {c.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Status: {c.status} · Location: {c.location}
                  </p>
                  {c.rewards.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {c.rewards.map((r: string, ri: number) => (
                        <span
                          key={ri}
                          className="text-xs px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.25)]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{c.details}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: For The King II Combat and Loadouts Guide (accordion) */}
      <section id="combat-loadouts" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Swords}
            linkKey="forTheKingIICombatLoadouts"
            title={t.modules.forTheKingIICombatLoadouts.title}
            intro={t.modules.forTheKingIICombatLoadouts.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal space-y-3">
            {t.modules.forTheKingIICombatLoadouts.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/[0.02]"
                >
                  <button
                    onClick={() =>
                      setCombatExpanded(combatExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <Swords className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${combatExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {combatExpanded === index && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.summary}
                      </p>
                      <ul className="space-y-1.5 mb-3">
                        {item.rules.map((r: string, ri: number) => (
                          <li key={ri} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {r}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                        <p className="text-xs font-semibold mb-0.5 text-[hsl(var(--nav-theme-light))]">
                          Best Use
                        </p>
                        <p className="text-sm">{item.bestUse}</p>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: For The King II Multiplayer and Crossplay Guide (comparison) */}
      <section
        id="multiplayer-crossplay"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Globe}
            linkKey="forTheKingIIMultiplayerCrossplay"
            title={t.modules.forTheKingIIMultiplayerCrossplay.title}
            intro={t.modules.forTheKingIIMultiplayerCrossplay.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)]">
                  <th className="text-left p-3 border-b border-border font-semibold">
                    Feature
                  </th>
                  {t.modules.forTheKingIIMultiplayerCrossplay.platforms.map(
                    (p: string, pi: number) => (
                      <th
                        key={pi}
                        className="text-left p-3 border-b border-border font-semibold"
                      >
                        {p}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.forTheKingIIMultiplayerCrossplay.rows.map(
                  (row: any, ri: number) => (
                    <tr key={ri}>
                      <td className="p-3 border-b border-border font-medium align-top">
                        {row.feature}
                      </td>
                      <td className="p-3 border-b border-border text-sm text-muted-foreground align-top">
                        {row.steam}
                      </td>
                      <td className="p-3 border-b border-border text-sm text-muted-foreground align-top">
                        {row.xbox}
                      </td>
                      <td className="p-3 border-b border-border text-sm text-muted-foreground align-top">
                        {row.playstation}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="hidden md:block mt-4 space-y-1.5">
            {t.modules.forTheKingIIMultiplayerCrossplay.rows.map(
              (row: any, ri: number) => (
                <p key={ri} className="text-xs text-muted-foreground">
                  <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                    {row.feature}:{" "}
                  </span>
                  {row.note}
                </p>
              ),
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {t.modules.forTheKingIIMultiplayerCrossplay.rows.map(
              (row: any, ri: number) => (
                <div
                  key={ri}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <h4 className="font-bold mb-2 text-[hsl(var(--nav-theme-light))]">
                    {row.feature}
                  </h4>
                  <dl className="space-y-2 mb-3">
                    {[
                      ["Steam / PC", row.steam],
                      ["Xbox", row.xbox],
                      ["PlayStation", row.playstation],
                    ].map(([k, v], ci) => (
                      <div key={ci}>
                        <dt className="text-xs font-semibold">{k}</dt>
                        <dd className="text-sm text-muted-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-xs text-muted-foreground border-t border-border pt-2">
                    {row.note}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: For The King II Campaign Chapters and Quests */}
      <section id="campaign-chapters" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={MapIcon}
            linkKey="forTheKingIICampaignChapters"
            title={t.modules.forTheKingIICampaignChapters.title}
            intro={t.modules.forTheKingIICampaignChapters.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal space-y-4">
            {t.modules.forTheKingIICampaignChapters.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.summary}
                    </p>
                    <ul className="space-y-1.5">
                      {step.details.map((d: string, di: number) => (
                        <li key={di} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: For The King II Dark Carnival and Dungeon Crawl Guide */}
      <section
        id="dark-carnival"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeading
            icon={Skull}
            linkKey="forTheKingIIDarkCarnival"
            title={t.modules.forTheKingIIDarkCarnival.title}
            intro={t.modules.forTheKingIIDarkCarnival.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.forTheKingIIDarkCarnival.modes.map(
              (m: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                      {m.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                      {m.type}
                    </span>
                  </div>
                  <p className="text-sm mb-3">
                    <span className="font-semibold">Objective: </span>
                    <span className="text-muted-foreground">{m.objective}</span>
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-1.5">
                      Core Mechanics
                    </p>
                    <ul className="space-y-1">
                      {m.mechanics.map((mc: string, mi: number) => (
                        <li key={mi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {mc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1.5">
                      Best Preparation
                    </p>
                    <ul className="space-y-1">
                      {m.preparation.map((pr: string, pi: number) => (
                        <li key={pi} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {pr}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 6 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/9ukAYPuSzg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/ForTheKing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/IronOakGames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@CurveGamesOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
