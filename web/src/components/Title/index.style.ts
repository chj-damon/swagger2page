import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    title: css`
      color: ${token.colorTextBase};
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      display: flex;
      align-items: center;

      &::before {
        content: ' ';
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 4px;
        background-color: ${token.colorPrimary};
      }
    `,
  };
});
