import { toUnocss, transfromCode } from 'transform-to-unocss'
import { getCssType } from './utils'
export class CssToUnocssProcess {
  /**
     * transform px to rpx
     *
     * @param {string} code origin text
     * @return {string} transformed text
     */
  convert(text: string) {
    return toUnocss(text) ?? text
  }

  /**
     * transform all px to rpx
     *
     * @param {string} code origin text
     * @return {string} transformed text
     */
  async convertAll(code: string, fileName: string): Promise<string> {
    if (!code)
      return code
    const type = getCssType(fileName)
    const unocss = (await transfromCode(code, fileName, type as any)) ?? code
    return unocss
  }
}
