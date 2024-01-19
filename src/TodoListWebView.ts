import path from 'node:path';
import { type CancellationToken, type ExtensionContext, Uri, type WebviewView, type WebviewViewProvider, type WebviewViewResolveContext, window, WebviewPanel } from 'vscode'

export class TodoListWebView implements WebviewViewProvider {
  public static viewId = 'todolist-view'

  constructor(
    private readonly context: ExtensionContext,
  ) {
    // ...
  }

  // 追踪当前webview面板
  private currentPanel: WebviewPanel | undefined = undefined;

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
    }

    const cssUri = webviewView.webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'assets', 'source', 'index.css'))
    const scriptUri = webviewView.webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'assets', 'source', 'index.js'))

    webviewView.webview.html = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>todolist</title>
          <link href="${cssUri}" rel="stylesheet"/>
        </head>
        <body>
          <div>
            <ul id="list">

            </ul>
            <div>
              <input id="input" placeholder="请输入"/>
              <button id="add">添加</button>
            </div>
          </div>
          <script src="${scriptUri}"></script>
        </body>
      </html>
    `

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'alert':
          window.showInformationMessage(message.text)
          break;

        case 'webview':
          // 判断currentPanel是否有值
          if (this.currentPanel) {
            const columnToShowIn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;
            // 如果有的话，就显示，然后激活
            this.currentPanel.reveal(columnToShowIn)
          } else {
            // 如果没有的话，就创建一个新的webview
            this.createWebviewPanel()
          }
          break;

        default:
          break
      }
    })
  }

  createWebviewPanel() {
    // 创建一个webviewPanel
    this.currentPanel = window.createWebviewPanel(
      'webview',
      'webview',
      { viewColumn: 1, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    this.currentPanel.iconPath = Uri.file(
      path.join(this.context.extensionPath, 'assets', 'icon.svg')
    )
    this.currentPanel.webview.html = this.getUmiContent();
  }

  /**
   * 获取基于umijs的webview内容
   * @returns string
   */
  getUmiContent() {
    const getDiskPath = (filename: string) => {
      return this.currentPanel?.webview.asWebviewUri(
        Uri.file(
          path.join(this.context.extensionPath, 'web', 'build', filename)
        )
      )
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link rel="shortcut icon" href="/favicon.png">
          <title>swagger2page</title>
          <link rel="stylesheet" href="${getDiskPath('umi.css')}">
        </head>
        <body>
          <div id="root"></div>
          <script src="${getDiskPath('umi.js')}"></script>
        </body>
      </html>
    `;
  }
}
