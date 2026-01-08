import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle2, 
  RefreshCw,
  Home, 
  Sparkles, 
  LayoutDashboard, 
  Calendar, 
  Moon, 
  Sun, 
  DollarSign, 
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Settings,
  FileText,
  Users,
  Search,
  ArrowUpRight,
  LogOut,
  Calculator,
  Gift,
  Receipt,
  Truck,
  Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

interface NavCategory {
  name: string;
  icon: any;
  items: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    name: "Accounting",
    icon: Calculator,
    items: [
      { icon: Calculator, label: "Accounting Home", href: "/accounting/home" },
      { icon: FileText, label: "PnL Release", href: "/accounting/pnl" },
      { icon: Receipt, label: "Journal Automations", href: "/accounting/journals" },
      { icon: Gift, label: "Bonus Release", href: "/accounting/bonus" },
    ]
  },
  {
    name: "Insight",
    icon: Sparkles,
    items: [
      { icon: Home, label: "Home", href: "/insight/home" },
      { icon: Sparkles, label: "Assistant", href: "/insight/assistant" },
      { icon: LayoutDashboard, label: "Dashboards", href: "/insight/dashboards" },
    ]
  },
  {
    name: "Operate",
    icon: Calendar,
    items: [
      { icon: Calendar, label: "Schedule", href: "/operate/schedule" },
      { icon: Moon, label: "End of Day", href: "/operate/end-of-day" },
      { icon: Sun, label: "Start of Day", href: "/operate/start-of-day" },
    ]
  },
  {
    name: "Motivate",
    icon: TrendingUp,
    items: [
      { icon: DollarSign, label: "Bonus", href: "/motivate/bonus" },
      { icon: TrendingUp, label: "Upsell", href: "/motivate/upsell" },
    ]
  },
  {
    name: "Payroll",
    icon: Banknote,
    items: [
      { icon: Sparkles, label: "Onboarding", href: "/payroll/onboarding" },
      { icon: Home, label: "Home", href: "/payroll/home" },
      { icon: FileText, label: "Tax Center", href: "/payroll/tax-center" },
    ]
  },
];

function NavCategoryItem({ category }: { category: NavCategory }) {
  const [location] = useLocation();
  
  const isActiveCategory = category.items.some(item => location === item.href || location.startsWith(item.href.split('/').slice(0, 3).join('/')));
  const Icon = category.icon;

  return (
    <div className="group/nav relative">
      <button
        className={cn(
          "w-full h-10 flex items-center gap-3 px-3 rounded-lg transition-all duration-200 text-left",
          isActiveCategory 
            ? "bg-gray-900 text-white" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-sm">{category.name}</span>
      </button>

      {/* Dropdown submenu */}
      <div className="absolute left-full top-0 ml-1 pt-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-150 z-50">
        <div className="w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 transform scale-95 group-hover/nav:scale-100 transition-transform duration-150 origin-top-left">
          {category.items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg transition-colors duration-100",
                  isActive 
                    ? "bg-gray-900 text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <ItemIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col py-6 sticky top-0 h-screen z-20">
        <div className="mb-8 flex items-center px-4">
          <div className="h-8 w-8 bg-black text-white flex items-center justify-center font-serif font-bold text-lg flex-shrink-0 rounded-sm">
            M
          </div>
          <span className="ml-2.5 font-serif text-lg font-bold">
            Munch
          </span>
        </div>

        <nav className="flex-1 flex flex-col px-2 space-y-0.5 overflow-y-auto overflow-x-visible">
          {navCategories.map((category) => (
            <NavCategoryItem key={category.name} category={category} />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-border sticky top-0 z-10">
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors outline-none group">
                   <div className="h-6 w-6 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-serif font-bold">K</div>
                   <span className="font-medium text-foreground text-sm">KOQ LLC</span>
                   <ChevronsUpDown className="h-3 w-3 text-muted-foreground group-hover:text-black" />
                 </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-56">
                 <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Switch Organization</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="gap-2 cursor-pointer">
                   <div className="h-5 w-5 bg-gray-900 text-white rounded flex items-center justify-center text-[10px] font-serif font-bold">K</div>
                   <span className="font-medium">KOQ LLC</span>
                   <Check className="h-3 w-3 ml-auto" />
                 </DropdownMenuItem>
                 <DropdownMenuItem className="gap-2 cursor-pointer">
                   <div className="h-5 w-5 bg-gray-200 text-gray-500 rounded flex items-center justify-center text-[10px] font-serif font-bold">M</div>
                   <span className="font-medium">Munch Demo</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

             <div className="h-4 w-px bg-border" />

             <Popover>
               <PopoverTrigger asChild>
                 <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors group">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="font-medium text-foreground text-sm group-hover:text-black">Synced: 2/2</span>
                   <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-black" />
                 </button>
               </PopoverTrigger>
               <PopoverContent className="w-64 p-2" align="start">
                 <div className="space-y-1">
                   <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Integrations</div>

                   <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">POS System</span>
                           <span className="text-[10px] text-muted-foreground">Toast API • Live</span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   </div>

                   <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">Accounting</span>
                           <span className="text-[10px] text-muted-foreground">QuickBooks • Synced 2m ago</span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   </div>
                 </div>

                 <div className="mt-2 pt-2 border-t border-border px-2">
                    <button className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 hover:bg-gray-50 rounded transition-colors">
                       <RefreshCw className="h-3 w-3" /> Sync Now
                    </button>
                 </div>
               </PopoverContent>
             </Popover>
           </div>

           <div className="flex items-center gap-6">
             <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help</button>
             <Link href="/settings">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</button>
             </Link>

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium hover:bg-secondary/70 transition-colors outline-none" title="Profile">
                    JD
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => setLocation("/login")}
                   >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
           </div>
        </header>

        {children}
      </main>
    </div>
  );
}
