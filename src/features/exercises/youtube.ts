const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
])

export const getYoutubeVideoId = (urlValue: string): string | null => {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(urlValue)
  } catch {
    return null
  }

  if (!YOUTUBE_HOSTS.has(parsedUrl.hostname)) {
    return null
  }

  if (parsedUrl.hostname.includes('youtu.be')) {
    const [videoId] = parsedUrl.pathname.split('/').filter(Boolean)
    return videoId ?? null
  }

  if (parsedUrl.pathname === '/watch') {
    return parsedUrl.searchParams.get('v')
  }

  if (parsedUrl.pathname.startsWith('/shorts/')) {
    const [, , videoId] = parsedUrl.pathname.split('/')
    return videoId ?? null
  }

  return null
}

export const isYoutubeUrl = (urlValue: string): boolean => getYoutubeVideoId(urlValue) != null

export const getYoutubeEmbedUrl = (urlValue: string): string | null => {
  const videoId = getYoutubeVideoId(urlValue)

  if (videoId == null || videoId.length === 0) {
    return null
  }

  return `https://www.youtube.com/embed/${videoId}`
}
