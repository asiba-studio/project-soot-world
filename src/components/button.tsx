import { ArrowRight, ArrowLeft, Download, ExternalLink, Plus } from 'lucide-react';
import { ReactNode } from 'react';

// シンプルなアイコンマップ
const iconMap = {
  right: ArrowRight,
  left: ArrowLeft,
  download: Download,
  external: ExternalLink,
  plus: Plus,
} as const;

type IconName = keyof typeof iconMap;
type Language = 'en' | 'ja';

interface SimpleButtonProps {
  children: ReactNode;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  href?: string;
  external?: boolean; 
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'minimal';
  lang?: Language;  // 新規追加
  size?: 'sm' | 'md' | 'lg'; 
}

export function SimpleButton({ 
  children, 
  icon, 
  iconPosition = 'right',
  href,
  external = false, 
  onClick,
  className = "",
  variant = 'default',
  lang = 'en',
  size = 'md'
}: SimpleButtonProps) {
  
  // Tailwindクラスベースの設計
  const baseClasses = [
    'inline-flex items-center gap-1 font-semibold no-underline transition-all duration-200 cursor-pointer border-0'
  ];

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 gap-1',
    md: 'text-base px-4 py-2 gap-2', 
    lg: 'text-lg px-5 py-2.5 gap-2'
  };

  const responsiveSizeClasses = {
    sm: 'text-xs px-2 py-1 md:text-sm md:px-3 md:py-1.5 lg:text-base lg:px-4 lg:py-2',
    md: 'text-sm px-3 py-1.5 md:text-base md:px-4 md:py-2 lg:text-lg lg:px-5 lg:py-2.5',
    lg: 'text-base px-4 py-2 md:text-lg md:px-5 md:py-2.5 lg:text-xl lg:px-6 lg:py-3'
  };

  const variantClasses = {
    default: 'bg-transparent text-black hover:opacity-80',
    outline: 'bg-transparent text-text-primary border-2 border-text-primary hover:bg-text-primary hover:text-white',
    minimal: 'bg-transparent text-text-primary py-2 px-0 hover:opacity-80'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5',
    md: 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6', 
    lg: 'w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'
  };

  const langClasses = lang === 'en' ? 'font-en' : 'font-zen text-ja-tight';
  
  const combinedClassName = [
    ...baseClasses,
    responsiveSizeClasses[size], // レスポンシブサイズを使用
    variantClasses[variant],
    langClasses,
    className
  ].join(' ');

  const IconComponent = icon ? iconMap[icon] : null;

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && (
        <IconComponent className={iconSizeClasses[size]} strokeWidth={2.5} />
      )}
      {children}
      {IconComponent && iconPosition === 'right' && (
        <IconComponent className={iconSizeClasses[size]} strokeWidth={2.5} />
      )}
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        target={external ? '_blank' : '_self'}
        rel={external ? 'noopener noreferrer' : undefined}
        className={combinedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}