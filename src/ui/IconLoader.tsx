import React from "react";
import "./IconLoader.scss";

interface IiconLoaderProps {
    addClassName?: string[];
}

type TProps = Readonly<IiconLoaderProps>;

function IconLoader({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconLoader"].join(" ");
    return (
        <div className={componentClassName}>
            <div className="IconLoader__holder">
                <div className="IconLoader__preloader">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export { IconLoader };
