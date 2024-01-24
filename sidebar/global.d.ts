import '@umijs/max/typings';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

declare global {
  interface Window {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: Omit<ModalStaticFunctions, 'warn'>;
  }
}
