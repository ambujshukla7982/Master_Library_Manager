import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Armchair, 
  Target, 
  Frown, 
  FileText,
  ChevronRight,
  Star,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Layout
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  
  if (user) {
    return <Redirect to="/home" />;
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg shadow-blue-600/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              LibraryMS
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <Link href="/books"><a className="hover:text-blue-600 transition-colors">Catalog</a></Link>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Stats</a>
            <a href="# testimonials" className="hover:text-blue-600 transition-colors">Stories</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-blue-600">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 rounded-xl px-6 font-bold transition-all active:scale-95">
                Join Library
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50 transition-all rounded-full blur-[140px] opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[140px] opacity-70" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-blue-100"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Powering Academic Excellence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[0.95]"
          >
            Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">Knowledge</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Experience a modern way of learning with our smart cataloging, instant seat booking, and community-driven reading goals.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/books">
              <Button size="lg" className="h-16 px-10 text-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-2xl rounded-2xl group transition-all hvr-grow">
                Browse Catalog
                <Search className="w-5 h-5 ml-2.5 text-white/70 group-hover:text-white transition-opacity" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all">
                Login / Sign Up
                <ChevronRight className="w-5 h-5 ml-1 opacity-50" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-sm font-black text-blue-600 tracking-[0.3em] uppercase mb-4">Core Capabilities</h2>
            <p className="text-5xl font-black text-slate-900 tracking-tight">Designed for the Modern Student</p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: Search, 
                title: "Smart Search", 
                desc: "Find any book instantly with our advanced filtering and real-time availability tracking.",
                color: "bg-blue-600"
              },
              { 
                icon: Armchair, 
                title: "Seat Booking", 
                desc: "Reserve your favorite study spot in the reading room before you even arrive.",
                color: "bg-indigo-600"
              },
              { 
                icon: Target, 
                title: "Reading Goals", 
                desc: "Set personal targets, track your progress, and get curated book recommendations.",
                color: "bg-amber-600"
              },
              { 
                icon: Frown, 
                title: "Fine Management", 
                desc: "Stay updated on your due dates and manage overdue fines with seamless online payments.",
                color: "bg-rose-600"
              },
              { 
                icon: FileText, 
                title: "Export Reports", 
                desc: "Generate detailed reading logs and borrowing history reports with a single click.",
                color: "bg-emerald-600"
              },
              { 
                icon: Layout, 
                title: "Intuitive UI", 
                desc: "A clean, modern interface that makes library management a delightful experience.",
                color: "bg-slate-900"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-${feature.color}/20 ${feature.color}`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {[
              { label: "Total Books", value: "1000+", icon: BookOpen },
              { label: "Categories", value: "20+", icon: Layout },
              { label: "Active Members", value: "500+", icon: Users },
              { label: "Access", value: "24/7", icon: Clock }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center group">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 lg:mx-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-blue-400 tracking-[0.3em] uppercase mb-4">Wide Selection</h2>
            <p className="text-5xl font-black tracking-tight">Explore Diverse Categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              "Engineering", "Medical", "Law", "Commerce", "Arts", 
              "Sciences", "Mathematics", "Economics", "Psychology", "Technology"
            ].map((cat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group text-center">
                 <div className="text-3xl mb-4 group-hover:scale-125 transition-transform inline-block">📚</div>
                 <div className="font-bold text-lg">{cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-sm font-black text-blue-600 tracking-[0.3em] uppercase mb-4">Testimonials</h2>
             <p className="text-5xl font-black text-slate-900 tracking-tight">What Our Students Say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "Arjun Sharma", dept: "Computer Science", text: "The seat booking feature is a game changer for me. No more searching for seats during exams!" },
              { name: "Priya Patel", dept: "Medicine", text: "I found medical journals here that weren't available anywhere else. Truly a life saver for my research." },
              { name: "Rahul Verma", dept: "Law", text: "The clean UI and easy book tracking make it so simple to stay on top of my reading goals." }
            ].map((t, i) => (
              <motion.div key={i} {...fadeIn} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
                <div className="absolute -top-6 left-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">"</div>
                </div>
                <p className="text-slate-600 italic mb-8 font-medium leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-blue-600 border-2 border-white shadow-sm">{t.name[0]}</div>
                  <div>
                    <div className="font-black text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.dept}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="bg-blue-600 rounded-xl p-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">LibraryMS</span>
              </div>
              <p className="text-slate-500 max-w-md mb-10 text-lg leading-relaxed">
                Empowering the next generation of scholars with digital-first library management tools. Your partner in the journey of lifelong learning.
              </p>
              <div className="flex items-center gap-6">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">
                    <Globe className="w-5 h-5" />
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><Link href="/"><a className="hover:text-blue-600 transition-colors">Home</a></Link></li>
                <li><Link href="/books"><a className="hover:text-blue-600 transition-colors">Catalog</a></Link></li>
                <li><Link href="/login"><a className="hover:text-blue-600 transition-colors">Login</a></Link></li>
                <li><a href="mailto:contact@library.com" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
               <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs mb-8">Office</h4>
               <p className="text-slate-500 font-bold leading-relaxed">
                 University Road, Academic Block II<br />
                 IIT Campus, Delhi 110016<br />
                 contact@library.com
               </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs font-black uppercase tracking-widest border-t border-slate-200 pt-10">
            <p>© 2024 LibraryMS. Built for Excellence.</p>
            <p className="flex items-center gap-10 mt-6 md:mt-0">
               <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
               <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
