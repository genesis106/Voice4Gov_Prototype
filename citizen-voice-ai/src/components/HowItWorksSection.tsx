import { Bot, Database, Phone, Rocket, ArrowRight } from "lucide-react";
const steps = [{
  icon: Bot,
  number: "01",
  title: "Create Your Voice Agent",
  description: "Each ministry designs a custom voice agent tailored to their specific citizen interaction needs."
}, {
  icon: Database,
  number: "02",
  title: "Upload Knowledge Base",
  description: "Add FAQs, policy documents, and response scripts. Select supported languages including Hindi and regional dialects."
}, {
  icon: Phone,
  number: "03",
  title: "Add Phone Directories",
  description: "Import citizen contact lists for outbound campaigns or connect your existing phone numbers for inbound calls."
}, {
  icon: Rocket,
  number: "04",
  title: "Go Live Instantly",
  description: "Your AI agent starts handling calls immediately—conducting surveys, answering queries, and resolving issues."
}];
const HowItWorksSection = () => {
  return <section id="how-it-works" className="section-padding bg-navy text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="section-container relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Deploy in Minutes, Not Months
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Getting started is simple. No complex integrations or lengthy setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-primary/20">
                  <ArrowRight className="absolute -right-3 -top-2 w-5 h-5 text-primary/40" />
                </div>}

              <div className="relative">
                {/* Step Number */}
                <div className="text-6xl font-bold mb-4 transition-colors text-destructive-foreground">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 transition-all group-hover:bg-primary/30 group-hover:scale-110">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-primary-foreground">
                  {step.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>)}
        </div>

        {/* Deployed Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/20 rounded-full">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">Average deployment time: Under less than 10 mins!</span>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;