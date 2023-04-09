import { toUnocss } from 'transform-to-unocss'

export function getCssType(filename) {
  const data = filename.split('.')
  const ext = data.pop()
  const result = ext === 'styl' ? 'stylus' : ext
  return result
}
export function getMultipedUnocssText(text) {
  let _a
  const selectedTexts = text.split(';').filter(i => i !== '"')
  let isChanged = false
  const selectedNewTexts = []
  for (let i = 0; i < selectedTexts.length; i++) {
    const text = selectedTexts[i]
    const newText = (_a = toUnocss(text)) !== null && _a !== void 0 ? _a : text
    if (!newText)
      continue
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
