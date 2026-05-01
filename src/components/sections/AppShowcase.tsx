"use client";

import { motion } from "framer-motion";
import { Smartphone, Shield, Zap, Globe } from "lucide-react";
import Image from "next/image";

export default function AppShowcase() {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From DSA Logic to <br />
                <span className="text-blue-300">Life-Saving Application</span>
              </h2>
              <p className="text-blue-100/70 text-lg max-w-xl">
                The same algorithms you explored above are implemented in our Flutter-based mobile application, 
                providing emergency responders with real-time navigation and decision support.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Smartphone />, title: "Native Flutter", desc: "Built with Flutter for smooth, high-performance UI across Android and iOS." },
                { icon: <Shield />, title: "Secure Data", desc: "Encrypted hospital and patient location data for HIPAA compliance." },
                { icon: <Zap />, title: "Instant Sync", desc: "Real-time traffic updates synchronized every 5 seconds." },
                { icon: <Globe />, title: "Offline Maps", desc: "Cached graph data ensures routing works even in low-connectivity areas." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                >
                  <div className="text-blue-300 mb-4">{item.icon}</div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-blue-100/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            {/* Using the generated image path here. In a real app, you'd use a static import or a valid URL. */}
            {/* For this demo, I'll use a placeholder structure or the actual generated path if accessible. */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
               <img 
                 src="/ambulance_app_mockup.png" 
                 alt="App Mockup" 
                 className="w-full h-full object-cover"
               />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -right-4 top-20 bg-white text-navy p-4 rounded-2xl shadow-xl border border-slate-100"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emergency/10 flex items-center justify-center text-emergency font-bold">1</div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Current Route</div>
                    <div className="text-sm font-bold">Optimized via A*</div>
                  </div>
               </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -left-4 bottom-20 bg-white text-navy p-4 rounded-2xl shadow-xl border border-slate-100"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">4m</div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Arrival</div>
                    <div className="text-sm font-bold">Fastest Response</div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
