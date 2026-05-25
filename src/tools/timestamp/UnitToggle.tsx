import { useTranslation } from 'react-i18next'

interface UnitToggleProps {
  value: 's' | 'ms'
  onChange: (v: 's' | 'ms') => void
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  const { t } = useTranslation('timestamp')

  return (
    <div className="inline-flex h-6 rounded-md border border-border text-[11px] font-mono overflow-hidden">
      <button
        className={`px-3 transition-colors ${value === 's' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => onChange('s')}
      >
        {t('unitSeconds', 's')}
      </button>
      <button
        className={`px-3 transition-colors ${value === 'ms' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => onChange('ms')}
      >
        {t('unitMillis', 'ms')}
      </button>
    </div>
  )
}