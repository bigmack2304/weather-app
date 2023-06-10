import React, { Fragment } from "react";
import { HomePage } from "../Home/Home";
import { store } from "../../redux/store";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { BasePageTemplate } from "../BasePageTemplate/BasePageTemplate";
import { NotCityFind } from "../NotCityFind/NotCityFind";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

// Корень всего приложения

function App() {
    return (
        <Fragment>
            <Provider store={store}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<BasePageTemplate />}>
                            <Route index element={<HomePage />} />
                            <Route path="/not_city_find" element={<NotCityFind />} />
                            <Route path="/search" element={<HomePage />} />
                            <Route path="/search/:city_name/:lat/:lon" element={<HomePage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </HashRouter>
            </Provider>
        </Fragment>
    );
}

export { App };
