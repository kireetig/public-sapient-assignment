import React from 'react';
import { Home } from './pages/Home/Home';

export default [
    {
        path: '/:pageNumber/page',
        component: Home,
        exact: true,
        // loadData: () => getSomeData()
    }
]