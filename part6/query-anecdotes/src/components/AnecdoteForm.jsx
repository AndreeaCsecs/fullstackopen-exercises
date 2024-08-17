import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));

      dispatch({
        type: "SET_NOTIFICATION",
        payload: `New anecdote '${newAnecdote.content}' created!`,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
    onError: (error) => {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: `Error: ${error.response.data.error}`,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    if (content.length < 5) {
      alert("Anecdote content must be at least 5 characters long.");
      return;
    }

    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
