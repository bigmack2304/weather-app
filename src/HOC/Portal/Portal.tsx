import React, { useMemo } from "react";
import { createPortal } from "react-dom";

// ХОК для рендера компонентов, которые должны быть поверх всего
// рендер содержимого идет в компонент PortalVieport который должен быть
// в самом низу документа.

interface IPortalProps {
    children?: React.ReactNode;
}

type TProps = Readonly<IPortalProps>;

function Portal({ children }: TProps) {
    const portal_vieport = useMemo(() => {
        return document.querySelector(".PortalVieport");
    }, []);

    if (children === null) {
        return null;
    }

    return createPortal(children, portal_vieport!);
}

export { Portal };
export type { IPortalProps };
