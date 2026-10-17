import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  DollarSign, 
  Scale, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Users, 
  UserCheck, 
  AlertCircle, 
  TrendingUp,
  Briefcase,
  Layers,
  Bot,
  Calendar,
  CreditCard,
  UserPlus,
  ArrowDownLeft,
  ChevronRight,
  Info
} from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
  accruedThisWeek: number; // Current total accrued earnings in the weekly cycle
  alreadyWithdrawn: number; // Amount they already withdrew from this week's early access limit
  weeklySalaryRate: number; // Total potential salary per week
  hourlyRate: number;
  hoursWorked: number;
}

interface PayrollTransaction {
  id: string;
  employeeName: string;
  employeeEmail: string;
  timestamp: string;
  type: 'Self-Service Checkout' | 'Weekly Auto-Settlement' | 'Accrual Update';
  amount: number;
  status: 'COMPLETED' | 'PENDING';
}

interface EmployeePayrollProps {
  onLogAction: (action: string, impact: string) => void;
  corporateCashReserve: number;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Expanding Bankrolls',
    role: 'Managing Partner & Lab Director',
    email: 'expandingbnkrolls@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop',
    accruedThisWeek: 6800.00,
    alreadyWithdrawn: 1200.00,
    weeklySalaryRate: 8500.00,
    hourlyRate: 212.50,
    hoursWorked: 32
  },
  {
    id: 'emp-2',
    name: 'Sarah Chen',
    role: 'Lead AI Engineer',
    email: 'sarah.chen@67snipper.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop',
    accruedThisWeek: 4500.00,
    alreadyWithdrawn: 800.00,
    weeklySalaryRate: 6000.00,
    hourlyRate: 150.00,
    hoursWorked: 30
  },
  {
    id: 'emp-3',
    name: 'Alex Mercer',
    role: 'Quant Architect',
    email: 'alex.mercer@67snipper.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop',
    accruedThisWeek: 3900.00,
    alreadyWithdrawn: 1500.00,
    weeklySalaryRate: 5200.00,
    hourlyRate: 130.00,
    hoursWorked: 30
  },
  {
    id: 'emp-4',
    name: 'Marcus Vance',
    role: 'Systems Developer',
    email: 'marcus.vance@67snipper.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop',
    accruedThisWeek: 2800.00,
    alreadyWithdrawn: 0.00,
    weeklySalaryRate: 4000.00,
    hourlyRate: 100.00,
    hoursWorked: 28
  }
];

const INITIAL_TRANSACTIONS: PayrollTransaction[] = [
  {
    id: 'tx-1',
    employeeName: 'Expanding Bankrolls',
    employeeEmail: 'expandingbnkrolls@gmail.com',
    timestamp: 'Yesterday, 04:32 PM',
    type: 'Self-Service Checkout',
    amount: 1200.00,
    status: 'COMPLETED'
  },
  {
    id: 'tx-2',
    employeeName: 'Sarah Chen',
    employeeEmail: 'sarah.chen@67snipper.com',
    timestamp: '2 days ago, 10:15 AM',
    type: 'Self-Service Checkout',
    amount: 800.00,
    status: 'COMPLETED'
  },
  {
    id: 'tx-3',
    employeeName: 'Alex Mercer',
    employeeEmail: 'alex.mercer@67snipper.com',
    timestamp: '3 days ago, 01:40 PM',
    type: 'Self-Service Checkout',
    amount: 1500.00,
    status: 'COMPLETED'
  },
  {
    id: 'tx-4',
    employeeName: 'Marcus Vance',
    employeeEmail: 'marcus.vance@67snipper.com',
    timestamp: 'Last Sunday, 11:59 PM',
    type: 'Weekly Auto-Settlement',
    amount: 2800.00,
    status: 'COMPLETED'
  }
];

