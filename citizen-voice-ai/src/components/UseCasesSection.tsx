import { BarChart3, FileEdit, Ticket, ScrollText, Globe2, Clock } from "lucide-react";

const useCases = [
  {
    icon: BarChart3,
    title: "Population & Feedback Surveys",
    description: "Conduct large-scale surveys with natural voice conversations, collecting structured data automatically.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileEdit,
    title: "Form Filling Assistance",
    description: "Help citizens complete complex government forms through guided voice conversations.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Ticket,
    title: "Ticket & Grievance Raising",
    description: "Accept and track citizen complaints with automatic categorization and follow-up.",
    color: "bg-trust-blue/10 text-trust-blue",
  },
  {
    icon: ScrollText,
    title: "Policy Query Handling",
    description: "Answer questions about government schemes, eligibility, and application processes.",
    color: "bg-gov-teal/10 text-gov-teal",
  },
  {
    icon: Globe2,
    title: "Multilingual Citizen Support",
    description: "Communicate in the citizen's preferred language, including regional dialects and Hinglish.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "After-hours Availability",
    description: "Provide round-the-clock support when human agents are unavailable.",
    color: "bg-accent/10 text-accent",
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Designed for Every Ministry's Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            From census data collection to citizen support, GovVoice AI handles it all.
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="card-elevated p-8 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl ${useCase.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <useCase.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
