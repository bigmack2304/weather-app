import React from "react";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import "./ModalWndTemplate.scss";

// рендерить этот компонент только в портале

interface IModalWndTemplate {
    onClose?: () => void;
    children?: React.ReactNode;
}

type TProps = Readonly<IModalWndTemplate>;

function ModalWndTemplate({ onClose = () => {}, children = null }: TProps) {
    const onOuterClick = (e: React.MouseEvent) => {
        // чтобы этот обработчик не ловил внутренние клики от других элементов
        if ((e.target as HTMLElement).classList.contains("ModalWndTemplate")) {
            onClose();
        }
    };

    const onBtnClose = (e: React.MouseEvent) => {
        onClose();
    };

    return (
        <div className="ModalWndTemplate" onClick={onOuterClick}>
            <div className="ModalWndTemplate__container">
                <div className="ModalWndTemplate__header">
                    <ButtonClose clickCallback={onBtnClose} addClassName={["ModalWndTemplate__close"]} />
                </div>
                <div className="ModalWndTemplate__main">{children}</div>
            </div>
        </div>
    );
}

export { ModalWndTemplate };
