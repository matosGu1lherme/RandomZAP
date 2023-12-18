// import { createRoot } from 'react-dom/client';
// import App from "./App";
// import * as serviceWorker from './serviceWorker';

// const root = createRoot(document.querySelector("#root"));

// root.render(<App/>);

// serviceWorker.unregister();

import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import ReactDOM from 'react-dom';
import '../src/pages/Home/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

