import { useState } from 'react';
import {
  Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Phone,
  Eye, CreditCard, Filter, Plus, Hotel, Users, MapPin, FileText, X
} from 'lucide-react';

type BookingStatus = 'INITIALIZED' | 'CONFIRMED' | 'PAID' | 'UNCONFIRMED' | 'CANCELLED';

interface Booking {
  id: number;
  hotel: string;
  supplier: string;
  tripName: string;
  tripId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  pax: number;
  cost: number;
  quotedCost?: number;
  cnf?: string;
  status: BookingStatus;
  isCritical?: boolean;
  hasDiscrepancy?: boolean;
  guestContact?: string;
  guestEmail?: string;
  paymentStatus?: string;
}

type ViewFilter = 'all' | 'critical' | 'initialized' | 'confirmed' | 'discrepancies';

export function ReservationsBookings() {
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  const initialBookings: Booking[] = [
    {
      id: 1,
      hotel: 'Kuta Paradiso',
      supplier: 'Bali Hotels Direct',
      tripName: 'Ravi Mehta',
      tripId: '#TR-0842',
      guestName: 'Ravi Mehta',
      checkIn: '2026-04-08',
      checkOut: '2026-04-15',
      nights: 7,
      rooms: 14,
      pax: 28,
      cost: 84000,
      quotedCost: 84000,
      cnf: 'CNF-8842A',
      status: 'CONFIRMED',
      isCritical: true,
      guestContact: '+91 98765 43210',
      guestEmail: 'ravi@example.com',
      paymentStatus: 'Paid 50%',
    },
    {
      id: 2,
      hotel: 'Ubud Retreat',
      supplier: 'Bali Stays',
      tripName: 'Priya Sharma',
      tripId: '#TR-0843',
      guestName: 'Priya Sharma',
      checkIn: '2026-04-10',
      checkOut: '2026-04-17',
      nights: 7,
      rooms: 2,
      pax: 4,
      cost: 45000,
      quotedCost: 42000,
      status: 'INITIALIZED',
      isCritical: true,
      hasDiscrepancy: true,
      guestContact: '+91 98123 45678',
      guestEmail: 'priya@example.com',
    },
    {
      id: 3,
      hotel: 'Seminyak Beach Resort',
      supplier: 'Indonesia Resorts',
      tripName: 'Vikram Joshi',
      tripId: '#TR-0844',
      guestName: 'Vikram Joshi',
      checkIn: '2026-04-12',
      checkOut: '2026-04-19',
      nights: 7,
      rooms: 2,
      pax: 4,
      cost: 52000,
      status: 'UNCONFIRMED',
      isCritical: true,
      guestContact: '+91 97654 32109',
      guestEmail: 'vikram@example.com',
      paymentStatus: 'Pending',
    },
    {
      id: 4,
      hotel: 'Dubai Marina Hotel',
      supplier: 'UAE Hotels',
      tripName: 'Gupta Family',
      tripId: '#TR-0845',
      guestName: 'Gupta Family',
      checkIn: '2026-04-20',
      checkOut: '2026-04-25',
      nights: 5,
      rooms: 3,
      pax: 5,
      cost: 68000,
      cnf: 'CNF-9923B',
      status: 'CONFIRMED',
      guestContact: '+91 96543 21098',
      guestEmail: 'gupta@example.com',
      paymentStatus: 'Full Paid',
    },
    {
      id: 5,
      hotel: 'Maldives Water Villa',
      supplier: 'Maldives Resorts',
      tripName: 'Karan & Isha',
      tripId: '#TR-0846',
      guestName: 'Karan & Isha',
      checkIn: '2026-04-25',
      checkOut: '2026-04-29',
      nights: 4,
      rooms: 1,
      pax: 2,
      cost: 125000,
      quotedCost: 120000,
      cnf: 'CNF-1234C',
      status: 'PAID',
      hasDiscrepancy: true,
      guestContact: '+91 95432 10987',
      guestEmail: 'karan@example.com',
      paymentStatus: 'Full Paid',
    },
    {
      id: 6,
      hotel: 'Nusa Dua Luxury',
      supplier: 'Bali Hotels Direct',
      tripName: 'Mehta Family',
      tripId: '#TR-0847',
      guestName: 'Mehta Family',
      checkIn: '2026-04-15',
      checkOut: '2026-04-23',
      nights: 8,
      rooms: 3,
      pax: 5,
      cost: 96000,
      status: 'INITIALIZED',
      guestContact: '+91 94321 09876',
      guestEmail: 'mehta@example.com',
    },
    {
      id: 7,
      hotel: 'Ubud Forest Stay',
      supplier: 'Eco Resorts Bali',
      tripName: 'Suresh Nair',
      tripId: '#TR-0848',
      guestName: 'Suresh Nair',
      checkIn: '2026-04-18',
      checkOut: '2026-04-22',
      nights: 4,
      rooms: 1,
      pax: 2,
      cost: 28000,
      quotedCost: 32000,
      cnf: 'CNF-5566D',
      status: 'CONFIRMED',
      hasDiscrepancy: true,
      guestContact: '+91 93210 98765',
      guestEmail: 'suresh@example.com',
      paymentStatus: 'Paid',
    },
  ];

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const [newBooking, setNewBooking] = useState({
    hotel: '',
    supplier: '',
    tripName: '',
    tripId: '',
    guestName: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    pax: 1,
    cost: 0,
    quotedCost: 0,
    cnf: '',
    status: 'INITIALIZED' as BookingStatus,
    guestContact: '',
    guestEmail: '',
  });

  const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilCheckInHelper = (checkIn: string): number => {
    const today = new Date('2026-04-08');
    const checkInDate = new Date(checkIn);
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddBooking = () => {
    const nights = calculateNights(newBooking.checkIn, newBooking.checkOut);
    const daysUntil = getDaysUntilCheckInHelper(newBooking.checkIn);
    const hasDiscrepancy = newBooking.quotedCost > 0 && newBooking.cost !== newBooking.quotedCost;

    const booking: Booking = {
      id: bookings.length + 1,
      hotel: newBooking.hotel,
      supplier: newBooking.supplier,
      tripName: newBooking.tripName,
      tripId: newBooking.tripId,
      guestName: newBooking.guestName,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      nights,
      rooms: newBooking.rooms,
      pax: newBooking.pax,
      cost: newBooking.cost,
      quotedCost: newBooking.quotedCost > 0 ? newBooking.quotedCost : undefined,
      cnf: newBooking.cnf || undefined,
      status: newBooking.status,
      isCritical: daysUntil >= 0 && daysUntil <= 7,
      hasDiscrepancy,
      guestContact: newBooking.guestContact,
      guestEmail: newBooking.guestEmail,
      paymentStatus: newBooking.status === 'PAID' ? 'Full Paid' : 'Pending',
    };

    setBookings([...bookings, booking]);
    setShowNewBookingModal(false);
    setNewBooking({
      hotel: '',
      supplier: '',
      tripName: '',
      tripId: '',
      guestName: '',
      checkIn: '',
      checkOut: '',
      rooms: 1,
      pax: 1,
      cost: 0,
      quotedCost: 0,
      cnf: '',
      status: 'INITIALIZED',
      guestContact: '',
      guestEmail: '',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'PAID':
        return 'bg-green-700 text-white';
      case 'INITIALIZED':
        return 'bg-blue-600 text-white';
      case 'UNCONFIRMED':
        return 'bg-orange-600 text-white';
      case 'CANCELLED':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const filterBookings = (bookings: Booking[]): Booking[] => {
    switch (viewFilter) {
      case 'critical':
        return bookings.filter(b => b.isCritical);
      case 'initialized':
        return bookings.filter(b => b.status === 'INITIALIZED');
      case 'confirmed':
        return bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PAID');
      case 'discrepancies':
        return bookings.filter(b => b.hasDiscrepancy);
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings(bookings);

  // Calculate stats
  const initializedCount = bookings.filter(b => b.status === 'INITIALIZED').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const paidCount = bookings.filter(b => b.status === 'PAID').length;
  const discrepanciesCount = bookings.filter(b => b.hasDiscrepancy).length;
  const criticalCount = bookings.filter(b => b.isCritical).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2>Reservations & Bookings</h2>
          <button
            onClick={() => setShowNewBookingModal(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Initialized</p>
                <p className="text-2xl text-foreground mt-1">{44}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Confirmed</p>
                <p className="text-2xl text-green-600 mt-1">{128}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border border-l-4 border-l-green-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CreditCard className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-2xl text-green-700 mt-1">{96}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border border-l-4 border-l-orange-600">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Discrepancies</p>
                <p className="text-2xl text-orange-600 mt-1">{7}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Critical (7d)</p>
                <p className="text-2xl text-red-600 mt-1">{criticalCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg mb-6 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-foreground mb-1">⚠ Critical Bookings Alert</h4>
              <p className="text-sm text-muted-foreground">
                You have {criticalCount} booking{criticalCount > 1 ? 's' : ''} with check-in within 7 days requiring immediate attention.
              </p>
            </div>
            <button
              onClick={() => setViewFilter('critical')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              View Critical ({criticalCount})
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg border border-border mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">View:</span>
              </div>
              <button
                onClick={() => setViewFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setViewFilter('critical')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewFilter === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setViewFilter('initialized')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewFilter === 'initialized'
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Initialized ({initializedCount})
              </button>
              <button
                onClick={() => setViewFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewFilter === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Confirmed ({confirmedCount + paidCount})
              </button>
              <button
                onClick={() => setViewFilter('discrepancies')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewFilter === 'discrepancies'
                    ? 'bg-orange-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Discrepancies ({discrepanciesCount})
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Hotel / Supplier</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Trip Name</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Check-In</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Nights</th>
                  <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Cost</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">CNF#</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((booking) => {
                  const daysUntil = getDaysUntilCheckInHelper(booking.checkIn);
                  const isCriticalDays = daysUntil <= 5 && daysUntil >= 0;

                  return (
                    <tr
                      key={booking.id}
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                        booking.isCritical ? 'bg-red-50' : ''
                      }`}
                      onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          {booking.isCritical && (
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm text-foreground">{booking.hotel}</p>
                            <p className="text-xs text-muted-foreground">{booking.supplier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{booking.tripId} · {booking.tripName}</p>
                        <p className="text-xs text-muted-foreground">{booking.rooms} room{booking.rooms > 1 ? 's' : ''} · {booking.pax} pax</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm ${isCriticalDays ? 'text-red-600' : 'text-foreground'}`}>
                          {formatDate(booking.checkIn)}
                        </p>
                        {isCriticalDays && (
                          <p className="text-xs text-red-600">In {daysUntil} day{daysUntil !== 1 ? 's' : ''}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{booking.nights}N</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-sm text-foreground whitespace-nowrap">{formatCurrency(booking.cost)}</p>
                          {booking.hasDiscrepancy && booking.quotedCost && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3 text-orange-600" />
                              <p className="text-xs text-orange-600 whitespace-nowrap">
                                vs {formatCurrency(booking.quotedCost)}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {booking.cnf ? (
                          <p className="text-sm text-foreground">{booking.cnf}</p>
                        ) : (
                          <p className="text-sm text-orange-600">Pending</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded text-xs w-fit ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          {booking.hasDiscrepancy && (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Discrepancy
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {booking.status === 'INITIALIZED' || booking.status === 'UNCONFIRMED' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Calling ${booking.hotel} for booking ${booking.tripId}`);
                              }}
                              className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                              title="Call to confirm"
                            >
                              <Phone className="w-4 h-4 text-blue-600" />
                            </button>
                          ) : null}
                          {booking.paymentStatus === 'Pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Processing payment for ${booking.tripId}`);
                              }}
                              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors text-xs"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(selectedBooking === booking.id ? null : booking.id);
                            }}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details Expansion */}
        {selectedBooking !== null && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 p-6">
            {(() => {
              const booking = bookings.find(b => b.id === selectedBooking);
              if (!booking) return null;

              return (
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-foreground mb-1">Booking Details</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.tripId} · {booking.guestName}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hotel Details */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Hotel className="w-5 h-5 text-primary" />
                        <h4 className="text-sm text-foreground">Hotel Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Property</p>
                          <p className="text-foreground">{booking.hotel}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Supplier</p>
                          <p className="text-foreground">{booking.supplier}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Confirmation</p>
                          <p className="text-foreground">{booking.cnf || 'Pending'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Guest Details */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-primary" />
                        <h4 className="text-sm text-foreground">Guest Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="text-foreground">{booking.guestName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p className="text-foreground">{booking.guestContact}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="text-foreground text-xs">{booking.guestEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h4 className="text-sm text-foreground">Booking Summary</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Check-in / Check-out</p>
                          <p className="text-foreground">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="text-foreground">{booking.nights} nights</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rooms / Pax</p>
                          <p className="text-foreground">{booking.rooms} rooms · {booking.pax} pax</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Cost Details */}
                  <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h4 className="text-sm text-foreground">Payment & Cost</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="text-lg text-foreground">{formatCurrency(booking.cost)}</p>
                      </div>
                      {booking.quotedCost && (
                        <div>
                          <p className="text-muted-foreground">Quoted Cost</p>
                          <p className="text-lg text-foreground">{formatCurrency(booking.quotedCost)}</p>
                        </div>
                      )}
                      {booking.hasDiscrepancy && (
                        <div>
                          <p className="text-muted-foreground">Discrepancy</p>
                          <p className="text-lg text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {formatCurrency(Math.abs(booking.cost - (booking.quotedCost || 0)))}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Payment Status</p>
                        <p className="text-lg text-foreground">{booking.paymentStatus || 'Pending'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      View Full Itinerary
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Hotel
                    </button>
                    {booking.hasDiscrepancy && (
                      <button className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Resolve Discrepancy
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* New Booking Modal */}
        {showNewBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">Add New Booking</h3>
                    <p className="text-sm text-muted-foreground">Enter booking details to add to your reservations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Hotel & Supplier */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Hotel Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBooking.hotel}
                        onChange={(e) => setNewBooking({ ...newBooking, hotel: e.target.value })}
                        placeholder="e.g., Kuta Paradiso"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Supplier <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBooking.supplier}
                        onChange={(e) => setNewBooking({ ...newBooking, supplier: e.target.value })}
                        placeholder="e.g., Bali Hotels Direct"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Guest & Trip Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Guest Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBooking.guestName}
                        onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                        placeholder="e.g., Ravi Mehta"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Trip ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBooking.tripId}
                        onChange={(e) => setNewBooking({ ...newBooking, tripId: e.target.value })}
                        placeholder="e.g., #TR-0842"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Guest Contact
                      </label>
                      <input
                        type="text"
                        value={newBooking.guestContact}
                        onChange={(e) => setNewBooking({ ...newBooking, guestContact: e.target.value })}
                        placeholder="e.g., +91 98765 43210"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Guest Email
                      </label>
                      <input
                        type="email"
                        value={newBooking.guestEmail}
                        onChange={(e) => setNewBooking({ ...newBooking, guestEmail: e.target.value })}
                        placeholder="e.g., guest@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Check-In Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={newBooking.checkIn}
                        onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Check-Out Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={newBooking.checkOut}
                        onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Rooms & Pax */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Rooms <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newBooking.rooms}
                        onChange={(e) => setNewBooking({ ...newBooking, rooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Pax (Travelers) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newBooking.pax}
                        onChange={(e) => setNewBooking({ ...newBooking, pax: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Cost & Quote */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Actual Cost (₹) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newBooking.cost || ''}
                        onChange={(e) => setNewBooking({ ...newBooking, cost: parseFloat(e.target.value) || 0 })}
                        placeholder="84000"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Quoted Cost (₹) <span className="text-muted-foreground text-xs">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newBooking.quotedCost || ''}
                        onChange={(e) => setNewBooking({ ...newBooking, quotedCost: parseFloat(e.target.value) || 0 })}
                        placeholder="84000"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Confirmation & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Confirmation Number <span className="text-muted-foreground text-xs">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={newBooking.cnf}
                        onChange={(e) => setNewBooking({ ...newBooking, cnf: e.target.value })}
                        placeholder="e.g., CNF-8842A"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Booking Status <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={newBooking.status}
                        onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as BookingStatus })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="INITIALIZED">INITIALIZED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PAID">PAID</option>
                        <option value="UNCONFIRMED">UNCONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Fields */}
                  {newBooking.checkIn && newBooking.checkOut && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-300">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Calculated Nights</p>
                          <p className="text-lg text-foreground">
                            {calculateNights(newBooking.checkIn, newBooking.checkOut)} nights
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Days Until Check-In</p>
                          <p className={`text-lg ${
                            getDaysUntilCheckInHelper(newBooking.checkIn) <= 7 && getDaysUntilCheckInHelper(newBooking.checkIn) >= 0
                              ? 'text-red-600'
                              : 'text-foreground'
                          }`}>
                            {getDaysUntilCheckInHelper(newBooking.checkIn)} days
                          </p>
                        </div>
                        {newBooking.quotedCost > 0 && newBooking.cost !== newBooking.quotedCost && (
                          <div>
                            <p className="text-muted-foreground mb-1">Discrepancy</p>
                            <p className="text-lg text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              {formatCurrency(Math.abs(newBooking.cost - newBooking.quotedCost))}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBooking}
                  disabled={
                    !newBooking.hotel ||
                    !newBooking.supplier ||
                    !newBooking.guestName ||
                    !newBooking.tripId ||
                    !newBooking.checkIn ||
                    !newBooking.checkOut ||
                    newBooking.cost <= 0
                  }
                  className="px-6 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
