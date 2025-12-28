import React from "react";
import Layout from "@/components/layout";
import { 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  Clock,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

// Mock Data
interface StatusCell {
  status: "good" | "action" | "warning" | "overdue";
  text?: string;
  link?: string;
}

interface PortfolioItem {
  id: number;
  location: string;
  payroll: StatusCell;
  pnl: StatusCell;
  journals: StatusCell;
  bonuses: StatusCell;
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    location: "Little Mo BK",
    payroll: { status: "good" },
    pnl: { status: "action", text: "Oct Ready", link: "/finance/pnl-release" },
    journals: { status: "warning", text: "$17 var", link: "/accounting/journals" },
    bonuses: { status: "good" }
  },
  {
    id: 2,
    location: "28-43 Jackson Ave",
    payroll: { status: "overdue", text: "Due Tomorrow", link: "/accounting/home" }, // No payroll page yet, link to home or placeholder
    pnl: { status: "good" },
    journals: { status: "good" },
    bonuses: { status: "action", text: "1 Pending", link: "/accounting/bonus" }
  },
  {
    id: 4,
    location: "Baby Blues",
    payroll: { status: "action", text: "Review", link: "/accounting/home" },
    pnl: { status: "action", text: "Sep Draft", link: "/finance/pnl-release" },
    journals: { status: "warning", text: "2 failed", link: "/accounting/journals" },
    bonuses: { status: "good" }
  },
  {
    id: 3,
    location: "Munch Demo",
    payroll: { status: "good" },
    pnl: { status: "good" },
    journals: { status: "good" },
    bonuses: { status: "good" }
  },
];

function StatusCellComponent({ cell }: { cell: StatusCell }) {
  const [, setLocation] = useLocation();

  if (cell.status === "good") {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-300">
        <Check className="h-5 w-5" />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cell.link) {
      setLocation(cell.link);
    }
  };

  if (cell.status === "action") {
    return (
      <button 
        onClick={handleClick}
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors w-fit mx-auto"
      >
        {cell.text}
      </button>
    );
  }

  if (cell.status === "warning") {
    return (
      <button 
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors w-fit mx-auto"
      >
        <AlertTriangle className="h-3 w-3" />
        {cell.text}
      </button>
    );
  }

  if (cell.status === "overdue") {
    return (
      <button 
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors w-fit mx-auto"
      >
        <Clock className="h-3 w-3" />
        {cell.text}
      </button>
    );
  }

  return null;
}

export default function AccountingHome() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/30 font-sans">
        <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">
          
          {/* Zone 1: Headline + Action */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Good morning, Sarah</h2>
              <h1 className="text-3xl font-serif font-medium text-gray-900 leading-tight">
                3 P&Ls are ready to release, but <span className="text-amber-600 border-b-2 border-amber-100 pb-0.5">Little Mo BK's October journals</span> have a $17 variance.
              </h1>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <button 
                onClick={() => setLocation("/accounting/journals")}
                className="group flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Review Variance</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Zone 2: Portfolio Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-gray-400" />
                Portfolio Overview
              </h3>
              <div className="flex gap-2">
                <button className="text-sm text-gray-500 hover:text-black transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100">
                  Sort by Priority
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-medium">
                    <th className="px-6 py-4 text-left w-[25%]">Location</th>
                    <th className="px-6 py-4 text-center w-[18%]">Payroll</th>
                    <th className="px-6 py-4 text-center w-[18%]">P&L</th>
                    <th className="px-6 py-4 text-center w-[18%]">Journals</th>
                    <th className="px-6 py-4 text-center w-[18%]">Bonuses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {portfolioData.map((item) => (
                    <tr 
                      key={item.id} 
                      className="group hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setLocation("/finance/pnl-release")} // Default to P&L or generic location view
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 group-hover:text-emerald-800 transition-colors">
                        <div className="flex items-center justify-between">
                          {item.location}
                          <ChevronRight className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusCellComponent cell={item.payroll} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusCellComponent cell={item.pnl} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusCellComponent cell={item.journals} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusCellComponent cell={item.bonuses} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Empty rows to fill space if needed or maintain height */}
                  {portfolioData.length < 5 && (
                     <tr className="bg-gray-50/10">
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs italic">
                           End of portfolio
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
