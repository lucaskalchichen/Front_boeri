import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import CotizadorAutos from './CotizadorAutos';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CotizadorAutos />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;