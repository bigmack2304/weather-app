import React, { Fragment } from "react";
import { HomePage, HomePage_memo } from "../Home/Home";
import { store } from "../../redux/store";
import { Provider } from "react-redux";

// Корень всего приложения

function App() {
    return (
        <Fragment>
            <Provider store={store}>
                <HomePage></HomePage>
            </Provider>
        </Fragment>
    );
}

export { App };
