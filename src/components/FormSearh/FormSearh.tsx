import React, { memo, useState, useEffect } from "react";
import { deep_object_is_equal } from "../../utils/is_equal";
import "./FormSearh.scss";

// форма поиска, при субмите вызывает коллбек submitCallback из пропсов

interface IFormSearhProps {
    submitCallback?: (searhVal: string) => void;
    focusCallback?: () => void;
    blurCallback?: () => void;
}

type TProps = Readonly<IFormSearhProps>;

function FormSearh({ submitCallback = () => {}, focusCallback = () => {}, blurCallback = () => {} }: TProps) {
    let [searhValue, setSearhValue] = useState<string>("");

    const form_onSubmit = (e: React.FormEvent) => {
        let target = e.target as HTMLFormElement;
        let searhValue = target.querySelector<HTMLInputElement>("input[type='searh']")!.value;

        e.preventDefault();

        if (searhValue == "") {
            return;
        }

        setSearhValue("");
        submitCallback(searhValue);
    };

    const Searh_onChange = (e: React.FormEvent) => {
        let target = e.target as HTMLInputElement;
        setSearhValue(target.value);
    };

    const onFocus = (e: React.FocusEvent) => {
        focusCallback();
    };

    const onBlur = (e: React.FocusEvent) => {
        blurCallback();
    };

    return (
        <form className="FormSearch" onSubmit={form_onSubmit}>
            <input
                className="FormSearch__search"
                type="searh"
                value={searhValue}
                onChange={Searh_onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <input className="FormSearch__buttonSubmit" type="submit" value="Поиск" />
        </form>
    );
}

const FormSearh_memo = memo(FormSearh, deep_object_is_equal);

export { FormSearh, FormSearh_memo };
export type { IFormSearhProps };
