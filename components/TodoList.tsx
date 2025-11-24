import React, { useState } from 'react';
import { Plus, Trash2, Check, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      dueDate: new Date(),
      priority,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Input Area */}
      <form onSubmit={addTask} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What do you need to study?"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
        />
        <div className="flex gap-2">
            <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button 
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-6 py-2 font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} />
                Add
            </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {tasks.length === 0 && (
            <div className="text-center py-10 text-slate-500">
                <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4">
                    <Check size={32} className="opacity-50" />
                </div>
                <p>No tasks yet. Start planning your study session!</p>
            </div>
        )}
        
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                task.completed 
                ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-violet-500'
                }`}
              >
                {task.completed && <Check size={14} className="text-white" />}
              </button>
              
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)} uppercase tracking-wide font-bold`}>
                        {task.priority}
                    </span>
                </div>
              </div>
            </div>

            <button 
                onClick={() => deleteTask(task.id)}
                className="text-slate-500 hover:text-red-400 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
                <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;