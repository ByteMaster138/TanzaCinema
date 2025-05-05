import React, { useEffect, useState } from 'react';
import { useMovies } from '../../context/MoviesContext';
import { Seat } from '../../types';

interface SeatGridProps {
  hallId: string;
  showtimeId: string;
}

const SeatGrid: React.FC<SeatGridProps> = ({ hallId, showtimeId }) => {
  const { generateSeats, toggleSeatSelection, selectedSeats, getHallById } = useMovies();
  const [seats, setSeats] = useState<Seat[]>([]);
  const hall = getHallById(hallId);

  useEffect(() => {
    const generatedSeats = generateSeats(hallId, showtimeId);
    setSeats(generatedSeats);
  }, [hallId, showtimeId, generateSeats]);

  if (!hall) {
    return <div>Hall not found</div>;
  }

  // Group seats by row
  const seatsByRow: { [row: number]: Seat[] } = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;
    toggleSeatSelection(seat);
  };

  const getSeatClassName = (seat: Seat) => {
    const isSelected = selectedSeats.some(
      s => s.row === seat.row && s.seatNumber === seat.seatNumber
    );
    
    let className = 'seat-button ';
    
    if (seat.isOccupied) {
      className += 'seat-occupied';
    } else if (isSelected) {
      className += seat.isVip ? 'seat-vip seat-selected' : 'seat-selected';
    } else {
      className += seat.isVip ? 'seat-vip' : 'seat-available';
    }
    
    return className;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Screen */}
      <div className="mb-10 relative">
        <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-500 rounded-t-full mx-auto w-[80%] max-w-3xl"></div>
        <div className="h-8 bg-gray-200 w-[90%] mx-auto max-w-4xl transform perspective-500 rotateX-40"></div>
        <p className="text-center text-gray-500 mt-2 text-sm">SCREEN</p>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mb-8">
        <div className="flex items-center">
          <div className="seat-button seat-available w-6 h-6 mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="seat-button seat-selected w-6 h-6 mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="seat-button seat-occupied w-6 h-6 mr-2"></div>
          <span className="text-sm">Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="seat-button seat-vip w-6 h-6 mr-2"></div>
          <span className="text-sm">VIP</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid place-items-center">
        {Object.keys(seatsByRow).map((rowNum) => {
          const rowSeats = seatsByRow[Number(rowNum)];
          return (
            <div key={`row-${rowNum}`} className="flex items-center mb-2">
              <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700">
                {rowNum}
              </div>
              <div className="grid grid-flow-col gap-2">
                {rowSeats.map(seat => (
                  <div
                    key={seat.id}
                    className="w-8 h-8"
                  >
                    <button
                      disabled={seat.isOccupied}
                      onClick={() => handleSeatClick(seat)}
                      className={`${getSeatClassName(seat)} w-full h-full`}
                    >
                      {seat.seatNumber}
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700">
                {rowNum}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatGrid;