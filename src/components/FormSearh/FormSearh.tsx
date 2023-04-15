import React, { memo, useState, useRef } from "react";
import { deep_object_is_equal } from "../../utils/is_equal";
import "./FormSearh.scss";
import { ButtonSearch } from "../ButtonSearch/ButtonSearch";

// форма поиска, при субмите вызывает коллбек submitCallback из пропсов

interface IFormSearhProps {
    submitCallback?: (searhVal: string) => void;
    focusCallback?: () => void;
    blurCallback?: () => void;
    inputChangeCallback?: (str: string) => void;
    placeholder?: string;
    addClassName?: string[];
}

type TProps = Readonly<IFormSearhProps>;

function FormSearh({
    submitCallback = () => {},
    focusCallback = () => {},
    blurCallback = () => {},
    inputChangeCallback = () => {},
    placeholder = "",
    addClassName = [""],
}: TProps) {
    let componentClassName = [...addClassName, "FormSearch"].join(" ").trim();
    let [searhValue, setSearhValue] = useState<string>("");
    let formRef = useRef<HTMLFormElement>(null);

    const form_onSubmit = (e: React.FormEvent) => {
        let target = e.target as HTMLFormElement;
        let searhValue = target.querySelector<HTMLInputElement>("input[type='searh']")!.value;

        e.preventDefault();
        (target.children[0] as HTMLInputElement).blur(); // принудительно снимаем фокус (если мы нажали enter он не снимится),
        // изза этого CityPosSearch баговал и после субмита не отображал подскаски,
        // пока не обновиш фокус на инпуте

        if (searhValue == "") {
            return;
        }

        setSearhValue("");
        submitCallback(searhValue);
    };

    const Searh_onChange = (e: React.FormEvent) => {
        let target = e.target as HTMLInputElement;
        setSearhValue(target.value);
        inputChangeCallback(target.value);
    };

    const onFocus = (e: React.FocusEvent) => {
        focusCallback();
    };

    const onBlur = (e: React.FocusEvent) => {
        blurCallback();
    };

    const on_buttonSubmit = () => {
        if (formRef && formRef.current) {
            formRef.current.su();
        }
    };

    return (
        <form className={componentClassName} onSubmit={form_onSubmit} ref={formRef}>
            <input
                className="FormSearch__search"
                type="searh"
                value={searhValue}
                onChange={Searh_onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
            />
            {/* <input className="FormSearch__buttonSubmit" type="submit" value="Поиск" /> */}
            <ButtonSearch addClassName={["FormSearch__buttonSubmit"]} type="submit"></ButtonSearch>
        </form>
    );
}

const FormSearh_memo = memo(FormSearh, deep_object_is_equal);

export { FormSearh, FormSearh_memo };
export type { IFormSearhProps };
