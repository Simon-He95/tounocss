import { transfromCode } from 'transform-to-unocss'
import { getCssType, getMultipedUnocssText } from './utils'

export class CssToUnocssProcess {
  /**
       * transform px to rpx
       *
       * @param {string} code origin text
       * @return {string} transformed text
       */
  convert(text) {
    let _a
    return (_a = getMultipedUnocssText(text)) !== null && _a !== void 0 ? _a : text
  }

  /**
       * transform all px to rpx
       *
       * @param {string} code origin text
       * @return {string} transformed text
       */
  async convertAll(code, fileName) {
    let _a
    if (!code)
      return code
    const type = getCssType(fileName)
    const unocss = (_a = (await transfromCode(code, fileName, type))) !== null && _a !== void 0 ? _a : code
    return unocss
  }
}
