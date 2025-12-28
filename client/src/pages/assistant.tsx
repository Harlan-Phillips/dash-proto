import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout";
import { useLocation } from "wouter";
import { 
  Send, 
  User, 
  Sparkles, 
  Bot, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Award,
  ChevronRight,
  Sun,
  X
} from "lucide-react";
import { Wand } from "@/components/ui/wand";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for our mock chat
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCall?: {
    state: "running" | "completed" | "pending_confirmation" | "denied";
    toolName: string;
    args?: any;
    result?: any;
    denialReason?: string;
  };
  artifact?: boolean;
};

// --- Mock Artifact Component ---
function PerformerArtifact() {
  return (
    <div className="mt-4 bg-white border border-border rounded-lg shadow-sm overflow-hidden max-w-md">
      <div className="bg-emerald-50/50 p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-serif text-lg font-bold">
             MR
           </div>
           <div>
             <h3 className="font-serif font-medium">Michael Richards</h3>
             <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Server • Dinner Shift</p>
           </div>
        </div>
        <div className="bg-white px-2 py-1 rounded text-xs font-bold border border-emerald-100 text-emerald-700 flex items-center gap-1">
           <Award className="h-3 w-3" /> Top 1%
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4">
         <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</div>
            <div className="text-xl font-serif font-medium flex items-center gap-1">
               <DollarSign className="h-4 w-4 text-muted-foreground" /> 4,280
            </div>
            <div className="text-xs text-emerald-600 font-medium">+12% vs avg</div>
         </div>
         <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Upsell Conv.</div>
            <div className="text-xl font-serif font-medium flex items-center gap-1">
               <TrendingUp className="h-4 w-4 text-muted-foreground" /> 32%
            </div>
            <div className="text-xs text-emerald-600 font-medium">+8% vs avg</div>
         </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-border">
         <button className="w-full bg-black text-white text-xs py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            View Full Performance Report <ArrowRight className="h-3 w-3" />
         </button>
      </div>
    </div>
  );
}

function LaborAnalysisArtifact() {
  return (
    <div className="mt-4 bg-white border border-border rounded-lg shadow-sm overflow-hidden max-w-md">
      <div className="bg-red-50/50 p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-serif text-lg font-bold">
             LB
           </div>
           <div>
             <h3 className="font-serif font-medium">Labor Variance</h3>
             <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Night • Dinner</p>
           </div>
        </div>
        <div className="bg-white px-2 py-1 rounded text-xs font-bold border border-red-100 text-red-700 flex items-center gap-1">
           <TrendingUp className="h-3 w-3" /> +8% Over
        </div>
      </div>
      
      <div className="p-4 space-y-4">
         <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scheduled Hours</span>
                <span className="font-medium">42.0 hrs</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actual Hours</span>
                <span className="font-medium text-red-600">45.5 hrs</span>
            </div>
         </div>
         <div className="p-3 bg-gray-50 rounded border border-border text-sm">
            <span className="font-medium">Insight:</span> 3 servers stayed 45m past cut time due to late table campers.
         </div>
      </div>
    </div>
  );
}

