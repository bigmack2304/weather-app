import React, { memo } from "react";
import "./Header.scss";
import { deep_object_is_equal } from "../../utils/is_equal";
import { CityPosSearch } from "../CityPosSearch/CityPosSearch";

interface IHeaderProps {}

type TProps = Readonly<IHeaderProps>;

function Header({}: TProps) {
    return (
        <div className="Header">
            <CityPosSearch />
        </div>
    );
}

const Header_memo = memo(Header, deep_object_is_equal);

export { Header, Header_memo };
export type { IHeaderProps };
