import { matchRoutes } from 'react-router-config';
import Routes from '../Routes';

export const getParams = (path) => {
  const route = matchRoutes(Routes, path);
  const match = route[0].match;
  return match.params;
};
