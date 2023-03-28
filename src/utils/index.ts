import { toUnocss } from 'transform-to-unocss'

export type CssType = 'less' | 'scss' | 'css' | 'stylus'
export function getCssType(filename: string) {
  const data = filename.split('.')
  const ext = data.pop()!
  const result = ext === 'styl' ? 'stylus' : ext
  return result as CssType
}

export function getMultipedUnocssText(text: string) {
  const selectedTexts = text.split(';')
  let isChanged = false
  const selectedNewTexts = []
  for (let i = 0; i < selectedTexts.length; i++) {
    const text = selectedTexts[i]
    const newText = toUnocss(text) ?? text
    if (!isChanged)
      isChanged = newText !== text
    selectedNewTexts.push(newText)
  }
  // 没有存在能够转换的元素
  if (!isChanged)
    return

  const selectedUnocssText = selectedNewTexts.join(' ')
  return selectedUnocssText
}
