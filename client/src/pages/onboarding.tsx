import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  UtensilsCrossed, 
  ChevronRight, 
  ArrowRight,
  Store,
  CreditCard,
  PieChart,
  Users,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  UserPlus,
  Mail,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type Step = 
  | "restaurant-info"
  | "pos-connect"
  | "accounting-connect"
  | "customization"
  | "accounting-team-check"
  | "invite-team"
  | "completion";

type FormData = {
  restaurantName: string;
  zipCode: string;
  conceptType: string;
  posProvider: string;
  accountingProvider: string;
  role: string;
  mainFocus: string;
  secondaryFocus: string;
  thirdFocus: string;
  hasAccountingTeam: boolean | null;
  accountantEmail: string;
};

// --- Components ---

function StepIndicator({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
  return (
    <div className="flex gap-2 mb-8 justify-center">
      {[...Array(totalSteps)].map((_, i) => (
        <div 
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i < currentStep ? "w-8 bg-emerald-600" : 
            i === currentStep ? "w-8 bg-black" : "w-2 bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function SelectionCard({ 
  icon: Icon, 
  title, 
  description, 
  selected, 
  onClick 
}: { 
  icon: any, 
  title: string, 
  description?: string, 
  selected: boolean, 
  onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-start gap-4 text-left",
        selected 
          ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600 shadow-sm" 
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <div className={cn(
        "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
        selected ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className={cn("font-medium", selected ? "text-emerald-900" : "text-gray-900")}>{title}</h3>
        {description && (
          <p className={cn("text-sm mt-1", selected ? "text-emerald-700/80" : "text-gray-500")}>{description}</p>
        )}
      </div>
      <div className={cn(
        "ml-auto h-5 w-5 rounded-full border flex items-center justify-center mt-2.5",
        selected ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300"
      )}>
        {selected && <CheckCircle2 size={12} />}
      </div>
    </div>
  );
}

// --- Main Onboarding Component ---

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("restaurant-info");
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    restaurantName: "",
    zipCode: "",
    conceptType: "",
    posProvider: "",
    accountingProvider: "",
    role: "",
    mainFocus: "",
    secondaryFocus: "",
    thirdFocus: "",
    hasAccountingTeam: null,
    accountantEmail: ""
  });

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const nextStep = (next: Step) => {
    setDirection(1);
    setStep(next);
  };
  
  const completeOnboarding = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/insight/home");
    }, 1500);
  };

  // --- Step Content Renderers ---

  const renderRestaurantInfo = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-serif font-medium">Tell us about your restaurant</h1>
        <p className="text-muted-foreground">We'll use this to benchmark your performance against similar venues.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Restaurant Name</label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              value={formData.restaurantName}
              onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
              placeholder="e.g. Little Mo BK"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Zip Code</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              placeholder="e.g. 11211"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Concept Type</label>
          <div className="grid grid-cols-2 gap-3">
            {["Fast Casual", "Fine Dining", "Casual Dining", "Cafe/Bakery", "Bar/Nightclub", "QSR"].map((type) => (
              <button
                key={type}
                onClick={() => setFormData({...formData, conceptType: type})}
                className={cn(
                  "py-2.5 px-3 rounded-lg text-sm border transition-all text-left",
                  formData.conceptType === type
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => nextStep("pos-connect")}
        disabled={!formData.restaurantName || !formData.zipCode || !formData.conceptType}
        className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );

  const renderPosConnect = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-serif font-medium">Connect your Point of Sale</h1>
        <p className="text-muted-foreground">Sync your sales and labor data automatically.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SelectionCard 
          icon={CreditCard}
          title="Toast"
          description="Most popular for full service"
          selected={formData.posProvider === "Toast"}
          onClick={() => setFormData({...formData, posProvider: "Toast"})}
        />
        <SelectionCard 
          icon={LayoutDashboard}
          title="Square"
          description="Great for quick service & retail"
          selected={formData.posProvider === "Square"}
          onClick={() => setFormData({...formData, posProvider: "Square"})}
        />
        <SelectionCard 
          icon={Store}
          title="Clover"
          description="Standard solution"
          selected={formData.posProvider === "Clover"}
          onClick={() => setFormData({...formData, posProvider: "Clover"})}
        />
      </div>

      <div className="space-y-3 mt-8">
        <button 
          onClick={() => nextStep("accounting-connect")}
          className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {formData.posProvider ? `Connect ${formData.posProvider}` : "Continue"} <ArrowRight size={16} />
        </button>
        <button 
          onClick={() => {
            setFormData({...formData, posProvider: "demo"});
            nextStep("accounting-connect");
          }}
          className="w-full text-sm text-muted-foreground hover:text-black py-2"
        >
          Skip & use demo data
        </button>
      </div>
    </div>
  );

  const renderAccountingConnect = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-serif font-medium">Connect Accounting</h1>
        <p className="text-muted-foreground">Automate your P&L and expense tracking.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100">
             <PieChart size={24} />
          </div>
          <div>
             <h3 className="font-medium text-emerald-900">QuickBooks Online</h3>
             <p className="text-sm text-emerald-700/80">Recommended Integration</p>
          </div>
        </div>
        <p className="text-sm text-emerald-800/80 mb-4">
           Sync your Chart of Accounts, Vendors, and Expenses directly into Munch Insights.
        </p>
        <button 
           onClick={() => setFormData({...formData, accountingProvider: "QBO"})}
           className={cn(
             "w-full py-2 rounded-lg text-sm font-medium transition-all",
             formData.accountingProvider === "QBO" 
               ? "bg-emerald-600 text-white shadow-md" 
               : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
           )}
        >
           {formData.accountingProvider === "QBO" ? "Selected" : "Select QuickBooks"}
        </button>
      </div>

      <div className="space-y-3 mt-8">
        <button 
          onClick={() => nextStep("customization")}
          className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {formData.accountingProvider ? "Connect & Continue" : "Continue"} <ArrowRight size={16} />
        </button>
        <button 
          onClick={() => {
            setFormData({...formData, accountingProvider: "demo"});
            nextStep("customization");
          }}
          className="w-full text-sm text-muted-foreground hover:text-black py-2"
        >
          I'll connect this later
        </button>
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-serif font-medium">Tailor your experience</h1>
        <p className="text-muted-foreground">What's your primary goal right now?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">What is your role?</label>
          <div className="grid grid-cols-2 gap-3">
             {["Owner", "General Manager", "Manager", "Chef", "Other"].map(role => (
               <button
                 key={role}
                 onClick={() => setFormData({...formData, role})}
                 className={cn(
                   "py-2 px-3 rounded-lg text-sm border transition-all text-left",
                   formData.role === role
                     ? "border-black bg-black text-white"
                     : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                 )}
               >
                 {role}
               </button>
             ))}
          </div>
        </div>

        <div>
           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">Main Focus (Priority #1)</label>
           <div className="grid grid-cols-1 gap-3">
              <SelectionCard 
                icon={TrendingUp}
                title="Increase Sales"
                description="Boost revenue through upsells & table turnover"
                selected={formData.mainFocus === "Increase Sales"}
                onClick={() => setFormData({...formData, mainFocus: "Increase Sales"})}
              />
              <SelectionCard 
                icon={Users}
                title="Control Labor"
                description="Optimize scheduling and cut overtime"
                selected={formData.mainFocus === "Control Labor"}
                onClick={() => setFormData({...formData, mainFocus: "Control Labor"})}
              />
              <SelectionCard 
                icon={DollarSign}
                title="Control COGS"
                description="Reduce waste and track supplier pricing"
                selected={formData.mainFocus === "Control COGS"}
                onClick={() => setFormData({...formData, mainFocus: "Control COGS"})}
              />
           </div>
        </div>
      </div>

      <button 
        onClick={() => nextStep("accounting-team-check")}
        disabled={!formData.role || !formData.mainFocus}
        className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );

  const renderAccountingTeamCheck = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <Briefcase size={24} />
        </div>
        <h1 className="text-2xl font-serif font-medium">Accounting Team</h1>
        <p className="text-muted-foreground">Do you work with an external accounting team for monthly or quarterly P&Ls?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => {
            setFormData({...formData, hasAccountingTeam: true});
            nextStep("invite-team");
          }}
          className="border-2 border-gray-100 hover:border-black hover:bg-gray-50 rounded-xl p-6 text-left transition-all group"
        >
           <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-lg">Yes, I have an accountant</span>
              <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
           </div>
           <p className="text-muted-foreground text-sm">We handle monthly close, tax prep, and P&L reviews.</p>
        </button>

        <button 
          onClick={() => {
            setFormData({...formData, hasAccountingTeam: false});
            nextStep("completion");
          }}
          className="border-2 border-gray-100 hover:border-black hover:bg-gray-50 rounded-xl p-6 text-left transition-all group"
        >
           <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-lg">No, I handle it myself</span>
              <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" size={20} />
           </div>
           <p className="text-muted-foreground text-sm">I manage the books or use automated software.</p>
        </button>
      </div>
    </div>
  );

  const renderInviteTeam = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-serif font-medium">Invite your Accountant</h1>
        <p className="text-muted-foreground">Give them access to automate P&L creation and transaction categorization.</p>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-6">
         <h3 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <ShieldCheck size={16} /> Secure Access
         </h3>
         <p className="text-sm text-purple-800/80">
            They will only have access to financial reports and accounting settings. They cannot change operational settings.
         </p>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Accountant's Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="email" 
            value={formData.accountantEmail}
            onChange={(e) => setFormData({...formData, accountantEmail: e.target.value})}
            placeholder="accountant@firm.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          />
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <button 
          onClick={() => nextStep("completion")}
          disabled={!formData.accountantEmail}
          className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Invite <ArrowRight size={16} />
        </button>
        <button 
          onClick={() => nextStep("completion")}
          className="w-full text-sm text-muted-foreground hover:text-black py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  const renderCompletion = () => (
    <div className="text-center space-y-6 py-8">
      <div className="relative mx-auto h-24 w-24">
         <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
         <div className="relative h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={48} />
         </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-medium">You're all set!</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
           We've customized your dashboard based on your goals. Let's get to work.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-left space-y-3 max-w-sm mx-auto">
         <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm">Restaurant Profile Created</span>
         </div>
         <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm">POS Integration Configured</span>
         </div>
         <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm">Goals & Targets Set</span>
         </div>
      </div>

      <button 
        onClick={completeOnboarding}
        disabled={isLoading}
        className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-8"
      >
        {isLoading ? (
           <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Preparing Dashboard...
           </>
        ) : (
           <>Enter Dashboard <ArrowRight size={16} /></>
        )}
      </button>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "restaurant-info": return renderRestaurantInfo();
      case "pos-connect": return renderPosConnect();
      case "accounting-connect": return renderAccountingConnect();
      case "customization": return renderCustomization();
      case "accounting-team-check": return renderAccountingTeamCheck();
      case "invite-team": return renderInviteTeam();
      case "completion": return renderCompletion();
      default: return null;
    }
  };

  const getStepIndex = () => {
    const steps: Step[] = ["restaurant-info", "pos-connect", "accounting-connect", "customization", "accounting-team-check", "invite-team", "completion"];
    return steps.indexOf(step);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {step !== "completion" && (
           <div className="text-center mb-8">
              <span className="font-serif text-xl font-bold tracking-tight text-[#1a4731]">Munch Insights</span>
           </div>
        )}

        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 rounded-2xl sm:px-10 border border-gray-100 min-h-[500px] flex flex-col">
          
          {step !== "completion" && (
            <StepIndicator currentStep={getStepIndex()} totalSteps={7} />
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>

        </div>
        
        {step !== "completion" && (
          <div className="text-center mt-6">
             <button className="text-xs text-muted-foreground hover:text-black transition-colors">
                Save & Continue Later
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
