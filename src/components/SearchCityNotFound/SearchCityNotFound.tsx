import React from "react";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import "./SearchCityNotFound.scss";

interface ISearchCityNotFound {
    onClose?: () => void;
}

type TProps = Readonly<ISearchCityNotFound>;

function SearchCityNotFound({ onClose = () => {} }: TProps) {
    const onOuterClick = (e: React.MouseEvent) => {
        // чтобы этот обработчик не ловил внутренние клики от других элементов
        if ((e.target as HTMLElement).classList.contains("SearchCityNotFound")) {
            onClose();
        }
    };

    const onBtnClose = (e: React.MouseEvent) => {
        onClose();
    };

    return (
        <div className="SearchCityNotFound" onClick={onOuterClick}>
            <div className="SearchCityNotFound__container">
                <div className="SearchCityNotFound__header">
                    <ButtonClose clickCallback={onBtnClose} addClassName={["SearchCityNotFound__close"]} />
                </div>
                <div className="SearchCityNotFound__main">
                    <p>Город не найден.</p>
                </div>
            </div>
        </div>
    );
}

export { SearchCityNotFound };
