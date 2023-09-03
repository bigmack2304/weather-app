import React from "react";
import "./Footer.scss";
import { LinkIcon } from "../LinkIcon/LinkIcon";
import { IconGitHub } from "../../ui/IconGitHub";
import { IconOpenWeather } from "../../ui/IconOpenWeather";
import { IconTwoGis } from "../../ui/IconTwoGis";
import { IconChart } from "../../ui/IconChart";

interface IFooterProps {
    children?: React.ReactNode;
}

type TProps = Readonly<IFooterProps>;

function defaultFooterContent() {
    return (
        <>
            <LinkIcon title="Страница проекта на GitHub" href="https://github.com/bigmack2304/weather-app">
                <IconGitHub addClassName={["Icon"]} />
            </LinkIcon>
            <LinkIcon title="Open weather API" href="https://openweathermap.org/">
                <IconOpenWeather addClassName={["Icon"]} />
            </LinkIcon>
            <LinkIcon title="Recharts" href="https://recharts.org/en-US/">
                <IconChart addClassName={["Icon"]} />
            </LinkIcon>
            <LinkIcon title="2Gis" href="https://info.2gis.com/" addClassName={["Footer__icon2gis"]}>
                <IconTwoGis addClassName={["Icon"]} />
            </LinkIcon>
        </>
    );
}

function Footer({ children }: TProps) {
    const footerContent = children ? children : defaultFooterContent();
    return <footer className="Footer">{footerContent}</footer>;
}

export { Footer };
export type { IFooterProps };
