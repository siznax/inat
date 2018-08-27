import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const OBSERVATIONS = [
  {"id": 123, "photo": '123-photo', "taxon": '123-name', "user": '123-user', "date": '123-date'},
  {"id": 456, "photo": '456-photo', "taxon": '456-name', "user": '456-user', "date": '456-date'},
  {"id": 789, "photo": '789-photo', "taxon": '789-name', "user": '789-user', "date": '789-date'}
];

ReactDOM.render(
  <App observations={OBSERVATIONS}/>,
  document.getElementById('root')
);
registerServiceWorker();
