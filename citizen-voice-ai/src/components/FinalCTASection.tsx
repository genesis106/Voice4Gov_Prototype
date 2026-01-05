import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Transform Citizen Communication with AI Voice Agents
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-10">
            Join Voice4Gov AI to serve millions of citizens more effectively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 group"
              onClick={() => navigate('/signup')}
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;