import React, { useState } from "react";
import Layout from "@/components/layout";
import { cn } from "@/lib/utils";

export default function Teams() {
  const [activeTab, setActiveTab] = useState<"departments" | "staff">("departments");

  return (
    <Layout>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 p-8 max-w-7xl mx-auto space-y-12 w-full">
          
          {/* Top Navigation Context */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-6">
              <span className="font-serif text-2xl font-medium" data-testid="text-chain-name">KOQ LLC</span>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full" data-testid="text-date">Jan 8, 2026</span>
            </div>
            
            <nav className="flex gap-1" data-testid="teams-tabs">
              <button
                onClick={() => setActiveTab("departments")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === "departments"
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                )}
                data-testid="tab-departments"
              >
                Departments
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === "staff"
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                )}
                data-testid="tab-staff"
              >
                Staff
              </button>
            </nav>
          </div>

        </div>
      </div>
    </Layout>
  );
}
