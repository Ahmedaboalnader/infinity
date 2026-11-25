import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex flex-wrap border-b border-border gap-1', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-px select-none',
              isActive
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-text-muted hover:text-text hover:border-border'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn('px-2 py-0.5 text-xs rounded-full', isActive ? 'bg-white/20 text-white' : 'bg-surface-2 text-text-muted')}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
