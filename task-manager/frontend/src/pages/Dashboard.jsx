import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskChart from "../components/TaskChart";

import { Search, Plus, SlidersHorizontal, Grid, List, CheckSquare } from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  
  // Navigation & View States
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, board
  const [viewMode, setViewMode] = useState("grid"); // grid, list (applicable to dashboard tab)
  
  // Form Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Search, Filters & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL"); // ALL, OVERDUE, TODAY, WEEK
  const [sortBy, setSortBy] = useState("NEWEST"); // NEWEST, DUE_DATE, PRIORITY

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`tasks/${id}/`);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await api.patch(`tasks/${id}/`, {
        status: "COMPLETED",
      });
      setTasks(
        tasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.patch(`tasks/${id}/`, {
        status: newStatus,
      });
      setTasks(
        tasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  // Real-time calculated counters
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingCount = totalCount - completedCount;
  
  const overdueCount = tasks.filter((t) => {
    if (!t.due_date || t.status === "COMPLETED") return false;
    const dueDateObj = new Date(t.due_date + "T23:59:59");
    return dueDateObj < new Date();
  }).length;

  // Filter Tasks Client-Side
  const filteredTasks = tasks.filter((task) => {
    // Search check
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Priority check
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;

    // Date check
    const matchesDate = (() => {
      if (dateFilter === "ALL") return true;
      if (!task.due_date) return false;

      const dueDateObj = new Date(task.due_date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);

      if (dateFilter === "OVERDUE") {
        return dueDateObj < today && task.status !== "COMPLETED";
      }
      if (dateFilter === "TODAY") {
        return dueDateObj.toDateString() === today.toDateString();
      }
      if (dateFilter === "WEEK") {
        return dueDateObj >= today && dueDateObj <= endOfWeek;
      }
      return true;
    })();

    return matchesSearch && matchesPriority && matchesDate;
  });

  // Sort Tasks Client-Side
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "DUE_DATE") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === "PRIORITY") {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    if (sortBy === "NEWEST") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  // Date Formatting for Header
  const headerDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex bg-[#070b16] min-h-screen text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-8 space-y-8 relative z-10">
        
        {/* Glow blobs on dashboard background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none -z-10"></div>

        {/* Dashboard Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
          <div className="text-left space-y-1">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {headerDateString}
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.username || "Developer"}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Here is an overview of your workspace. You have{" "}
              <span className="text-indigo-400 font-bold">{pendingCount}</span> pending tasks.
            </p>
          </div>

          {/* New Task Action Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/10 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </header>

        {/* 1. Dashboard View (Overview, Stats, Charts, Task List/Grid) */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard title="Total Tasks" value={totalCount} type="total" />
              <StatsCard title="Completed" value={completedCount} type="completed" />
              <StatsCard title="Pending" value={pendingCount} type="pending" />
              <StatsCard title="Overdue" value={overdueCount} type="overdue" />
            </section>

            {/* Custom SVG Charts Section */}
            <section>
              <TaskChart tasks={tasks} />
            </section>

            {/* Task Controls / Toolbar */}
            <section className="p-4 rounded-2xl bg-slate-900/20 border border-slate-800/60 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Search Control */}
              <div className="relative w-full lg:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-slate-200 placeholder:text-slate-600 font-medium"
                />
              </div>

              {/* Filters & Grid Selector */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                
                {/* Priority Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Prio</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-indigo-500 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>

                {/* Due Date Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Date</span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-indigo-500 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="ALL">All Deadlines</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="TODAY">Due Today</option>
                    <option value="WEEK">Due This Week</option>
                  </select>
                </div>

                {/* Sort By Select */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-indigo-500 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="NEWEST">Newest Created</option>
                    <option value="DUE_DATE">Due Date (Soonest)</option>
                    <option value="PRIORITY">Priority Weight</option>
                  </select>
                </div>

                {/* Grid vs List View Mode Toggle */}
                <div className="flex items-center border border-slate-800 rounded-xl p-1 bg-slate-950/40">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      viewMode === "grid" ? "bg-indigo-600/20 text-indigo-400" : "text-slate-500 hover:text-slate-350"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      viewMode === "list" ? "bg-indigo-600/20 text-indigo-400" : "text-slate-500 hover:text-slate-350"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>

              </div>
            </section>

            {/* Task Card Grid/List Container */}
            {sortedTasks.length > 0 ? (
              <section
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onComplete={handleComplete}
                  />
                ))}
              </section>
            ) : (
              <section className="py-20 rounded-2xl bg-slate-900/10 border border-dashed border-slate-800/80 text-center space-y-3">
                <CheckSquare size={36} className="mx-auto text-slate-650 stroke-[1.5]" />
                <h4 className="text-base font-bold text-slate-300">No tasks found</h4>
                <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  No tasks match your current filter settings. Try adjusting your queries or create a new task to get started!
                </p>
              </section>
            )}
          </div>
        )}

        {/* 2. Board View (Kanban style board) */}
        {activeTab === "board" && (
          <div className="space-y-6 animate-fade-in flex flex-col flex-1 h-[calc(100vh-140px)]">
            
            {/* Quick Kanban Header Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/15 border border-slate-800/60">
              <span className="text-xs font-semibold text-slate-400">
                Quickly transition tasks by clicking board arrows or marking completion.
              </span>
              {/* Kanban-specific Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Quick search board..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-slate-200 placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0 overflow-y-auto pb-4">
              
              {/* Column 1: TODO */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/15 border border-slate-850/60 h-full overflow-y-auto">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-550"></span>
                    <h3 className="font-bold text-sm text-slate-300">To Do</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-550 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {sortedTasks.filter((t) => t.status === "TODO").length}
                  </span>
                </div>
                
                <div className="space-y-4 overflow-y-auto flex-1 pr-1.5">
                  {sortedTasks.filter((t) => t.status === "TODO").length > 0 ? (
                    sortedTasks
                      .filter((t) => t.status === "TODO")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onComplete={handleComplete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-600 border border-dashed border-slate-800/40 rounded-xl">
                      No tasks in To Do
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: IN PROGRESS */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/15 border border-slate-850/60 h-full overflow-y-auto">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse-subtle"></span>
                    <h3 className="font-bold text-sm text-slate-300">In Progress</h3>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">
                    {sortedTasks.filter((t) => t.status === "IN_PROGRESS").length}
                  </span>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 pr-1.5">
                  {sortedTasks.filter((t) => t.status === "IN_PROGRESS").length > 0 ? (
                    sortedTasks
                      .filter((t) => t.status === "IN_PROGRESS")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onComplete={handleComplete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-600 border border-dashed border-slate-800/40 rounded-xl">
                      No tasks in Progress
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: COMPLETED */}
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/15 border border-slate-850/60 h-full overflow-y-auto">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-sm text-slate-300">Completed</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
                    {sortedTasks.filter((t) => t.status === "COMPLETED").length}
                  </span>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 pr-1.5">
                  {sortedTasks.filter((t) => t.status === "COMPLETED").length > 0 ? (
                    sortedTasks
                      .filter((t) => t.status === "COMPLETED")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onComplete={handleComplete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-600 border border-dashed border-slate-800/40 rounded-xl">
                      No completed tasks
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Slide-over Task Creation/Edit Form Modal */}
      <TaskForm
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        onTaskCreated={(newTask) => setTasks([newTask, ...tasks])}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        fetchTasks={fetchTasks}
      />
    </div>
  );
}

export default Dashboard;