const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
  <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center">
    <img
      src="/logo.png"
      alt="Voice4Gov logo"
      className="h-12 w-auto"
    />
  </div>
  <span className="text-lg font-bold">Voice4Gov AI</span>
</div>


          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
              Use Cases
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#capabilities" className="text-muted-foreground hover:text-foreground transition-colors">
              Capabilities
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Voice4Gov AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
