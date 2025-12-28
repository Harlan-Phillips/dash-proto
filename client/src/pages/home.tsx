import React, { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  TrendingDown,
  Target,
  Sparkles,
  Zap,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

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

function StatCard({ label, value, trend, trendValue, icon: Icon, color = "default" }: any) {
  return (
    <div className="bg-white border border-border p-6 flex flex-col justify-between h-full rounded-xl">
       <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
       </div>
       
       <div>
          <div className="text-3xl font-serif font-medium mb-2">{value}</div>
          <div className="flex items-center gap-2 text-sm">
             <span className={cn(
               "font-medium flex items-center gap-1",
               trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-600"
             )}>
               {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
               {trendValue}
             </span>
             <span className="text-muted-foreground text-xs">vs last week</span>
          </div>
       </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto space-y-12">
        
        {/* 1. Top Navigation Context */}
        <div className="flex items-center justify-between border-b border-border pb-4">
           <div className="flex items-center gap-6">
              <span className="font-serif text-2xl font-medium">Little Mo BK</span>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">Today, Oct 24</span>
           </div>
           
           <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Locations <span className="text-[10px] ml-1">▼</span></button>
              <button className="hover:text-foreground transition-colors">Bonuses</button>
              <button className="hover:text-foreground transition-colors">Reports</button>
              <button className="hover:text-foreground transition-colors">Settings</button>
           </div>
        </div>

        {/* 2. Hero / Quick Overview */}
        <div className="bg-gray-50 border border-border p-10 relative overflow-hidden rounded-xl">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles size={200} />
           </div>

           <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3" />
                 </div>
                 <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Daily Briefing</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight mb-8">
                 Revenue is tracking <span className="bg-emerald-50 text-emerald-700 px-1 border border-emerald-100 rounded">12% ahead of forecast</span>, but labor costs are <span className="bg-red-50 text-red-700 px-1 border border-red-100 rounded">trending high</span> for the dinner shift.
              </h1>
              
              <div className="flex gap-3">
                  <ActionButton>Fix Labor Risk</ActionButton>
              </div>
           </div>
        </div>

        {/* 3. Related Stats */}
        <div>
           <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Stats related to tonight's labor risk
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                label="Labor Cost %" 
                value="28.4%" 
                trend="down" 
                trendValue="+2.1%" 
                icon={Users}
              />
              <StatCard 
                label="Projected OT Hours" 
                value="12 hrs" 
                trend="down" 
                trendValue="+4 hrs" 
                icon={Clock}
              />
              <StatCard 
                label="Sales Per Labor Hr" 
                value="$65.20" 
                trend="down" 
                trendValue="-$4.50" 
                icon={DollarSign}
              />
           </div>
        </div>

      </div>
      
      {/* Sticky Footer / Impact Bar */}
      <div className="sticky bottom-0 bg-black text-white py-4 px-8 flex justify-between items-center z-30">
         <div className="flex gap-8 text-sm">
            <div>
               <span className="text-gray-400 mr-2">Time Saved This Month:</span>
               <span className="font-mono">17.4 hrs</span>
            </div>
            <div>
               <span className="text-gray-400 mr-2">Profit Impact:</span>
               <span className="font-mono text-emerald-400">+$4,230</span>
            </div>
         </div>
      </div>

    </Layout>
  );
}