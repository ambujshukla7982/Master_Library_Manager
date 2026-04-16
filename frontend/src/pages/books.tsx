import { useState, useEffect } from "react";
import { useSearchBooks, useGetCategories, usePlaceReservation, useCreateBook, BookResponse as BookResp } from "@workspace/api-client-react";
import { useBookReviews, useCreateReview, useBookCopies } from "@/lib/api-extra";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  BookOpen, 
  X, 
  Loader2, 
  MapPin, 
  Tag, 
  Star, 
  Grid3X3, 
  List, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  ArrowRight,
  Book
} from "lucide-react";
import { cn, getCategoryIcon } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const COLLEGE_CATEGORIES = [
  "COMPUTER_SCIENCE", "ELECTRONICS_ELECTRICAL", "MECHANICAL", "CIVIL", 
  "MATHEMATICS", "PHYSICS", "CHEMISTRY", "MEDICAL_HEALTHCARE", 
  "LAW_LEGAL", "COMMERCE_ACCOUNTING", "MANAGEMENT_MBA", "ARTS_HUMANITIES", 
  "ENGLISH_LITERATURE", "ECONOMICS", "PSYCHOLOGY_SOCIOLOGY", "DATA_SCIENCE_AI_ML",
  "ENVIRONMENT_AGRICULTURE", "ARCHITECTURE_DESIGN", "COMPETITIVE_EXAM_PREP", "GENERAL_KNOWLEDGE"
];

