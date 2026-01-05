import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import UseCasesSection from "@/components/UseCasesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import PartnerSection from "@/components/PartnerSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <UseCasesSection />
        <HowItWorksSection />
        <CapabilitiesSection />
        <PartnerSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
