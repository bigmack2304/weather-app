import React, { useEffect } from "react";
import { useAppStoreDispatch, useAppStoreSelector } from "../redux/redux_hooks";
import { setPending, setError, setSuccess } from "../redux/slises/autoDetectLocation";

// автоопределение координат пользователя

interface IUseGeoLocationParams<D extends object> {
    onError?: (err: GeolocationPositionError, dependencies: D) => void;
    onSuccess?: (position: GeolocationPosition, dependencies: D) => void;
    onPending?: () => void;
}

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
    const { detectionStage, isError, nextStage, errorCode } = useAppStoreSelector((store) => store.autoDetectLocation);

    const startCallback = () => {
        onPending();
        redux_storeDispatch(setPending(true));
    };

    const successCallback = (dependencies: TDEPENDENCIES, position: GeolocationPosition) => {
        onSuccess(position, dependencies);
        redux_storeDispatch(setSuccess(true));
    };

    const errorCallback = (dependencies: TDEPENDENCIES, err: GeolocationPositionError) => {
        // if (err.code === 1) {
        //     // нету разрешений
        // }

        // if (err.code === 2) {
        //     // внутрення ошибка
        // }

        // if (err.code === 3) {
        //     // ошибка по таймауту
        //     // на некоторых устройствах нужен gps
        // }

        // if (err.code === 4) {
        //     // GeoLocation не поддерживается
        // }

        onError(err, dependencies);
        setError({ errorCode: err.code, errorStatus: true });
    };

    const getGeoLocation = (gettingOptions: PositionOptions, dependencies: Readonly<TDEPENDENCIES> = {} as Readonly<TDEPENDENCIES>) => {
        if (!navigator.geolocation) {
            errorCallback(dependencies, geoLocationErrorConstructor(4, "geoLocation not supported"));
            return;
        }

        startCallback();
        navigator.geolocation.getCurrentPosition(
            successCallback.bind(null, dependencies),
            errorCallback.bind(null, dependencies),
            gettingOptions
        );
    };

    useEffect(() => {
        if (isError) {
            if (errorCode === 3) {
                if (detectionStage === 1 && nextStage) {
                    getGeoLocation({ timeout: 15000, enableHighAccuracy: true });
                }

                if (detectionStage === 2 && nextStage) {
                    getGeoLocation({ timeout: 15000, enableHighAccuracy: false });
                }

                if (detectionStage === 3) {
                    redux_storeDispatch(setError({ errorStatus: true, errorCode: 4 }));
                }
            }
        }
    }, [isError, detectionStage, nextStage, errorCode]);

    return [getGeoLocation];
}

export { useGeoLocation };
