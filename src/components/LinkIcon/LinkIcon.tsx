import React from "react";
import "./LinkIcon.scss";

// компонент для оборачивания чего либо в ссылку (не подойдет для многострочных компонентов)

interface ILinkIconProps {
    children?: React.ReactNode;
    title?: string;
    href?: string;
}

type TProps = Readonly<ILinkIconProps>;

function LinkIcon({ children, title = "", href = "" }: TProps) {
    return (
        <a className="LinkIcon" href={href} title={title}>
            {children}
        </a>
    );
}

export { LinkIcon };
export type { ILinkIconProps };
