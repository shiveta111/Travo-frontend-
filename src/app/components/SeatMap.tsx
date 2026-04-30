import { User, XCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

interface Seat {
  id: string;
  row: number;
  position: string;
  status: 'sold' | 'available' | 'blocked';
  passengerName?: string;
}

interface SeatMapProps {
  totalSeats: number;
  sold: number;
  available: number;
  sector: string;
}

export function SeatMap({ totalSeats, sold, available, sector }: SeatMapProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Generate seat layout based on total seats
  const seats = useMemo(() => {
    const seatLayout: Seat[] = [];
    const seatsPerRow = 6; // Standard 3-3 configuration
    const rows = Math.ceil(totalSeats / seatsPerRow);
    const positions = ['A', 'B', 'C', 'D', 'E', 'F'];

    let seatIndex = 0;
    for (let row = 1; row <= rows; row++) {
      for (let posIdx = 0; posIdx < positions.length; posIdx++) {
        if (seatIndex >= totalSeats) break;

        const position = positions[posIdx];
        let status: 'sold' | 'available' | 'blocked';
        let passengerName: string | undefined;

        // Assign status based on sold count
        if (seatIndex < sold) {
          status = 'sold';
          passengerName = `Passenger ${seatIndex + 1}`;
        } else if (seatIndex < sold + available) {
          status = 'available';
        } else {
          status = 'blocked';
        }

        seatLayout.push({
          id: `${row}${position}`,
          row,
          position,
          status,
          passengerName,
        });

        seatIndex++;
      }
    }

    return seatLayout;
  }, [totalSeats, sold, available]);

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-green-600 text-white border-green-700 hover:bg-green-700';
      case 'available':
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200';
      case 'blocked':
        return 'bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getSeatIcon = (status: string) => {
    switch (status) {
      case 'sold':
        return <User className="w-4 h-4" />;
      case 'blocked':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <h3 className="text-foreground mb-3">Seat Map - {sector}</h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-600 border-2 border-green-700 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-muted-foreground">Sold ({sold})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-muted-foreground">Available ({available})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-300 border-2 border-gray-400 flex items-center justify-center">
              <XCircle className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-muted-foreground">Blocked ({totalSeats - sold - available})</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex flex-col items-center">
          {/* Front of Plane Indicator */}
          <div className="mb-4 pb-4 border-b border-border w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-primary"></div>
              <span className="text-sm text-primary">Front of Aircraft</span>
            </div>
          </div>

          {/* Column Labels */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 text-center text-xs text-muted-foreground">Row</div>
            {['A', 'B', 'C'].map((col) => (
              <div key={col} className="w-10 text-center text-xs text-muted-foreground">
                {col}
              </div>
            ))}
            <div className="w-8"></div>
            {['D', 'E', 'F'].map((col) => (
              <div key={col} className="w-10 text-center text-xs text-muted-foreground">
                {col}
              </div>
            ))}
          </div>

          {/* Seat Rows */}
          <div className="space-y-2">
            {Object.entries(seatsByRow).map(([rowNum, rowSeats]) => (
              <div key={rowNum} className="flex items-center gap-2">
                {/* Row Number */}
                <div className="w-8 text-center text-xs text-muted-foreground">{rowNum}</div>

                {/* Left Side (A, B, C) */}
                {rowSeats.slice(0, 3).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.status !== 'blocked' && setSelectedSeat(seat)}
                    className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs transition-all ${getSeatColor(seat.status)} ${
                      seat.status === 'blocked' ? 'opacity-50' : ''
                    }`}
                    disabled={seat.status === 'blocked'}
                    title={seat.status === 'sold' ? seat.passengerName : seat.status}
                  >
                    {getSeatIcon(seat.status) || seat.position}
                  </button>
                ))}

                {/* Aisle */}
                <div className="w-8 flex items-center justify-center">
                  <div className="h-px w-full bg-border"></div>
                </div>

                {/* Right Side (D, E, F) */}
                {rowSeats.slice(3, 6).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.status !== 'blocked' && setSelectedSeat(seat)}
                    className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs transition-all ${getSeatColor(seat.status)} ${
                      seat.status === 'blocked' ? 'opacity-50' : ''
                    }`}
                    disabled={seat.status === 'blocked'}
                    title={seat.status === 'sold' ? seat.passengerName : seat.status}
                  >
                    {getSeatIcon(seat.status) || seat.position}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Seat Info */}
      {selectedSeat && (
        <div className={`p-4 rounded-lg border-2 ${
          selectedSeat.status === 'sold' ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm mb-1 ${
                selectedSeat.status === 'sold' ? 'text-green-700' : 'text-blue-700'
              }`}>
                Seat {selectedSeat.id}
              </h4>
              <p className="text-xs text-muted-foreground">
                {selectedSeat.status === 'sold'
                  ? `Occupied by ${selectedSeat.passengerName}`
                  : 'Available for booking'}
              </p>
            </div>
            <button
              onClick={() => setSelectedSeat(null)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
