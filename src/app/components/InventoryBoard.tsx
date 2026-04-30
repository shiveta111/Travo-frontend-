import { TrendingUp, AlertTriangle, Package, CheckCircle, Clock, Plane } from 'lucide-react';
import { useState } from 'react';
import { SeatMap } from './SeatMap';

interface DepartureInventory {
  id: number;
  sector: string;
  departureDate: string;
  totalSeats: number;
  sold: number;
  available: number;
  loadFactor: number;
  riskLevel: 'Safe' | 'Warning' | 'Critical';
  daysToDeparture: number;
  airline: string;
  exposure: number;
}

export function InventoryBoard() {
  const [selectedDeparture, setSelectedDeparture] = useState<DepartureInventory | null>(null);

  const inventoryData: DepartureInventory[] = [
    {
      id: 1,
      sector: 'BOM-BALI',
      departureDate: '16-Apr-2026',
      totalSeats: 30,
      sold: 18,
      available: 12,
      loadFactor: 60,
      riskLevel: 'Warning',
      daysToDeparture: 13,
      airline: 'SQ',
      exposure: 460000,
    },
    {
      id: 2,
      sector: 'BOM-BALI',
      departureDate: '19-Apr-2026',
      totalSeats: 30,
      sold: 12,
      available: 18,
      loadFactor: 40,
      riskLevel: 'Warning',
      daysToDeparture: 16,
      airline: 'SQ',
      exposure: 690000,
    },
    {
      id: 3,
      sector: 'CCU-BALI',
      departureDate: '22-Apr-2026',
      totalSeats: 20,
      sold: 3,
      available: 17,
      loadFactor: 15,
      riskLevel: 'Critical',
      daysToDeparture: 19,
      airline: 'SQ',
      exposure: 663000,
    },
    {
      id: 4,
      sector: 'AMD-VIETNAM',
      departureDate: '08-May-2026',
      totalSeats: 40,
      sold: 4,
      available: 36,
      loadFactor: 10,
      riskLevel: 'Critical',
      daysToDeparture: 35,
      airline: 'VJ',
      exposure: 2880000,
    },
    {
      id: 5,
      sector: 'DEL-BALI',
      departureDate: '15-May-2026',
      totalSeats: 30,
      sold: 9,
      available: 21,
      loadFactor: 30,
      riskLevel: 'Critical',
      daysToDeparture: 42,
      airline: 'SQ',
      exposure: 826000,
    },
    {
      id: 6,
      sector: 'LKO-BALI',
      departureDate: '24-May-2026',
      totalSeats: 25,
      sold: 7,
      available: 18,
      loadFactor: 28,
      riskLevel: 'Critical',
      daysToDeparture: 51,
      airline: 'AirAsia',
      exposure: 648000,
    },
    {
      id: 7,
      sector: 'AMD-BALI',
      departureDate: '05-Jun-2026',
      totalSeats: 35,
      sold: 15,
      available: 20,
      loadFactor: 43,
      riskLevel: 'Warning',
      daysToDeparture: 63,
      airline: 'VJ',
      exposure: 1400000,
    },
    {
      id: 8,
      sector: 'BOM-VIETNAM',
      departureDate: '18-Jun-2026',
      totalSeats: 40,
      sold: 10,
      available: 30,
      loadFactor: 25,
      riskLevel: 'Critical',
      daysToDeparture: 76,
      airline: 'Batik',
      exposure: 2100000,
    },
    {
      id: 9,
      sector: 'BLR-BALI',
      departureDate: '25-Apr-2026',
      totalSeats: 42,
      sold: 35,
      available: 7,
      loadFactor: 83,
      riskLevel: 'Safe',
      daysToDeparture: 18,
      airline: 'SQ',
      exposure: 280000,
    },
  ];

  const getCardColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Safe':
        return 'bg-green-50 border-green-300 hover:border-green-400';
      case 'Warning':
        return 'bg-yellow-50 border-yellow-300 hover:border-yellow-400';
      case 'Critical':
        return 'bg-red-50 border-red-300 hover:border-red-400 animate-pulse';
      default:
        return 'bg-gray-50 border-gray-300 hover:border-gray-400';
    }
  };

  const getLoadFactorColor = (loadFactor: number) => {
    if (loadFactor >= 70) return 'text-green-600';
    if (loadFactor >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Safe':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Warning':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalSeats = inventoryData.reduce((sum, item) => sum + item.totalSeats, 0);
  const totalSold = inventoryData.reduce((sum, item) => sum + item.sold, 0);
  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.available, 0);
  const overallLoadFactor = Math.round((totalSold / totalSeats) * 100);
  const criticalDepartures = inventoryData.filter(item => item.riskLevel === 'Critical').length;
  const warningDepartures = inventoryData.filter(item => item.riskLevel === 'Warning').length;
  const safeDepartures = inventoryData.filter(item => item.riskLevel === 'Safe').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-6">Inventory Board - Departure Critical Status</h2>

        {/* Top Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Inventory</p>
                <p className="text-2xl text-foreground mt-1">{totalSeats}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-green-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Overall Load Factor</p>
                <p className={`text-2xl mt-1 ${getLoadFactorColor(overallLoadFactor)}`}>
                  {overallLoadFactor}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Safe Departures</p>
                <p className="text-2xl text-green-600 mt-1">{safeDepartures}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-yellow-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Warning Status</p>
                <p className="text-2xl text-yellow-600 mt-1">{warningDepartures}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border border-l-4 border-l-red-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Critical Status</p>
                <p className="text-2xl text-red-600 mt-1">{criticalDepartures}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sold vs Available Visual */}
        <div className="bg-card p-5 rounded-lg border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Inventory Overview</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm text-muted-foreground">Sold: {totalSold}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-muted-foreground">Available: {totalAvailable}</span>
              </div>
            </div>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-500"
              style={{ width: `${(totalSold / totalSeats) * 100}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                {totalSold} Sold
              </span>
            </div>
            <div
              className="absolute top-0 h-full bg-blue-600 transition-all duration-500"
              style={{
                left: `${(totalSold / totalSeats) * 100}%`,
                width: `${(totalAvailable / totalSeats) * 100}%`
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                {totalAvailable} Available
              </span>
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalDepartures > 0 && (
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h4 className="text-red-600 mb-1">Critical Inventory Alert</h4>
                <p className="text-sm text-red-600">
                  {criticalDepartures} departure{criticalDepartures > 1 ? 's' : ''} require immediate organizational action.
                  Red flashing cards indicate critical risk levels below 40% load factor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {inventoryData.map((departure) => (
            <div
              key={departure.id}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getCardColor(departure.riskLevel)}`}
              onClick={() => setSelectedDeparture(departure)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-4 h-4 text-foreground" />
                    <h4 className="text-foreground">{departure.sector}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{departure.airline}</p>
                </div>
                {getRiskIcon(departure.riskLevel)}
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Departure</p>
                <p className="text-sm text-foreground">{departure.departureDate}</p>
                <p className="text-xs text-muted-foreground">D-{departure.daysToDeparture}</p>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Load Factor</span>
                  <span className={`text-sm ${getLoadFactorColor(departure.loadFactor)}`}>
                    {departure.loadFactor}%
                  </span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      departure.loadFactor >= 70 ? 'bg-green-600' :
                      departure.loadFactor >= 40 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${departure.loadFactor}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded">
                  <p className="text-muted-foreground">Sold</p>
                  <p className="text-foreground">{departure.sold}</p>
                </div>
                <div className="p-2 bg-white rounded">
                  <p className="text-muted-foreground">Available</p>
                  <p className="text-foreground">{departure.available}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/50">
                <span className={`px-2 py-1 rounded text-xs ${
                  departure.riskLevel === 'Safe' ? 'bg-green-600 text-white' :
                  departure.riskLevel === 'Warning' ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {departure.riskLevel}
                </span>
              </div>

              {departure.riskLevel !== 'Safe' && (
                <div className={`mt-3 p-2 rounded-lg border ${
                  departure.riskLevel === 'Warning'
                    ? 'bg-yellow-100 border-yellow-400'
                    : 'bg-red-100 border-red-400'
                }`}>
                  <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                  <p className={`text-xs ${
                    departure.riskLevel === 'Warning' ? 'text-yellow-700' : 'text-red-700'
                  }`}>
                    {departure.riskLevel === 'Warning' ? 'Push Distribution' : 'Discount Support'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Risk Level Legend */}
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <h4 className="text-sm text-foreground mb-3">Risk Level Indicators</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 border-2 border-green-300 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Safe (Green)</p>
                <p className="text-xs text-muted-foreground">Load factor ≥ 70%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 border-2 border-yellow-300 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Warning (Yellow)</p>
                <p className="text-xs text-muted-foreground">Load factor 40-69%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-50 border-2 border-red-300 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Critical (Red)</p>
                <p className="text-xs text-muted-foreground">Load factor &lt; 40% - Immediate action required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Departure Modal */}
        {selectedDeparture && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4" onClick={() => setSelectedDeparture(null)}>
            <div className="bg-card rounded-lg p-6 max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-foreground mb-2">{selectedDeparture.sector} - Detailed View</h3>
                  <p className="text-sm text-muted-foreground">{selectedDeparture.airline} • {selectedDeparture.departureDate}</p>
                </div>
                <button
                  onClick={() => setSelectedDeparture(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Seats</p>
                  <p className="text-2xl text-foreground">{selectedDeparture.totalSeats}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Seats Sold</p>
                  <p className="text-2xl text-green-600">{selectedDeparture.sold}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Available</p>
                  <p className="text-2xl text-blue-600">{selectedDeparture.available}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Load Factor</p>
                  <p className={`text-2xl ${getLoadFactorColor(selectedDeparture.loadFactor)}`}>
                    {selectedDeparture.loadFactor}%
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Days to Departure</p>
                  <p className="text-2xl text-foreground">{selectedDeparture.daysToDeparture}</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Exposure</p>
                  <p className="text-2xl text-accent">{formatCurrency(selectedDeparture.exposure)}</p>
                </div>
              </div>

              {/* Seat Map Visualization */}
              <div className="mb-6">
                <SeatMap
                  totalSeats={selectedDeparture.totalSeats}
                  sold={selectedDeparture.sold}
                  available={selectedDeparture.available}
                  sector={selectedDeparture.sector}
                />
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-foreground mb-3">Risk Assessment</h4>
                <div className={`p-4 rounded-lg border-2 ${
                  selectedDeparture.riskLevel === 'Safe' ? 'bg-green-50 border-green-300' :
                  selectedDeparture.riskLevel === 'Warning' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getRiskIcon(selectedDeparture.riskLevel)}
                    <h4 className={`text-foreground ${
                      selectedDeparture.riskLevel === 'Safe' ? 'text-green-600' :
                      selectedDeparture.riskLevel === 'Warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selectedDeparture.riskLevel} Status
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedDeparture.riskLevel === 'Critical' &&
                      'Immediate action required: Load factor below 40%. Consider discount campaigns or distribution push.'}
                    {selectedDeparture.riskLevel === 'Warning' &&
                      'Monitor closely: Load factor between 40-69%. Push distribution channels and track pipeline.'}
                    {selectedDeparture.riskLevel === 'Safe' &&
                      'Healthy inventory status: Load factor above 70%. Continue current strategy.'}
                  </p>

                  {selectedDeparture.riskLevel !== 'Safe' && (
                    <div className={`mt-3 p-3 rounded-lg border-2 ${
                      selectedDeparture.riskLevel === 'Warning'
                        ? 'bg-yellow-100 border-yellow-400'
                        : 'bg-red-100 border-red-400'
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                      <p className={`text-sm ${
                        selectedDeparture.riskLevel === 'Warning' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        <strong>{selectedDeparture.riskLevel === 'Warning' ? 'Push Distribution' : 'Discount Support'}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  View Flight Details
                </button>
                <button className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                  Push Distribution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
