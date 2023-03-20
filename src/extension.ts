// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import { CssRpxProcess } from './process';
import { CssRpxProvider } from './provider';

let config = null;
// 插件被激活时调用activate
export function activate(context: vscode.ExtensionContext) {
    config = vscode.workspace.getConfiguration("px-to-rpx");
    const process = new CssRpxProcess();
    let provider = new CssRpxProvider(process);
    const LANS = ['html', 'vue', "swan", "wxml", "axml", 'css', "wxss", "acss", 'less', 'scss', 'sass', 'stylus', 'wxss', 'acss'];
    for (let lan of LANS) {
        //为对应类型文件添加代码提示
        let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
        context.subscriptions.push(providerDisposable);
    }
     
    //注册px2rpx命令
    vscode.commands.registerTextEditorCommand('extension.px2rpx', async(textEditor, edit) => {
        const doc = textEditor.document;
        const fileName = doc.fileName;
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
        //获取全部文本区域
        const selection = new vscode.Range(start, end);
        let text = doc.getText(selection);
        //替换文件内容
        const newSelection = await process.convertAll(text,fileName);

        textEditor.edit( builder => {
            builder.replace(selection, newSelection);
        });
    });
    
    //注册px2rpxInSelection命令
    let disposable = vscode.commands.registerTextEditorCommand('extension.px2rpxInSelection', async (textEditor, edit) => {
        const doc = textEditor.document;
        let selection: vscode.Selection | vscode.Range = textEditor.selection;
        //获取选中区域
        if (selection.isEmpty) {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            selection = new vscode.Range(start, end);
        }
        
        let text = doc.getText(selection);
        const newSelection = await process.convert(text);
        //替换文件内容
        textEditor.edit(builder => {
            builder.replace(selection,newSelection );
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
