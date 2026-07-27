import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap<T extends HTMLElement>(open: boolean, onClose?: () => void): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (!open || !ref.current) return
    const container = ref.current

    const first = container.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusable.length === 0) return
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return ref
}
