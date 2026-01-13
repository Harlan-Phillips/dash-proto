import React, { useState } from "react";
import Layout from "@/components/layout";
import { 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Utensils,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area,
  ComposedChart,
  Legend,
  Cell
} from "recharts";

// --- Mock Data ---
const shiftBreakdownData = [
  { name: "9am", sales: 180, laborCost: 80, laborPercent: 44 },
  { name: "10am", sales: 240, laborCost: 95, laborPercent: 39 },
  { name: "11am", sales: 420, laborCost: 140, laborPercent: 33 },
  { name: "12pm", sales: 780, laborCost: 290, laborPercent: 37 },
  { name: "1pm", sales: 640, laborCost: 280, laborPercent: 43 },
  { name: "2pm", sales: 320, laborCost: 150, laborPercent: 46 },
  { name: "3pm", sales: 180, laborCost: 70, laborPercent: 38 },
  { name: "4pm", sales: 180, laborCost: 70, laborPercent: 38 },
  { name: "5pm", sales: 280, laborCost: 60, laborPercent: 21 },
  { name: "6pm", sales: 520, laborCost: 80, laborPercent: 15 },
  { name: "7pm", sales: 480, laborCost: 75, laborPercent: 15 },
  { name: "8pm", sales: 300, laborCost: 65, laborPercent: 21 },
  { name: "9pm", sales: 200, laborCost: 50, laborPercent: 25 },
  { name: "10pm", sales: 100, laborCost: 25, laborPercent: 25 },
];

const dailyPerformanceData = [
  { name: "Sep 1", sales: 4200, laborCost: 1200, laborPercent: 28.5 },
  { name: "Sep 2", sales: 3800, laborCost: 1150, laborPercent: 30.2 },
  { name: "Sep 3", sales: 4500, laborCost: 1250, laborPercent: 27.7 },
  { name: "Sep 4", sales: 4800, laborCost: 1300, laborPercent: 27.0 },
  { name: "Sep 5", sales: 6200, laborCost: 1600, laborPercent: 25.8 },
  { name: "Sep 6", sales: 7100, laborCost: 1800, laborPercent: 25.3 },
  { name: "Sep 7", sales: 5400, laborCost: 1400, laborPercent: 25.9 },
  { name: "Sep 8", sales: 3900, laborCost: 1180, laborPercent: 30.2 },
  { name: "Sep 9", sales: 4100, laborCost: 1200, laborPercent: 29.2 },
  { name: "Sep 10", sales: 4600, laborCost: 1280, laborPercent: 27.8 },
  { name: "Sep 11", sales: 4900, laborCost: 1350, laborPercent: 27.5 },
  { name: "Sep 12", sales: 6500, laborCost: 1650, laborPercent: 25.3 },
  { name: "Sep 13", sales: 7400, laborCost: 1900, laborPercent: 25.6 },
  { name: "Sep 14", sales: 5600, laborCost: 1450, laborPercent: 25.8 },
  { name: "Sep 15", sales: 4000, laborCost: 1200, laborPercent: 30.0 },
  { name: "Sep 16", sales: 4300, laborCost: 1250, laborPercent: 29.0 },
  { name: "Sep 17", sales: 4700, laborCost: 1300, laborPercent: 27.6 },
  { name: "Sep 18", sales: 5100, laborCost: 1400, laborPercent: 27.4 },
  { name: "Sep 19", sales: 6800, laborCost: 1700, laborPercent: 25.0 },
  { name: "Sep 20", sales: 7600, laborCost: 1950, laborPercent: 25.6 },
  { name: "Sep 21", sales: 5800, laborCost: 1500, laborPercent: 25.8 },
  { name: "Sep 22", sales: 4100, laborCost: 1220, laborPercent: 29.7 },
  { name: "Sep 23", sales: 4400, laborCost: 1280, laborPercent: 29.0 },
  { name: "Sep 24", sales: 4900, laborCost: 1350, laborPercent: 27.5 },
  { name: "Sep 25", sales: 5300, laborCost: 1450, laborPercent: 27.3 },
  { name: "Sep 26", sales: 7000, laborCost: 1750, laborPercent: 25.0 },
  { name: "Sep 27", sales: 7800, laborCost: 2000, laborPercent: 25.6 },
  { name: "Sep 28", sales: 6000, laborCost: 1550, laborPercent: 25.8 },
  { name: "Sep 29", sales: 4200, laborCost: 1250, laborPercent: 29.7 },
  { name: "Sep 30", sales: 4500, laborCost: 1300, laborPercent: 28.8 },
];

