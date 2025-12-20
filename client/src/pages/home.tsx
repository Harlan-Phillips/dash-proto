import React from "react";
import Layout from "@/components/layout";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

function KPICard({ title, value, change, subtext, icon: Icon, trend = "positive" }: { title: string, value: string, change?: string, subtext?: string, icon: any, trend?: "positive" | "negative" | "neutral" }) {
  return (
    <div className="bg-white p-6 border border-border shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
         <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
         <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <div className="text-3xl font-serif font-medium">{value}</div>
        {(change || subtext) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
             {change && (
                <span className={trend === "positive" ? "text-emerald-600" : trend === "negative" ? "text-red-600" : "text-gray-600"}>
                  {change}
                </span>
             )}
             {subtext && <span className="text-muted-foreground">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Welcome */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="font-serif text-3xl font-medium mb-1">Good morning, John</h1>
              <p className="text-muted-foreground">Here's what's happening at your restaurant today.</p>
           </div>
           <div className="flex gap-2">
             <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
               View Schedule
             </button>
           </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
             title="Daily Sales" 
             value="$12,450" 
             change="+8.2%" 
             subtext="vs last week"
             icon={DollarSign}
             trend="positive"
          />
          <KPICard 
             title="Labor Cost" 
             value="22.4%" 
             change="-1.5%" 
             subtext="of sales"
             icon={Users}
             trend="positive"
          />
          <KPICard 
             title="Avg Check" 
             value="$84.20" 
             change="+2.1%" 
             subtext="per guest"
             icon={TrendingUp}
             trend="positive"
          />
          <KPICard 
             title="Active Alerts" 
             value="2" 
             subtext="Requires attention"
             icon={AlertCircle}
             trend="negative"
          />
        </div>

        {/* Recent Activity / Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Chart Placeholder */}
           <div className="lg:col-span-2 bg-white border border-border shadow-sm p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg">Sales Performance</h3>
                <div className="flex gap-2">
                   <button className="text-xs font-medium text-black bg-gray-100 px-2 py-1">Daily</button>
                   <button className="text-xs font-medium text-gray-500 hover:text-black px-2 py-1">Weekly</button>
                   <button className="text-xs font-medium text-gray-500 hover:text-black px-2 py-1">Monthly</button>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                 {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-secondary hover:bg-emerald-100 transition-colors relative group" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ${h * 240}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground px-2">
                 <span>Mon</span>
                 <span>Tue</span>
                 <span>Wed</span>
                 <span>Thu</span>
                 <span>Fri</span>
                 <span>Sat</span>
                 <span>Sun</span>
              </div>
           </div>

           {/* Quick Actions / Notifications */}
           <div className="bg-white border border-border shadow-sm p-0 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-gray-50/50">
                 <h3 className="font-serif text-lg">Action Items</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 {[
                   { title: "Review Last Night's Close", time: "2 hours ago", type: "task" },
                   { title: "Approve Schedule Changes", time: "4 hours ago", type: "task" },
                   { title: "Inventory Low: House Wine", time: "Yesterday", type: "alert" },
                   { title: "New Staff Onboarding", time: "Yesterday", type: "task" },
                 ].map((item, i) => (
                    <div key={i} className="p-4 border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-colors flex items-start gap-3 group">
                       <div className={cn("h-2 w-2 rounded-full mt-2 flex-shrink-0", item.type === "alert" ? "bg-red-500" : "bg-blue-500")} />
                       <div className="flex-1">
                          <div className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                       </div>
                       <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                 ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-border">
                 <button className="w-full py-2 text-sm text-center text-muted-foreground hover:text-black transition-colors">
                    View All Actions
                 </button>
              </div>
           </div>

        </div>

      </div>
    </Layout>
  );
}
