// Statistics.jsx
import StatisticLine from "./StatisticLine";

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <div>{"No feedback given"}</div>;
  }

  const total = good + neutral + bad;

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="Good :" value={good} />
          <StatisticLine text="Neutral :" value={neutral} />
          <StatisticLine text="Bad :" value={bad} />
          <tr>
            <td>All:</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td>Average:</td>
            <td>{total ? ((good - bad) / total).toFixed(2) : 0}</td>
          </tr>
          <tr>
            <td>Positive:</td>
            <td>{total ? ((good / total) * 100).toFixed(2) : 0} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
