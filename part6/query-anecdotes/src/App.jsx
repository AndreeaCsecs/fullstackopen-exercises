import { useQuery } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes } from "./requests";

const App = () => {
  // Fetch anecdotes using useQuery
  const {
    data: anecdotes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false, // Optional: Disable retries on failure
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return (
      <div>Anecdote service not available due to problems in the server</div>
    );
  }

  const handleVote = (anecdote) => {
    console.log("vote", anecdote);
  };

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
