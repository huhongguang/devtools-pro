import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FIRST_DAY_MAP: Record<string, number> = {
  en: 0, fr: 1, de: 1, ru: 1, vi: 1,
  'zh-CN': 1, 'zh-TW': 1, ja: 1, ko: 1, ar: 6,
}

interface CalendarPickerProps {
  value: string // YYYY-MM-DD
  onChange: (date: string) => void
  onClose: () => void
}

export default function CalendarPicker({ value, onChange, onClose }: CalendarPickerProps) {
  const { t, i18n } = useTranslation('timestamp')
  const ref = useRef<HTMLDivElement>(null)

  const initialDate = value ? new Date(value + 'T00:00:00') : new Date()
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())

  const firstDay = FIRST_DAY_MAP[i18n.language] ?? 1
  const dayNames = [t('daySu','Su'), t('dayMo','Mo'), t('dayTu','Tu'), t('dayWe','We'), t('dayTh','Th'), t('dayFr','Fr'), t('daySa','Sa')]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const monthNames = [
    t('monthJan','Jan'), t('monthFeb','Feb'), t('monthMar','Mar'), t('monthApr','Apr'),
    t('monthMay','May'), t('monthJun','Jun'), t('monthJul','Jul'), t('monthAug','Aug'),
    t('monthSep','Sep'), t('monthOct','Oct'), t('monthNov','Nov'), t('monthDec','Dec'),
  ]

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  // Compute grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()

  const offset = (firstDayOfMonth - firstDay + 7) % 7
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const selectedStr = value

  const cells: { day: number; dateStr: string; current: boolean }[] = []
  for (let i = 0; i < offset; i++) {
    const d = prevMonthDays - offset + i + 1
    const m = viewMonth === 0 ? 11 : viewMonth - 1
    const y = viewMonth === 0 ? viewYear - 1 : viewYear
    cells.push({ day: d, dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, current: true })
  }
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1
    const y = viewMonth === 11 ? viewYear + 1 : viewYear
    cells.push({ day: i, dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`, current: false })
  }

  // Reorder day headers based on firstDay
  const orderedDayNames = [...dayNames.slice(firstDay), ...dayNames.slice(0, firstDay)]

  const select = (dateStr: string) => {
    onChange(dateStr)
    onClose()
  }

  return (
    <div ref={ref} className="absolute z-50 w-[260px] tool-card p-3 shadow-elevated animate-fade-in" style={{ top: '100%', left: 0, marginTop: '4px' }}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button className="btn-ghost py-1 px-1" onClick={prevMonth}><ChevronLeft size={14} /></button>
        <span className="text-sm font-semibold text-foreground">{monthNames[viewMonth]} {viewYear}</span>
        <button className="btn-ghost py-1 px-1" onClick={nextMonth}><ChevronRight size={14} /></button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {orderedDayNames.map(name => (
          <div key={name} className="text-center text-[10px] font-semibold uppercase text-muted-foreground py-1">{name}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {cells.map((cell, i) => {
          const isToday = cell.dateStr === todayStr
          const isSelected = cell.dateStr === selectedStr
          return (
            <button
              key={i}
              className={`w-8 h-8 text-xs rounded-md flex items-center justify-center relative transition-colors ${
                !cell.current ? 'text-muted-foreground/40' :
                isSelected ? 'bg-primary text-primary-foreground font-bold' :
                isToday ? 'text-foreground font-semibold' : 'text-muted-foreground hover:bg-surface-elevated'
              }`}
              onClick={() => select(cell.dateStr)}
            >
              {cell.day}
              {isToday && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {/* Today button */}
      <button className="btn-ghost w-full mt-2 text-xs" onClick={() => select(todayStr)}>
        {t('calendarToday', 'Today')}
      </button>
    </div>
  )
}