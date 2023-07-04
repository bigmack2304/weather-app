import React, { useEffect } from "react";
import { useAppStoreDispatch, useAppStoreSelector } from "../redux/redux_hooks";
import { setPending, setError, setSuccess, setNextStage } from "../redux/slises/autoDetectLocation";

// автоопределение координат пользователя

interface IUseGeoLocationParams<D extends object> {
    onError?: (err: GeolocationPositionError, dependencies: D) => void;
    onSuccess?: (position: GeolocationPosition, dependencies: D) => void;
    onPending?: () => void;
}

type TTimerId = ReturnType<typeof setTimeout>;

function geoLocationErrorConstructor(code: number, message: string): GeolocationPositionError {
    return {
        code: code,
        message: message,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
    };
}

function useGeoLocation<TDEPENDENCIES extends object>({
    onError = () => {},
    onSuccess = () => {},
    onPending = () => {},
}: IUseGeoLocationParams<TDEPENDENCIES>): [
    getGeoLocation: (gettingOptions: PositionOptions, dependencies?: Readonly<TDEPENDENCIES>) => void
] {
    const redux_storeDispatch = useAppStoreDispatch();
    const { detectionStage, isError, nextStage, errorCode, isPending } = useAppStoreSelector((state) => state.autoDetectLocation);
    let dopTimerErrTimeout: TTimerId;
    const startCallback = () => {
        onPending();
        redux_storeDispatch(setPending(true));
    };

    const successCallback = (dependencies: TDEPENDENCIES, position: GeolocationPosition) => {
        onSuccess(position, dependencies);
        redux_storeDispatch(setSuccess(true));
    };

    const errorCallback = (dependencies: TDEPENDENCIES, err: GeolocationPositionError) => {
        onError(err, dependencies);
        redux_storeDispatch(setError({ errorCode: err.code, errorStatus: true }));
    };

    const getGeoLocation = (gettingOptions: PositionOptions, dependencies: Readonly<TDEPENDENCIES> = {} as Readonly<TDEPENDENCIES>) => {
        if (!navigator.geolocation) {
            errorCallback(dependencies, geoLocationErrorConstructor(4, "geoLocation not supported"));
            return;
        }

        // дополнительный таймаут, на моем телефоне почемуто getCurrentPosition оочень странно работает и в некоторых ситуациях стандартный таймаут не отрабатывает
        dopTimerErrTimeout = setTimeout(() => {
            if (!isError && isPending) {
                redux_storeDispatch(setError({ errorStatus: true, errorCode: 3 }));
            }
        }, gettingOptions.timeout ?? 5000 + 1000);

        startCallback();
        navigator.geolocation.getCurrentPosition(
            successCallback.bind(null, dependencies),
            errorCallback.bind(null, dependencies),
            gettingOptions
        );
    };

    useEffect(() => {
        if (isError) {
            clearTimeout(dopTimerErrTimeout);
            if (errorCode === 3) {
                // ошибка по первому таймауту
                if (detectionStage === 1 && nextStage) {
                    getGeoLocation({ timeout: 15000, enableHighAccuracy: true });
                }

                // ошибка по второму таймауту
                if (detectionStage === 2) {
                    redux_storeDispatch(setNextStage(true)); //???????????
                    getGeoLocation({ timeout: 15000, enableHighAccuracy: false });
                }

                // ошибка по третьему таймауту, генерируем новую ошибку о том что определить город не удалось
                if (detectionStage === 3) {
                    redux_storeDispatch(setError({ errorStatus: true, errorCode: 5 }));
                }
            }
        }
    }, [isError, detectionStage, nextStage, errorCode]);

    useEffect(() => {
        return () => {
            clearTimeout(dopTimerErrTimeout);
        };
    });

    return [getGeoLocation];
}

export { useGeoLocation };
