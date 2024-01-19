import NiceModal from '@ebay/nice-modal-react';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { createGlobalStyle, ThemeProvider } from 'antd-style';

import { getTabMapping } from './constant';

export const tabsLayout = {
  local: getTabMapping(),
};

export function rootContainer(container: any) {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider
        getStaticInstance={instances => {
          window.message = instances.message;
          window.notification = instances.notification;
          window.modal = instances.modal;
        }}
        defaultThemeMode="light"
        theme={appearance => {
          if (appearance === 'dark') {
            return {
              token: {
                wireframe: false,
              },
            };
          }
          return {
            token: {
              wireframe: false,
            },
          };
        }}
      >
        <App style={{ height: '100%' }}>
          <NiceModal.Provider>
            <Global />
            {container}
          </NiceModal.Provider>
        </App>
      </ThemeProvider>
    </ConfigProvider>
  );
}

const Global = createGlobalStyle`
  a {
    color: ${p => p.theme.colorPrimary};
    &:hover {
      color: ${p => p.theme.colorPrimaryHover};
    }
  }

  .runtime-keep-alive-tabs-layout {
    background-color: ${p => p.theme.colorBgContainer};
    border-radius: 8px 8px 0 0;

    .ant-tabs {
      .ant-tabs-nav-list {
        .ant-tabs-tab {
          background-color: ${p => p.theme.colorBgElevated};
        }
      }
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

