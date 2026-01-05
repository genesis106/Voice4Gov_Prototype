import { 
  PhoneCall, 
  Users, 
  Plug, 
  Shield, 
  BarChart2, 
  Settings2,
  Zap,
  Headphones 
} from "lucide-react";

const capabilities = [
  {
    icon: PhoneCall,
    title: "Simultaneous Calls",
    description: "Handle thousands of calls at once without wait times.",
  },
  {
    icon: Users,
    title: "Human Handoff",
    description: "Seamlessly transfer complex cases to human agents.",
  },
  {
    icon: Plug,
    title: "API Integration",
    description: "Connect with existing government systems and databases.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security meeting government standards.",
  },
  {
    icon: BarChart2,
    title: "Analytics & Logs",
    description: "Real-time dashboards and detailed call transcripts.",
  },
  {
    icon: Settings2,
    title: "Custom Workflows",
    description: "Design unique conversation flows per ministry.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Go live within hours, not weeks or months.",
  },
  {
    icon: Headphones,
    title: "Natural Conversations",
    description: "Human-like voice interactions that citizens trust.",
  },
];

const CapabilitiesSection = () => {
  return (
    <section id="capabilities" className="section-padding bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Platform Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to deploy, manage, and scale AI voice agents across your organization.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <capability.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{capability.title}</h3>
              <p className="text-sm text-muted-foreground">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
