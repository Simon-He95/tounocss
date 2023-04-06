import * as vscode from 'vscode'
import { CssToUnocssProcess } from './process'
import { getMultipedUnocssText } from './utils'
// 'use strict'

// let config = null
// 插件被激活时调用activate
export function activate(context: vscode.ExtensionContext) {
  // config = vscode.workspace.getConfiguration('to-unocss')
  const process = new CssToUnocssProcess()
  const LANS = ['html', 'vue', 'swan', 'wxml', 'axml', 'css', 'wxss', 'acss', 'less', 'scss', 'sass', 'stylus', 'wxss', 'acss']

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

      const selection = editor.selection
      const wordRange = new vscode.Range(selection.start, selection.end)
      const range = document.getWordRangeAtPosition(position)
      const word = document.getText(range)
      // 获取当前选中的文本内容
      const selectedText = editor.document.getText(wordRange) || word
      if (!selectedText || !/[\w\-]+:/.test(selectedText))
        return
      const selectedUnocssText = getMultipedUnocssText(selectedText)
      if (!selectedUnocssText)
        return

      const md = new vscode.MarkdownString()
      md.appendMarkdown(`ToUnocss: <span style="color:green">${selectedUnocssText}</span>\n`)

      return new vscode.Hover(md)
    },
  })

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
