import { Activity, Globe, Mail, Users } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emergency flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">ERO <span className="text-primary">Optimizer</span></span>
            </Link>
            <p className="text-sm text-foreground/50 max-w-sm">
              An educational project exploring the power of Data Structures and Algorithms in optimizing emergency response systems for modern cities.
            </p>
            <div className="flex gap-4">
              <Globe className="w-5 h-5 text-foreground/40 hover:text-primary cursor-pointer" />
              <Mail className="w-5 h-5 text-foreground/40 hover:text-primary cursor-pointer" />
              <Users className="w-5 h-5 text-foreground/40 hover:text-primary cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground/40">Resources</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li className="hover:text-primary cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Algorithm Guide</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Flutter Codebase</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Research Paper</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground/40">Contact</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li>support@ero-optimizer.edu</li>
              <li>DSA Project Lab, Room 402</li>
              <li>University of Engineering</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/40">
          <p>© 2026 Emergency Route Optimizer Project. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
