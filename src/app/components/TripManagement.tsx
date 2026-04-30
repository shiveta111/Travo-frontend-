import { useState } from 'react';
import {
  MapPin, Users, Calendar, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Filter, Search, Plus, Edit, Eye, Check,
  Plane, Hotel, Activity, FileText, Download
} from 'lucide-react';

type TripStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'QUOTED' | 'COMPLETED' | 'CANCELLED';
type ViewFilter = 'all' | 'in-progress' | 'upcoming' | 'completed';

interface Trip {
  id: number;
  tripName: string;
  destination: string;
  guestName: string;
  startDate: string;
  endDate: string;
  nights: number;
  pax: number;
  cost: number;
  selling: number;
  margin: number;
  status: TripStatus;
  issues?: string[];
  milestones?: {
    bookingConfirmed: boolean;
    paymentsReceived: boolean;
    tripStarted: boolean;
    tripCompleted: boolean;
  };
}

export function TripManagement() {
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
  const [showNewTripModal, setShowNewTripModal] = useState(false);

  const initialTrips: Trip[] = [
    {
      id: 1,
      tripName: 'Bali 7N - Group',
      destination: 'Bali, Indonesia',
      guestName: 'Ravi Mehta',
      startDate: '2026-04-08',
      endDate: '2026-04-15',
      nights: 7,
      pax: 28,
      cost: 680000,
      selling: 840000,
      margin: 23.8,
      status: 'IN_PROGRESS',
      issues: ['Hotel ⚠', 'Pymt ⚠'],
      milestones: {
        bookingConfirmed: true,
        paymentsReceived: false,
        tripStarted: true,
        tripCompleted: false,
      },
    },
    {
      id: 2,
      tripName: 'Dubai 5N - Family',
      destination: 'Dubai, UAE',
      guestName: 'Priya Sharma',
      startDate: '2026-04-12',
      endDate: '2026-04-17',
      nights: 5,
      pax: 5,
      cost: 240000,
      selling: 290000,
      margin: 20.8,
      status: 'CONFIRMED',
      milestones: {
        bookingConfirmed: true,
        paymentsReceived: true,
        tripStarted: false,
        tripCompleted: false,
      },
    },
    {
      id: 3,
      tripName: 'Thailand 6N - Couple',
      destination: 'Phuket, Thailand',
      guestName: 'Amit & Neha Gupta',
      startDate: '2026-04-15',
      endDate: '2026-04-21',
      nights: 6,
      pax: 2,
      cost: 95000,
      selling: 125000,
      margin: 31.6,
      status: 'CONFIRMED',
      milestones: {
        bookingConfirmed: true,
        paymentsReceived: true,
        tripStarted: false,
        tripCompleted: false,
      },
    },
    {
      id: 4,
      tripName: 'Maldives 4N - Honeymoon',
      destination: 'Maldives',
      guestName: 'Karan & Isha',
      startDate: '2026-03-28',
      endDate: '2026-04-01',
      nights: 4,
      pax: 2,
      cost: 185000,
      selling: 230000,
      margin: 24.3,
      status: 'COMPLETED',
      milestones: {
        bookingConfirmed: true,
        paymentsReceived: true,
        tripStarted: true,
        tripCompleted: true,
      },
    },
    {
      id: 5,
      tripName: 'Singapore 4N - Family',
      destination: 'Singapore',
      guestName: 'Rajesh Kumar',
      startDate: '2026-04-20',
      endDate: '2026-04-24',
      nights: 4,
      pax: 4,
      cost: 165000,
      selling: 195000,
      margin: 18.2,
      status: 'QUOTED',
      milestones: {
        bookingConfirmed: false,
        paymentsReceived: false,
        tripStarted: false,
        tripCompleted: false,
      },
    },
    {
      id: 6,
      tripName: 'Kashmir 5N - Group',
      destination: 'Kashmir, India',
      guestName: 'Travel Club Delhi',
      startDate: '2026-04-10',
      endDate: '2026-04-15',
      nights: 5,
      pax: 42,
      cost: 520000,
      selling: 650000,
      margin: 25.0,
      status: 'IN_PROGRESS',
      issues: ['Transport ⚠'],
      milestones: {
        bookingConfirmed: true,
        paymentsReceived: true,
        tripStarted: true,
        tripCompleted: false,
      },
    },
  ];

  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const [newTrip, setNewTrip] = useState({
    tripName: '',
    destination: '',
    guestName: '',
    startDate: '',
    endDate: '',
    pax: 1,
    cost: 0,
    selling: 0,
    status: 'QUOTED' as TripStatus,
  });

  const calculateNights = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMargin = (cost: number, selling: number): number => {
    if (selling === 0) return 0;
    return ((selling - cost) / selling) * 100;
  };

  const handleAddTrip = () => {
    const nights = calculateNights(newTrip.startDate, newTrip.endDate);
    const margin = calculateMargin(newTrip.cost, newTrip.selling);

    const trip: Trip = {
      id: trips.length + 1,
      tripName: newTrip.tripName,
      destination: newTrip.destination,
      guestName: newTrip.guestName,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      nights,
      pax: newTrip.pax,
      cost: newTrip.cost,
      selling: newTrip.selling,
      margin,
      status: newTrip.status,
      milestones: {
        bookingConfirmed: newTrip.status === 'CONFIRMED' || newTrip.status === 'IN_PROGRESS',
        paymentsReceived: false,
        tripStarted: newTrip.status === 'IN_PROGRESS',
        tripCompleted: false,
      },
    };

    setTrips([...trips, trip]);
    setShowNewTripModal(false);
    setNewTrip({
      tripName: '',
      destination: '',
      guestName: '',
      startDate: '',
      endDate: '',
      pax: 1,
      cost: 0,
      selling: 0,
      status: 'QUOTED',
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

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'IN_PROGRESS':
        return 'bg-[#f3797e] text-white';
      case 'COMPLETED':
        return 'bg-[#7978e9] text-white';
      case 'QUOTED':
        return 'bg-yellow-600 text-white';
      case 'CANCELLED':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: TripStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />;
      case 'COMPLETED':
        return <Check className="w-4 h-4" />;
      case 'QUOTED':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filterTrips = (trips: Trip[]): Trip[] => {
    let filtered = trips;

    // Apply view filter
    const today = new Date('2026-04-08');
    switch (viewFilter) {
      case 'in-progress':
        filtered = filtered.filter(t => t.status === 'IN_PROGRESS');
        break;
      case 'upcoming':
        filtered = filtered.filter(t => {
          const startDate = new Date(t.startDate);
          const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil >= 0 && daysUntil <= 30 && t.status !== 'COMPLETED';
        });
        break;
      case 'completed':
        filtered = filtered.filter(t => t.status === 'COMPLETED');
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTrips = filterTrips(trips);
  const activeTrips = trips.filter(t => t.status === 'IN_PROGRESS' || t.status === 'CONFIRMED');
  const upcomingTrips = trips.filter(t => {
    const today = new Date('2026-04-08');
    const startDate = new Date(t.startDate);
    const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30 && t.status !== 'COMPLETED';
  });
  const totalPaxThisMonth = trips.reduce((sum, t) => sum + t.pax, 0);
  const avgMargin = trips.reduce((sum, t) => sum + t.margin, 0) / trips.length;

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-card rounded-lg border border-border p-4">
        <div className="mb-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Trip Management
          </h3>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setViewFilter('all')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
              viewFilter === 'all'
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>All Trips</span>
              <span className="text-sm opacity-75">{trips.length}</span>
            </div>
          </button>

          <button
            onClick={() => setViewFilter('in-progress')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
              viewFilter === 'in-progress'
                ? 'bg-[#f3797e] text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>In Progress</span>
              <span className="text-sm opacity-75">
                {trips.filter(t => t.status === 'IN_PROGRESS').length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setViewFilter('upcoming')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
              viewFilter === 'upcoming'
                ? 'bg-[#4b49ac] text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Upcoming (30d)</span>
              <span className="text-sm opacity-75">{upcomingTrips.length}</span>
            </div>
          </button>

          <button
            onClick={() => setViewFilter('completed')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
              viewFilter === 'completed'
                ? 'bg-[#7978e9] text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Completed</span>
              <span className="text-sm opacity-75">
                {trips.filter(t => t.status === 'COMPLETED').length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Summary Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plane className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Active Trips</p>
                <p className="text-2xl text-foreground mt-1">{activeTrips.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-[#4b49ac]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="w-5 h-5 text-[#4b49ac]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Upcoming Trips</p>
                <p className="text-2xl text-[#4b49ac] mt-1">{upcomingTrips.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Pax This Month</p>
                <p className="text-2xl text-foreground mt-1">{totalPaxThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Average Margin</p>
                <p className="text-2xl text-green-600 mt-1">{avgMargin.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">↑ 2% vs LM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search trips, guests, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground"
            />
          </div>
          <button className="px-4 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowNewTripModal(true)}
            className="px-4 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>

        {/* Trips Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Trip Name</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Guest</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Dates</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Pax</th>
                  <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Cost</th>
                  <th className="px-4 py-3 text-right text-xs text-muted-foreground uppercase">Selling</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Margin</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase">Issues</th>
                  <th className="px-4 py-3 text-center text-xs text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrip(selectedTrip === trip.id ? null : trip.id)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground">{trip.tripName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {trip.destination}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{trip.guestName}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {new Date(trip.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} -
                      {new Date(trip.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      <span className="text-muted-foreground ml-1">({trip.nights}N)</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{trip.pax}</td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(trip.cost)}</td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">{formatCurrency(trip.selling)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-green-600">{trip.margin.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${getStatusColor(trip.status)}`}>
                        {getStatusIcon(trip.status)}
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {trip.issues && trip.issues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {trip.issues.map((issue, idx) => (
                            <span key={idx} className="px-2 py-1 rounded text-xs bg-red-100 text-red-600 border border-red-300">
                              {issue}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          No Issues
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          title="Edit Trip"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {trip.status !== 'COMPLETED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1.5 rounded hover:bg-green-50 transition-colors"
                            title="Mark Completed"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trip Details Expansion */}
        {selectedTrip !== null && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 p-6">
            {(() => {
              const trip = trips.find(t => t.id === selectedTrip);
              if (!trip) return null;

              return (
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-foreground mb-1">{trip.tripName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {trip.destination} • {trip.guestName}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedTrip(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Trip Timeline */}
                  <div className="mb-6">
                    <h4 className="text-sm text-muted-foreground mb-4">Trip Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${
                        trip.milestones?.bookingConfirmed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {trip.milestones?.bookingConfirmed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm">Booking Confirmed</span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${
                        trip.milestones?.paymentsReceived
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {trip.milestones?.paymentsReceived ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm">Payments Received</span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${
                        trip.milestones?.tripStarted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {trip.milestones?.tripStarted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm">Trip Started</span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${
                        trip.milestones?.tripCompleted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {trip.milestones?.tripCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm">Trip Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      View Itinerary
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Documents
                    </button>
                    {trip.issues && trip.issues.length > 0 && (
                      <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Resolve Issues ({trip.issues.length})
                      </button>
                    )}
                    {trip.status !== 'COMPLETED' && (
                      <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* New Trip Modal */}
        {showNewTripModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">Add New Trip</h3>
                    <p className="text-sm text-muted-foreground">Enter trip details to add to your trip list</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewTripModal(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Trip Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTrip.tripName}
                        onChange={(e) => setNewTrip({ ...newTrip, tripName: e.target.value })}
                        placeholder="e.g., Bali 7N - Family"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Destination <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTrip.destination}
                        onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                        placeholder="e.g., Bali, Indonesia"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Guest Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTrip.guestName}
                        onChange={(e) => setNewTrip({ ...newTrip, guestName: e.target.value })}
                        placeholder="e.g., Ravi Mehta"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Number of Travelers (Pax) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newTrip.pax}
                        onChange={(e) => setNewTrip({ ...newTrip, pax: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Start Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        End Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Cost (₹) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTrip.cost || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, cost: parseFloat(e.target.value) || 0 })}
                        placeholder="240000"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Selling Price (₹) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTrip.selling || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, selling: parseFloat(e.target.value) || 0 })}
                        placeholder="290000"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-2">
                        Status <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={newTrip.status}
                        onChange={(e) => setNewTrip({ ...newTrip, status: e.target.value as TripStatus })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="QUOTED">QUOTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {newTrip.startDate && newTrip.endDate && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-300">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Calculated Nights</p>
                          <p className="text-lg text-foreground">
                            {calculateNights(newTrip.startDate, newTrip.endDate)} nights
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Calculated Margin</p>
                          <p className="text-lg text-green-600">
                            {calculateMargin(newTrip.cost, newTrip.selling).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewTripModal(false)}
                  className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTrip}
                  disabled={
                    !newTrip.tripName ||
                    !newTrip.destination ||
                    !newTrip.guestName ||
                    !newTrip.startDate ||
                    !newTrip.endDate ||
                    newTrip.cost <= 0 ||
                    newTrip.selling <= 0
                  }
                  className="px-6 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
