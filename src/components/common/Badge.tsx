import React from 'react';
import { LoanStatus } from '../../types';

interface StatusBadgeProps {
  status: LoanStatus | 'ACTIVE' | 'INACTIVE';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'ISSUED':
      return (
        <span className={`inline-flex items-center text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded ${className}`}>
          Issued
        </span>
      );
    case 'RETURNED':
      return (
        <span className={`inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded ${className}`}>
          Returned
        </span>
      );
    case 'OVERDUE':
      return (
        <span className={`inline-flex items-center text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded ${className}`}>
          Overdue
        </span>
      );
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded ${className}`}>
          Active
        </span>
      );
    case 'INACTIVE':
      return (
        <span className={`inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded ${className}`}>
          Inactive
        </span>
      );
    default:
      return <span className={`text-xs text-slate-600 ${className}`}>{status}</span>;
  }
};
