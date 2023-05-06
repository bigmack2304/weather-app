import React from "react";
import "./ButtonClose.scss";
import { IconClose } from "../../ui/IconClose";

interface IButtonCloseProps {
    clickCallback?: (e: React.MouseEvent) => void;
    addClassName?: string[];
}

type TProps = Readonly<IButtonCloseProps>;

function ButtonClose({ clickCallback = () => {}, addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "ButtonClose"].join(" ");
    return (
        <button className={componentClassName} onClick={clickCallback}>
            <IconClose />
        </button>
    );
}

export { ButtonClose };
