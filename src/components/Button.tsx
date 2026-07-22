type ButtonVariant = 'sky' | 'lime' | 'mustard' | 'orange' | 'pink' | 'outline'
type ButtonRadius = 0 | 5 | 10 | 15

type ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  radius?: ButtonRadius
  className?: string
  disabled?: boolean
  onClick?: () => void
}

const variantStyles: Record<ButtonVariant, string> = {
  sky: 'bg-sky text-white hover:brightness-110',
  lime: 'bg-lime text-white hover:brightness-110',
  mustard: 'bg-mustard text-white hover:brightness-110',
  orange: 'bg-orange text-white hover:brightness-110',
  pink: 'bg-pink text-white hover:brightness-110',
  outline: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-none',
}

const radiusStyles: Record<ButtonRadius, string> = {
  0: 'rounded-none',
  5: 'rounded-[5px]',
  10: 'rounded-[10px]',
  15: 'rounded-[15px]',
}

export function Button({
  children,
  variant = 'sky',
  radius = 15,
  className = '',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-base ${variantStyles[variant]} ${radiusStyles[radius]} ${className} ${disabled ? 'pointer-events-none opacity-40' : ''}`}
    >
      {children}
    </button>
  )
}
