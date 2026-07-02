/*
 * Home — Landing Page HelpMultas Franquias
 * Design Philosophy: "Narrativa Progressiva" — Storytelling Imersivo
 * Colors: Navy (#0A1628) + Gold (#D4A017) + Off-white (#F8F6F0)
 * Typography: Fraunces (display) + Plus Jakarta Sans (body) + Bebas Neue (data)
 *
 * Sections:
 * 1. AnnouncementBar — Urgência no topo
 * 2. HeroSection — Headline + formulário
 * 3. MarketSection — Dados de mercado (o problema/oportunidade)
 * 4. ModelSection — Done-For-You + timeline
 * 5. TestimonialsSection — Casos de sucesso
 * 6. DifferentialsSection — Por que HelpMultas (bento grid)
 * 7. ComparisonSection — Tabela comparativa
 * 8. FAQSection — Perguntas frequentes
 * 9. CTASection — CTA final com urgência
 * 10. Footer
 */

import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/HeroSection";
import InvestmentModelsSection from "@/components/InvestmentModelsSection";
import MarketSection from "@/components/MarketSection";
import GrowthSection from "@/components/GrowthSection";
import ModelSection from "@/components/ModelSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyNav from "@/components/StickyNav";
import FranchiseeMotivationSection from "@/components/FranchiseeMotivationSection";
import HelpExperienceVideoSection from "@/components/HelpExperienceVideoSection";
import TeamSection from "@/components/TeamSection";
import TechSection from "@/components/TechSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Sticky nav (appears after scroll) */}
      <StickyNav />

      {/* 1. Urgency announcement bar */}
      <AnnouncementBar />

      {/* 2. Hero: headline + form */}
      <HeroSection />

      

      {/* 3. Market data: the opportunity */}
      <MarketSection />

      <TechSection />

      {/* 2.5. Investment models: Home Based vs Loja Física */}
      <InvestmentModelsSection />
      
      {/* 3.5. Growth factors: why the market grows */}
      <GrowthSection />

      {/* 4. Testimonials: social proof */}
      <TestimonialsSection />

      {/* 5. Differentials: why HelpMultas (bento grid) */}
      <FranchiseeMotivationSection />

      {/* 6. Model: Done-For-You explanation */}
      <ModelSection />

      {/* 7. Experience: the size of the aid fines */}
      <HelpExperienceVideoSection />

      {/* 8. Team: our team */}
      <TeamSection />

      {/* 9. News: media validation */}
      <NewsSection />

      {/* 10. Final CTA with urgency */}
      <CTASection />

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