const ticketTimeData = [
  { name: "10am", green: 12, yellow: 2, red: 0 },
  { name: "11am", green: 28, yellow: 5, red: 1 },
  { name: "12pm", green: 45, yellow: 12, red: 3 },
  { name: "1pm", green: 52, yellow: 15, red: 5 },
  { name: "2pm", green: 38, yellow: 8, red: 2 },
  { name: "3pm", green: 18, yellow: 4, red: 1 },
  { name: "4pm", green: 15, yellow: 0, red: 0 },
  { name: "5pm", green: 15, yellow: 0, red: 0 },
  { name: "6pm", green: 15, yellow: 0, red: 0 },
  { name: "7pm", green: 55, yellow: 18, red: 9 },
  { name: "8pm", green: 42, yellow: 12, red: 4 },
  { name: "9pm", green: 25, yellow: 5, red: 3 },
];

const ticketTimeDataMonth = [
  { name: "Sep 1", green: 120, yellow: 15, red: 2 },
  { name: "Sep 2", green: 135, yellow: 18, red: 3 },
  { name: "Sep 3", green: 142, yellow: 22, red: 4 },
  { name: "Sep 4", green: 155, yellow: 25, red: 5 },
  { name: "Sep 5", green: 180, yellow: 35, red: 12 },
  { name: "Sep 6", green: 210, yellow: 42, red: 15 },
  { name: "Sep 7", green: 165, yellow: 28, red: 8 },
  { name: "Sep 8", green: 115, yellow: 12, red: 1 },
  { name: "Sep 9", green: 128, yellow: 16, red: 3 },
  { name: "Sep 10", green: 135, yellow: 20, red: 4 },
  { name: "Sep 11", green: 150, yellow: 24, red: 6 },
  { name: "Sep 12", green: 195, yellow: 38, red: 14 },
  { name: "Sep 13", green: 225, yellow: 45, red: 18 },
  { name: "Sep 14", green: 175, yellow: 30, red: 10 },
  { name: "Sep 15", green: 118, yellow: 14, red: 2 },
  { name: "Sep 16", green: 132, yellow: 18, red: 4 },
  { name: "Sep 17", green: 145, yellow: 22, red: 5 },
  { name: "Sep 18", green: 160, yellow: 26, red: 7 },
  { name: "Sep 19", green: 205, yellow: 40, red: 16 },
  { name: "Sep 20", green: 235, yellow: 48, red: 20 },
  { name: "Sep 21", green: 185, yellow: 32, red: 12 },
  { name: "Sep 22", green: 122, yellow: 15, red: 2 },
  { name: "Sep 23", green: 138, yellow: 19, red: 4 },
  { name: "Sep 24", green: 152, yellow: 25, red: 6 },
  { name: "Sep 25", green: 168, yellow: 28, red: 8 },
  { name: "Sep 26", green: 215, yellow: 44, red: 17 },
  { name: "Sep 27", green: 245, yellow: 50, red: 22 },
  { name: "Sep 28", green: 190, yellow: 35, red: 14 },
  { name: "Sep 29", green: 125, yellow: 16, red: 3 },
  { name: "Sep 30", green: 140, yellow: 21, red: 5 },
];

// --- Components ---

function ActionButton({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "outline" | "ghost" }) {
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-border bg-white hover:bg-gray-50 text-foreground",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-gray-50",
  };
  
  return (
    <button className={cn("px-4 py-2 text-sm font-medium transition-colors font-sans", variants[variant])}>
      {children}
    </button>
  );
}

