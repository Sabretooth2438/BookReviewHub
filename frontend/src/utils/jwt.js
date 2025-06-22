export function roleFromToken(token) {
  if (!token) return null

  try {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload)).role // "ADMIN" or "USER"
  } catch {
    return null
  }
}
