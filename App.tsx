import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Timer, Settings } from 'lucide-react';

import TodoList from './components/TodoList';
import CalendarView from './components/CalendarView';
import Statistics from './components/Statistics';
import FocusOverlay from './components/FocusOverlay';
import SpotifyWidget from './components/SpotifyWidget';

import { Task, CalendarEvent, StudySession, ViewState, TimerConfig } from './types';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Data State (Mock Persistence could be added here)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([
    { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], minutes: 45 },
    { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], minutes: 120 },
  ]);

  // Timer State
  const [timerConfig, setTimerConfig] = useState<TimerConfig>({ focusTime: 25, breakTime: 5 });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false); // If true, overlay shows
  const intervalRef = useRef<number | null>(null);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      handleTimerComplete();
    } else {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsFocusMode(false);
    
    // Log Session
    const today = new Date().toISOString().split('T')[0];
    const newSession: StudySession = { date: today, minutes: timerConfig.focusTime };
    setSessions(prev => [...prev, newSession]);
    
    // Play sound or alert
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(e => console.log("Audio play failed interaction needed"));
    alert("Focus session complete! Great job!");
    
    setTimeLeft(timerConfig.focusTime * 60);
  };

  const startTimer = () => {
    setIsActive(true);
    setIsFocusMode(true); // Locks screen
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsFocusMode(false);
    setTimeLeft(timerConfig.focusTime * 60);
  };

  const updateTimerConfig = (newMinutes: number) => {
      setTimerConfig(prev => ({ ...prev, focusTime: newMinutes }));
      if (!isActive) {
          setTimeLeft(newMinutes * 60);
      }
  };

  // Render Helpers
  const renderNavButton = (v: ViewState, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setView(v)}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-20 md:w-auto md:flex-row md:px-4 md:py-3 md:gap-3
        ${view === v 
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
    >
      {icon}
      <span className="text-xs md:text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-violet-500 selection:text-white">
      
      {/* Focus Overlay (Lock Screen) */}
      <FocusOverlay 
        timeLeft={timeLeft} 
        isActive={isFocusMode} 
        onStop={stopTimer}
        timerConfig={timerConfig}
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <CheckSquare className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">FocusFlow</h1>
          </div>

          <nav className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-800 flex md:flex-col justify-between md:justify-start gap-1 sticky top-4 z-20">
            {renderNavButton(ViewState.DASHBOARD, <LayoutDashboard size={20} />, 'Dashboard')}
            {renderNavButton(ViewState.TODO, <CheckSquare size={20} />, 'Tasks')}
            {renderNavButton(ViewState.CALENDAR, <Calendar size={20} />, 'Calendar')}
            {renderNavButton(ViewState.TIMER, <Timer size={20} />, 'Timer')}
          </nav>

          <div className="hidden md:block">
            <SpotifyWidget />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-8 pb-24 md:pb-0">
          
          {/* Header */}
          <header className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                    {view === ViewState.DASHBOARD && 'Overview'}
                    {view === ViewState.TODO && 'My Tasks'}
                    {view === ViewState.CALENDAR && 'Schedule'}
                    {view === ViewState.TIMER && 'Focus Session'}
                </h2>
                <p className="text-slate-400 text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>
            {/* Quick Timer Toggle (Mini) */}
            {view !== ViewState.TIMER && (
                <button 
                    onClick={() => setView(ViewState.TIMER)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-mono text-violet-400"
                >
                    <Timer size={16} />
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </button>
            )}
          </header>

          {/* Views */}
          <div className="animate-fade-in">
            {view === ViewState.DASHBOARD && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                            <div className="text-violet-200 text-sm font-medium mb-1">Total Study Time</div>
                            <div className="text-3xl font-bold">
                                {sessions.reduce((acc, curr) => acc + curr.minutes, 0)} <span className="text-lg font-normal opacity-70">mins</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
                            <div className="text-slate-400 text-sm font-medium mb-1">Tasks Pending</div>
                            <div className="text-3xl font-bold text-white">
                                {tasks.filter(t => !t.completed).length} <span className="text-lg font-normal text-slate-500">/ {tasks.length}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
                            <div className="text-slate-400 text-sm font-medium mb-1">Upcoming Targets</div>
                            <div className="text-3xl font-bold text-white">
                                {events.filter(e => new Date(e.date) >= new Date()).length}
                            </div>
                        </div>
                    </div>
                    <Statistics sessions={sessions} />
                </div>
            )}

            {view === ViewState.TODO && (
                <TodoList tasks={tasks} setTasks={setTasks} />
            )}

            {view === ViewState.CALENDAR && (
                <CalendarView events={events} setEvents={setEvents} />
            )}

            {view === ViewState.TIMER && (
                <div className="flex flex-col items-center justify-center py-12 space-y-10">
                     <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative w-72 h-72 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl">
                            <span className="text-7xl font-bold text-white font-mono tracking-tight">
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                        </div>
                     </div>

                     <div className="flex gap-4">
                         {!isActive ? (
                            <button 
                                onClick={startTimer}
                                className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-violet-900/50 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Timer size={24} />
                                Start Focus
                            </button>
                         ) : (
                             <button className="bg-slate-700 text-slate-400 px-8 py-3 rounded-full font-bold text-lg cursor-not-allowed opacity-50">
                                 Running...
                             </button>
                         )}
                     </div>

                     <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Settings size={18} />
                            Timer Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Focus Duration (minutes)</label>
                                <input 
                                    type="range" 
                                    min="1" max="90" 
                                    value={timerConfig.focusTime}
                                    disabled={isActive}
                                    onChange={(e) => updateTimerConfig(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                />
                                <div className="text-right text-violet-400 font-mono mt-1">{timerConfig.focusTime} min</div>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-500 border border-slate-800">
                                <strong>Note:</strong> Starting the timer will enable "Focus Mode", covering the screen to prevent distractions.
                            </div>
                        </div>
                     </div>
                </div>
            )}
          </div>
        </main>
        
        {/* Mobile Spotify Spacer */}
        <div className="md:hidden h-20">
             <SpotifyWidget />
        </div>

      </div>
    </div>
  );
};

export default App;