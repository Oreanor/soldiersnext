export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  
  const cookies = document.cookie.split(';')
  const favoritesCookie = cookies.find(cookie => cookie.trim().startsWith('favorites='))
  
  if (!favoritesCookie) return []
  
  try {
    const favoritesStr = favoritesCookie.split('=')[1]
    return JSON.parse(decodeURIComponent(favoritesStr))
  } catch (error) {
    console.error('Error parsing favorites cookie:', error)
    return []
  }
}

export function setFavorites(favorites: string[]) {
  if (typeof window === 'undefined') return
  
  const favoritesStr = JSON.stringify(favorites)
  const encodedFavorites = encodeURIComponent(favoritesStr)
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1) // Кука на год
  
  document.cookie = `favorites=${encodedFavorites}; expires=${expires.toUTCString()}; path=/`
}

export function addToFavorites(id: string) {
  const favorites = getFavorites()
  if (!favorites.includes(id)) {
    setFavorites([...favorites, id])
  }
}

export function removeFromFavorites(id: string) {
  const favorites = getFavorites()
  setFavorites(favorites.filter(favId => favId !== id))
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
} 