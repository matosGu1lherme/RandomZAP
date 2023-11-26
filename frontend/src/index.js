import { createRoot } from 'react-dom/client';
import App from "./App";
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.querySelector("#root"));

root.render(<App/>);

serviceWorker.unregister();

