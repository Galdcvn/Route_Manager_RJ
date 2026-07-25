import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

type ShareModalProps = {
  open: boolean
  onClose: () => void
  onShare: () => void
  onCopyLink: () => void
}

export function ShareModal({ open, onClose, onShare, onCopyLink }: ShareModalProps) {
  const { t } = useTranslation()
  if (!open) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy">{t('results.share')}</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { onShare(); onClose() }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
            >
              <svg className="h-5 w-5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-navy">{t('results.shareVia')}</p>
                <p className="text-xs text-slate-400">{t('results.shareViaSub')}</p>
              </div>
            </button>

            <button
              onClick={() => { onCopyLink(); onClose() }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
            >
              <svg className="h-5 w-5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-navy">{t('results.copyLink')}</p>
                <p className="text-xs text-slate-400">{t('results.copyLinkSub')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
