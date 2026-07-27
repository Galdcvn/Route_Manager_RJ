import { useState } from 'react'

interface AvatarImgProps {
  src: string
  alt?: string
  fallback: string
  className?: string
}

export function AvatarImg({ src, alt = '', fallback, className = '' }: AvatarImgProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center bg-navy text-sm font-bold text-white ${className}`}>
        {fallback}
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} />
}
