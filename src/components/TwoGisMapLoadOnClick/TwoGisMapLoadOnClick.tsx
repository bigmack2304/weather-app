import React, { useState, lazy, Suspense } from "react";
import "./TwoGisMapLoadOnClick.scss";
import type { ITwoGisMaps } from "../TwoGisMap/TwoGisMap";
import { Button } from "../Button/Button";

interface IPropsTwoGisMapLoadOnClick {
    addClassNameDefault?: string[];
    addClassNameDeLoaded?: string[];
    mapsSettings?: ITwoGisMaps;
}

type TProps = Readonly<IPropsTwoGisMapLoadOnClick>;

const TwoGisMapsLazy = lazy(() => import("../TwoGisMap/TwoGisMap"));

function TwoGisMapLoadOnClick({ addClassNameDefault = [""], addClassNameDeLoaded = [""], mapsSettings = {} }: TProps) {
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
                    <TwoGisMapsLazy {...mapsSettings} addClassName={[componentClassNameDeLoaded]} />
                </Suspense>
            ) : (
                <div className={`${componentClassNameDefault} TwoGisMapLoadOnClick__default`}>
                    <Button addClassName={["TwoGisMapLoadOnClick__button"]} clickCallback={onButtonClick}>
                        Показать карту
                    </Button>
                </div>
            )}
        </>
    );
}

export { TwoGisMapLoadOnClick };
