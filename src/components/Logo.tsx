type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* R - top left */}
      <text x="10" y="55" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="48" fill="#F5A623">
        R
      </text>
      {/* M - top right */}
      <text x="55" y="55" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="48" fill="#FF9800">
        M
      </text>
      {/* R - bottom left */}
      <text x="10" y="105" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="48" fill="#8BC34A">
        R
      </text>
      {/* J - bottom right */}
      <text x="58" y="105" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="48" fill="#4CA3FF">
        J
      </text>
      {/* Map pin */}
      <g transform="translate(58, 52)">
        <path
          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
          fill="#EB6092"
        />
        <circle cx="12" cy="11" r="4" fill="white" />
      </g>
    </svg>
  )
}
