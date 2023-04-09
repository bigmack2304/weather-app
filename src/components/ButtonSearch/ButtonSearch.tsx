import React from "react";
import "./ButtonSearch.scss";
import { IconSearch } from "../../ui/IconSearch";

interface IButtonSearchProps {
    clickCallback?: (e: React.MouseEvent) => void;
    addClassName?: string[];
    type?: "submit" | "button" | "reset";
}

type TProps = Readonly<IButtonSearchProps>;

function ButtonSearch({ clickCallback = () => {}, addClassName = [""], type }: TProps) {
    let componentClassName = [...addClassName, "ButtonSearch"].join(" ");
    return (
        <button className={componentClassName} onClick={clickCallback} type={type}>
            <IconSearch />
        </button>
    );
}

export { ButtonSearch };
