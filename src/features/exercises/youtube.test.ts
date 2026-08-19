import { describe, expect, it } from 'vitest'

import { getYoutubeEmbedUrl, getYoutubeVideoId, isYoutubeUrl } from './youtube'

describe('youtube utils', () => {
  it('supports youtube watch urls', () => {
    const url = 'https://www.youtube.com/watch?v=N2hvV6tvZ2w'
    expect(getYoutubeVideoId(url)).toBe('N2hvV6tvZ2w')
    expect(isYoutubeUrl(url)).toBe(true)
  })

  it('supports youtu.be urls', () => {
    const url = 'https://youtu.be/N2hvV6tvZ2w'
    expect(getYoutubeVideoId(url)).toBe('N2hvV6tvZ2w')
  })

  it('supports youtube shorts urls', () => {
    const url = 'https://www.youtube.com/shorts/N2hvV6tvZ2w'
    expect(getYoutubeVideoId(url)).toBe('N2hvV6tvZ2w')
    expect(getYoutubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/N2hvV6tvZ2w')
  })
})
