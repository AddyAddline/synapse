import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  max = 100,
  className,
  color = 'brand',
}: {
  value: number
  max?: number
  className?: string
  color?: 'brand' | 'neuro' | 'amber'
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', {
          'bg-brand-500': color === 'brand',
          'bg-neuro-500': color === 'neuro',
          'bg-amber-500': color === 'amber',
        })}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
