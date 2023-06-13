import React, { Fragment, lazy, Suspense } from "react";
import { store } from "../../redux/store";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { BasePageTemplate } from "../BasePageTemplate/BasePageTemplate";
import { LoadingPage } from "../LoadingPage/LoadingPage";

// Корень всего приложения

function App() {
    const NotCityFind = lazy(() => import("../NotCityFind/NotCityFind"));
    const NotFoundPage = lazy(() => import("../NotFoundPage/NotFoundPage"));
    const HomePage = lazy(() => import("../Home/Home"));
    const HomeProvider = lazy(() => import("../../HOC/HomeProvider/HomeProvider"));

    return (
        <Fragment>
            <Provider store={store}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<BasePageTemplate />}>
                            <Route index element={<Navigate to={"/search"} />} />
                            <Route
                                path="not_city_find"
                                element={
                                    <Suspense fallback={<LoadingPage />}>
                                        <NotCityFind />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="search"
                                element={
                                    <Suspense fallback={<LoadingPage />}>
                                        <HomeProvider>
                                            <HomePage />
                                        </HomeProvider>
                                    </Suspense>
                                }
                            />
                            <Route
                                path="search/:city_name/:lat/:lon"
                                element={
                                    <Suspense fallback={<LoadingPage />}>
                                        <HomeProvider>
                                            <HomePage />
                                        </HomeProvider>
                                    </Suspense>
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <Suspense fallback={<LoadingPage />}>
                                        <NotFoundPage />
                                    </Suspense>
                                }
                            />
                        </Route>
                    </Routes>
                </HashRouter>
            </Provider>
        </Fragment>
    );
}

export { App };
