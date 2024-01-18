import { getLocale, message, registerCommand } from '@vscode-use/utils'
import { stat, statSync } from 'fs';
import { window, type Disposable, type ExtensionContext } from 'vscode'

/**
 * 一旦你的插件激活了，这个方法就会被调用
 * 它只会在插件激活的时候执行一次
 * @param context 
 */
export async function activate(context: ExtensionContext) {
  const disposes: Disposable[] = [
    // 注册命令
    registerCommand('getFileState', (uri) => {
      // 文件路径
      const filePath = uri.path.substring(1);
      stat(filePath, (err, stats) => { 
        if (err) {
          window.showErrorMessage(err.message);
          return;
        }

        if (stats.isDirectory()) {
          window.showWarningMessage('这是一个文件夹，不是文件，请选择文件');
          return;
        }

        if (stats.isFile()) {
          const size = stats.size;
          const createTime = stats.birthtime.toLocaleString();
          const modifyTime = stats.mtime.toLocaleString();

          window.showInformationMessage(`
            文件大小：${size}B;
            创建时间：${createTime};
            修改时间：${modifyTime};
          `, { modal: true });
        }
      });

      const stats = statSync(filePath);
      console.log(stats, 'stats');
      console.log(stats.isDirectory(), 'isDirectory');
      console.log(stats.isFile(), 'isFile');
    }),
  ]
  const lan = getLocale()
  const isZh = lan.includes('zh')
  message.info(isZh ? '你好' : 'Hello')

  // 注册命令
  context.subscriptions.push(...disposes)
}

/**
 * 当你的插件被释放的时候，这个方法会被调用
 * 它只会在插件释放的时候执行一次
 */
export function deactivate() {

}
