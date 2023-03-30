import React from "react";
import "./ButtonClose.scss";
import { IconClose } from "../../ui/IconClose";

interface IButtonCloseProps {
    clickCallback?: (e: React.MouseEvent) => void;
}

type TProps = Readonly<IButtonCloseProps>;

function ButtonClose({ clickCallback = () => {} }: TProps) {
    return (
        <button className="ButtonClose" onClick={clickCallback}>
            <IconClose />
        </button>
    );
}

export { ButtonClose };
