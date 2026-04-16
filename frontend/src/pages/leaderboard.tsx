import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Trophy, 
  Medal, 
  Hash,
  Crown,
  TrendingUp,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery<any[]>({
    queryKey: ["/api/analytics/leaderboard"],
    queryFn: async () => {
      // In a real app, the TanStack Query client would handle this via the base URL
      const res = await fetch("/api/analytics/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    }
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-amber-500 fill-amber-500/20" />;
      case 1: return <Medal className="w-6 h-6 text-slate-400 fill-slate-400/20" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700/20" />;
      default: return <span className="text-sm font-bold text-slate-400">#{index + 1}</span>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 rounded-2xl p-3 shadow-lg shadow-amber-200/50">
            <Trophy className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Reader Leaderboard</h1>
            <p className="text-slate-500 mt-1">Celebrating our most dedicated book enthusiasts this month.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
           <TrendingUp className="w-4 h-4 text-emerald-500" />
           <span className="text-sm font-medium text-slate-600">Updated hourly</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard?.map((user, index) => (
                <Card key={user.userId} className={cn(
                  "border-none shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] rounded-[1.5rem] overflow-hidden",
                  index === 0 ? "bg-amber-50/50 ring-2 ring-amber-200" : "bg-white"
                )}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-10 flex justify-center">
                        {getRankIcon(index)}
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                        {user.name?.[0]}
                      </div>
                      
                      <div>
                        <div className="font-bold text-slate-900 leading-none mb-1">{user.name}</div>
                        <div className="text-xs text-slate-400 capitalize">{user.role?.replace('ROLE_', '').toLowerCase()}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">{user.booksRead}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Books Read</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <CardHeader>
              <Users className="w-8 h-8 mb-2 opacity-80" />
              <CardTitle className="text-xl">Community Stats</CardTitle>
              <CardDescription className="text-indigo-100 opacity-80">Our collective achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-indigo-100 text-sm">Total Readers</span>
                <span className="font-bold">1,240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-100 text-sm">Books Read This Month</span>
                <span className="font-bold">8,542</span>
              </div>
              <div className="h-px bg-white/10" />
              <p className="text-xs text-indigo-100 opacity-70 leading-relaxed">
                Join our reading challenges and climb the leaderboard! Top readers every month receive exclusive library perks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Medal className="w-5 h-5 text-amber-500" />
                 Hall of Fame
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                  {[
                    { name: "Year 2023", reader: "Sarah Jenkins", count: 412 },
                    { name: "Year 2024", reader: "Michael Chen", count: 528 }
                  ].map((award, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{award.name}</span>
                      <span className="text-sm font-bold text-slate-900">{award.reader}</span>
                      <span className="text-xs text-slate-500">{award.count} Books</span>
                    </div>
                  ))}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
