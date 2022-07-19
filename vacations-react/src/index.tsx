import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Layout from './components/Layout/Layout';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer position="top-center"/>
    <Layout />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
