import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="section-container md:py-32 py-[100px]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-fade-up">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Trusted by Government Organizations
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up animation-delay-200">
              One Platform.{" "}
              <span className="text-gradient">Many Ministries.</span>{" "}
              Infinite Conversations.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-up animation-delay-400">
              Build AI-powered voice agents for surveys, grievance handling, form assistance, and policy queries, at national scale.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up animation-delay-600">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="hero-outline" 
                size="xl"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-8 animate-fade-up animation-delay-400">
            <div className="relative">
              {/* Main Visual Card */}
              <div className="relative bg-card rounded-3xl shadow-xl border border-border/50 p-8 overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 gradient-hero opacity-10 blur-2xl" />
                
                {/* Voice Wave Animation */}
                <div className="flex items-center justify-center py-16">
                  <div className="relative flex items-center gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`,
                          animationDelay: `${i * 100}ms`,
                          animationDuration: `${800 + Math.random() * 400}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sample Conversation */}
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                      "Namaste! Main aapki kaise madad kar sakta hoon?"
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                      "Mujhe ration card ke baare mein jaankari chahiye"
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card rounded-xl shadow-lg border border-border/50 p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Survey Complete</div>
                    <div className="text-xs text-muted-foreground">1,234 responses</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-14 -right-6 bg-card rounded-xl shadow-lg border border-border/50 p-4 animate-float animation-delay-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Form Filled</div>
                    <div className="text-xs text-muted-foreground">Auto-processed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;