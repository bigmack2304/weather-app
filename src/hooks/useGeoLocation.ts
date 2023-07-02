import React, { useEffect } from "react";

// автоопределение координат пользователя

// нужен глобвльный стет
// - если это первая загрузка
// - определенные координаты
// - обработка 3х типов ошибок
// - нужноли автоопределение для первой загрузки? ???

interface IUseGeoLocationParams {
    onError?: (err: GeolocationPositionError) => void;
    onSuccess?: (position: GeolocationPosition) => void;
}

function useGeoLocation({
    onError = () => {},
    onSuccess = () => {},
}: IUseGeoLocationParams): [getGeoLocation: (gettingOptions: PositionOptions) => void] {
    let geoLocationGettingStage: 0 | 1 | 2 | 3 = 0; // 0 - еще не определяли. 1 - определение с высокой точностью. 2 - определение с высокой точностью. 3 - определение с низкой точностью

    const successCallback = (position: GeolocationPosition) => {
        onSuccess(position);
    };

    const errorCallback = (err: GeolocationPositionError) => {
        if (err.code === 3 && (geoLocationGettingStage === 1 || geoLocationGettingStage === 2)) {
            // ошибка по таймауту
            // на некоторых устройствах нужен gps
            getGeoLocation({ timeout: 15000, enableHighAccuracy: false });
        }

        if (err.code === 1) {
            // нету разрешений
        }

        if (err.code === 2) {
            // внутрення ошибка
        }

        onError(err);
    };

    const getGeoLocation = (gettingOptions: PositionOptions) => {
        if (!navigator.geolocation) return;
        // if (cityName !== undefined && lat !== undefined && lon !== undefined) return;
        geoLocationGettingStage++;

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, gettingOptions);
    };

    // getGeoLocation({ timeout: 15000, enableHighAccuracy: true });

    return [getGeoLocation];
}

export { useGeoLocation };