function DateRangeSelector({ timeRange, setTimeRange, date, setDate, type = "default" }: any) {
  const handlePrev = () => {
    // Logic to go to prev month/week/day
    // For prototype, we'll just show the concept
  };
  
  const handleNext = () => {
    // Logic to go to next month/week/day
  };

  return (
    <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center">
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {timeRange === "Month" ? "September 2025" : 
             timeRange === "Week" ? "Sep 15 - Sep 21" : 
             timeRange === "Today" ? "Monday, Sep 15" : "2025"}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors" onClick={handleNext}>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <div className="h-4 w-px bg-gray-200" />
      <div className="flex bg-gray-100/50 rounded-md p-0.5">
        {["Today", "Week", "Month", "Year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              timeRange === range 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            )}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtext, trend, trendValue, icon: Icon, color = "emerald" }: any) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    gray: "text-gray-600 bg-gray-50 border-gray-100",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-sans tracking-tight text-gray-900">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", colors[color as keyof typeof colors])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-1">
        {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        <div className="flex items-center gap-2 text-sm">
          <span className={cn("font-medium flex items-center gap-0.5", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-amber-600")}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            {trendValue}
          </span>
          <span className="text-muted-foreground text-xs">vs avg</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview({ title, description, role, tags, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
        active 
          ? "bg-black text-white border-black ring-2 ring-black ring-offset-2" 
          : "bg-white border-gray-200 hover:border-gray-300 text-foreground"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          active ? "bg-white/20" : "bg-gray-100"
        )}>
          <LayoutDashboard className="h-5 w-5" />
        </div>
        {active && <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">Active</span>}
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className={cn("text-sm mb-4 line-clamp-2", active ? "text-gray-300" : "text-muted-foreground")}>
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className={cn(
          "text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wider",
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
        )}>
          {role}
        </span>
        {tags.map((tag: string) => (
          <span key={tag} className={cn(
            "text-[10px] px-2 py-1 rounded-md border",
            active ? "border-white/20 text-gray-300" : "border-gray-200 text-gray-500"
          )}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function Dashboards() {
  const [selectedDashboard, setSelectedDashboard] = useState<string>("performance_summary");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [customDashboard, setCustomDashboard] = useState<any>(null);
  
  // Date State
  const [timeRange, setTimeRange] = useState<"Today" | "Week" | "Month" | "Year">("Month");
  const [date, setDate] = useState(new Date(2025, 8, 15)); // September 15, 2025

  const presets = [
    {
      id: "performance_summary",
      title: "Performance Summary",
      description: "Comprehensive view of sales, labor, and prime costs with shift breakdown.",
      role: "GM",
      tags: ["Profit", "Sales", "Labor"],
      layout: "performance"
    },
    {
      id: "ticket_time",
      title: "Ticket Time Performance",
      description: "Kitchen efficiency metrics, ticket time breakdowns, and bottleneck analysis.",
      role: "Chef",
      tags: ["Kitchen", "Efficiency", "Speed"],
      layout: "ticket_time"
    },
    {
      id: "server_performance",
      title: "Server Performance",
      description: "Individual sales performance, tip averages, and table turnover rates.",
      role: "Manager",
      tags: ["Staff", "Sales", "Service"],
      layout: "server"
    }
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);
    
    // Create the dashboard shell immediately
    const newDashboard = {
      id: "custom_generated",
      title: `Analysis: "${searchQuery}"`,
      description: "AI is analyzing your data to build a custom view...",
      role: "Custom",
      tags: ["AI Generated"],
      layout: "custom"
    };
    
    setCustomDashboard(newDashboard);
    setSelectedDashboard("custom_generated");
    
    // Simulate progressive generation
    setTimeout(() => {
      setGenerationStep(1); // Metrics
    }, 800);

    setTimeout(() => {
      setGenerationStep(2); // Chart
    }, 2000);

    setTimeout(() => {
      setGenerationStep(3); // Breakdown
    }, 3500);

    setTimeout(() => {
      setGenerationStep(4); // Recommendations
      setIsGenerating(false);
      setCustomDashboard(prev => ({
        ...prev,
        description: "Custom dashboard generated based on your specific query."
      }));
    }, 5000);
  };

  const filteredPresets = presets.filter(p => filterRole === "all" || p.role === filterRole);
  const allDashboards = customDashboard ? [customDashboard, ...filteredPresets] : filteredPresets;

  const currentDashboard = allDashboards.find(d => d.id === selectedDashboard) || presets[0];

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        
        {/* Sidebar: Dashboard List */}
        <div className="w-80 border-r border-border bg-gray-50/50 flex flex-col">
          <div className="p-6 border-b border-border">
             <h1 className="font-serif text-2xl font-bold mb-4">Dashboards</h1>
             
             {/* AI Generator Input */}
             <div className="relative mb-6">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg blur opacity-40"></div>
               <form onSubmit={handleGenerate} className="relative flex shadow-sm">
                 <input 
                    type="text" 
                    placeholder="Describe a problem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                 />
                 <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
                 <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="bg-black text-white px-3 py-2 rounded-r-lg hover:bg-gray-800 disabled:opacity-70"
                 >
                   {isGenerating ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                 </button>
               </form>
             </div>

             {/* Filters */}
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {["all", "Owner", "GM", "Manager", "Chef"].map(role => (
                 <button
                   key={role}
                   onClick={() => setFilterRole(role)}
                   className={cn(
                     "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                     filterRole === role 
                       ? "bg-gray-900 text-white" 
                       : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                   )}
                 >
                   {role === "all" ? "All Roles" : role}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {allDashboards.map(dashboard => (
               <DashboardPreview 
                  key={dashboard.id}
                  {...dashboard}
                  active={selectedDashboard === dashboard.id}
                  onClick={() => setSelectedDashboard(dashboard.id)}
               />
             ))}
             
             <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex flex-col items-center justify-center gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Create New Dashboard</span>
             </button>
          </div>
        </div>

        {/* Main Content: Active Dashboard */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
           <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-serif font-medium text-gray-900 mb-1">{currentDashboard.title}</h2>
                    <p className="text-muted-foreground">{currentDashboard.description}</p>
                 </div>
                 <div className="flex gap-3">
                    <DateRangeSelector 
                       timeRange={timeRange} 
                       setTimeRange={setTimeRange} 
                       date={date} 
                       setDate={setDate} 
                    />
                 </div>
              </div>

              {/* Dynamic Content Based on Layout */}
              {currentDashboard.layout === "performance" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   {/* Key Metrics */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard 
                        title="SALES" 
                        value={timeRange === "Month" ? "$152,400" : "$4,820"} 
                        subtext={timeRange === "Month" ? "Avg Month: $148,000" : "Avg Monday: $5,180"}
                        trend="down" 
                        trendValue="6.9%" 
                        icon={DollarSign} 
                        color="gray" 
                      />
                      <MetricCard 
                        title="COGS %" 
                        value="32.4%" 
                        subtext={timeRange === "Month" ? "Avg Month: 31.0%" : "Avg Monday: 30.8%"}
                        trend="up" 
                        trendValue="1.6 pts" 
                        icon={Utensils} 
                        color="gray" 
                      />
                      <MetricCard 
                        title="LABOR %" 
                        value="31.8%" 
                        subtext={timeRange === "Month" ? "Avg Month: 30.0%" : "Avg Monday: 29.3%"}
                        trend="up" 
                        trendValue="2.5 pts" 
                        icon={Users} 
                        color="gray" 
                      />
                      <div className="relative overflow-hidden bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">PRIME COST</p>
                            <h3 className="text-3xl font-bold font-sans tracking-tight text-gray-900">64.2%</h3>
                          </div>
                          <div className="p-2 rounded-lg bg-red-100 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{timeRange === "Month" ? "Avg Month: 61.0%" : "Avg Monday: 60.1%"}</p>
                          <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                            <AlertCircle className="h-3 w-3" />
                            +4.1 pts vs avg
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Shift Breakdown / Trend Chart */}
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-lg font-medium flex items-center gap-2">
                           <Clock className="h-4 w-4 text-gray-500" />
                           {timeRange === "Month" ? "Daily Breakdown" : timeRange === "Week" ? "Daily Breakdown" : "Shift Breakdown"}
                           <span className="text-sm font-normal text-muted-foreground ml-2">
                             {timeRange === "Month" ? "September 2025" : "Today"}
                           </span>
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-medium">
                           <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                              <span>Sales</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                              <span>Labor Cost</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Labor %</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={timeRange === "Month" ? dailyPerformanceData : shiftBreakdownData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10} 
                                tick={{fontSize: 12, fill: '#6b7280'}}
                                minTickGap={30}
                            />
                            <YAxis 
                                yAxisId="left" 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(value) => `$${value}`} 
                                tick={{fontSize: 12, fill: '#6b7280'}}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(value) => `${value}%`} 
                                tick={{fontSize: 12, fill: '#6b7280'}}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                formatter={(value, name) => [
                                  name === "laborPercent" ? `${value}%` : `$${value}`, 
                                  name === "sales" ? "Sales" : name === "laborCost" ? "Labor Cost" : "Labor %"
                                ]}
                            />
                            <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={timeRange === "Month" ? 12 : 20} />
                            <Bar yAxisId="left" dataKey="laborCost" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={timeRange === "Month" ? 12 : 20} />
                            <Line yAxisId="right" type="monotone" dataKey="laborPercent" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: "#ef4444"}} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                   
                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                         <span className="font-medium text-gray-900">Total Sales: <span className="font-bold">{timeRange === "Month" ? "$152,400" : "$4,820"}</span></span>
                         <span className="font-medium text-gray-900">Total Labor: <span className="font-bold">{timeRange === "Month" ? "$45,720" : "$1,535"}</span></span>
                         <span className="font-medium text-gray-900">Overall Labor %: <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">31.8%</span></span>
                      </div>
                      <div className="text-gray-500 italic">Synced with Performance Summary</div>
                   </div>
                </div>
              )}

              {currentDashboard.layout === "ticket_time" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   {/* Ticket Time Chart */}
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                                <span className="text-sm font-medium text-gray-600">On-time (0-7 min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                                <span className="text-sm font-medium text-gray-600">At risk (7-10 min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                                <span className="text-sm font-medium text-gray-600">Problematic (&gt;10 min)</span>
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">Tickets by {timeRange === "Month" ? "day" : "hour"}</span>
                      </div>
                      
                      <div className="h-80 relative">
                        {/* Custom Tooltip Mimic from Screenshot */}
                        <div className="absolute top-10 left-[45%] z-10 bg-white p-4 rounded-lg shadow-xl border border-gray-100 w-64 animate-in fade-in zoom-in duration-300 pointer-events-none hidden md:block">
                            <div className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">
                                {timeRange === "Month" ? "Sep 15" : "3pm:00 – 3pm:59"}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span>Green</span>
                                    </div>
                                    <span className="font-medium">18 tickets (78%)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                        <span>Yellow</span>
                                    </div>
                                    <span className="font-medium">4 tickets (17%)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>Red</span>
                                    </div>
                                    <span className="font-medium">1 tickets (4%)</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 font-medium">
                                Total: 23 tickets
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={timeRange === "Month" ? ticketTimeDataMonth : ticketTimeData} barSize={timeRange === "Month" ? 12 : 40}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                             <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10} 
                                tick={{fontSize: 12, fill: '#6b7280'}}
                                minTickGap={30}
                             />
                             <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                             <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                             <Bar dataKey="green" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                             <Bar dataKey="yellow" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
                             <Bar dataKey="red" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex justify-around items-center mt-8 pt-6 border-t border-gray-100">
                          <div className="text-center">
                              <div className="text-3xl font-bold text-emerald-600 mb-1">78%</div>
                              <div className="text-sm text-gray-500">On-time tickets</div>
                          </div>
                          <div className="text-center">
                              <div className="text-3xl font-bold text-amber-500 mb-1">16%</div>
                              <div className="text-sm text-gray-500">At risk tickets</div>
                          </div>
                          <div className="text-center">
                              <div className="text-3xl font-bold text-red-500 mb-1">6%</div>
                              <div className="text-sm text-gray-500">Problematic tickets</div>
                          </div>
                      </div>
                   </div>
                   
                   {/* Kitchen Issues */}
                   <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-lg font-medium text-red-900 flex items-center gap-2">
                              <AlertCircle className="h-5 w-5" />
                              Kitchen Issues {timeRange === "Month" ? "This Month" : "Today"}
                          </h3>
                          <button className="text-sm text-gray-500 hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Click to get guided help</button>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-red-100 shadow-sm mb-3">
                          <div className="flex gap-3">
                              <div className="p-2 bg-red-100 rounded-full h-fit">
                                  <Clock className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                  <h4 className="font-medium text-gray-900">Red tickets spiked during dinner rush</h4>
                                  <p className="text-sm text-gray-600 mt-1">9 problematic tickets at 7pm — check grill and sauté stations for bottlenecks.</p>
                                  <div className="flex gap-2 mt-3">
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Hour: 7pm</span>
                                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">9 red tickets</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-red-100 shadow-sm opacity-70">
                          <div className="flex gap-3">
                              <div className="p-2 bg-amber-100 rounded-full h-fit">
                                  <Utensils className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                  <h4 className="font-medium text-gray-900">Protein waste above normal</h4>
                                  <p className="text-sm text-gray-600 mt-1">Observed higher than average trimmings waste during prep shift.</p>
                              </div>
                          </div>
                      </div>
                   </div>
                </div>
              )}

              {currentDashboard.layout === "custom" && (
                <div className="space-y-8">
                  {/* Step 1: Metrics */}
                  {generationStep >= 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="flex items-center gap-2 mb-3 text-emerald-700 font-medium text-sm animate-pulse">
                        <Sparkles className="h-4 w-4" /> 
                        {generationStep === 1 ? "Analyzing key performance metrics..." : "Key Metrics Identified"}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Impact Score" value="High" trend="up" trendValue="Critical" icon={AlertCircle} color="red" />
                        <MetricCard title="Est. Loss" value="$450" trend="up" trendValue="Daily" icon={DollarSign} color="amber" />
                        <MetricCard title="Frequency" value="4x" trend="up" trendValue="Weekly" icon={Clock} color="blue" />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Main Chart */}
                  {generationStep >= 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      <div className="flex items-center gap-2 mb-3 text-emerald-700 font-medium text-sm animate-pulse">
                        <TrendingUp className="h-4 w-4" /> 
                        {generationStep === 2 ? "Correlating data points across time..." : "Trend Analysis"}
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-medium text-lg mb-6">Anomaly Detection</h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyPerformanceData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                              <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={2} dot={{r: 4, fill: "#000"}} activeDot={{r: 6}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Breakdown/Insights */}
                  {generationStep >= 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      <div className="flex items-center gap-2 mb-3 text-emerald-700 font-medium text-sm animate-pulse">
                         <Filter className="h-4 w-4" /> 
                         {generationStep === 3 ? "Isolating root causes..." : "Root Cause Analysis"}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="font-medium text-lg mb-4">Contributing Factors</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                               <span className="text-sm font-medium text-red-900">Inventory Variance</span>
                               <span className="text-sm font-bold text-red-700">42%</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                               <span className="text-sm font-medium text-gray-700">Portion Control</span>
                               <span className="text-sm font-bold text-gray-900">28%</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                               <span className="text-sm font-medium text-gray-700">Waste Tracking</span>
                               <span className="text-sm font-bold text-gray-900">15%</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="font-medium text-lg mb-4">Recommended Actions</h3>
                          <div className="space-y-4">
                            <div className="flex gap-3">
                               <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                               <div>
                                  <h4 className="text-sm font-medium text-gray-900">Audit Protein Prep</h4>
                                  <p className="text-xs text-gray-500 mt-1">Check trim waste logs for the last 3 days against standard yield.</p>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                               <div>
                                  <h4 className="text-sm font-medium text-gray-900">Retrain Line Cooks</h4>
                                  <p className="text-xs text-gray-500 mt-1">Schedule a 15-min demo on proper portioning for top 3 menu items.</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    </Layout>
  );
}