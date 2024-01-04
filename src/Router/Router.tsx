import react from "react";
import { Suspense, lazy } from "react";
import { createHashRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { BasePageTemplate } from "../pages/BasePageTemplate/BasePageTemplate";
import { LoadingPage } from "../pages/LoadingPage/LoadingPage";
import HomeProvider from "../HOC/HomeProvider/HomeProvider";
import HomePage from "../pages/Home/Home";

const NotCityFind = lazy(() => import("../pages/NotCityFind/NotCityFind"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));

const router = createHashRouter(
    createRoutesFromElements(
        <Route path="/" element={<BasePageTemplate />}>
            <Route index element={<Navigate to={"/search"} />} />
            <Route
                path="not_city_find"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <HomeProvider>
                            <NotCityFind />
                        </HomeProvider>
                    </Suspense>
                }
            />
            <Route
                path="search"
                element={
                    <HomeProvider>
                        <HomePage />
                    </HomeProvider>
                }
            />
            <Route
                path="search/:city_name/:lat/:lon"
                element={
                    <HomeProvider>
                        <HomePage />
                    </HomeProvider>
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
    )
);

export { router };