export default function Assistant() {
  const [location] = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize from query param
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialQuery = searchParams.get("q");

    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery);
    }
  }, [location]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // --- Mock Simulation Flow ---
    await new Promise(r => setTimeout(r, 1200));

    let toolMsg: Message;
    
    // Simple routing logic for mock
    if (text.toLowerCase().includes("labor") || text.toLowerCase().includes("break it down")) {
        toolMsg = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I'll analyze last night's labor variance.",
            toolCall: {
                state: "pending_confirmation",
                toolName: "analyze_labor_variance",
                args: { shift: "yesterday_dinner", metric: "hours_variance" }
            }
        };
    } else {
        toolMsg = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I'll check the performance data for this week.",
            toolCall: {
                state: "pending_confirmation",
                toolName: "analyze_staff_performance",
                args: { timeRange: "this_week", metric: "sales_volume", staff_member: "Michael Richards" }
            }
        };
    }

    setMessages(prev => [...prev, toolMsg]);
    setIsTyping(false);
  };

  const handleConfirmTool = async (msgId: string, toolName: string) => {
    // Update to running
    setMessages(prev => prev.map(m => 
      m.id === msgId 
        ? { ...m, toolCall: { ...m.toolCall!, state: "running" } }
        : m
    ));
    setIsTyping(true);

    // Tool "running" pause
    await new Promise(r => setTimeout(r, 2000));

    // Update tool to completed
    setMessages(prev => prev.map(m => 
      m.id === msgId 
        ? { ...m, toolCall: { ...m.toolCall!, state: "completed", result: "Analysis complete." } }
        : m
    ));

    // Final Answer
    await new Promise(r => setTimeout(r, 800));
    
    let finalMsg: Message;
    if (toolName === "analyze_labor_variance") {
        finalMsg = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "Last night's dinner shift ran **8% over budget**. The primary driver was 3 servers clocking out 45 mins late.",
            artifact: true // We'll hijack this flag to show labor artifact
        };
    } else {
        finalMsg = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "Based on sales volume and upsell conversion rates, **Michael Richards** is your top performer this week. He consistently exceeds the check average target during dinner shifts.",
            artifact: true
        };
    }
    
    setMessages(prev => [...prev, finalMsg]);
    setIsTyping(false);
  };

  const handleDenyTool = (msgId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === msgId 
        ? { ...m, toolCall: { ...m.toolCall!, state: "denied", denialReason: "User cancelled action" } }
        : m
    ));
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white shadow-sm border-x border-border">
           
           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" ref={scrollRef}>
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col justify-center items-center max-w-lg mx-auto w-full">
                    
                    {/* Proactive Insight Card */}
                    <div className="w-full bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-12">
                        <div className="p-8 pb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Sun className="h-6 w-6 text-amber-500 fill-amber-500" />
                                <h2 className="font-serif text-2xl font-medium">Good morning, Little Mo BK.</h2>
                            </div>
                            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                                I noticed labor ran <span className="font-medium text-red-600 bg-red-50 px-1 rounded">8% over</span> last night. Want me to break it down?
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleSend("Yes, show me the labor breakdown")}
                                    className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                >
                                    Yes, show me
                                </button>
                                <button className="text-muted-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-foreground transition-colors">
                                    Not now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Actions */}
                    <div className="w-full space-y-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-medium px-1">
                            <span>Or ask me something</span>
                            <div className="h-px bg-border flex-1" />
                        </div>
                        
                        <div className="grid gap-3">
                            <button onClick={() => handleSend("Who's my top performer this week?")} className="text-left px-5 py-4 bg-gray-50 hover:bg-white hover:shadow-md border border-border rounded-xl transition-all group flex justify-between items-center">
                                <span className="font-medium text-gray-700 group-hover:text-black">"Who's my top performer this week?"</span>
                                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black transition-colors" />
                            </button>
                            <button onClick={() => handleSend("Am I overstaffed tonight?")} className="text-left px-5 py-4 bg-gray-50 hover:bg-white hover:shadow-md border border-border rounded-xl transition-all group flex justify-between items-center">
                                <span className="font-medium text-gray-700 group-hover:text-black">"Am I overstaffed tonight?"</span>
                                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black transition-colors" />
                            </button>
                            <button onClick={() => handleSend("Compare this week vs last")} className="text-left px-5 py-4 bg-gray-50 hover:bg-white hover:shadow-md border border-border rounded-xl transition-all group flex justify-between items-center">
                                <span className="font-medium text-gray-700 group-hover:text-black">"Compare this week vs last"</span>
                                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black transition-colors" />
                            </button>
                        </div>
                    </div>

                 </div>
              ) : (
                 messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={cn("flex gap-4", msg.role === "assistant" ? "bg-transparent" : "flex-row-reverse")}
                    >
                       <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                          msg.role === "assistant" ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                       )}>
                          {msg.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
                       </div>
                       
                       <div className={cn("max-w-[80%]", msg.role === "user" && "text-right")}>
                          
                          {/* Message Bubble */}
                          <div className={cn(
                             "py-2 px-4 rounded-2xl inline-block text-sm leading-relaxed",
                             msg.role === "user" 
                               ? "bg-gray-100 text-foreground rounded-tr-none" 
                               : "text-foreground bg-transparent px-0"
                          )}>
                             {msg.content}
                          </div>

                          {/* Tool Call UI */}
                          {msg.toolCall && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: "auto" }}
                               className="mt-2 mb-2"
                             >
                                {msg.toolCall.state === "pending_confirmation" ? (
                                    <div className="border border-border rounded-lg p-4 bg-white shadow-sm max-w-sm text-left">
                                      <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <Wand />
                                            <span className="font-medium text-sm">Confirm Action</span>
                                          </div>
                                          <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Pending</span>
                                      </div>
                                      
                                      <div className="space-y-3 mb-4">
                                         <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tool</div>
                                         <div className="font-mono text-xs bg-gray-50 p-1.5 rounded border border-border">{msg.toolCall.toolName}</div>

                                         <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Parameters</div>
                                         <div className="space-y-2">
                                            {Object.entries(msg.toolCall.args || {}).map(([key, value]) => (
                                               <div key={key} className="flex flex-col gap-1">
                                                  <span className="text-xs text-muted-foreground">{key}</span>
                                                  {key === "staff_member" ? (
                                                      <select className="text-sm border border-border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-black/5 outline-none w-full">
                                                          <option>{value as string}</option>
                                                          <option>Sarah Jenkins</option>
                                                          <option>David Chen</option>
                                                          <option>Entire Team</option>
                                                      </select>
                                                  ) : (
                                                      <div className="text-sm font-medium">{value as string}</div>
                                                  )}
                                               </div>
                                            ))}
                                         </div>
                                      </div>

                                      <div className="flex gap-2 pt-2 border-t border-border">
                                          <button 
                                            onClick={() => handleDenyTool(msg.id)}
                                            className="flex-1 py-2 text-xs font-medium border border-border rounded hover:bg-gray-50 transition-colors"
                                          >
                                            Deny
                                          </button>
                                          <button 
                                            onClick={() => handleConfirmTool(msg.id, msg.toolCall!.toolName)}
                                            className="flex-1 py-2 text-xs font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors shadow-sm"
                                          >
                                            Allow
                                          </button>
                                      </div>
                                    </div>
                                ) : msg.toolCall.state === "denied" ? (
                                    <div className="inline-flex items-center gap-2 text-xs font-mono bg-gray-50 border border-border px-3 py-2 rounded-md opacity-70">
                                       <div className="h-2 w-2 rounded-full bg-red-400" />
                                       <span className="text-muted-foreground decoration-line-through">Action cancelled</span>
                                    </div>
                                ) : (
                                   <div className="inline-flex items-center gap-2 text-xs font-mono bg-white border border-border px-3 py-2 rounded-md shadow-sm">
                                      {msg.toolCall.state === "running" ? (
                                         <>
                                            <Wand /> 
                                            <span className="text-muted-foreground">Running tool:</span> 
                                            <span className="font-medium text-black">{msg.toolCall.toolName}</span>
                                         </>
                                      ) : (
                                         <>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            <span className="text-muted-foreground">Completed:</span>
                                            <span className="font-medium text-black">{msg.toolCall.toolName}</span>
                                         </>
                                      )}
                                   </div>
                                )}
                             </motion.div>
                          )}

                          {/* Artifact UI */}
                          {msg.artifact && (
                             <motion.div
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.2 }}
                             >
                               {msg.toolCall?.toolName === "analyze_labor_variance" ? <LaborAnalysisArtifact /> : <PerformerArtifact />}
                             </motion.div>
                          )}
                       </div>
                    </motion.div>
                 ))
              )}

              {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                       <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                       <Wand />
                       <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
                    </div>
                 </motion.div>
              )}
           </div>

           {/* Input Area */}
           <div className="p-6 bg-white border-t border-border">
              <div className="relative max-w-3xl mx-auto">
                 <form 
                   onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                   className="relative flex items-center"
                 >
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a follow-up question..."
                      className="w-full py-4 pl-4 pr-12 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-sans"
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       <Send className="h-4 w-4" />
                    </button>
                 </form>
              </div>
           </div>

        </div>
      </div>
    </Layout>
  );
}