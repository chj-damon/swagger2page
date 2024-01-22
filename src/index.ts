import { message } from '@vscode-use/utils';
import { type Disposable, type ExtensionContext, window } from 'vscode';
import { SidebarWebView } from './SidebarWebView';

/**
 * 一旦你的插件激活了，这个方法就会被调用
 * 它只会在插件激活的时候执行一次
 * @param context
 */
export async function activate(context: ExtensionContext) {
  message.info('插件已激活');
  const sidebarWebView = new SidebarWebView(context);

  const disposes: Disposable[] = [
    window.registerWebviewViewProvider(SidebarWebView.viewId, sidebarWebView),
  ];

  // 注册命令
  context.subscriptions.push(...disposes);
}

/**
 * 当你的插件被释放的时候，这个方法会被调用
 * 它只会在插件释放的时候执行一次
 */
export function deactivate() {}
