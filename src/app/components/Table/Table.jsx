import styles from './Table.module.scss'

function Table() {
  return (
<table className={styles.rating}>
          <thead>
            <tr>
              <th>#</th>
              <th>Команда</th>
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Reload</td>
              <td>300</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">8</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">9</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
            <tr>
              <th scope="row">10</th>
              <td>Творожки</td>
              <td>200</td>
            </tr>
          </tbody>
        </table>
  )
}

export default Table