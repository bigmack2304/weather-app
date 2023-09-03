import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { PortalVieport } from "../../components/PortalVieport/PortalVieport";
import "./BasePageTemplate.scss";

// Корень всего приложения

function BasePageTemplate() {
    return (
        <>
            <div className="BasePageTemplate">
                <Header />
                <main className="BasePageTemplate__main">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <PortalVieport />
        </>
    );
}

export { BasePageTemplate };
