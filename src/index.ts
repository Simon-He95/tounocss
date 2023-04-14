import * as vscode from 'vscode'
import { CssToUnocssProcess } from './process'
import { getMultipedUnocssText } from './utils'
// 'use strict'

// let config = null
// 插件被激活时调用activate
export function activate(context: vscode.ExtensionContext) {
  const styleReg = /style="([^"]+)"/
  const { dark, light } = vscode.workspace.getConfiguration('to-unocss')
  const process = new CssToUnocssProcess()
  const LANS = ['html', 'vue', 'svelte', 'swan', 'wxml', 'axml', 'css', 'wxss', 'acss', 'less', 'scss', 'sass', 'stylus', 'wxss', 'acss']
  // style
  const style = {
    dark: Object.assign({
      textDecoration: 'underline',
      backgroundColor: 'rgba(144, 238, 144, 0.5)',
      color: 'black',
    }, dark),
    light: Object.assign({
      textDecoration: 'underline',
      backgroundColor: 'rgba(255, 165, 0, 0.5)',
      color: '#ffffff',
    }, light),
  }
  const decorationType = vscode.window.createTextEditorDecorationType(style)

  // 注册ToUnocss命令
  vscode.commands.registerTextEditorCommand('extension.ToUnocss', async (textEditor) => {
    const doc = textEditor.document
    const fileName = doc.fileName
    const start = new vscode.Position(0, 0)
    const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length)
    // 获取全部文本区域
    const selection = new vscode.Range(start, end)
    const text = doc.getText(selection)
    // 替换文件内容
    const newSelection = await process.convertAll(text, fileName)

    textEditor.edit((builder) => {
      builder.replace(selection, newSelection)
    })
  })

  // 注册InlineStyleToUnocss命令
  const disposable = vscode.commands.registerTextEditorCommand('extension.InlineStyleToUnocss', async (textEditor) => {
    const doc = textEditor.document
    let selection: vscode.Selection | vscode.Range = textEditor.selection
    // 获取选中区域
    if (selection.isEmpty) {
      const start = new vscode.Position(0, 0)
      const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length)
      selection = new vscode.Range(start, end)
    }
    const text = doc.getText(selection)
    const newSelection = await process.convert(text)
    // 替换文件内容
    textEditor.edit((builder) => {
      builder.replace(selection, newSelection)
    })
  })

  // 注册hover事件
  vscode.languages.registerHoverProvider(LANS, {
    provideHover(document, position) {
      // 获取当前选中的文本范围
      const editor = vscode.window.activeTextEditor
      if (!editor)
        return
      // 移除样式
      vscode.window.activeTextEditor?.setDecorations(decorationType, [])
      const selection = editor.selection
      const wordRange = new vscode.Range(selection.start, selection.end)
      let selectedText = editor.document.getText(wordRange)
      const realRangeMap: any = []
      if (!selectedText) {
        const range = document.getWordRangeAtPosition(position) as any
        let word = document.getText(range)
        const line = range.c.c
        const lineNumber = position.line
        const lineText = document.lineAt(lineNumber).text
        const styleMatch = word.match(styleReg)
        if (styleMatch) {
          word = styleMatch[1]
          const index = styleMatch.index!
          realRangeMap.push({
            content: styleMatch[0],
            range: new vscode.Range(
              new vscode.Position(line, index!),
              new vscode.Position(line, index! + styleMatch[1].length),
            ),
          })
        }
        else {
          // 可能存在多项，查找离range最近的
          const wholeReg = new RegExp(`([\\w\\-]+\\s*:\\s*)?([\\w\\-\\[\\(\\!]+)?${word}(:*\\s*[^";\\/>]+)?`, 'g')
          for (const match of lineText.matchAll(wholeReg)) {
            const { index } = match
            const pos = index! + match[0].indexOf(word)
            if (pos === range?.c?.e) {
              word = match[0]
              realRangeMap.push({
                content: match[0],
                range: new vscode.Range(
                  new vscode.Position(line, index!),
                  new vscode.Position(line, index! + match[0].length),
                ),
              })
              break
            }
          }
        }
        selectedText = word
      }

      // 获取当前选中的文本内容
      if (!selectedText || !/[\w\-]+\s*:/.test(selectedText))
        return
      const selectedUnocssText = getMultipedUnocssText(selectedText)
      if (!selectedUnocssText)
        return

      // 增加decorationType样式
      editor.edit(() => editor.setDecorations(decorationType, realRangeMap.map((item: any) => item.range)))

      const md = new vscode.MarkdownString()
      md.isTrusted = true
      md.supportHtml = true
      md.appendMarkdown('<a href="https://github.com/Simon-He95/tounocss">To Unocss:</a>\n')
      md.appendCodeblock(selectedUnocssText, 'js')
      return new vscode.Hover(md)
    },
  })

  // 监听编辑器选择内容变化的事件
  vscode.window.onDidChangeTextEditorSelection(() => vscode.window.activeTextEditor?.setDecorations(decorationType, []))

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }
