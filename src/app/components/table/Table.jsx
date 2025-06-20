import styles from "./Table.module.scss";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";

const fetchUsers = async () => {
  try {
    const data = await instance.get("/users/");
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

function Table() {
  const { data: users, isLoading } = useQuery(["users"], fetchUsers);
  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }

  const formattedUsers = users.map((u) => ({
    score: u.score,
    username: u.username,
  }));

  const scoreSortedUsers = formattedUsers
    ? [...formattedUsers].sort((a, b) => b.score - a.score)
    : [];

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
        {scoreSortedUsers.map((user, index) => (
          <tr key={index}>
            <th>{index + 1}</th>
            <td>{user.username}</td>
            <td>{user.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default Table;
