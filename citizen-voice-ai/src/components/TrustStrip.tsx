import { Building2 } from "lucide-react";

const TrustStrip = () => {
  return (
    <section className="py-12 border-y border-border/50 bg-secondary/30">
      <div className="section-container">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Built for governments, public institutions, and large-scale citizen engagement
        </p>
        
        {/* Ministry Logo Placeholders */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Building2 className="w-8 h-8" />
              <span className="text-sm font-medium hidden sm:inline">Ministry {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
