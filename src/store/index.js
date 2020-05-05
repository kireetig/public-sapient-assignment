import { rootReducer } from './reducer';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const configureStore = () => {
  const initialState = {};
  const middleware = [thunk];

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );

  return store;
};

export default configureStore;
