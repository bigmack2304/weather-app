import React from "react";
import "./NotFoundPage.scss";

function NotFoundPage() {
    return (
        <div className="NotFoundPage">
            <span className="NotFoundPage__404">404</span>
            <br />
            <span className="NotFoundPage__info">Такой страницы не существует.</span>
        </div>
    );
}
export { NotFoundPage };
