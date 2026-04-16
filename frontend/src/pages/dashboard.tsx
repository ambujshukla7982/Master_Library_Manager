import { useGetDashboard, useSearchBooks } from "@workspace/api-client-react";
import { useMyNotifications, useMyFines, useMyGoals, useMonthlyLoans, useGenreStats } from "@/lib/api-extra";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Library, 
  Users, 
  BookMarked, 
  AlertCircle, 
  BookOpen, 
  Loader2, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Plus, 
  BookPlus, 
  CalendarPlus,
  Sparkles,
  ChevronRight,
  History as HistoryIcon,
  Trophy,
  ArrowRight
} from "lucide-react";
import { formatDate, formatCurrency, getCategoryIcon } from "@/lib/utils";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"];

export default function DashboardPage() {
  const { isStaff, isAdmin, user } = useAuth();
  const { data: dashData, isLoading: isDashLoading } = useGetDashboard();
  const { data: booksData, isLoading: isBooksLoading } = useSearchBooks({ page: 0, size: 5 });
  const { data: notifications } = useMyNotifications();
  const { data: fines } = useMyFines();
  const { data: goals } = useMyGoals();
  const { data: monthlyData } = useMonthlyLoans();
  const { data: genreData } = useGenreStats();

  if (isDashLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Initializing Dashboard</p>
      </div>
    );
  }

  const currentGoal = goals?.[0];
  const unpaidFines = fines?.filter((f) => !f.paid) ?? [];
  const totalUnpaidFines = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

  const stats = isStaff ? [
    { label: "Total Books", value: dashData?.totalBooks ?? 0, icon: Library, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Loans", value: dashData?.activeLoans ?? 0, icon: BookMarked, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Overdue", value: dashData?.overdueLoans ?? 0, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Members", value: dashData?.totalUsers ?? 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  ] : [
    { label: "Borrowed", value: dashData?.activeLoans ?? 0, icon: BookMarked, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Returning", value: dashData?.overdueLoans ?? 0, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Fines", value: `₹${totalUnpaidFines.toFixed(0)}`, icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Goal Progress", value: currentGoal ? `${currentGoal.completedBooks}/${currentGoal.targetBooks}` : "0/0", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthlyData?.map((m: any, i: number) => ({
    month: monthNames[m.month ? m.month - 1 : i] || monthNames[i],
    loans: m.count || m.loans || 0,
  })) ?? monthNames.map(m => ({ month: m, loans: 0 }));

  const pieData = (genreData ?? dashData?.categoryStats ?? []).map((g: any, i: number) => ({
    name: g.category || g.genre || g.categoryKey || `Genre ${i + 1}`,
    value: Number(g.loans || g.count || g.value || 0),
  })).filter((d: any) => d.value > 0);

  const newArrivals = booksData?.content ?? [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-4">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Real-time Analytics Enabled</span>
           </motion.div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
             {isStaff ? "Library Command Center" : `Good Morning, ${user?.name?.split(" ")[0] ?? "Reader"}`}
           </h1>
           <p className="text-slate-500 mt-2 font-medium">
             {isStaff ? "Monitoring collection performance and member engagement." : "Track your reading journey and discover new titles."}
           </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Link href="/books">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 rounded-2xl h-14 px-8 font-black text-white shadow-xl shadow-slate-200 transition-all active:scale-95">
                 Browse Catalog
              </Button>
           </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white hover:shadow-blue-600/5 transition-all">
                <CardContent className="p-8">
                   <div className={`p-4 rounded-2xl ${s.bg} w-fit mb-6`}>
                      <Icon className={`w-6 h-6 ${s.color}`} />
                   </div>
                   <div className="text-4xl font-black text-slate-900 mb-1">{s.value}</div>
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Summary Tooltips or Mini Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                 <CardHeader className="p-8">
                    <Trophy className="w-10 h-10 mb-4 opacity-80" />
                    <CardTitle className="text-2xl font-black">Reading Goals</CardTitle>
                    <CardDescription className="text-indigo-100 opacity-70 font-medium">Keep pushing your boundaries!</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 pt-0">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-3xl font-black">75%</span>
                       <span className="text-xs font-bold uppercase tracking-widest text-indigo-100 opacity-60">This Quarter</span>
                    </div>
                    <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                       <div className="bg-white h-full transition-all w-[75%]" />
                    </div>
                    <Link href="/profile">
                       <Button variant="ghost" className="mt-6 text-white hover:bg-white/10 p-0 font-bold flex items-center gap-2">
                          View details <ChevronRight className="w-4 h-4" />
                       </Button>
                    </Link>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-emerald-600 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <CardHeader className="p-8">
                    <HistoryIcon className="w-10 h-10 mb-4 opacity-80" />
                    <CardTitle className="text-2xl font-black">Your History</CardTitle>
                    <CardDescription className="text-emerald-100 opacity-70 font-medium">A recap of your favorite reads.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 pt-0">
                    <div className="bg-white/10 rounded-2xl p-4 mb-6">
                       <div className="text-sm font-bold">Currently Reading</div>
                       <div className="text-lg font-black truncate">Fundamentals of Algorithms</div>
                    </div>
                    <Link href="/reading-history">
                       <Button variant="ghost" className="text-white hover:bg-white/10 p-0 font-bold flex items-center gap-2">
                          Full history <ChevronRight className="w-4 h-4" />
                       </Button>
                    </Link>
                 </CardContent>
              </Card>
           </div>

           {/* Performance Chart */}
           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white p-8">
              <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Circulation Trend</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Monthly borrowing frequency for 2024</CardDescription>
                 </div>
                 <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-100">Yearly Context</div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: "12px 20px" }} />
                      <Line type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={4} dot={false} activeDot={{ r: 8, fill: "#3b82f6", strokeWidth: 4, stroke: "#fff" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
           {/* New Arrivals Section */}
           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-black text-slate-900 uppercase">New Arrivals</CardTitle>
                    <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 px-4">
                 {isBooksLoading ? (
                   <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></div>
                 ) : (
                   <div className="space-y-2">
                      {newArrivals.map((book) => (
                        <Link key={book.id} href="/books">
                          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                             <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-200 transition-colors">
                                <BookOpen className="w-6 h-6" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors underline-offset-4 decoration-blue-600 truncate">{book.title}</div>
                                <div className="text-xs text-slate-400 font-bold truncate">{book.author}</div>
                                <div className="mt-1">
                                   <span className="inline-block bg-slate-100 text-[9px] font-black text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                      {book.subCategory.replace(/_/g, ' ')}
                                   </span>
                                </div>
                             </div>
                          </div>
                        </Link>
                      ))}
                   </div>
                 )}
                 <Link href="/books">
                    <Button variant="ghost" className="w-full mt-6 rounded-2xl h-12 font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2">
                       Explore Catalog <ArrowRight className="w-4 h-4" />
                    </Button>
                 </Link>
              </CardContent>
           </Card>

           {/* Genre Pie Chart */}
           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white p-8">
             <CardHeader className="px-0 pt-0 pb-4">
               <CardTitle className="text-xl font-black text-slate-900 uppercase">Reader Interest</CardTitle>
             </CardHeader>
             <CardContent className="px-0">
               <div className="h-64">
                 {pieData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                        data={pieData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={85} 
                        paddingAngle={5}
                        dataKey="value"
                       >
                         {pieData.map((_: any, i: number) => (
                           <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} className="outline-none" />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-300">
                      <TrendingUp className="w-10 h-10 mb-4 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest">No stats yet</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
