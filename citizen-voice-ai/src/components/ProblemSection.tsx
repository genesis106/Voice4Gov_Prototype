import { DollarSign, BookCheck, FileStack, Megaphone } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "Manual Call Centers Are Expensive",
    description: "Staffing large call centers drains budgets while struggling to meet demand during peak hours.",
  },
  {
    icon: BookCheck,
    title: "Knowledge Accuracy",
    description: "Eliminating human error and inconsistent answers by using a centralized Knowledge Base, ensuring the AI provides the exact same source of truth to every citizen.",
  },
  {
    icon: FileStack,
    title: "Administrative Bottlenecks",
    description: "Automating repetitive tasks like form filling and ticket raising, which reduces manual data entry and allows human staff to focus on critical decision-making.",
  },
  {
    icon: Megaphone,
    title: "Proactive Outreach",
    description: "Transforming government from reactive to proactive by enabling mass outbound calls for rapid survey collection, feedback, and verification of benefit delivery.",
  },
];

const ProblemSection = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Government Communication at a Crossroads
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional methods can't keep up with the scale and diversity of modern citizen needs.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="card-elevated p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
