import { Home } from './pages/Home/Home';
import { getNews } from './store/actions';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: (store) => store.dispatch(getNews(0)),
  },
  {
    path: '/:pageNumber/page',
    component: Home,
    exact: true,
    loadData: (store, match) => {
      return store.dispatch(getNews(match.params.pageNumber));
    },
  },
];
