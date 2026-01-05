import { Bot, Globe, PhoneCall, FileCheck, CheckCircle2 } from "lucide-react";
const solutions = [{
  icon: Bot,
  title: "24/7 AI Voice Agents",
  description: "Always available to assist citizens"
}, {
  icon: Globe,
  title: "Multilingual Conversations",
  description: "Supports Hinglish, Hindi, and English - with more languages coming soon"
}, {
  icon: PhoneCall,
  title: "Inbound & Outbound Calls",
  description: "Reach citizens proactively or respond instantly"
}, {
  icon: FileCheck,
  title: "Automated Workflows",
  description: "Handle surveys, forms, and grievances automatically"
}];
const SolutionSection = () => {
  return <section className="section-padding bg-secondary/30 px-0 py-[10px]">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              The Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              AI Voice Agents That Work at{" "}
              <span className="text-gradient">National Scale</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              GovVoice AI empowers every ministry to deploy intelligent voice agents that understand citizens, speak their language, and resolve their needs—automatically.
            </p>

            <div className="space-y-4">
              {solutions.map((solution, index) => <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-card transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <solution.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-card rounded-3xl shadow-xl border border-border/50 p-8 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-2 gradient-hero" />
              
              <div className="space-y-6">
                {/* Visual illustration */}
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full gradient-hero opacity-20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bot className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4">
                  {[{
                  label: "Languages",
      value: "3",
                }, {
                  label: "Uptime",
                  value: "99.9%"
                }, {
                  label: "Response",
                  value: "<1s"
                }, {
                  label: "Accuracy",
                  value: "98%"
                }].map((stat, index) => <div key={index} className="text-center p-4 bg-secondary/50 rounded-xl">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            
          </div>
        </div>
      </div>
    </section>;
};
export default SolutionSection;