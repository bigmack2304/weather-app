import React, { useEffect } from "react";
import { useAppStoreSelector } from "../../redux/redux_hooks";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const { cityName, lat, lon } = useAppStoreSelector((state) => state.weatherGeo);
    const routerNavigate = useNavigate();

    useEffect(() => {
        if (cityName && lat && lon) {
            routerNavigate("/search");
        }
    }, [cityName, lat, lon]);

    return <div style={{ marginTop: "40px", fontSize: "34px", fontWeight: "bold", textAlign: "center" }}>404</div>;
}
export { NotFoundPage };
