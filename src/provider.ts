// import * as vscode from 'vscode';
// import { CssToUnocssProcess } from "./process";
// import * as nls from 'vscode-nls';

// //国际化支持
// const localize = nls.config({ messageFormat: nls.MessageFormat.both})();

// //实现代码提示
// export class CssToUnocssProvider implements vscode.CompletionItemProvider {

//     constructor(private process: CssToUnocssProcess) { }

//     provideCompletionItems (
//         document: vscode.TextDocument, 
//         position: vscode.Position, 
//         token: vscode.CancellationToken
//     ): Thenable<vscode.CompletionItem[]> {
//         return new Promise((resolve, reject) => {
// 	    let wordAtPosition = document.getWordRangeAtPosition(position);
//             var currentWord = '';
// 	    if (wordAtPosition && wordAtPosition.start.character < position.character) {
// 	        var word = document.getText(wordAtPosition);
// 		currentWord = word.substr(0, position.character - wordAtPosition.start.character);
// 	    }
//         debugger;
//         const res = this.process.convert(currentWord);
//         console.log({res});
//             if (!res) {
//                 return resolve([]);
//             }
            
//             //代码提示信息
//             const item = new vscode.CompletionItem(`${res.pxValue}px -> ${res.rpx}`, vscode.CompletionItemKind.Snippet);
//             // 要插入的文本
//             item.insertText = res.rpx;
//             item.detail = 'Value';
//             //国际化提示信息
//             let message = localize('ToUnocss.description', 
//             'Translate $0px to $1, you can set design base width in preferences settings.');
//             message = message.replace('$0', res.pxValue + '');
//             message = message.replace('$1', res.rpx + '');
//             item.documentation = `${message}`;
//             return resolve([item]);
//         });
//     }
// }
