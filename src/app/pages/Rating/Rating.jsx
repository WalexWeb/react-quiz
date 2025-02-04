import styles from "./Rating.module.scss";

function Rating() {
  document.title = "Викторина | Рейтинг";
  return (
    <div className={styles.window}>
      <h1 className={styles.header}>Рейтинг участников</h1>
      <p className={styles.caption}>Рейтинг по количеству набранных баллов</p>
      <div>
        <table className={styles.rating}>
          <thead>
            <tr>
              <th>#</th>
              <th>Команда</th>
              <th>Факультет</th>
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Reload</td>
              <td>ФПСОИБ</td>
              <td>300</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">8</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">9</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">10</th>
              <td>Творожки</td>
              <td>ФПСОПП</td>
              <td>200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rating;
