import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, ChevronDown, Check, X, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { designTokens } from '../design/tokens';

// --- BUTTONS ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function PrimaryButton({
  children,
  icon: Icon,
  iconPosition = 'left',
  loading,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={designTokens.motion.hoverScale}
      whileTap={designTokens.motion.hoverTap}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans text-xs font-bold text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-indigo-500/10 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={14} className="shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={14} className="shrink-0" />}
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  icon: Icon,
  iconPosition = 'left',
  loading,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={designTokens.motion.hoverScale}
      whileTap={designTokens.motion.hoverTap}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 active:bg-gray-100 dark:active:bg-gray-800 rounded-xl transition-all shadow-sm disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={14} className="shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={14} className="shrink-0" />}
    </motion.button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for screenreaders (Priority 14)
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  label,
  className = '',
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2.5 rounded-xl',
    lg: 'p-3 rounded-2xl'
  };

  const variantClasses = {
    primary: 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-sm',
    secondary: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 shadow-sm',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400',
    ghost: 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60'
  };

  return (
    <motion.button
      whileHover={designTokens.motion.hoverScale}
      whileTap={designTokens.motion.hoverTap}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} className="shrink-0" />
    </motion.button>
  );
}

// --- CARDS & BADGES ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-lg transition-colors duration-300 ${onClick ? 'cursor-pointer hover:border-white/40' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  onClick
}: MetricCardProps) {
  const CardWrapper = onClick ? motion.button : 'div';
  const interactionProps = onClick 
    ? { 
        whileHover: { y: -3, scale: 1.01 }, 
        whileTap: { scale: 0.99 },
        className: 'text-left w-full cursor-pointer'
      } 
    : {};

  return (
    // @ts-ignore
    <CardWrapper
      {...interactionProps}
      className={`p-5 rounded-2xl border border-gray-150 bg-white shadow-sm hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${onClick ? 'w-full' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="font-sans text-xl md:text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
          {value}
        </span>
        {trend && (
          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${trend.isPositive ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20' : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20'}`}>
            {trend.value}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 font-sans text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
          {description}
        </p>
      )}
    </CardWrapper>
  );
}

export function StatBadge({ label, value, colorClass = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' }: { label: string; value: string | number; colorClass?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-sans text-[10px] font-bold tracking-normal ${colorClass}`}>
      <span className="opacity-75 uppercase tracking-wide">{label}:</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function TrustBadge({ label, icon: Icon, onClick }: { label: string; icon?: LucideIcon; onClick?: () => void }) {
  const BadgeWrapper = onClick ? 'button' : 'div';
  return (
    // @ts-ignore
    <BadgeWrapper
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-[10px] font-sans font-bold dark:border-emerald-950/30 dark:bg-emerald-950/15 dark:text-emerald-400 ${onClick ? 'cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/30 active:scale-97' : ''}`}
    >
      {Icon ? <Icon size={11} className="shrink-0 animate-pulse" /> : <ShieldCheck size={11} className="shrink-0" />}
      <span>{label}</span>
    </BadgeWrapper>
  );
}

// --- TITLES & HEADINGS ---

export function SectionTitle({ children, subtitle, className = '' }: { children: React.ReactNode; subtitle?: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <h2 className="font-sans text-lg font-bold text-gray-950 dark:text-white tracking-tight">
        {children}
      </h2>
      {subtitle && (
        <p className="font-sans text-xs text-gray-500 dark:text-gray-400 leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function SectionDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-sans text-xs text-gray-500 dark:text-gray-400 leading-normal ${className}`}>
      {children}
    </p>
  );
}

export function ToolSection({ title, description, children, className = '' }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="border-b border-gray-100 dark:border-gray-850 pb-2">
        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400">
          {title}
        </h3>
        {description && (
          <p className="font-sans text-[11px] text-gray-500 dark:text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

// --- PANELS ---

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  icon?: LucideIcon;
  className?: string;
}

export function InfoPanel({
  title,
  children,
  variant = 'info',
  icon: Icon,
  className = ''
}: InfoPanelProps) {
  const themes = {
    info: {
      border: 'border-indigo-100 dark:border-indigo-900/40',
      bg: 'bg-indigo-50/40 dark:bg-indigo-950/15',
      text: 'text-indigo-900 dark:text-indigo-200',
      icon: <Info size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
    },
    success: {
      border: 'border-emerald-100 dark:border-emerald-900/40',
      bg: 'bg-emerald-50/40 dark:bg-emerald-950/15',
      text: 'text-emerald-900 dark:text-emerald-200',
      icon: <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
    },
    warning: {
      border: 'border-amber-100 dark:border-amber-900/40',
      bg: 'bg-amber-50/40 dark:bg-amber-950/15',
      text: 'text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
    },
    danger: {
      border: 'border-rose-100 dark:border-rose-900/40',
      bg: 'bg-rose-50/40 dark:bg-rose-950/15',
      text: 'text-rose-900 dark:text-rose-200',
      icon: <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
    }
  };

  const activeTheme = themes[variant];

  return (
    <div className={`p-4 rounded-xl border ${activeTheme.border} ${activeTheme.bg} flex items-start gap-3 ${className}`}>
      {Icon ? <Icon size={16} className={`${variant === 'info' ? 'text-indigo-600' : variant === 'success' ? 'text-emerald-600' : variant === 'warning' ? 'text-amber-600' : 'text-rose-600'} shrink-0 mt-0.5`} /> : activeTheme.icon}
      <div className="space-y-1">
        <h4 className={`font-sans font-bold text-xs ${activeTheme.text}`}>
          {title}
        </h4>
        <div className="font-sans text-[11px] opacity-90 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- GRIDS & COMPLEX LAYOUTS ---

export function FeatureGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}

interface TimelineItem {
  time: string;
  title: string;
  description: string;
  badge?: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 pl-6 space-y-8 py-2">
      {items.map((item, idx) => (
        <div key={idx} className="relative">
          {/* Dot */}
          <div className="absolute -left-[31px] top-1.5 bg-white dark:bg-gray-900 rounded-full h-4.5 w-4.5 border-2 border-indigo-500 flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full" />
          </div>
          {/* Content */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                {item.time}
              </span>
              {item.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {item.badge}
                </span>
              )}
            </div>
            <h4 className="font-sans font-bold text-xs text-gray-950 dark:text-white mt-0.5">
              {item.title}
            </h4>
            <p className="font-sans text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between p-4 text-left font-sans font-bold text-xs text-gray-900 dark:text-white hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors cursor-pointer"
            >
              <span>{item.title}</span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-gray-50 dark:border-gray-850/50 font-sans text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// --- MODALS, SKELETONS, & EMPTY STATES ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={designTokens.animations.spring}
          className={`relative w-full ${widthClasses[maxWidth]} overflow-hidden rounded-2xl border border-gray-150 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-650 transition-colors dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          <h3 className="font-sans font-bold text-md text-gray-950 dark:text-white mb-4 pr-6 border-b border-gray-100 dark:border-gray-850 pb-2">
            {title}
          </h3>

          <div className="mt-2 text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`} />
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-950/10 py-12">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-500 flex items-center justify-center mb-4">
          <Icon size={20} />
        </div>
      )}
      <h3 className="font-sans font-bold text-sm text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <SecondaryButton className="mt-5" onClick={onAction}>
          {actionLabel}
        </SecondaryButton>
      )}
    </div>
  );
}
