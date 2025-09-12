import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Bot, User, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  age: string;
  income: string;
  loanType: string;
  loanAmount: string;
  emis: string;
  creditScore: string;
  panNumber: string;
}

interface Message {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface FileUpload {
  salarySlip: File | null;
  aadhaarCard: File | null;
}

const ChatBot = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    income: '',
    loanType: '',
    loanAmount: '',
    emis: '',
    creditScore: '',
    panNumber: ''
  });
  const [files, setFiles] = useState<FileUpload>({
    salarySlip: null,
    aadhaarCard: null
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hello! I'm your AI Loan Eligibility Advisor. I'll help you check your loan eligibility by collecting some information and analyzing your documents. Let's start with your basic details.",
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { field: 'name', label: 'Full Name', type: 'text', question: "What's your full name?" },
    { field: 'age', label: 'Age', type: 'number', question: "How old are you?" },
    { field: 'income', label: 'Monthly Income (₹)', type: 'number', question: "What's your monthly income in rupees?" },
    { field: 'loanType', label: 'Loan Type', type: 'select', question: "What type of loan are you applying for?", options: ['Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan'] },
    { field: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', question: "How much loan amount do you need?" },
    { field: 'emis', label: 'Existing EMIs (₹)', type: 'number', question: "What's your total existing EMI amount per month?" },
    { field: 'creditScore', label: 'Credit Score', type: 'number', question: "What's your current credit score (300-850)?" },
    { field: 'panNumber', label: 'PAN Number', type: 'text', question: "What's your PAN number?" }
  ];

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const currentField = steps[currentStep].field as keyof UserData;
    const value = userData[currentField];
    
    if (!value) {
      toast({
        title: "Required Field",
        description: "Please fill in this field before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: value,
      timestamp: new Date()
    }]);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Add next bot question
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: steps[currentStep + 1].question,
          timestamp: new Date()
        }]);
      }, 500);
    } else {
      // Move to document upload phase
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "Great! Now I need you to upload your documents for verification. Please upload your Salary Slip and Aadhaar Card.",
          timestamp: new Date()
        }]);
        setCurrentStep(currentStep + 1);
      }, 500);
    }
  };

  const handleFileUpload = (type: 'salarySlip' | 'aadhaarCard', file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    toast({
      title: "File Uploaded",
      description: `${type === 'salarySlip' ? 'Salary Slip' : 'Aadhaar Card'} uploaded successfully!`,
    });
  };

  const processApplication = async () => {
    if (!files.salarySlip || !files.aadhaarCard) {
      toast({
        title: "Missing Documents",
        description: "Please upload both Salary Slip and Aadhaar Card.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setMessages(prev => [...prev, {
      type: 'bot',
      content: "Processing your application... Running OCR on documents, validating information, and checking loan eligibility...",
      timestamp: new Date()
    }]);

    // Simulate processing
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "✅ Documents processed successfully! Analyzing your loan eligibility...",
        timestamp: new Date()
      }]);
      
      setTimeout(() => {
        // Mock eligibility result
        const isEligible = parseInt(userData.creditScore) > 650 && 
                          parseInt(userData.income) > parseInt(userData.emis) * 3;
        
        setMessages(prev => [...prev, {
          type: 'bot',
          content: isEligible 
            ? "🎉 Congratulations! You are eligible for the loan. Based on your profile, here are your options..." 
            : "❌ Unfortunately, you don't meet the current eligibility criteria. Here's how you can improve...",
          timestamp: new Date()
        }]);
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const currentQuestion = currentStep < steps.length ? steps[currentStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Loan Eligibility Advisor
          </h1>
          <p className="text-muted-foreground">Get instant loan eligibility assessment with AI-powered document verification</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chat Interface */}
          <Card className="flex flex-col h-[600px] shadow-lg">
            <div className="flex items-center gap-2 border-b p-4">
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="font-semibold">Loan Advisor Bot</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.type === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-xs rounded-lg p-3 ${
                    message.type === 'bot' 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {currentQuestion && (
              <div className="border-t p-4">
                <div className="space-y-4">
                  <Label>{currentQuestion.label}</Label>
                  {currentQuestion.type === 'select' ? (
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={userData[currentQuestion.field as keyof UserData]}
                      onChange={(e) => handleInputChange(currentQuestion.field as keyof UserData, e.target.value)}
                    >
                      <option value="">Select {currentQuestion.label}</option>
                      {currentQuestion.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={currentQuestion.type}
                      placeholder={`Enter your ${currentQuestion.label.toLowerCase()}`}
                      value={userData[currentQuestion.field as keyof UserData]}
                      onChange={(e) => handleInputChange(currentQuestion.field as keyof UserData, e.target.value)}
                    />
                  )}
                  <Button onClick={handleNext} className="w-full">
                    {currentStep < steps.length - 1 ? 'Next' : 'Proceed to Documents'}
                  </Button>
                </div>
              </div>
            )}

            {/* Document Upload Phase */}
            {currentStep >= steps.length && (
              <div className="border-t p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Salary Slip</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('salarySlip', e.target.files[0])}
                        className="text-xs"
                      />
                      {files.salarySlip && <CheckCircle className="h-4 w-4 text-success" />}
                    </div>
                  </div>
                  <div>
                    <Label>Aadhaar Card</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('aadhaarCard', e.target.files[0])}
                        className="text-xs"
                      />
                      {files.aadhaarCard && <CheckCircle className="h-4 w-4 text-success" />}
                    </div>
                  </div>
                </div>
                <Button onClick={processApplication} className="w-full" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Analyze Eligibility'}
                </Button>
              </div>
            )}
          </Card>

          {/* Application Summary */}
          <Card className="h-[600px] overflow-y-auto shadow-lg">
            <div className="border-b p-4">
              <h2 className="font-semibold">Application Summary</h2>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(userData).map(([key, value]) => (
                value && (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                )
              ))}
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Document Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Salary Slip</span>
                    {files.salarySlip ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aadhaar Card</span>
                    {files.aadhaarCard ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;