import styles from './Input.module.scss'

function Input(props) {
  return (
    <input {...props} className={styles.inpt}></input>
  )
}

export default Input