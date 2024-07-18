// src/actions/anecdoteActions.js

const generateId = () => (100000 * Math.random()).toFixed(0);

export const voteAnecdote = (id) => {
  return {
    type: "VOTE_ANECDOTE",
    payload: { id },
  };
};

export const addAnecdote = (content) => {
  return {
    type: "ADD_ANECDOTE",
    payload: {
      content,
      id: generateId(),
      votes: 0,
    },
  };
};
