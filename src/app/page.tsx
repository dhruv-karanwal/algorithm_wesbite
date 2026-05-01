import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AlgorithmExplorer from "@/components/sections/AlgorithmExplorer";
import SimulationEngine from "@/components/simulation/SimulationEngine";
import Analytics from "@/components/sections/Analytics";
import Scenarios from "@/components/sections/Scenarios";
import AppShowcase from "@/components/sections/AppShowcase";

export const metadata = {
  title: "Emergency Route Optimizer | DSA Educational Project",
  description: "Learn how Graph Algorithms optimize emergency ambulance routing in modern cities.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <Hero />
      
      <section id="overview" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">The <span className="text-emergency">Problem</span> & Our <span className="text-primary">Solution</span></h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              In emergency medical services, every minute delayed increases mortality risk by up to 7%. 
              Traditional GPS routing often fails to account for dynamic urban constraints like heavy traffic, 
              emergency-only lanes, and sudden road blocks. 
              <br /><br />
              <strong>Emergency Route Optimizer (ERO)</strong> is a data-driven platform that demonstrates how 
              Data Structures and Algorithms (DSA) can be leveraged to find truly optimal paths in complex graphs. 
              By implementing specialized versions of <strong>Dijkstra</strong> and <strong>A* Search</strong>, 
              we've created a system that prioritizes speed and reliability above all.
            </p>
          </div>
        </div>
      </section>

      <AlgorithmExplorer />
      
      <SimulationEngine />
      
      <Analytics />
      
      <Scenarios />
      
      <AppShowcase />
      
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Conclusion & Learnings</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            This project illustrates that DSA isn't just about passing interviews—it's about building 
            systems that can save lives. Through this exploration, we've seen how informed search 
            beats brute-force, and how data structures like Priority Queues are the unsung heroes of navigation.
          </p>
          <div className="inline-flex gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-primary">Optimality</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Learned</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-emergency">Efficiency</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Visualized</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-blue-400">Scale</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Mastered</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
