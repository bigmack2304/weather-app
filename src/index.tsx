import React from "react";
import ReactDOM from "react-dom/client";

import "./global_styles/normalize.css";
import "./global_styles/def_styles.css";

import { App } from "./pages/App/App";

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
);

// Если вы хотите начать измерять производительность в своем приложении, передайте функцию
// для регистрации результатов (например: отчет о веб-показателях жизнедеятельности (console.log))
// или отправить на конечную точку analytics. Узнайте больше: https://bit.ly/CRA-vitals
// reportWebVitals();
