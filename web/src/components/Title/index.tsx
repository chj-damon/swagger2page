import { useStyles } from './index.style';

export default (props: { text: string }) => {
  const { styles } = useStyles();

  return <div className={styles.title}>{props.text}</div>;
};
