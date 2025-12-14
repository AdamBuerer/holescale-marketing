import { Link } from 'react-router-dom';
import { Twitter, Linkedin } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="light" width={140} className="mb-3 md:mb-4" />
            <p className="mb-3 md:mb-4 opacity-90 text-sm">
              Filling holes in your scalability
            </p>
            <p className="text-xs opacity-75 mb-4">
              Based in Colorado, USA
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="opacity-90 hover:opacity-100 transition-opacity">Features</Link></li>
              <li><Link to="/pricing" className="opacity-90 hover:opacity-100 transition-opacity">Pricing</Link></li>
              <li><Link to="/how-it-works" className="opacity-90 hover:opacity-100 transition-opacity">How it Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="opacity-90 hover:opacity-100 transition-opacity">About</Link></li>
              <li><Link to="/contact" className="opacity-90 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><a href="mailto:careers@holescale.com" className="opacity-90 hover:opacity-100 transition-opacity">Careers</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources" className="opacity-90 hover:opacity-100 transition-opacity">Blog</Link></li>
              <li><Link to="/faq" className="opacity-90 hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link to="/glossary" className="opacity-90 hover:opacity-100 transition-opacity">Glossary</Link></li>
              <li><Link to="/faq" className="opacity-90 hover:opacity-100 transition-opacity">Help Center</Link></li>
              <li><Link to="/resources" className="opacity-90 hover:opacity-100 transition-opacity">Guides</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="opacity-90 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              <li><Link to="/privacy" className="opacity-90 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm opacity-90">
            © {new Date().getFullYear()} HoleScale. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://linkedin.com/company/holescale" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/holescale" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
