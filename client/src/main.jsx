import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
const { VITE_APOLLO_CLIENT_GRAPHQL_URI } = import.meta.env;
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css'


const client = new ApolloClient({
  uri: VITE_APOLLO_CLIENT_GRAPHQL_URI || 'http://localhost:3002/api/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
