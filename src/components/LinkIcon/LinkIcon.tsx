import React from "react";
import "./LinkIcon.scss";

// компонент для оборачивания чего либо в ссылку (не подойдет для многострочных компонентов)

interface ILinkIconProps {
    children?: React.ReactNode;
    title?: string;
    href?: string;
    addClassName?: string[];
}

type TProps = Readonly<ILinkIconProps>;

function LinkIcon({ children, title = "", href = "", addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "LinkIcon"].join(" ");
    return (
        <a className={componentClassName} href={href} title={title}>
            {children}
        </a>
    );
}

export { LinkIcon };
export type { ILinkIconProps };
