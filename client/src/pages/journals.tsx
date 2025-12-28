import React, { useState } from "react";
import Layout from "@/components/layout";
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  RefreshCw, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type JournalType = "sales" | "delivery" | "payroll";

interface JournalEntry {
  id: string;
  date: string;
  isBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  exportedAt: string | null;
  status: "exported" | "pending" | "error";
}

const mockSalesData: JournalEntry[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `sale-${i}`,
  date: new Date(2025, 11, 28 - i).toISOString().split('T')[0],
  isBalanced: true,
  totalDebit: 2000 + Math.random() * 3000,
  totalCredit: 2000 + Math.random() * 3000,
  exportedAt: i < 5 ? null : new Date(2025, 11, 29 - i).toLocaleDateString(),
  status: i < 5 ? "pending" : "exported"
}));

const mockDeliveryData: JournalEntry[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `del-${i}`,
  date: new Date(2025, 11, 28 - i).toISOString().split('T')[0],
  isBalanced: true,
  totalDebit: 500 + Math.random() * 1000,
  totalCredit: 500 + Math.random() * 1000,
  exportedAt: i < 3 ? null : new Date(2025, 11, 29 - i).toLocaleDateString(),
  status: i < 3 ? "pending" : "exported"
}));

const mockPayrollData: JournalEntry[] = Array.from({ length: 4 }).map((_, i) => ({
  id: `pay-${i}`,
  date: new Date(2025, 11, 28 - (i * 7)).toISOString().split('T')[0],
  isBalanced: true,
  totalDebit: 12000 + Math.random() * 4000,
  totalCredit: 12000 + Math.random() * 4000,
  exportedAt: i === 0 ? null : new Date(2025, 11, 29 - (i * 7)).toLocaleDateString(),
  status: i === 0 ? "pending" : "exported"
}));

export default function Journals() {
  const [activeTab, setActiveTab] = useState<JournalType>("sales");
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());

  const getData = () => {
    switch (activeTab) {
      case "sales": return mockSalesData;
      case "delivery": return mockDeliveryData;
      case "payroll": return mockPayrollData;
    }
  };

  const data = getData();

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedEntries);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedEntries(newSet);
  };

  const toggleAll = () => {
    if (selectedEntries.size === data.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(data.map(d => d.id)));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-gray-50/30">
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Journal Automations</h1>
              <p className="text-sm text-muted-foreground">View any automated POS {activeTab} journals and export them to your accounting software.</p>
            </div>
          </div>

          {/* Journal Type Switcher */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
            <button
              onClick={() => setActiveTab("sales")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "sales" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-gray-900"
              )}
            >
              Sales Journals
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "delivery" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-gray-900"
              )}
            >
              Delivery Journals
            </button>
            <button
              onClick={() => setActiveTab("payroll")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "payroll" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-gray-900"
              )}
            >
              Payroll Journals
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-gray-700">
              <span>28-43 Jackson Ave</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-gray-700">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Nov 28 - Dec 28, 2025</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>

            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-gray-700">
              <Download className="h-4 w-4 text-gray-500" />
              <span>Exported</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>

            <div className="ml-auto flex gap-3">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-black"
                 />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                 <span>Push to QuickBooks Online</span>
                 <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-black text-white rounded-lg shadow-sm border border-gray-800 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-900 text-gray-400 font-medium border-b border-gray-800">
                   <tr>
                      <th className="px-6 py-4 w-12">
                         <input 
                           type="checkbox" 
                           checked={selectedEntries.size === data.length && data.length > 0}
                           onChange={toggleAll}
                           className="rounded bg-gray-800 border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                         />
                      </th>
                      <th className="px-6 py-4">Date ↓</th>
                      <th className="px-6 py-4">Is Balanced?</th>
                      <th className="px-6 py-4 text-right">Total Debit</th>
                      <th className="px-6 py-4 text-right">Total Credit</th>
                      <th className="px-6 py-4">Exported At</th>
                      <th className="px-6 py-4"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                   {data.map((entry) => (
                     <tr key={entry.id} className="hover:bg-gray-900/50 transition-colors group">
                        <td className="px-6 py-4">
                           <input 
                             type="checkbox" 
                             checked={selectedEntries.has(entry.id)}
                             onChange={() => toggleSelection(entry.id)}
                             className="rounded bg-gray-800 border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                           />
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-300">{entry.date}</td>
                        <td className="px-6 py-4">
                           {entry.isBalanced ? (
                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/30 text-emerald-400 text-xs font-medium border border-emerald-900/50">
                               <CheckCircle2 className="h-3 w-3" /> Yes
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/30 text-red-400 text-xs font-medium border border-red-900/50">
                               <AlertCircle className="h-3 w-3" /> No
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-gray-300">{entry.totalDebit.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-300">{entry.totalCredit.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-400">
                           {entry.exportedAt ? (
                             entry.exportedAt
                           ) : (
                             <span className="text-gray-600 italic">Not exported</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-800 rounded-md transition-all text-gray-400 hover:text-white">
                              <ArrowUpRight className="h-4 w-4" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
          
          <div className="mt-4 flex justify-between text-xs text-gray-500 px-2">
             <span>Showing {data.length} entries</span>
             <div className="flex gap-2">
                <button className="hover:text-gray-900 disabled:opacity-50">Previous</button>
                <span>Page 1 of 1</span>
                <button className="hover:text-gray-900 disabled:opacity-50">Next</button>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}