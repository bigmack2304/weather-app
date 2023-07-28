import React, { useState, lazy, Suspense } from "react";
import "./TwoGisMapLoadOnClick.scss";

interface IPropsTwoGisMapLoadOnClick {
    addClassNameDefault?: string[];
    addClassNameDeLoaded?: string[];
}

type TProps = Readonly<IPropsTwoGisMapLoadOnClick>;

const TwoGisMapsLazy = lazy(() => import("../TwoGisMap/TwoGisMap"));

function TwoGisMapLoadOnClick({ addClassNameDefault = [""], addClassNameDeLoaded = [""] }: TProps) {
    const componentClassNameDefault = [...addClassNameDefault, "TwoGisMapLoadOnClick"].join(" ");
    const componentClassNameDeLoaded = [...addClassNameDeLoaded].join(" ");
    const [isLoadState, setIsLoadState] = useState<boolean>(false);

    const onButtonClick = (e: React.MouseEvent) => {
        setIsLoadState(true);
    };

    return (
        <>
            {isLoadState ? (
                <Suspense fallback={<div className={`${componentClassNameDefault} TwoGisMapLoadOnClick__loading`}>Загрузка...</div>}>
                    <TwoGisMapsLazy
                        mapInitConfig={{ fullscreenControl: false, zoomControl: false }}
                        addClassName={[componentClassNameDeLoaded]}
                    />
                </Suspense>
            ) : (
                <div className={`${componentClassNameDefault} TwoGisMapLoadOnClick__default`}>
                    <button className="TwoGisMapLoadOnClick__button" onClick={onButtonClick}>
                        Показать карту
                    </button>
                </div>
            )}
        </>
    );
}

export { TwoGisMapLoadOnClick };
