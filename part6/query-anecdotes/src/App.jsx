import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, updateAnecdote } from "./requests";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const {
    data: anecdotes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  });

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      );

      dispatch({
        type: "SET_NOTIFICATION",
        payload: `Anecdote '${updatedAnecdote.content}' voted!`,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
  });

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    voteMutation.mutate(updatedAnecdote);
  };

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return (
      <div>Anecdote service not available due to problems in the server</div>
    );
  }

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
