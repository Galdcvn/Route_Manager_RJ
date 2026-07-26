import { useTranslation } from 'react-i18next'
import type { Attraction } from '../types/attraction'
import { categoryEmoji } from '../utils/categoryEmoji'

type AttractionInfoModalProps = {
  open: boolean
  onClose: () => void
  attraction: Attraction | null
}

export function AttractionInfoModal({ open, onClose, attraction }: AttractionInfoModalProps) {
  const { t } = useTranslation()
  if (!open || !attraction) return null

  const endereco = [attraction.rua, attraction.bairro, attraction.cidade]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryEmoji[attraction.categoria] ?? '📍'}</span>
              <div>
                <h2 className="text-lg font-bold text-navy">{attraction.nome}</h2>
                <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
                  {t('categories.' + (attraction.categoria ?? 'outro'))}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Imagem */}
          {attraction.imagem_url && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img
                src={attraction.imagem_url}
                alt={attraction.nome}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {/* Endereço */}
          {endereco && (
            <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
              <span>{endereco}</span>
            </div>
          )}

          {/* Horários */}
          {attraction.horarios && (
            <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{attraction.horarios}</span>
            </div>
          )}

          {/* Descrição */}
          {attraction.descricao && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-600">{attraction.descricao}</p>
            </div>
          )}

          {/* Contatos */}
          {attraction.contatos && attraction.contatos.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">{t('contacts.title')}</h3>
              <div className="flex flex-col gap-2">
                {attraction.contatos.map((contato, i) => {
                  const href = contato.tipo === 'telefone' || contato.tipo === 'whatsapp'
                    ? `tel:${contato.valor.replace(/\D/g, '')}`
                    : contato.tipo === 'email'
                    ? `mailto:${contato.valor}`
                    : contato.tipo === 'instagram'
                    ? `https://instagram.com/${contato.valor.replace('@', '')}`
                    : contato.tipo === 'site'
                    ? contato.valor
                    : undefined

                  const icon = contato.tipo === 'telefone' || contato.tipo === 'whatsapp'
                    ? <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    : contato.tipo === 'email'
                    ? <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>
                    : contato.tipo === 'instagram'
                    ? <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>
                    : <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>

                  const content = (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {icon}
                      </svg>
                      <span>{contato.valor}</span>
                    </div>
                  )

                  return href ? (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="transition hover:text-pink">
                      {content}
                    </a>
                  ) : (
                    <div key={i}>{content}</div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
