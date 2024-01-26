import {
  Uri,
  Webview,
  WebviewPanel,
  window,
  workspace,
  type ExtensionContext,
  type WebviewView,
  type WebviewViewProvider,
} from 'vscode';
import { generateFileByTemplate, getApiInfo } from './utils/generate';
import { parseOpenapi } from './utils/openapi';

export class SidebarWebView implements WebviewViewProvider {
  public static viewId = 'swagger2page-view';

  constructor(private readonly context: ExtensionContext) {
    // ...
  }

  // 追踪当前webview面板
  private currentPanel: WebviewPanel | undefined = undefined;

  // 追踪当前选中的接口
  private selectedContent: OpenAPIPathMapValue | undefined = undefined;

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    const buildFolder = ['sidebar', 'build'];
    const cssUri = this.getDiskPath(
      webviewView.webview,
      'umi.css',
      buildFolder,
    );
    const jsUri = this.getDiskPath(webviewView.webview, 'umi.js', buildFolder);

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        Uri.joinPath(this.context.extensionUri, ...buildFolder),
      ],
    };
    webviewView.webview.html = this.getWebviewContent(cssUri, jsUri);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        // sidebar的webview已经初始化好，这个时候在vscode侧开始做openapi的解析
        case 'init':
          const result = await parseOpenapi();
          webviewView.webview.postMessage({
            type: 'init',
            data: result,
          });
          break;

        case 'alert':
          window.showInformationMessage(message.text);
          break;

        case 'webview':
          console.log(message.data);
          this.selectedContent = message.data;
          // 判断currentPanel是否有值
          if (this.currentPanel) {
            const columnToShowIn = window.activeTextEditor
              ? window.activeTextEditor.viewColumn
              : undefined;
            // 如果有的话，就显示，然后激活
            this.currentPanel.reveal(columnToShowIn);
          } else {
            // 如果没有的话，就创建一个新的webview
            this.createWebviewPanel();
          }
          break;

        default:
          break;
      }
    });
  }

  // 创建一个webviewPanel
  createWebviewPanel() {
    const buildFolder = ['web', 'build'];

    this.currentPanel = window.createWebviewPanel(
      'webview',
      'webview',
      { viewColumn: 1, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          Uri.joinPath(this.context.extensionUri, ...buildFolder),
        ],
      },
    );

    const cssUri = this.getDiskPath(
      this.currentPanel!.webview,
      'umi.css',
      buildFolder,
    );
    const jsUri = this.getDiskPath(
      this.currentPanel!.webview,
      'umi.js',
      buildFolder,
    );
    this.currentPanel.iconPath = Uri.joinPath(
      this.context.extensionUri,
      'assets',
      'icon.svg',
    );
    this.currentPanel.webview.html = this.getWebviewContent(cssUri, jsUri);

    this.currentPanel.onDidDispose(() => {
      this.currentPanel = undefined;
      this.selectedContent = undefined;
    });

    this.currentPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'init':
          // 在webview初始化成功之后，把选中的某个接口的数据传递过去
          this.currentPanel!.webview.postMessage({
            type: 'init',
            data: this.selectedContent,
          });
          break;

        case 'generate':
          const workspaceFolderUri = workspace.workspaceFolders
            ? workspace.workspaceFolders[0].uri
            : undefined;

          const uris = await window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            title: '选择生成目录',
            openLabel: '选择',
            // defaultUri取插件所在项目的根目录
            defaultUri: workspaceFolderUri
              ? Uri.joinPath(workspaceFolderUri, 'src')
              : undefined,
          });
          if (uris && uris.length > 0) {
            const selectedFilePath = uris[0].fsPath;
            // 开始根据message.data，以及对应的template，生成文件
            try {
              const templatePath = Uri.joinPath(
                this.context.extensionUri,
                'src',
                'templates',
              ).fsPath;

              const apiImportPath = await getApiInfo(
                this.selectedContent?.path,
              );

              const filePath = generateFileByTemplate(
                selectedFilePath,
                templatePath,
                message.data,
                apiImportPath,
                this.selectedContent?.requestName,
              );
              if (!filePath) {
                window.showErrorMessage('生成失败');
              } else {
                window.showInformationMessage('生成成功');
                // vscode打开这个刚刚生成的文件
                const openPath = Uri.file(filePath);
                window.showTextDocument(openPath);
              }
            } catch (error) {
              console.error(error);
              window.showErrorMessage((error as unknown as Error).message);
            }
          }

        default:
          break;
      }
    });
  }

  /**
   * 获取基于umijs的webview内容
   * @returns string
   */
  getWebviewContent(cssUri?: Uri, jsUri?: Uri) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>swagger2page</title>
          <link rel="stylesheet" href="${cssUri}">
        </head>
        <body>
          <div id="root"></div>
          <script src="${jsUri}"></script>
        </body>
      </html>
    `;
  }

  getDiskPath(webview: Webview, filename: string, folders: string[]) {
    return webview.asWebviewUri(
      Uri.joinPath(this.context.extensionUri, ...folders, filename),
    );
  }
}