export default function EmployeePayroll({ onLogAction, corporateCashReserve }: EmployeePayrollProps) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [transactions, setTransactions] = useState<PayrollTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(INITIAL_EMPLOYEES[0].id);
  
  // Checkout Interactive States
  const [checkoutAmount, setCheckoutAmount] = useState<string>('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Onboarding States
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpRate, setNewEmpRate] = useState('');

  // Selected Employee memo
  const currentEmployee = useMemo(() => {
    return employees.find(emp => emp.id === selectedEmpId) || employees[0];
  }, [employees, selectedEmpId]);

  // Calculations under the Half-Balance Weekly Rule
  // Formula:
  // Total Earned this week so far = accruedThisWeek
  // Early access checkout limit (50% of accrued) = accruedThisWeek * 0.5
  // Leftover available for early checkout = Math.max(0, limit - alreadyWithdrawn)
  // Standard locked remaining amount = accruedThisWeek - alreadyWithdrawn
  const payrollMetrics = useMemo(() => {
    const totalEarned = currentEmployee.accruedThisWeek;
    const weeklyLimit = totalEarned * 0.5;
    const availableCheckout = Math.max(0, weeklyLimit - currentEmployee.alreadyWithdrawn);
    const lockedBalance = totalEarned - currentEmployee.alreadyWithdrawn - availableCheckout;

    return {
      totalEarned,
      weeklyLimit,
      availableCheckout,
      lockedBalance
    };
  }, [currentEmployee]);

  const handleQuickSelect = (pct: number) => {
    const amount = (payrollMetrics.availableCheckout * pct).toFixed(2);
    setCheckoutAmount(amount);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(checkoutAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid numeric checkout amount.");
      return;
    }

    if (amount > payrollMetrics.availableCheckout) {
      alert("Error: Checkout exceeds your available early access balance limit (50% rule).");
      return;
    }

    setCheckingOut(true);

    setTimeout(() => {
      // Deduct/update values
      setEmployees(prev => prev.map(emp => {
        if (emp.id === selectedEmpId) {
          return {
            ...emp,
            alreadyWithdrawn: emp.alreadyWithdrawn + amount
          };
        }
        return emp;
      }));

      // Add to transaction log
      const newTx: PayrollTransaction = {
        id: `tx-${Date.now()}`,
        employeeName: currentEmployee.name,
        employeeEmail: currentEmployee.email,
        timestamp: 'Just now',
        type: 'Self-Service Checkout',
        amount: amount,
        status: 'COMPLETED'
      };

      setTransactions(prev => [newTx, ...prev]);
      setCheckingOut(false);
      setCheckoutAmount('');
      setSuccessMessage(`Instant self-service checkout of $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} has been initiated successfully! Sent to external routing ledger.`);
      
      onLogAction(
        `💳 SELF-SERVICE CHECKOUT: ${currentEmployee.name} withdrew $${amount.toLocaleString()}`,
        `Transferred early wage portion instantly. Protected corporate liquidity. (50% payroll cycle rule in effect)`
      );

      // Dismiss message after 5s
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 1200);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(newEmpRate);
    if (!newEmpName || !newEmpEmail || !newEmpRole || isNaN(rate) || rate <= 0) {
      alert("Please fill all onboarding fields correctly.");
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      email: newEmpEmail,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=100&fit=crop`,
      accruedThisWeek: Math.round(rate * 0.4), // start with 40% of standard accrued for the current week
      alreadyWithdrawn: 0,
      weeklySalaryRate: rate,
      hourlyRate: Math.round((rate / 40) * 100) / 100,
      hoursWorked: 16
    };

    setEmployees(prev => [...prev, newEmp]);
    setSelectedEmpId(newEmp.id);
    
    // Reset form
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpRole('');
    setNewEmpRate('');
    setShowOnboardModal(false);

    onLogAction(
      `👤 ONBOARDED EMPLOYEE: ${newEmp.name} as ${newEmp.role}`,
      `Configured custom $${rate.toLocaleString()}/wk payroll pipeline. Initiated real-time early access eligibility.`
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row items-center md:justify-between border-b border-slate-800 pb-8 gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-6 bg-emerald-600/20 rounded-[2.5rem] border border-emerald-500/30 text-emerald-400">
            <Scale className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Employee Payroll</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium">
              Employee Self-Service check-out and cash velocity control panel. Under 50% weekly early-access rules.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOnboardModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Onboard Employee
        </button>
      </div>

      {/* Main Roster & Self-Service Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Team Roster selection */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white uppercase italic text-xs tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Active Team Roster
            </h3>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 text-slate-500 rounded border border-white/5">
              {employees.length} Personnel
            </span>
          </div>

          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Select a team member profile to access their self-service payroll interface and execute wage checkouts.
          </p>

          <div className="space-y-2 mt-2">
            {employees.map((emp) => {
              const isSelected = emp.id === selectedEmpId;
              return (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmpId(emp.id);
                    setCheckoutAmount('');
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-slate-800 border-emerald-500/40 shadow-md text-white' 
                      : 'bg-slate-950 border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={emp.avatarUrl} 
                      alt={emp.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-black text-[11px] uppercase tracking-wide truncate">{emp.name}</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">{emp.role}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-emerald-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active self service check out console */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Employee Active File Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full uppercase">
                Self-Service Dashboard
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <img 
                src={currentEmployee.avatarUrl} 
                alt={currentEmployee.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-800"
              />
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{currentEmployee.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-medium text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {currentEmployee.role}
                  </span>
                  <span>•</span>
                  <span>{currentEmployee.email}</span>
                </div>
              </div>
            </div>

            {/* Balances Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              
              {/* Accrued earnings */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Cycle Accrued Earnings
                  </span>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    ${payrollMetrics.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="mt-4 text-[9px] text-slate-400">
                  Based on <span className="text-white font-bold">{currentEmployee.hoursWorked} hrs</span> worked at ${currentEmployee.hourlyRate}/hr
                </div>
              </div>

              {/* Instant Checkout Available (Half balance rule) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5" />
                      Early Access Available
                    </span>
                    <span className="text-[7px] bg-emerald-500/10 text-emerald-400 font-bold px-1 rounded uppercase">
                      50% rule
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                    ${payrollMetrics.availableCheckout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="mt-4 text-[9px] text-slate-400 leading-normal">
                  Total Early Limit: ${payrollMetrics.weeklyLimit.toLocaleString()} <br/>
                  Withdrawn early: ${currentEmployee.alreadyWithdrawn.toLocaleString()}
                </div>
              </div>

              {/* Locked Balance */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Sunday Standard Lock
                  </span>
                  <div className="text-2xl font-black text-slate-400 mt-2 font-mono">
                    ${payrollMetrics.lockedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="mt-4 text-[9px] text-slate-500 leading-normal">
                  Settle auto payout on Sunday <br/> at 23:59 UTC
                </div>
              </div>

            </div>

            {/* Educational Half-Balance Explainer */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8 flex items-start gap-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs text-white uppercase tracking-tight">The 50% Cycle Cash-Velocity Protocol</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Under 67SNIPPER Labs continuous liquidity protocol, employees can instantly check out up to 50% of their accrued earnings ahead of the weekend. The remaining 50% is consolidated in standard reserve accounts and settled automatically every Sunday at midnight to secure system-wide runway stability.
                </p>
              </div>
            </div>

            {/* Interactive self-service checkout interface */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6">
              <h4 className="font-black text-white text-sm uppercase italic tracking-wide mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Execute Instant Checkout (Early Access)
              </h4>

              {successMessage && (
                <div className="mb-5 p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-300 text-xs animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">{successMessage}</p>
                </div>
              )}

              {payrollMetrics.availableCheckout <= 0 ? (
                <div className="p-4 bg-slate-900 border border-slate-800 text-slate-400 text-center rounded-xl text-xs space-y-1">
                  <AlertCircle className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="font-bold text-white uppercase tracking-wider text-[10px]">Early Limit Exhausted</p>
                  <p className="text-[10px]">You have already checked out your maximum allowed 50% early wage allowance ($ {currentEmployee.alreadyWithdrawn.toLocaleString()}) for this week.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Checkout Amount ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                        $
                      </div>
                      <input 
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={payrollMetrics.availableCheckout}
                        value={checkoutAmount}
                        onChange={(e) => setCheckoutAmount(e.target.value)}
                        disabled={checkingOut}
                        placeholder={`Max available: $${payrollMetrics.availableCheckout.toFixed(2)}`}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mr-2">Quick:</span>
                    {[
                      { label: '25%', val: 0.25 },
                      { label: '50%', val: 0.50 },
                      { label: '75%', val: 0.75 },
                      { label: 'Max (100%)', val: 1.0 }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleQuickSelect(btn.val)}
                        disabled={checkingOut}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={checkingOut || !checkoutAmount || parseFloat(checkoutAmount) <= 0 || parseFloat(checkoutAmount) > payrollMetrics.availableCheckout}
                    className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initiating Payday Clearance...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-emerald-200" />
                        Authorize Instant Checkout
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Ledger History log */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4">
            <h4 className="font-black text-white text-xs uppercase italic tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Corporate Payroll Settlement Ledger
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-slate-400">
                <thead>
                  <tr className="border-b border-slate-800 text-[9px] text-slate-500 uppercase font-black tracking-wider text-left">
                    <th className="pb-3">Personnel</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Transaction Type</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-950/20 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        <div>{tx.employeeName}</div>
                        <div className="text-[9px] text-slate-500 font-medium">{tx.employeeEmail}</div>
                      </td>
                      <td className="py-3 font-medium text-slate-400">{tx.timestamp}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          tx.type === 'Self-Service Checkout' ? 'text-indigo-400' : 'text-emerald-400'
                        }`}>
                          {tx.type === 'Self-Service Checkout' ? (
                            <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-white">
                        ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Onboarding New Employee Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowOnboardModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Onboard New Personnel</h3>
              <p className="text-xs text-slate-400">Configure salary parameters and initiate self-service early access wage routing.</p>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Liam Vance"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Corporate Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. liam.vance@67snipper.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Organizational Role</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Lead Devops Architect"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Weekly Standard Salary Rate ($)</label>
                <input 
                  type="number"
                  required
                  min="100"
                  step="50"
                  placeholder="e.g. 4500"
                  value={newEmpRate}
                  onChange={(e) => setNewEmpRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  Confirm Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
