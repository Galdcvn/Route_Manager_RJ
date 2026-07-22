export function parseWKBHex(hex: string): { lat: number; lng: number } {
  const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const view = new DataView(bytes.buffer)
  // EWKB: 1 byte endian + 4 bytes type + 4 bytes SRID = offset 9
  const lng = view.getFloat64(9, true)
  const lat = view.getFloat64(17, true)
  return { lat, lng }
}
