import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const existing = events.find(e => e.date === dateStr);
    setTargetInput(existing ? existing.target : '');
  };

  const saveTarget = () => {
    if (!selectedDate) return;
    const newEvents = events.filter(e => e.date !== selectedDate);
    if (targetInput.trim()) {
      newEvents.push({ date: selectedDate, target: targetInput });
    }
    setEvents(newEvents);
    setSelectedDate(null);
  };

  const getTargetForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date === dateStr);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Calendar Grid */}
      <div className="flex-1 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300">
              <ChevronLeft />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-slate-500 text-sm font-medium py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const target = getTargetForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-start pt-2 relative overflow-hidden transition-all
                  ${isToday ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}
                  ${target ? 'ring-1 ring-green-500/50' : ''}
                `}
              >
                <span className={`text-sm font-medium ${isToday ? 'text-violet-400' : 'text-slate-300'}`}>{day}</span>
                {target && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500/50" />
                )}
                {target && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-slate-900/80 transition-opacity">
                        <Target size={16} className="text-green-400"/>
                    </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side Panel for Target Setting */}
      <div className="w-full md:w-80 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="text-violet-500" />
            Daily Targets
        </h3>
        
        {selectedDate ? (
          <div className="flex-1 flex flex-col">
            <p className="text-slate-400 mb-2">Set target for: <span className="text-white font-mono">{selectedDate}</span></p>
            <textarea 
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none resize-none mb-4"
              placeholder="e.g. Complete Chapter 4 Physics..."
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />
            <div className="mt-auto flex gap-2">
                <button 
                onClick={saveTarget}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                Save
                </button>
                <button 
                onClick={() => setSelectedDate(null)}
                className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                Cancel
                </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-center text-sm">
            <p>Select a date to set or view your study target.</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-700">
             <h4 className="text-sm font-semibold text-slate-400 mb-3">Upcoming Targets</h4>
             <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {events
                    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
                    .slice(0, 3)
                    .map((e, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-2 rounded border border-slate-700/50 text-xs">
                        <div className="text-violet-400 font-mono mb-1">{e.date}</div>
                        <div className="text-slate-300 line-clamp-2">{e.target}</div>
                    </div>
                ))}
                {events.length === 0 && <span className="text-xs text-slate-600">No upcoming targets.</span>}
             </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;