export type CssType = 'less' | 'scss' | 'css' | 'stylus';
export function getCssType(filename: string) {
  const data = filename.split('.');
  const ext = data.pop()!;
  const result = ext === 'styl' ? 'stylus' : ext;
  return result as CssType;
}
