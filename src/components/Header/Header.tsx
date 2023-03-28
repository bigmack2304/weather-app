import React, { memo } from "react";
import "./Header.scss";
import { FormSearh } from "../FormSearh/FormSearh";
import { deep_object_is_equal } from "../../utils/is_equal";

interface IHeaderProps {}

type TProps = Readonly<IHeaderProps>;

function Header({}: TProps) {
    return (
        <div className="Header">
            <FormSearh />
        </div>
    );
}

const Header_memo = memo(Header, deep_object_is_equal);

export { Header, Header_memo };
export type { IHeaderProps };
