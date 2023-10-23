import React from "react";
import "./Button.scss";

interface IButtonProps {
    clickCallback?: (e: React.MouseEvent) => void;
    addClassName?: string[];
    children: React.ReactNode;
}

type TProps = Readonly<IButtonProps>;

function Button({ clickCallback = () => {}, addClassName = [""], children }: TProps) {
    let componentClassName = [...addClassName, "Button"].join(" ");
    return (
        <button className={componentClassName} onClick={clickCallback}>
            {children}
        </button>
    );
}

export { Button };
