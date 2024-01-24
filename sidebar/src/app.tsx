import NiceModal from '@ebay/nice-modal-react';
import { App, ConfigProvider } from 'antd';
import { ThemeProvider, createGlobalStyle } from 'antd-style';
import zhCN from 'antd/locale/zh_CN';

export function rootContainer(container: any) {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider
        getStaticInstance={(instances) => {
          window.message = instances.message;
          window.notification = instances.notification;
          window.modal = instances.modal;
        }}
        defaultThemeMode="dark"
        theme={(appearance) => {
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
    color: ${(p) => p.theme.colorPrimary};
    &:hover {
      color: ${(p) => p.theme.colorPrimaryHover};
    }
  }

  .ant-empty {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    background-color: ${(p) => p.theme.colorBgContainer};
  }

  .ant-pro-card {
    background-color: ${(p) => p.theme.colorBgContainer} !important;
  }

  .ant-pro-table {
    .ant-pro-card {
      background-color: ${(p) => p.theme.colorBgContainer} !important;
    }
    .ant-pro-card-body {
      padding-left: ${(p) => p.theme.padding}px !important;
      padding-right: ${(p) => p.theme.padding}px !important;
    }
    .ant-pro-query-filter {
      padding: ${(p) => p.theme.padding}px;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
