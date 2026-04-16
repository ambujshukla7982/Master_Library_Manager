import { useState, useMemo } from "react";
import { useReadingRooms, useAvailableSeats, useBookSeat, useMySeatBookings, useCancelSeatBooking, type SeatBookingItem } from "@/lib/api-extra";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Armchair, Calendar, Loader2, X, Clock, MapPin, Sparkles, ChevronRight, Info, CheckCircle2, History as HistoryIcon } from "lucide-react";
import { cn, formatDate, getBookingStatusColor } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TIME_SLOTS = [
  { value: "morning", label: "Morning (9 AM - 1 PM)", start: "09:00", end: "13:00" },
  { value: "afternoon", label: "Afternoon (1 PM - 5 PM)", start: "13:00", end: "17:00" },
  { value: "fullday", label: "Full Day (9 AM - 5 PM)", start: "09:00", end: "17:00" },
];

export default function SeatBookingPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookingModal, setBookingModal] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("fullday");

  const { data: rooms, isLoading: roomsLoading } = useReadingRooms();
  const { data: availableSeats, isLoading: seatsLoading } = useAvailableSeats(selectedRoom, selectedDate);
  const { data: myBookings, isLoading: bookingsLoading } = useMySeatBookings();
  const bookSeat = useBookSeat();
  const cancelBooking = useCancelSeatBooking();

  const currentRoom = useMemo(() => rooms?.find(r => r.id === selectedRoom), [rooms, selectedRoom]);
  const totalSeats = currentRoom?.totalSeats ?? 50;

  const handleBookSeat = () => {
    if (!selectedRoom || bookingModal === null) return;
    const slot = TIME_SLOTS.find(s => s.value === selectedSlot)!;
    bookSeat.mutate({
      roomId: selectedRoom,
      seatNumber: bookingModal,
      bookingDate: selectedDate,
      startTime: slot.start,
      endTime: slot.end,
    }, {
      onSuccess: () => { 
        toast({ title: "Seat Confirmed!", description: `Seat #${bookingModal} reserved for ${formatDate(selectedDate)}` }); 
        setBookingModal(null); 
      },
      onError: (err: any) => toast({ title: "Booking failed", description: (err as any)?.message ?? "Could not book seat", variant: "destructive" }),
    });
  };

  const getSeatStatus = (seatNum: number) => {
    const isCurrentlyBookedByMe = myBookings?.some(b => 
      b.seatNumber === seatNum && 
      b.bookingDate === selectedDate && 
      b.roomId === selectedRoom && 
      b.status === "BOOKED"
    );
    if (isCurrentlyBookedByMe) return "mine";
    if (availableSeats && !availableSeats.includes(seatNum)) return "booked";
    return "available";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-4">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Priority Access for Members</span>
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Reserve Your Spot</h1>
           <p className="text-slate-500 mt-2 font-medium">Choose your preferred study environment for focused learning.</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Controls */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
             <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-3">
                   <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Date</Label>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <Input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]} 
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 font-bold" 
                      />
                   </div>
                </div>
                
                <div className="flex-[1.5] space-y-3">
                   <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reading Room</Label>
                   <Select value={selectedRoom?.toString() ?? ""} onValueChange={(v) => setSelectedRoom(Number(v))}>
                      <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 font-bold">
                         <SelectValue placeholder="Select Environment" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl p-2">
                         {rooms?.map(room => (
                           <SelectItem key={room.id} value={room.id.toString()} className="rounded-xl py-3">
                              <span className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                 </div>
                                 <div>
                                    <div className="font-bold">{room.name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-black">{room.totalSeats} Total Seats Available</div>
                                 </div>
                              </span>
                           </SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>
             </div>
          </Card>

          {/* Seat Map */}
          <AnimatePresence mode="wait">
            {selectedRoom ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[3rem] bg-white overflow-hidden p-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                         <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentRoom?.name}</h2>
                         <p className="text-slate-400 font-medium text-sm">Interactive Seat Topology</p>
                      </div>
                      <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-2 px-3 py-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                            <span className="text-[10px] font-black uppercase text-slate-400">Free</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1">
                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black uppercase text-slate-400">Sold</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1">
                            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />
                            <span className="text-[10px] font-black uppercase text-slate-400">Yours</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 h-1.5 w-full rounded-full mb-16 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/20 blur-md" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Front of Room / Entry</div>
                   </div>

                   {seatsLoading ? (
                     <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Scanning Floor Access</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                        {Array.from({ length: totalSeats }, (_, i) => i + 1).map(seatNum => {
                          const status = getSeatStatus(seatNum);
                          return (
                            <motion.button 
                              key={seatNum}
                              whileHover={status === "available" ? { scale: 1.1, y: -2 } : {}}
                              whileTap={status === "available" ? { scale: 0.95 } : {}}
                              onClick={() => status === "available" ? setBookingModal(seatNum) : undefined}
                              disabled={status === "booked"}
                              className={cn(
                                "group aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative",
                                status === "available" && "bg-white border-2 border-emerald-100 text-emerald-600 shadow-sm hover:border-emerald-500 hover:text-emerald-700 hover:shadow-emerald-200 hover:shadow-lg",
                                status === "booked" && "bg-slate-50 border-2 border-slate-100 text-slate-200 cursor-not-allowed",
                                status === "mine" && "bg-blue-600 border-2 border-blue-700 text-white shadow-xl shadow-blue-200 hvr-pulse-grow"
                              )}
                            >
                               <Armchair className={cn("w-6 h-6 transition-transform", status === "available" && "group-hover:scale-110")} />
                               <span className="text-[10px] font-black mt-1">{seatNum}</span>
                               {status === "mine" && (
                                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                                     <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  </div>
                               )}
                            </motion.button>
                          );
                        })}
                     </div>
                   )}

                   <div className="mt-16 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                         <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                         Seats marked in <span className="text-emerald-600">Emerald</span> are available for reservation. Bookings are non-transferable and require check-in within 30 minutes of the start time.
                      </p>
                   </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white p-20 text-center">
                   <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                      <MapPin className="w-10 h-10 text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Selection Required</h3>
                   <p className="text-slate-400 max-w-sm mx-auto font-medium">Please choose a reading room environment to view its interactive seat topology and availability.</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          {/* Reservation List */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden p-8">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-lg font-black text-slate-900 uppercase">Your Passes</h3>
                   <p className="text-xs text-slate-400 font-bold tracking-widest">Active Bookings</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <HistoryIcon className="w-5 h-5" />
                </div>
             </div>

             {bookingsLoading ? (
               <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
             ) : myBookings && myBookings.length > 0 ? (
               <div className="space-y-4">
                 {myBookings.map((b) => (
                   <motion.div key={b.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="group">
                     <div className="bg-slate-50 hover:bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all hover:shadow-xl hover:shadow-slate-200/40 relative">
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                                 <Armchair className="w-6 h-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <div className="font-black text-slate-900 truncate uppercase text-sm">{b.roomName}</div>
                                 <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Seat #{b.seatNumber}</div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-6 py-4 border-y border-slate-100/50">
                              <div className="space-y-1">
                                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date</div>
                                 <div className="text-xs font-bold text-slate-600">{formatDate(b.bookingDate)}</div>
                              </div>
                              <div className="space-y-1">
                                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Window</div>
                                 <div className="text-xs font-bold text-slate-600">{b.startTime} - {b.endTime}</div>
                              </div>
                           </div>

                           <div className="flex items-center justify-between">
                              <span className={cn("text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest", getBookingStatusColor(b.status))}>{b.status}</span>
                              {b.status === "BOOKED" && (
                                <button 
                                  onClick={() => { cancelBooking.mutate(b.id); toast({ title: "Booking Dismissed" }); }}
                                  className="text-rose-400 hover:text-rose-600 transition-colors p-2"
                                >
                                   <X className="w-5 h-5" />
                                </button>
                              )}
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Empty Inventory</p>
               </div>
             )}
          </Card>

          {/* Guidelines */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-slate-900 text-white p-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mt-10 -mr-10" />
             <div className="relatve z-10 flex flex-col gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                   <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                   <h3 className="text-xl font-black mb-1">Library Etiquette</h3>
                   <p className="text-slate-400 text-sm">Please follow these simple rules for a better environment for everyone.</p>
                </div>
                <ul className="space-y-3 text-xs font-bold text-slate-300">
                   <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> Silence remains mandatory in all areas.</li>
                   <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> No food or uncovered drinks permitted.</li>
                   <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> Clear your seat 5 minutes prior to end time.</li>
                </ul>
             </div>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingModal !== null} onOpenChange={() => setBookingModal(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Armchair className="w-8 h-8" />
             </div>
            <DialogTitle className="text-3xl font-black text-slate-900 leading-tight uppercase">Confirm Selection</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">You are reserving Seat #{bookingModal} for a focused study session.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 mt-4">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Environment</div>
                  <div className="font-bold text-slate-900">{currentRoom?.name}</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</div>
                  <div className="font-bold text-slate-900">{formatDate(selectedDate)}</div>
               </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Duration Window</Label>
              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-blue-100 font-bold">
                   <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {TIME_SLOTS.map(s => (
                    <SelectItem key={s.value} value={s.value} className="rounded-xl py-3">{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <Button variant="ghost" onClick={() => setBookingModal(null)} className="flex-1 h-16 rounded-2xl font-black text-slate-400">Abort</Button>
              <Button 
                onClick={handleBookSeat} 
                disabled={bookSeat.isPending}
                className="flex-1 h-16 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/30 transition-all active:scale-95"
              >
                {bookSeat.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm Pass"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
