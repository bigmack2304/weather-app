import React, { useEffect, useRef, useState } from "react";
import "./PortalVieport.scss";

// вьюпорт для порталов. ХОК Portal будет рендерить содержимое именно сюда
// когда в нутри этого компонента чтото есть, у него появляется модификатор --active

interface IPortalVieportProps {
    addClassName?: string[];
}

type TProps = Readonly<IPortalVieportProps>;

const observer_config: MutationObserverInit = {
    subtree: false,
    childList: true,
};

function PortalVieport({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "PortalVieport"].join(" ").trim();
    const [isActive, setIsActive] = useState<boolean>(false);
    const vieportRef = useRef<HTMLDivElement>(null);

    if (isActive) {
        componentClassName = `${componentClassName} PortalVieport--active`;
    }

    const onUpdate = () => {
        if (!vieportRef.current) return;

        if (vieportRef.current.children.length > 0) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    };

    useEffect(() => {
        let observer = new MutationObserver(onUpdate);
        observer.observe(vieportRef.current!, observer_config);

        return () => {
            observer.disconnect();
        };
    }, []);

    return <div className={componentClassName} ref={vieportRef}></div>;
}

export { PortalVieport };
