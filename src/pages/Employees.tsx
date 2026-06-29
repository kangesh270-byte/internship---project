/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  Clock3,
  TrendingUp,
  UserCheck,
  Plus,
  X,
  Target,
  DollarSign,
  Briefcase,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Employee, Attendance, Target as EmployeeTarget, UserRole } from '../types';

interface EmployeesProps {
  employees: Employee[];
  attendance: Attendance[];
  targets: EmployeeTarget[];
  onAddEmployee: (emp: any) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onCheckIn: (employeeId: string, time: string, status: 'Present' | 'Late') => void;
  onCheckOut: (employeeId: string, time: string) => void;
  onAddTarget: (target: any) => void;
}

export default function Employees({
  employees,
  attendance,
  targets,
  onAddEmployee,
  onUpdateEmployee,
  onCheckIn,
  onCheckOut,
  onAddTarget
}: EmployeesProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  // Form states for adding employee
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Sales Executive');
  const [department, setDepartment] = useState('Sales Operations');

  // Form states for sales target
  const [targetEmpId, setTargetEmpId] = useState('');
  const [targetAmount, setTargetAmount] = useState(10000);

  // Computed Values
  const TODAY_STR = '2026-06-29';

  const employeeAttendanceMap = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendance.forEach(att => {
      if (att.date === TODAY_STR) {
        map[att.employeeId] = att;
      }
    });
    return map;
  }, [attendance]);

  const activeTargetsMap = useMemo(() => {
    const map: Record<string, EmployeeTarget> = {};
    const currentMonthStr = '2026-06';
    targets.forEach(t => {
      if (t.month === currentMonthStr) {
        map[t.employeeId] = t;
      }
    });
    return map;
  }, [targets]);

  const selectedEmployee = useMemo(() => {
    return employees.find(e => e.id === selectedEmpId) || null;
  }, [employees, selectedEmpId]);

  const selectedEmployeeTargets = useMemo(() => {
    if (!selectedEmpId) return [];
    return targets.filter(t => t.employeeId === selectedEmpId);
  }, [targets, selectedEmpId]);

  const selectedEmployeeAttendance = useMemo(() => {
    if (!selectedEmpId) return [];
    return attendance.filter(a => a.employeeId === selectedEmpId);
  }, [attendance, selectedEmpId]);

  // Handlers
  const handleRegisterEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out employee name and contact email.');
      return;
    }
    onAddEmployee({
      name,
      email,
      phone,
      role,
      department,
      status: 'Active'
    });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setRole('Sales Executive');
    setDepartment('Sales Operations');
    setIsAddModalOpen(false);
  };

  const handleRegisterTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmpId || targetAmount <= 0) {
      alert('Please specify a valid employee and positive sales target amount.');
      return;
    }
    onAddTarget({
      employeeId: targetEmpId,
      month: '2026-06',
      targetAmount: parseFloat(targetAmount.toString())
    });

    alert('Successfully designated monthly target.');
    setIsTargetModalOpen(false);
  };

  const handleCheckInSimulate = (empId: string) => {
    // Determine check-in time
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // if checked in after 9:00 AM, count as Late
    const isLate = new Date().getHours() >= 9;
    onCheckIn(empId, time, isLate ? 'Late' : 'Present');
  };

  const handleCheckOutSimulate = (empId: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onCheckOut(empId, time);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Search and Action bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex-wrap gap-3">
        <div>
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Employee Operations Center</h3>
          <p className="text-[10px] text-zinc-400">Onboard employee profiles, check attendance logs, and track sales targets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (employees.length > 0) setTargetEmpId(employees[0].id);
              setIsTargetModalOpen(true);
            }}
            className="flex items-center gap-1 px-3.5 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
          >
            <Target className="w-3.5 h-3.5 text-zinc-500" />
            Designate Target
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Onboard Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Employee List Directory */}
        <div className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden ${
          selectedEmpId ? 'lg:col-span-2' : 'lg:col-span-3'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold select-none">
                  <th className="py-3 px-5">Staff Profile</th>
                  <th className="py-3 px-5">Contact & Org</th>
                  <th className="py-3 px-5">June KPI Performance</th>
                  <th className="py-3 px-5 text-center">Attendance (TODAY)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {employees.map(e => {
                  const todayAtt = employeeAttendanceMap[e.id];
                  const juneTarget = activeTargetsMap[e.id];
                  const progressPct = juneTarget
                    ? Math.min(100, Math.round((juneTarget.achievedAmount / juneTarget.targetAmount) * 100))
                    : null;

                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedEmpId(selectedEmpId === e.id ? null : e.id)}
                      className={`hover:bg-zinc-50/50 text-xs cursor-pointer transition-colors ${
                        selectedEmpId === e.id ? 'bg-amber-500/[0.02]' : ''
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="font-bold text-zinc-800 text-sm">{e.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono tracking-wider mt-0.5 font-semibold uppercase">
                          {e.role}
                        </div>
                      </td>
                      <td className="py-4 px-5 space-y-0.5">
                        <p className="text-zinc-600 font-semibold">{e.email}</p>
                        <p className="text-zinc-400 font-medium">{e.department}</p>
                      </td>
                      <td className="py-4 px-5">
                        {juneTarget ? (
                          <div className="space-y-1 w-44">
                            <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-zinc-500">
                              <span>${juneTarget.achievedAmount.toLocaleString()} / ${juneTarget.targetAmount.toLocaleString()}</span>
                              <span className={progressPct && progressPct >= 100 ? 'text-emerald-500 font-bold' : ''}>
                                {progressPct}%
                              </span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  progressPct && progressPct >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider font-mono">
                            No active target
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-2">
                          {todayAtt ? (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                todayAtt.status === 'Present'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                Checked-In: {todayAtt.checkIn}
                              </span>
                              {todayAtt.checkOut ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                                  Checked-Out: {todayAtt.checkOut}
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleCheckOutSimulate(e.id)}
                                  className="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-100 font-bold rounded hover:bg-zinc-950 transition-colors cursor-pointer border border-zinc-900"
                                >
                                  Check Out
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCheckInSimulate(e.id)}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[10px] rounded transition-all cursor-pointer shadow-sm"
                            >
                              Check In Today
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Employee Drawer sidebar panel */}
        {selectedEmpId && selectedEmployee && (
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-zinc-200 shadow-xl space-y-6 page-transition">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  Staff Portfolio
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-2">{selectedEmployee.name}</h3>
                <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-650" />
                  {selectedEmployee.department} • {selectedEmployee.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmpId(null)}
                className="p-1 text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Target History */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-zinc-500" />
                Performance History
              </h4>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {selectedEmployeeTargets.length === 0 ? (
                  <div className="p-3 text-[11px] text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    No sales target history recorded.
                  </div>
                ) : (
                  selectedEmployeeTargets.map(t => (
                    <div key={t.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-300">Target for {t.month}</p>
                        <p className="text-[10px] text-zinc-500">Achieved: ${t.achievedAmount.toLocaleString()} / ${t.targetAmount.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.status === 'Achieved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : t.status === 'Failed'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attendance History */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5 text-zinc-500" />
                Attendance Logs
              </h4>
              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {selectedEmployeeAttendance.length === 0 ? (
                  <div className="p-3 text-[11px] text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    No registered clock logs recorded.
                  </div>
                ) : (
                  selectedEmployeeAttendance.map(a => (
                    <div key={a.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-300">{a.date}</p>
                        <p className="text-[10px] text-zinc-500">
                          {a.checkIn} {a.checkOut ? `to ${a.checkOut}` : '• Checked-In'}
                        </p>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        a.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Modal: Onboard Employee */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden page-transition">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Onboard Employee Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleRegisterEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Full Employee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alicia Silverstone"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alicia@saascorp.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Corporate phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    System Authorization Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sales Operations"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer"
                >
                  Confirm Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Designation Target Modal */}
      {isTargetModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden page-transition">
            <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
                Designate Monthly Target
              </span>
              <button
                onClick={() => setIsTargetModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTarget} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Authorized Employee
                </label>
                <select
                  value={targetEmpId}
                  onChange={e => setTargetEmpId(e.target.value)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-medium text-zinc-700 bg-white cursor-pointer"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 mb-1">
                  Sales Target Goal ($)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="500"
                  value={targetAmount}
                  onChange={e => setTargetAmount(parseInt(e.target.value) || 0)}
                  className="w-full text-xs border border-zinc-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-zinc-400 font-mono text-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-50">
                <button
                  type="button"
                  onClick={() => setIsTargetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1"
                >
                  Confirm Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
