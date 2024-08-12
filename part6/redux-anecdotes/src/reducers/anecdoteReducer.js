// src/reducers/anecdoteReducer.js

import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";
import { setNotificationWithTimeout } from "./notificationReducer";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    voteAnecdote(state, action) {
      const id = action.payload.id;
      const anecdoteToVote = state.find((anecdote) => anecdote.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes = action.payload.votes;
      }
    },
  },
});

export const { setAnecdotes, addAnecdote, voteAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
    dispatch(setNotificationWithTimeout(`Added anecdote '${content}'`, 5));
  };
};

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToVote = getState().anecdotes.find((a) => a.id === id);
    const updatedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1,
    };
    const updatedAnecdoteFromServer = await anecdoteService.update(
      updatedAnecdote
    );
    dispatch(voteAnecdote(updatedAnecdoteFromServer));
    dispatch(
      setNotificationWithTimeout(
        `You voted for '${updatedAnecdote.content}'`,
        5
      )
    );
  };
};

export default anecdoteSlice.reducer;
