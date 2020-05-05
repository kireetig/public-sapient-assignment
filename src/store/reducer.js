const initialState = {
  news: [],
};

export const rootReducer = (state, action) => {
  if (action.type === 'UpdateNews') {
    return { ...state, news: action.payload };
  }
  return initialState;
};
