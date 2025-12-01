import React from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  filterCount?: number;
  rightContent?: ReactNode;
}

export function PageHeader({ 
  title, 
  onAdd, 
  addLabel = 'Thêm mới',
  searchValue = '',
  onSearchChange,
  onFilterClick,
  filterCount = 0,
  rightContent
}: PageHeaderProps) {
  return (
    <div 
      className="sticky top-16 z-30 px-6 py-4 mb-6"
      style={{
        background: 'rgba(250, 250, 250, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        
        <div className="flex items-center gap-3">
          {rightContent}
          
          {/* Search Box */}
          {onSearchChange && (
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 h-10 pl-4 pr-10 rounded-2xl bg-white border border-border focus:border-[#FF8C42] focus:outline-none transition-colors"
                style={{ boxShadow: 'var(--shadow-softer)' }}
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          {/* Filter Button */}
          {onFilterClick && (
            <div className="relative">
              <button
                onClick={onFilterClick}
                className="relative w-10 h-10 rounded-2xl bg-white hover:bg-secondary transition-colors flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-softer)' }}
              >
                <Filter className="w-5 h-5 text-muted-foreground" />
                {filterCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-xs">
                    {filterCount}
                  </div>
                )}
              </button>
            </div>
          )}
          
          {onAdd && (
            <button 
              onClick={onAdd}
              className="px-5 h-10 rounded-2xl bg-[#FF8C42] hover:bg-[#FF7A2E] text-white transition-colors flex items-center gap-2"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <Plus className="w-5 h-5" />
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}