import React from "react";
import "./Footer.scss";
import { LinkIcon } from "../LinkIcon/LinkIcon";
import { IconGitHub } from "../../ui/IconGitHub";

interface IFooterProps {
    children?: React.ReactNode;
}

type TProps = Readonly<IFooterProps>;

function defaultFooterContent() {
    return (
        <LinkIcon title="Страница проекта на GitHub" href="https://github.com/bigmack2304/weather-app">
            <IconGitHub addClassName={["Icon"]} />
        </LinkIcon>
    );
}

function Footer({ children }: TProps) {
    const footerContent = children ? children : defaultFooterContent();
    return <footer className="Footer">{footerContent}</footer>;
}

export { Footer };
export type { IFooterProps };
