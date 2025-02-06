import styles from "./Button.module.scss";
import { m } from "framer-motion";

function Button({ children, disabled, onClick }) {
  return (
    <m.button
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      className={styles.btn}
    >
      {children}
    </m.button>
  );
}

export default Button;
