import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  ChevronDown,
  ChevronRight,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

function updateTaskStep(stepIndex: number) {
  const stored = localStorage.getItem("activeTask");
  if (!stored) return;
  
  try {
    const task = JSON.parse(stored);
    if (task.steps && task.steps[stepIndex]) {
      task.steps[stepIndex].completed = true;
      localStorage.setItem("activeTask", JSON.stringify(task));
      window.dispatchEvent(new Event("storage"));
    }
  } catch {}
}

interface Employee {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "issue";
  issue?: string;
  hireDate: string;
  payRate: string;
  payType: "Hourly" | "Salary";
  ssn?: string;
  w4?: boolean;
  directDeposit?: boolean;
}

const mockEmployees: Employee[] = [
  { 
    id: "f1", 
    name: "Emily Rodriguez", 
    role: "Server", 
    location: "NYC - Brooklyn",
    email: "emily.r@example.com",
    phone: "(555) 123-4567",
    status: "issue",
    issue: "Missing SSN",
    hireDate: "2025-12-15",
    payRate: "$18.00",
    payType: "Hourly",
    ssn: "",
    w4: true,
    directDeposit: true
  },
  { 
    id: "f2", 
    name: "James Wilson", 
    role: "Line Cook", 
    location: "NYC - Brooklyn",
    email: "james.w@example.com",
    phone: "(555) 234-5678",
    status: "issue",
    issue: "Missing W-4 form",
    hireDate: "2025-12-20",
    payRate: "$22.00",
    payType: "Hourly",
    ssn: "***-**-1234",
    w4: false,
    directDeposit: true
  },
  { 
    id: "f3", 
    name: "Ashley Thompson", 
    role: "Bartender", 
    location: "NYC - Queens",
    email: "ashley.t@example.com",
    phone: "(555) 345-6789",
    status: "issue",
    issue: "Invalid tax withholding",
    hireDate: "2026-01-02",
    payRate: "$20.00",
    payType: "Hourly",
    ssn: "***-**-5678",
    w4: true,
    directDeposit: false
  },
  { 
    id: "4", 
    name: "Sarah Chen", 
    role: "Manager", 
    location: "NYC - Manhattan",
    email: "sarah.c@example.com",
    phone: "(555) 456-7890",
    status: "active",
    hireDate: "2024-06-01",
    payRate: "$65,000",
    payType: "Salary",
    ssn: "***-**-9012",
    w4: true,
    directDeposit: true
  },
  { 
    id: "5", 
    name: "Marcus Johnson", 
    role: "Host", 
    location: "NYC - Manhattan",
    email: "marcus.j@example.com",
    phone: "(555) 567-8901",
    status: "active",
    hireDate: "2025-08-15",
    payRate: "$16.00",
    payType: "Hourly",
    ssn: "***-**-3456",
    w4: true,
    directDeposit: true
  },
  { 
    id: "6", 
    name: "Lisa Park", 
    role: "Server", 
    location: "NYC - Queens",
    email: "lisa.p@example.com",
    phone: "(555) 678-9012",
    status: "pending",
    hireDate: "2026-01-05",
    payRate: "$17.00",
    payType: "Hourly",
    ssn: "***-**-7890",
    w4: true,
    directDeposit: false
  },
];

export default function PayrollStaff() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());
  const [highlightedEmployees, setHighlightedEmployees] = useState<Set<string>>(new Set());
  const [fixedIssues, setFixedIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const employeeIds = params.get("employees");
    
    if (employeeIds) {
      const ids = employeeIds.split(",");
      setExpandedEmployees(new Set(ids));
      setHighlightedEmployees(new Set(ids));
    }
  }, [searchString]);

  const toggleEmployee = (id: string) => {
    setExpandedEmployees(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFixIssue = (employeeId: string) => {
    setFixedIssues(prev => new Set(prev).add(employeeId));
    
    const issueEmployees = mockEmployees.filter(e => e.status === "issue");
    const allFixed = issueEmployees.every(e => fixedIssues.has(e.id) || e.id === employeeId);
    
    if (allFixed) {
      updateTaskStep(1);
    }
  };

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const issueCount = mockEmployees.filter(e => e.status === "issue" && !fixedIssues.has(e.id)).length;
  const pendingCount = mockEmployees.filter(e => e.status === "pending").length;

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => setLocation("/payroll/home")}>
                Payroll
              </Button>
              <span className="mx-2">›</span>
              <span className="text-primary">Staff</span>
            </div>
            <h1 className="text-2xl font-bold">Staff Directory</h1>
            <p className="text-muted-foreground">Manage employee payroll information</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Card className="flex-1">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockEmployees.length}</div>
                <div className="text-sm text-muted-foreground">Total Employees</div>
              </div>
            </CardContent>
          </Card>
          {issueCount > 0 && (
            <Card className="flex-1 border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{issueCount}</div>
                  <div className="text-sm text-red-600">Issues to Resolve</div>
                </div>
              </CardContent>
            </Card>
          )}
          {pendingCount > 0 && (
            <Card className="flex-1 border-amber-200 bg-amber-50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
                  <div className="text-sm text-amber-600">Pending Setup</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Employees</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-employees"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredEmployees.map((employee) => {
                const isExpanded = expandedEmployees.has(employee.id);
                const isHighlighted = highlightedEmployees.has(employee.id);
                const isFixed = fixedIssues.has(employee.id);
                const hasIssue = employee.status === "issue" && !isFixed;

                return (
                  <div key={employee.id} className={cn(isHighlighted && "bg-amber-50")}>
                    <div 
                      className={cn(
                        "px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        isHighlighted && "hover:bg-amber-100"
                      )}
                      onClick={() => toggleEmployee(employee.id)}
                      data-testid={`row-employee-${employee.id}`}
                    >
                      <div className="text-muted-foreground">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {employee.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.role}</div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {employee.location}
                      </div>

                      <div>
                        {hasIssue ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {employee.issue}
                          </Badge>
                        ) : isFixed ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Fixed
                          </Badge>
                        ) : employee.status === "pending" ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={cn("px-6 pb-6 pt-2 ml-14", isHighlighted && "bg-amber-50")}>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Info</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {employee.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {employee.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Hired: {new Date(employee.hireDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pay Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                {employee.payRate} ({employee.payType})
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                SSN: {employee.ssn || <span className="text-red-600">Missing</span>}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                W-4: {employee.w4 ? <span className="text-emerald-600">Complete</span> : <span className="text-red-600">Missing</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        {hasIssue && (
                          <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium text-red-900 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4" />
                                  Action Required: {employee.issue}
                                </div>
                                <p className="text-sm text-red-700 mt-1">
                                  This must be resolved before the employee can be included in payroll runs.
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={(e) => { e.stopPropagation(); handleFixIssue(employee.id); }}
                                data-testid={`button-fix-${employee.id}`}
                              >
                                Mark as Fixed
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}