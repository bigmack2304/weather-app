import React, { useState } from "react";
import "./ClosableItem.scss";
import { ButtonClose } from "./../ButtonClose/ButtonClose";

// компонент с текстом и кнопкой удалить компонент
// пока подразумивается что у этого компонента будет некая обертка
// которая будет управлять их видимостью, для этого в пропасах определен closeCallback
// который мы должны передать в этот компонент перед монтированием
// когда будет нажата кнопка закрыть будет вызван этот коллбек, так компонент обертка сможет
// определить что пора удалять какойто компонент ClosableItem

// также при вызове коллбека в него передается некий ключ, с которым монтировался ClosableItem
// так внешний компонент понимает из какого именно ClosableItem сработал коллбек.

// UPD- всетаки добавил управление видимостью содержимого из этого компонента, это позволит
//      управлять видимостью DOM этого компонента из негоже, но этот продолжит висеть в дереве компонентов.

interface IClosableItemProps {
    addClassName?: string[];
    closeCallback?: (metaDataId: string) => void;
    children?: string | null | undefined;
    metaDataId?: string;
}

type TProps = Readonly<IClosableItemProps>;

function ClosableItem({ addClassName = [""], closeCallback = () => {}, children, metaDataId = "" }: TProps) {
    let componentClassName = [...addClassName, "ClosableItem"].join(" ");
    const [isVisibly, setIsVisibly] = useState<boolean>(true);

    const onClose = (e: React.MouseEvent) => {
        closeCallback(metaDataId);
        setIsVisibly(false);
    };

    return (
        <>
            {isVisibly ? (
                <div className={componentClassName}>
                    <div className="ClosableItem__text">{children}</div>
                    <div className="ClosableItem__button_wrapper">
                        <ButtonClose clickCallback={onClose} addClassName={["ClosableItem__buttonClose"]} />
                    </div>
                </div>
            ) : null}
        </>
    );
}

export { ClosableItem };
export type { IClosableItemProps };
