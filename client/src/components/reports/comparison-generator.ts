
import { ReportData, ReportType, MOCK_REPORTS } from './mock-data';

interface PLMonthlyData {
  current: number | null;
  percent_of_income?: number;
  percent?: number;
}

interface PLJsonFile1 {
  metadata: {
    period: string;
    generated: string;
  };
  accounts: Array<{
    account: string;
    monthly_data: Record<string, PLMonthlyData>;
  }>;
}

interface PLJsonFile2 {
  period: string;
  generated: string;
  months: string[];
  sections: Record<string, Record<string, Record<string, PLMonthlyData>>>;
}

// Normalize account names for comparison
function normalizeAccountName(name: string): string {
  // Remove "400-" prefix variations if present, convert to lowercase, trim
  return name.replace(/^(\d{3}-\d{3})\s+/, '').trim().toLowerCase();
}

function getAccountCode(name: string): string {
  const match = name.match(/^(\d{3}-\d{3})/);
  return match ? match[1] : '';
}

interface ComparisonRow {
  account: string;
  sep: number;
  oct: number;
  delta: number;
  deltaPct: number;
  code: string;
}

export async function generateComparisonReport(file1: any, file2: any): Promise<ReportData> {
  // Parse file 1 (Sep 2025 structure)
  const sepData: Record<string, number> = {};
  
  // Handle File 1 Structure (Array of accounts)
  if (file1.accounts && Array.isArray(file1.accounts)) {
    file1.accounts.forEach((acc: any) => {
      const sepVal = acc.monthly_data["September 2025"]?.current || 0;
      // Store by both full name and normalized name
      sepData[acc.account] = sepVal;
      sepData[normalizeAccountName(acc.account)] = sepVal;
    });
  }

  // Parse file 2 (Oct 2025 structure)
  const octData: Record<string, number> = {};
  const allAccounts: Set<string> = new Set();
  const accountMap: Map<string, string> = new Map(); // Maps normalized name to display name

  // Handle File 2 Structure (Nested sections)
  if (file2.sections) {
    Object.values(file2.sections).forEach((section: any) => {
      Object.entries(section).forEach(([accName, monthData]: [string, any]) => {
        // Extract Oct data specifically
        const octVal = monthData["Oct 2025"]?.current || 0;
        octData[accName] = octVal;
        
        // Also add September data from File 2 if missing from File 1 (as a fallback or verification)
        if (monthData["Sep 2025"]?.current && !sepData[accName]) {
             sepData[accName] = monthData["Sep 2025"].current;
        }

        allAccounts.add(accName);
        accountMap.set(normalizeAccountName(accName), accName);
        
        // Also process nested accounts if any (like in Beverage Sales)
        Object.entries(monthData).forEach(([nestedKey, nestedVal]: [string, any]) => {
           if (typeof nestedVal === 'object' && nestedVal !== null && !['current', 'percent'].includes(nestedKey) && !nestedKey.includes('2025')) {
               // This is likely a sub-account
               // Check if it has monthly data
               const subOctVal = (nestedVal as any)["Oct 2025"]?.current;
               if (subOctVal !== undefined) {
                   octData[nestedKey] = subOctVal;
                   allAccounts.add(nestedKey);
                   accountMap.set(normalizeAccountName(nestedKey), nestedKey);
                   
                   // Check Sep data for sub-account
                    const subSepVal = (nestedVal as any)["Sep 2025"]?.current;
                    if (subSepVal !== undefined && !sepData[nestedKey]) {
                        sepData[nestedKey] = subSepVal;
                    }
               }
           }
        });
      });
    });
  }
  
  // Merge keys from File 1 that might not be in File 2
  Object.keys(sepData).forEach(key => {
      if (!allAccounts.has(key)) {
         // Try to find if it exists in a different format
         const norm = normalizeAccountName(key);
         if (!accountMap.has(norm)) {
             allAccounts.add(key);
             accountMap.set(norm, key);
         }
      }
  });

  const comparisonRows: ComparisonRow[] = [];
  let totalRevenueSep = 0;
  let totalRevenueOct = 0;
  let grossProfitSep = 0;
  let grossProfitOct = 0;
  let netIncomeSep = 0;
  let netIncomeOct = 0;

  // Build Comparison Rows
  Array.from(allAccounts).forEach(accountName => {
    // Try exact match first
    let sepVal = sepData[accountName];
    let octVal = octData[accountName];
    
    // Try normalized match if exact fails
    if (sepVal === undefined) {
        sepVal = sepData[normalizeAccountName(accountName)] || 0;
    }
    if (octVal === undefined) {
         // Reverse check: maybe File 1 has it but File 2 key is different?
         // We iterate File 2 keys primarily, but ensure we check File 1 keys against normalized File 2 keys
         // For now assume octData is populated from File 2 iteration
         octVal = 0;
    }

    if (sepVal === 0 && octVal === 0) return;

    const delta = octVal - sepVal;
    const deltaPct = sepVal !== 0 ? (delta / sepVal) * 100 : (octVal !== 0 ? 100 : 0);
    const code = getAccountCode(accountName);

    comparisonRows.push({
      account: accountName,
      sep: sepVal,
      oct: octVal,
      delta,
      deltaPct,
      code
    });

    // Identify Key Totals (Simple heuristic based on names)
    const lowerName = accountName.toLowerCase();
    if (lowerName.includes("total income") || lowerName.includes("total revenue")) {
        totalRevenueSep = sepVal;
        totalRevenueOct = octVal;
    }
    if (lowerName.includes("gross profit")) {
        grossProfitSep = sepVal;
        grossProfitOct = octVal;
    }
    if (lowerName.includes("net income")) {
        netIncomeSep = sepVal;
        netIncomeOct = octVal;
    }
  });

  // Sort by Account Code then Name
  comparisonRows.sort((a, b) => {
      if (a.code && b.code) return a.code.localeCompare(b.code);
      return a.account.localeCompare(b.account);
  });
  
  // Calculate Totals if not found explicitly
  if (totalRevenueOct === 0) {
      // Fallback: Sum 400- series
      totalRevenueOct = comparisonRows.filter(r => r.code.startsWith('4')).reduce((sum, r) => sum + r.oct, 0);
      totalRevenueSep = comparisonRows.filter(r => r.code.startsWith('4')).reduce((sum, r) => sum + r.sep, 0);
  }

  // Generate Executive Summary
  const summary: string[] = [];
  
  const revDelta = totalRevenueOct - totalRevenueSep;
  const revDeltaPct = totalRevenueSep ? (revDelta / totalRevenueSep) * 100 : 0;
  
  summary.push(`Revenue ${revDelta >= 0 ? 'increased' : 'decreased'} ${Math.abs(revDeltaPct).toFixed(1)}% MoM ($${revDelta.toLocaleString()}).`);
  
  if (netIncomeOct !== 0 || netIncomeSep !== 0) {
      const netDelta = netIncomeOct - netIncomeSep;
      summary.push(`Net Income moved ${netDelta >= 0 ? 'up' : 'down'} by $${Math.abs(netDelta).toLocaleString()}.`);
  }

  // Find biggest movers
  const movers = [...comparisonRows].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 3);
  movers.forEach(m => {
     summary.push(`${m.account} shifted by $${m.delta.toLocaleString()} (${m.deltaPct.toFixed(1)}%).`);
  });


  const metrics = [
      { 
          label: "Total Revenue", 
          value: `$${totalRevenueOct.toLocaleString()}`, 
          change: `${revDelta >= 0 ? '+' : ''}${revDeltaPct.toFixed(1)}%`, 
          trend: revDelta >= 0 ? 'up' as const : 'down' as const
      },
      { 
          label: "Gross Profit", 
          value: `$${grossProfitOct.toLocaleString()}`, 
          change: `${((grossProfitOct - grossProfitSep)/grossProfitSep * 100).toFixed(1)}%`, 
          trend: (grossProfitOct - grossProfitSep) >= 0 ? 'up' as const : 'down' as const
      },
      { 
          label: "Net Income", 
          value: `$${netIncomeOct.toLocaleString()}`, 
          change: `${((netIncomeOct - netIncomeSep)/Math.abs(netIncomeSep) * 100).toFixed(1)}%`, 
          trend: (netIncomeOct - netIncomeSep) >= 0 ? 'up' as const : 'down' as const
      }
  ];

  return {
    title: "September vs October 2025 Profitability Report",
    dateRange: "Sep 1, 2025 - Oct 31, 2025",
    entity: "Comparison Report",
    dataSources: ["Uploaded P&L (Sep)", "Uploaded P&L (Oct)"],
    summary,
    metrics,
    tableData: {
      headers: ["Account", "Sep 2025", "Oct 2025", "Delta ($)", "Delta (%)"],
      rows: comparisonRows.slice(0, 50).map(row => [ // Limit rows for mockup
        row.account,
        `$${row.sep.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
        `$${row.oct.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
        `$${row.delta.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
        `${row.deltaPct.toFixed(1)}%`
      ])
    },
    analysis: `
      Comparing September to October 2025 reveals a ${Math.abs(revDeltaPct).toFixed(1)}% ${revDelta >= 0 ? 'increase' : 'decrease'} in total revenue. 
      The largest variances were observed in ${movers.map(m => m.account).join(', ')}. 
      
      Note: This comparison normalizes account names across the two different file formats provided. 
      Some accounts may appear with slight naming variations if the source systems generated them differently.
    `.trim(),
    recommendations: [
      "Investigate the top 3 variance drivers listed above.",
      "Review COGS efficiency for categories with revenue growth but margin compression.",
      "Validate that all October accruals are fully posted to ensure comparison accuracy."
    ]
  };
}