export default function BooksPage() {
  const { user, isStaff } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBook, setSelectedBook] = useState<BookResp | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [availOnly, setAvailOnly] = useState(false);

  const { data: booksData, isLoading } = useSearchBooks(
    { 
      q: debouncedSearch || undefined, 
      subcategory: selectedCategory || undefined, 
      page, 
      size: 20 
    },
  );

  const reserveMutation = usePlaceReservation({
    mutation: {
      onSuccess: () => { 
        toast({ title: "Reserved!", description: "Your reservation has been placed." }); 
        setSelectedBook(null); 
      },
      onError: (err: any) => { 
        toast({ title: "Reservation failed", description: err?.data?.message ?? "Could not place reservation", variant: "destructive" }); 
      },
    },
  });

  let filteredBooks = booksData?.content ?? [];
  if (availOnly) filteredBooks = filteredBooks.filter(b => b.availableCopies > 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50/50">
      {/* Category Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex-shrink-0 lg:sticky lg:top-0 lg:h-[calc(100vh-64px)] overflow-y-auto hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
           <Filter className="w-5 h-5 text-blue-600" />
           <h2 className="font-bold text-slate-900 tracking-tight">Browse Categories</h2>
        </div>
        
        <div className="space-y-1">
          <button 
            onClick={() => { setSelectedCategory(""); setPage(0); }}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
              !selectedCategory 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            )}
          >
            <span>All Categories</span>
            {!selectedCategory && <ChevronRight className="w-4 h-4" />}
          </button>
          
          {COLLEGE_CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(0); }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                selectedCategory === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
              )}
            >
              <span className="truncate pr-2">{cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
              {selectedCategory === cat && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explore Collection</h1>
            <p className="text-slate-500 mt-2 font-medium">Discover over 1,000 titles across various academic disciplines.</p>
          </motion.div>
          
          {isStaff && (
            <Button onClick={() => setShowAddBook(true)} className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-12 px-6 shadow-xl shadow-blue-600/20 font-bold transition-all active:scale-95">
              <Plus className="w-5 h-5 mr-2" /> Add New Book
            </Button>
          )}
        </div>

        {/* Global Search & View Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search by title, author, or ISBN..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 font-medium transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <button 
               onClick={() => setViewMode("grid")}
               className={cn("p-2.5 rounded-xl transition-all", viewMode === "grid" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-400 hover:bg-slate-50")}
             >
               <Grid3X3 className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setViewMode("list")}
               className={cn("p-2.5 rounded-xl transition-all", viewMode === "list" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-400 hover:bg-slate-50")}
             >
               <List className="w-5 h-5" />
             </button>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <input 
              type="checkbox" 
              id="avail"
              checked={availOnly} 
              onChange={(e) => setAvailOnly(e.target.checked)} 
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="avail" className="text-sm font-bold text-slate-600 cursor-pointer">Available Only</label>
          </div>
        </div>

        {/* Categories Bar Mobile */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
           <button 
            onClick={() => { setSelectedCategory(""); setPage(0); }}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap", !selectedCategory ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}
           >
             All
           </button>
           {COLLEGE_CATEGORIES.map(cat => (
             <button 
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(0); }}
              className={cn("px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap", selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}
             >
                {cat.replace(/_/g, ' ').toLowerCase()}
             </button>
           ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm font-bold text-slate-500 px-2 uppercase tracking-widest">
           <span>{isLoading ? "Fetching Collection..." : `${booksData?.totalElements || 0} Results Found`}</span>
           {selectedCategory && (
             <button onClick={() => setSelectedCategory("")} className="text-blue-600 hover:underline flex items-center gap-1">
               <X className="w-3.5 h-3.5" /> {selectedCategory.replace(/_/g, ' ')}
             </button>
           )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Knowledge Base</p>
            </motion.div>
          ) : filteredBooks.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Title</th>
                        <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Author</th>
                        <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                        <th className="px-8 py-5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedBook(book)}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <Book className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{book.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-slate-500 font-medium hidden md:table-cell text-sm">{book.author}</td>
                          <td className="px-6 py-6">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">{book.subCategory.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className={cn("inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-full text-xs font-black", book.availableCopies > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                               {book.availableCopies}/{book.totalCopies}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Button variant="ghost" className="rounded-xl font-bold text-xs text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               Details <ArrowRight className="w-4 h-4 ml-2" />
                             </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {booksData && booksData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 py-10">
                  <Button 
                    variant="ghost" 
                    disabled={page === 0} 
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="rounded-xl font-bold h-12 px-6"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, booksData.totalPages) }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={cn("w-10 h-10 rounded-xl font-black text-sm transition-all", page === i ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:bg-white border border-transparent hover:border-slate-200")}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    disabled={page >= booksData.totalPages - 1} 
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="rounded-xl font-bold h-12 px-6"
                  >
                    Next <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <BookOpen className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Matches Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">We couldn't find any books matching your criteria. Try broadly searching or browsing categories.</p>
              <Button variant="outline" onClick={() => { setSearch(""); setSelectedCategory(""); }} className="mt-8 rounded-2xl h-12 px-8 border-2 font-bold">Clear Filters</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          user={user}
          isStaff={isStaff}
          onClose={() => setSelectedBook(null)}
          onReserve={() => reserveMutation.mutate({ data: { bookId: selectedBook.id } })}
          reserving={reserveMutation.isPending}
          onLogin={() => setLocation("/login")}
        />
      )}

      {/* Add Book Modal */}
      {showAddBook && <AddBookModal onClose={() => setShowAddBook(false)} />}
    </div>
  );
}

function BookCard({ book, onClick }: { book: BookResp; onClick: () => void }) {
  const isAvailable = book.availableCopies > 0;
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border-none shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-600/10 transition-all cursor-pointer group rounded-[2.5rem] overflow-hidden bg-white" onClick={onClick}>
        <div className="p-6">
          <div className="h-56 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-[2rem] flex items-center justify-center mb-6 relative group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] transition-opacity" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 shadow-sm z-10 transition-transform group-hover:scale-110">
               {book.isbn ? `ISBN: ${book.isbn.slice(-4)}` : "LMS-REF"}
            </div>
            <div className="relative z-10 p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 group-hover:shadow-blue-500/20 transition-all group-hover:-rotate-3 group-hover:scale-110">
                <BookOpen className="w-12 h-12 text-blue-600/20 group-hover:text-blue-600 transition-colors duration-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-2 uppercase group-hover:text-blue-600 transition-colors">{book.title}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">{book.author}</p>
              </div>
              <Book className="w-5 h-5 text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                <Tag className="w-3 h-3" />{book.subCategory.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest", isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                {isAvailable ? `${book.availableCopies} Copies Left` : "Out of Stock"}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function BookDetailModal({ book, user, isStaff, onClose, onReserve, reserving, onLogin }: {
  book: BookResp; user: any; isStaff: boolean; onClose: () => void; onReserve: () => void; reserving: boolean; onLogin: () => void;
}) {
  const { data: reviews } = useBookReviews(book.id);
  const { data: copies } = useBookCopies(book.id);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const createReview = useCreateReview();
  const { toast } = useToast();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-[3rem] p-0 border-none overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row h-full">
           <div className="w-full md:w-80 bg-slate-50 flex items-center justify-center p-12 shrink-0">
             <BookOpen className="w-32 h-32 text-slate-200" />
           </div>
           
           <div className="flex-1 p-10 space-y-8 overflow-y-auto max-h-[85vh]">
              <div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-3">
                  {book.mainCategoryDisplay}
                </motion.div>
                <DialogTitle className="text-3xl font-black text-slate-900 leading-tight uppercase mb-2">{book.title}</DialogTitle>
                <p className="text-lg font-bold text-slate-400">{book.author}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</span>
                    <div className={cn("font-black flex items-center gap-2", book.availableCopies > 0 ? "text-emerald-600" : "text-rose-600")}>
                       <span className="text-2xl">{book.availableCopies}</span>
                       <span className="text-xs uppercase">/ {book.totalCopies} Copies</span>
                    </div>
                 </div>
                 {book.isbn && (
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISBN Number</span>
                      <div className="font-black text-slate-900">{book.isbn}</div>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">About this book</h4>
                <p className="text-slate-600 font-medium leading-relaxed">{book.description || "No description available for this title."}</p>
              </div>

              {/* Reviews Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Student Reviews</h4>
                   <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-black text-slate-900">4.8</span>
                   </div>
                </div>
                
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {reviews && reviews.length > 0 ? (
                    reviews.map(r => (
                      <div key={r.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-slate-900 text-sm">{r.userName}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3", i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))
                  ) : <p className="text-sm font-bold text-slate-300 py-4 text-center">Be the first to share your thoughts.</p>}
                </div>
              </div>

              {/* Final Actions */}
              <div className="pt-6 border-t border-slate-100">
                {!user ? (
                   <Button onClick={onLogin} className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3">
                     <Lock className="w-6 h-6 opacity-50" />
                     Login to Borrow
                   </Button>
                ) : !isStaff ? (
                   <Button 
                    onClick={onReserve} 
                    disabled={reserving || book.availableCopies === 0}
                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-2xl shadow-blue-600/30 transition-all active:scale-95"
                   >
                     {reserving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Request Reservation"}
                   </Button>
                ) : (
                  <Button variant="outline" onClick={onClose} className="w-full h-16 rounded-2xl border-2 font-black text-lg">
                    Manage Collection
                  </Button>
                )}
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddBookModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("COLLEGE");
  const [subCategory, setSubCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState(5);
  const [description, setDescription] = useState("");
  const [isbnLoading, setIsbnLoading] = useState(false);

  const createBook = useCreateBook({
    mutation: {
      onSuccess: () => { toast({ title: "Resource Added", description: "The book is now available in the catalog." }); onClose(); },
      onError: (err: any) => { toast({ title: "Operation Failed", description: err?.data?.message ?? "Error while adding record", variant: "destructive" }); },
    },
  });

  const lookupIsbn = async () => {
    if (!isbn) return;
    setIsbnLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = await res.json();
      const bookData = data[`ISBN:${isbn}`];
      if (bookData) {
        setTitle(bookData.title || "");
        setAuthor(bookData.authors?.map((a: any) => a.name).join(", ") || "");
        toast({ title: "MetaData Synced", description: "Title and author have been updated." });
      } else {
        toast({ title: "No Record Found", description: "Manual entry required for this ISBN.", variant: "destructive" });
      }
    } catch { toast({ title: "Network Error", variant: "destructive" }); }
    setIsbnLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-[3rem] p-10 border-none shadow-2xl">
        <DialogHeader className="mb-8">
           <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">New Catalog Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); createBook.mutate({ data: { title, author, isbn: isbn || undefined, mainCategory: category as any, subCategory: subCategory || "RESEARCH", totalCopies, description: description || undefined } }); }} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">ISBN Lookup</Label>
              <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="Enter 13-digit ISBN..." className="h-12 rounded-xl border-slate-200" />
            </div>
            <Button type="button" variant="outline" className="mt-8 h-12 rounded-xl px-6 font-bold border-2" onClick={lookupIsbn} disabled={isbnLoading}>
              {isbnLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Fill Data"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="h-12 rounded-xl border-slate-200" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Author</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} required className="h-12 rounded-xl border-slate-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {["COLLEGE", "COMPETITIVE_EXAM", "NON_FICTION", "FICTION", "COMIC", "HISTORY", "SCHOOL", "OTHER"].map(c => (
                    <SelectItem key={c} value={c} className="rounded-xl">{c.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Stock</Label>
              <Input type="number" min={1} value={totalCopies} onChange={(e) => setTotalCopies(Number(e.target.value))} className="h-12 rounded-xl border-slate-200" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Book Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl border-slate-200" rows={3} />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-14 font-black text-slate-400">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl shadow-blue-600/20" disabled={createBook.isPending}>
              {createBook.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
