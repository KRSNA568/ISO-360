import { useRef } from 'react'
import { cn } from '@/lib/cn'

/**
 * 6-digit OTP input with auto-advance, backspace, and paste support.
 * Props:
 *   value    — string of up to 6 digits
 *   onChange — (newValue: string) => void
 *   disabled — boolean
 *   error    — boolean (red highlight)
 */
export default function OtpInput({ value = '', onChange, disabled = false, error = false }) {
  const inputsRef = useRef([])

  // Normalise to exactly 6 slots (trailing spaces for empty slots)
  const chars = (value + '      ').slice(0, 6)

  function updateChar(index, ch) {
    const arr = chars.split('')
    arr[index] = ch
    // Trim trailing spaces for compact value, but keep at least `index+1` chars
    const joined = arr.join('')
    onChange(joined.trimEnd())
  }

  function handleChange(i, e) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    updateChar(i, ch || ' ')
    if (ch && i < 5) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace') {
      const current = chars[i]?.trim()
      if (!current) {
        // already empty — move back and clear previous
        if (i > 0) {
          inputsRef.current[i - 1]?.focus()
          updateChar(i - 1, ' ')
        }
      } else {
        updateChar(i, ' ')
      }
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft' && i > 0)  { e.preventDefault(); inputsRef.current[i - 1]?.focus() }
    if (e.key === 'ArrowRight' && i < 5) { e.preventDefault(); inputsRef.current[i + 1]?.focus() }
  }

  function handlePaste(e) {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(paste)
    inputsRef.current[Math.min(paste.length, 5)]?.focus()
  }

  function handleFocus(e) {
    e.target.select()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => {
        const digit = chars[i]?.trim() || ''
        return (
          <input
            key={i}
            ref={el => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            className={cn(
              'w-11 h-14 text-center text-xl font-bold border rounded-md bg-surface',
              'focus:outline-none transition-all duration-150',
              error
                ? 'border-red-500 bg-red-50 focus:border-red-600'
                : 'border-border focus:border-gold focus:ring-2 focus:ring-gold/20',
              disabled && 'opacity-50 cursor-not-allowed',
              digit && !error && 'border-gold/60 bg-gold-subtle',
            )}
          />
        )
      })}
    </div>
  )
}
