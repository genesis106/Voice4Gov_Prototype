import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Clock, TrendingUp } from "lucide-react";
const PartnerSection = () => {
  return <section className="section-padding bg-background relative overflow-hidden py-[10px]">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-200 mb-8">
  <img
    src="/logo.png"
    alt="Voice4Gov logo"
    className="h-18 w-auto"
  />
</div>


          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your 24/7 Digital{" "}
            <span className="text-gradient">Citizen Support Partner</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Always available. Always consistent. Always scalable.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-card rounded-full border border-border/50 shadow-sm">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Zero Downtime</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-card rounded-full border border-border/50 shadow-sm">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-card rounded-full border border-border/50 shadow-sm">
              <Headphones className="w-5 h-5 text-trust-blue" />
              <span className="text-sm font-medium">Human-like Experience</span>
            </div>
          </div>

          {/* CTA */}
          <Button variant="hero" size="xl" className="group">
            Start Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>;
};
export default PartnerSection;