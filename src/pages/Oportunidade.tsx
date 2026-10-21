/*
 * Oportunidade — réplica da Home (root) em /oportunidade
 *
 * Diferenças em relação à Home:
 *  - formulários sem UF/Cidade
 *  - sem Meta (Pixel, fbp/fbc/fbclid) — campanhas próprias, sem conflito
 *  - botão flutuante de WhatsApp e notificações de novos cadastros
 *
 * As demais seções são as mesmas da Home.
 */

import AnnouncementBar from "@/components/AnnouncementBar";
import InvestmentModelsSection from "@/components/InvestmentModelsSection";
import MarketSection from "@/components/MarketSection";
import GrowthSection from "@/components/GrowthSection";
import ModelSection from "@/components/ModelSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import StickyNav from "@/components/StickyNav";
import FranchiseeMotivationSection from "@/components/FranchiseeMotivationSection";
import HelpExperienceVideoSection from "@/components/HelpExperienceVideoSection";
import TeamSection from "@/components/TeamSection";
import TechSection from "@/components/TechSection";
import HeroSectionOp from "@/components/oportunidade/HeroSectionOp";
import CTASectionOp from "@/components/oportunidade/CTASectionOp";
import WhatsAppFloat from "@/components/oportunidade/WhatsAppFloat";
import SignupToast from "@/components/oportunidade/SignupToast";

export default function Oportunidade() {
  return (
    <div className="min-h-screen">
      <StickyNav />
      <AnnouncementBar />
      <HeroSectionOp />
      <MarketSection />
      <TechSection />
      <InvestmentModelsSection />
      <GrowthSection />
      <TestimonialsSection />
      <FranchiseeMotivationSection />
      <ModelSection atuacaoTitle="Administrativo" />
      <HelpExperienceVideoSection />
      <TeamSection />
      <NewsSection robustImages />
      <CTASectionOp />
      <Footer />

      <WhatsAppFloat />
      <SignupToast />
    </div>
  );
}
