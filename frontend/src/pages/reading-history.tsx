import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, RotateCcw, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";

export default function ReadingHistoryPage() {
  const { user } = useAuth();

  if (!user) return <Redirect to="/login" />;

  const { data: loans, isLoading } = useQuery<any[]>({
    queryKey: ["/loans/my"],
  });

  const history = loans?.filter(l => l.status === "RETURNED") || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 rounded-2xl p-2.5 shadow-lg shadow-blue-600/20">
          <HistoryIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reading History</h1>
          <p className="text-slate-500">A journey through your past reads and accomplishments.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : history.length > 0 ? (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 py-6">
            <CardTitle>Returned Books</CardTitle>
            <CardDescription>You have read {history.length} books so far.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="py-4">Book Details</TableHead>
                  <TableHead>Borrowed Date</TableHead>
                  <TableHead>Returned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((loan) => (
                  <TableRow key={loan.id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                           <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{loan.bookTitle}</div>
                          <div className="text-xs text-slate-500">{loan.author}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {new Date(loan.borrowDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 capitalize">
                        {loan.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                        <RotateCcw className="w-4 h-4 mr-2" /> Re-borrow
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-200 shadow-sm">
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HistoryIcon className="w-8 h-8 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No history yet</h3>
           <p className="text-slate-500 max-w-sm mx-auto mb-8">
             Books you've borrowed and returned will appear here. Start your reading journey today!
           </p>
           <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">Browse Books</Button>
        </div>
      )}
    </div>
  );
}
