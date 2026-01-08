import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Shield, 
  Users, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  MapPin,
  Link2,
  Phone,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SetupPath = "fresh" | "connect" | null;
type OnboardingStep = "path" | "location" | "setup" | "connect";
type LocationStatus = "pending" | "needs_connection" | "completed";

const freshSteps = [
  { number: 1, label: "Select Location" },
  { number: 2, label: "Set Up Entity" },
];

const importSteps = [
  { number: 1, label: "Select Location" },
  { number: 2, label: "Set Up Entity" },
  { number: 3, label: "Connect Provider" },
];

const getStepNumber = (step: OnboardingStep): number => {
  switch (step) {
    case "location": return 1;
    case "setup": return 2;
    case "connect": return 3;
    default: return 0;
  }
};

interface Location {
  id: string;
  name: string;
  address: string;
  status: LocationStatus;
  entityId?: string;
  entityName?: string;
  provider?: string;
}

const mockLocations: Location[] = [
  { id: "loc1", name: "KOQ Mission", address: "123 Mission St, San Francisco, CA", status: "pending" },
  { id: "loc2", name: "KOQ Financial District", address: "456 Market St, San Francisco, CA", status: "pending" },
];

export default function PayrollOnboarding() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("path");
  const [setupPath, setSetupPath] = useState<SetupPath>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [cameFromPath, setCameFromPath] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const stepParam = params.get("step");
    if (stepParam === "setup") {
      setSetupPath("fresh");
      setSelectedLocation(mockLocations[0]);
      setCurrentStep("setup");
    }
  }, [searchString]);

  const completedLocations = locations.filter(l => l.status === "completed");
  const needsConnectionLocations = locations.filter(l => l.status === "needs_connection");
  const pendingLocations = locations.filter(l => l.status === "pending");

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleLocationContinue = () => {
    if (selectedLocation) {
      setCurrentStep("setup");
    }
  };

  const handleNeedsConnectionSelect = (location: Location) => {
    setSelectedLocation(location);
    setSetupPath("connect");
    setCameFromPath(true);
    setCurrentStep("connect");
  };

  const handleMultiLocationSupport = () => {
    setShowSupportModal(true);
  };

  const handleSetupComplete = () => {
    if (selectedLocation) {
      const updatedEntityName = `${selectedLocation.name} LLC`;
      const updatedEntityId = `ent-${selectedLocation.id}`;
      
      if (setupPath === "connect") {
        const updatedLocation = { 
          ...selectedLocation, 
          status: "needs_connection" as const, 
          entityName: updatedEntityName, 
          entityId: updatedEntityId 
        };
        setLocations(prev => prev.map(l => 
          l.id === selectedLocation.id ? updatedLocation : l
        ));
        setSelectedLocation(updatedLocation);
        setCurrentStep("connect");
      } else {
        setLocations(prev => prev.map(l => 
          l.id === selectedLocation.id 
            ? { ...l, status: "completed" as const, entityName: updatedEntityName, entityId: updatedEntityId } 
            : l
        ));
        toast({
          title: "Setup complete",
          description: `${selectedLocation.name} has been set up successfully.`,
        });
        resetToLocationSelection();
      }
    }
  };

  const handleConnectComplete = () => {
    if (selectedLocation) {
      setLocations(prev => prev.map(l => 
        l.id === selectedLocation.id 
          ? { ...l, status: "completed" as const, provider: "Connected" } 
          : l
      ));
      toast({
        title: "Provider connected",
        description: `${selectedLocation.name} has been connected to your payroll provider.`,
      });
      resetToLocationSelection();
    }
  };

  const resetToLocationSelection = () => {
    setCurrentStep("path");
    setSelectedLocation(null);
    setSetupPath(null);
    setCameFromPath(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        {currentStep === "path" && (
          <>
            <section className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4" data-testid="text-hero-title">
                Payroll centered around incentivizing operators
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Streamline your payroll process with tools designed for restaurant operations.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-12">
                <Card className="text-left">
                  <CardContent className="pt-6">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Guided Onboarding</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step setup tailored to your business needs.</p>
                  </CardContent>
                </Card>

                <Card className="text-left">
                  <CardContent className="pt-6">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Compliance Ready</h3>
                    <p className="text-sm text-muted-foreground">Stay compliant with automated tax calculations and filings.</p>
                  </CardContent>
                </Card>

                <Card className="text-left">
                  <CardContent className="pt-6">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Human Support</h3>
                    <p className="text-sm text-muted-foreground">Dedicated support team to help you every step of the way.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {pendingLocations.length > 0 ? (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-center">How would you like to set up payroll?</h2>
                <p className="text-center text-muted-foreground mb-6">Each location will be mapped to its own legal entity (1:1)</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <Card
                    className="transition-all hover:border-gray-400 flex flex-col"
                    data-testid="card-path-fresh"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 h-6 mb-2">
                        <Badge className="bg-blue-100 text-blue-700">Recommended</Badge>
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Start Fresh
                      </CardTitle>
                      <CardDescription>Set up new payroll from scratch with our guided experience</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Create new legal entities</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Configure pay schedules</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Add employees step by step</li>
                      </ul>
                      <div className="mt-auto">
                        <Button 
                          className="w-full" 
                          onClick={() => { setSetupPath("fresh"); setCurrentStep("location"); }}
                          data-testid="button-continue-fresh"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="transition-all hover:border-gray-400 flex flex-col"
                    data-testid="card-path-connect"
                  >
                    <CardHeader>
                      <div className="h-6 mb-2"></div>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Import from Previous Provider
                      </CardTitle>
                      <CardDescription>Complete setup then connect your existing provider</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Complete legal entity setup</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Connect your previous provider</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Import existing employee data</li>
                      </ul>
                      <div className="mt-auto">
                        <Button 
                          className="w-full" 
                          onClick={() => { setSetupPath("connect"); setCurrentStep("location"); }}
                          data-testid="button-continue-connect"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Need multiple locations on one legal entity?</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          If you need to map multiple locations to a single legal entity, please contact our support team for assisted setup.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100"
                          onClick={handleMultiLocationSupport}
                          data-testid="button-contact-support"
                        >
                          <Phone className="h-4 w-4 mr-2" /> Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            ) : (
              <section className="mb-8">
                <Card className="p-8 text-center border-emerald-200 bg-emerald-50">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-emerald-900">All locations set up!</h3>
                  <p className="text-muted-foreground mb-6">All your locations have been configured for payroll.</p>
                  <Button onClick={() => setLocation("/payroll/home")} data-testid="button-go-home">
                    Go to Payroll Home
                  </Button>
                </Card>
              </section>
            )}
          </>
        )}

        {currentStep !== "path" && (
          <div className="flex items-center mb-8">
            {(setupPath === "connect" ? importSteps : freshSteps).map((step, index, arr) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    getStepNumber(currentStep) > step.number 
                      ? "bg-emerald-500 text-white" 
                      : getStepNumber(currentStep) === step.number 
                        ? "bg-black text-white" 
                        : "bg-gray-200 text-gray-500"
                  )}>
                    {getStepNumber(currentStep) > step.number ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm font-medium",
                    getStepNumber(currentStep) >= step.number ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    getStepNumber(currentStep) > step.number ? "bg-emerald-500" : "bg-gray-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {currentStep === "location" && (
          <section>
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setCurrentStep("path")} className="mb-4">
                ← Back
              </Button>
              <h1 className="text-3xl font-bold mb-2">Select a Location</h1>
              <p className="text-muted-foreground">
                Choose a location to set up payroll for.
              </p>
            </div>

            {pendingLocations.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  Locations Pending Setup ({pendingLocations.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {pendingLocations.map((location) => (
                    <Card
                      key={location.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-gray-400",
                        selectedLocation?.id === location.id && "border-black ring-1 ring-black"
                      )}
                      onClick={() => handleLocationSelect(location)}
                      data-testid={`card-location-${location.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                              selectedLocation?.id === location.id ? "border-black" : "border-gray-300"
                            )}>
                              {selectedLocation?.id === location.id && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                            </div>
                            <div>
                              <div className="font-medium">{location.name}</div>
                              <div className="text-sm text-muted-foreground">{location.address}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                            Pending
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Button 
                    size="lg" 
                    disabled={!selectedLocation} 
                    onClick={handleLocationContinue}
                    data-testid="button-location-continue"
                  >
                    Start Setup <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All locations set up!</h3>
                <p className="text-muted-foreground mb-4">All your locations have been configured for payroll.</p>
                <Button onClick={() => setLocation("/payroll/home")} data-testid="button-go-home">
                  Go to Payroll Home
                </Button>
              </Card>
            )}
          </section>
        )}

        {currentStep === "setup" && selectedLocation && (
          <section>
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setCurrentStep("location")} className="mb-4">
                ← Back
              </Button>
              <h1 className="text-3xl font-bold mb-2">Set Up {selectedLocation.name}</h1>
              <p className="text-muted-foreground">
                Complete the setup to create a legal entity for this location.
              </p>
            </div>

            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">CheckHQ Component Here</h3>
                <p className="text-gray-500 mb-6">
                  This is where the CheckHQ onboarding component will be integrated.
                </p>
                <Button onClick={handleSetupComplete} data-testid="button-complete-setup">
                  {setupPath === "connect" ? "Continue to Connect Provider" : "Complete Setup"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {currentStep === "connect" && selectedLocation && (
          <section>
            <div className="mb-8">
              <Button variant="ghost" onClick={() => {
                if (cameFromPath) {
                  setCurrentStep("path");
                  setSelectedLocation(null);
                  setCameFromPath(false);
                } else {
                  setCurrentStep("setup");
                }
              }} className="mb-4">
                ← Back
              </Button>
              <h1 className="text-3xl font-bold mb-2">Connect Provider for {selectedLocation.name}</h1>
              <p className="text-muted-foreground">
                Connect your existing payroll provider to sync data.
              </p>
              {selectedLocation.entityName && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                    <Building2 className="h-3 w-3 mr-1" />
                    {selectedLocation.entityName}
                  </Badge>
                </div>
              )}
            </div>

            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-12 text-center">
                <Link2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Connect With Payroll Provider Component Here</h3>
                <p className="text-gray-500 mb-6">
                  This is where the payroll provider connection component will be integrated.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => {
                    if (selectedLocation) {
                      setLocations(prev => prev.map(l => 
                        l.id === selectedLocation.id 
                          ? { ...l, status: "needs_connection" as const } 
                          : l
                      ));
                      toast({
                        title: "Setup saved",
                        description: `You can connect ${selectedLocation.name} to a provider later.`,
                      });
                      resetToLocationSelection();
                    }
                  }} data-testid="button-skip-connect">
                    Skip for Now
                  </Button>
                  <Button onClick={handleConnectComplete} data-testid="button-complete-connect">
                    Complete Connection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {currentStep === "path" && (needsConnectionLocations.length > 0 || completedLocations.length > 0) && (
          <section className="mt-12 pt-8 border-t">
            {needsConnectionLocations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Needs Connection ({needsConnectionLocations.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {needsConnectionLocations.map((location) => (
                    <Card 
                      key={location.id} 
                      className="border-amber-200 bg-amber-50/50 cursor-pointer hover:border-amber-300 transition-all" 
                      onClick={() => handleNeedsConnectionSelect(location)}
                      data-testid={`card-needs-connection-${location.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-medium text-amber-900">{location.name}</div>
                              <div className="text-sm text-amber-700">{location.address}</div>
                              {location.entityName && (
                                <div className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {location.entityName}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-700">Needs Connection</Badge>
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                              Connect <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {completedLocations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Completed ({completedLocations.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {completedLocations.map((location) => (
                    <Card key={location.id} className="border-emerald-200 bg-emerald-50/50" data-testid={`card-completed-${location.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-emerald-900">{location.name}</div>
                              <div className="text-sm text-emerald-700">{location.address}</div>
                              {location.entityName && (
                                <div className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {location.entityName}
                                  {location.provider && (
                                    <span className="ml-2 text-emerald-500">• {location.provider}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {showSupportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSupportModal(false)}>
            <Card className="max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Our team will help you set up multiple locations under a single legal entity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">Call Us</div>
                        <div className="text-sm text-blue-700">1-800-MUNCH-PAY</div>
                        <div className="text-xs text-blue-600 mt-1">Mon-Fri, 9am-6pm PST</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">Schedule a Call</div>
                        <div className="text-sm text-blue-700">Book a time with our payroll specialists</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full" onClick={() => setShowSupportModal(false)} data-testid="button-close-support">
                  Got it
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
