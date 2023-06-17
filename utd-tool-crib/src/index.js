import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

// const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
// const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

