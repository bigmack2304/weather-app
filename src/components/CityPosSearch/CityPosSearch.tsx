import React, { memo, useEffect, useState } from "react";
import { FormSearh } from "../FormSearh/FormSearh";
import { deep_object_is_equal } from "../../utils/is_equal";
import type * as fetchCityLatLon from "../../utils/fetch_LatLon";
import type { TStorageHistoryCity } from "./../../appLocalStorage/appLoacalStorage";
import { get_full_country_by_code, get_localed_city_name, get_system_language, delete_obj_from_array } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import { ClosableItem } from "../ClosableItem/ClosableItem";
import "./CityPosSearch.scss";
import { Portal } from "../../HOC/Portal/Portal";
import { useNavigate } from "react-router-dom";
import { ModalWndTemplate } from "../ModalWndTemplate/ModalWndTemplate";
import { updateCity, setNotFound, fetchGeo, setFetchData, setAutoDetect } from "../../redux/slises/weather_lat_lon";
import { setNextStage, resetError } from "../../redux/slises/autoDetectLocation";
import { useAppStoreDispatch, useAppStoreSelector } from "../../redux/redux_hooks";
import { useGeoLocation } from "../../hooks/useGeoLocation";

// компонент делает запрос на сервер для определления координат города
// указанного в форме, после ответа, если найден один город то происходит вызов
// колбека selectCityCallback с передачей в него широты и долготы
// еслиже найденных городов более одного то под формой появляется список найденных
// городов, юсер кликает на нужный ему город, после этого также происходит вызов
// selectCityCallback с координатами выбранного города

interface ICityPosSearchProps {}

type TProps = Readonly<ICityPosSearchProps>;

function CityPosSearch({}: TProps) {
    let [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
    let [localStorageData, setLocalStorageData] = useLoacalStorage(true);
    let [readFormValue, setReadFormValue] = useState<string>(""); // эта строка изменяется в след на изменением текста в форме
    const storeDispatch = useAppStoreDispatch();
    const router_navigate = useNavigate();

    const { isFetchLoading, isNotFound, fetchData } = useAppStoreSelector((state) => state.weatherGeo);
    const { isPending, isError, detectionStage, errorCode, nextStage } = useAppStoreSelector((state) => state.autoDetectLocation);

    //const [getGeoLocation] = useGeoLocation({}); // это нужно тут, тк в нутри есть useEffect который реагирует на стор, проблема в том что если этот хук стоит в HOC (homeProvider) то useEffect не риагирует на изменения, но так все работает

    let sorted_cityPosResponse: fetchCityLatLon.TResponseObj[] = fetchData ? [...fetchData] : [];

    sorted_cityPosResponse = sorted_cityPosResponse.sort((a, b) => {
        let sys_locale = get_system_language();
        if (a.country.toLowerCase() === sys_locale) {
            return -1;
        }
        return 1;
    });

    let filtred_storage_history: TStorageHistoryCity[] = localStorageData.history ? [...localStorageData.history] : [];
    filtred_storage_history = filtred_storage_history.filter((value) => {
        let cityName = value.name.toLowerCase();
        let formText = readFormValue.toLowerCase();

        if (cityName.startsWith(formText)) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        if (fetchData && fetchData.length !== 0) {
            if (fetchData.length === 1) {
                selectCallback(fetchData[0]);
            }
        }
    }, [fetchData]);

    // вызывается при субмите формы
    const searchCity = (seachVal: string) => {
        storeDispatch(fetchGeo({ cityName: seachVal }));
        closeHistory();
        setReadFormValue("");
    };

    const onFormChange = (str: string) => {
        setReadFormValue(str);
    };

    const removeResponse = () => {
        storeDispatch(setFetchData(undefined));
    };

    // начать поиск города по выбранному результату GEO запроса
    const selectCallback = (selectedCity: fetchCityLatLon.TResponseObj) => {
        storeDispatch(updateCity({ lat: selectedCity.lat, lon: selectedCity.lon, cityName: get_localed_city_name(selectedCity) }));
        storeDispatch(setAutoDetect(false));
        removeResponse();
        router_navigate("/search");
    };

    // тут нужно показать историю (начало ввода в форму)
    const onFormFocus = () => {
        setIsHistoryVisible(true);
        storeDispatch(setNotFound(false));
    };

    // тут нужно скрывать историю (потеря фокуса над формаой)
    const closeHistory = () => {
        setIsHistoryVisible(false);
    };

    // тут нужно удалять элемент из истории (нажатие на крестик элемента под формой)
    const onHistoryListClose = (metaDataId: string) => {
        let decode_metaDataId = JSON.parse(metaDataId) as TStorageHistoryCity;
        let new_history = delete_obj_from_array(localStorageData.history, decode_metaDataId) as TStorageHistoryCity[];
        setLocalStorageData({ ...localStorageData, history: [...new_history] });
    };

    // тут нужно начинать поиск по выбранному городу (нажатие на какойто элемент под формой)
    const onHistorySelect = (metaDataId: string) => {
        let decode_metaDataId = JSON.parse(metaDataId) as TStorageHistoryCity;
        storeDispatch(updateCity({ lat: decode_metaDataId.lat, lon: decode_metaDataId.lon, cityName: decode_metaDataId.name }));
        storeDispatch(setAutoDetect(false));
        closeHistory();
        router_navigate("/search");
    };

    // закрываем модалку о ненайденном городе
    const onModalWndTemplateClose = () => {
        storeDispatch(setNotFound(false));
    };

    // при истичении времяни автоопределения координат, выводим модалку, при закрытии которой пытаемся еще раз определить координаты
    const isErrAutoDetectLocation = () => {
        if (detectionStage === 1) {
            storeDispatch(setNextStage(true));
            return;
        }
        storeDispatch(resetError());
    };

    return (
        <div className="CityPosSearch">
            <FormSearh
                submitCallback={searchCity}
                focusCallback={onFormFocus}
                inputChangeCallback={onFormChange}
                placeholder="Поиск города"
                addClassName={["CityPosSearch__form"]}
            />

            {fetchData && fetchData.length > 1 ? (
                <Portal>
                    <div className="CityPosSearch__hints_outer" onClick={removeResponse}></div>
                    <div className="CityPosSearch__hints_wrapper">
                        <div className="CityPosSearch__hints_elements">
                            {sorted_cityPosResponse.map((city) => {
                                return (
                                    <div
                                        tabIndex={0}
                                        className="CityPosSearch__hint_element"
                                        key={`${city.lat}-${city.lon}`}
                                        onClick={selectCallback.bind(null, city)}
                                    >
                                        <span className="CityPosSearch__cityName">{get_localed_city_name(city)}</span>
                                        <span>
                                            {get_full_country_by_code(city.country) ? `: ${get_full_country_by_code(city.country)}` : null}
                                        </span>
                                        <span>{city.state ? `, ${city.state}` : null}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Portal>
            ) : null}

            {isHistoryVisible && filtred_storage_history.length !== 0 && !fetchData ? (
                <Portal>
                    <div className="CityPosSearch__history_outer" onClick={closeHistory}></div>
                    <div className="CityPosSearch__hints_wrapper">
                        <div className="CityPosSearch__hints_elements">
                            {filtred_storage_history.map((city) => {
                                return (
                                    <ClosableItem
                                        closeCallback={onHistoryListClose}
                                        onClick={onHistorySelect}
                                        metaDataId={JSON.stringify(city)}
                                        addClassName={["CityPosSearch__hint_element"]}
                                        key={`${city.lat}-${city.lon}`}
                                    >
                                        {city.name}
                                    </ClosableItem>
                                );
                            })}
                        </div>
                    </div>
                </Portal>
            ) : null}

            {isFetchLoading || isPending ? <IconLoader addClassName={["CityPosSearch__loader"]} /> : null}

            {isNotFound ? (
                <Portal>
                    <ModalWndTemplate onClose={onModalWndTemplateClose}>
                        <p>Город не найден.</p>
                    </ModalWndTemplate>
                </Portal>
            ) : null}

            {isError ? (
                errorCode == 3 && detectionStage == 1 ? (
                    <Portal>
                        <ModalWndTemplate onClose={isErrAutoDetectLocation}>
                            <p>
                                Привышено время автомотического определения города, возможно на вашем устройстве требуется включить гео
                                локацию. После закрытия окна запустится повторная попытка определения города.
                            </p>
                        </ModalWndTemplate>
                    </Portal>
                ) : errorCode == 5 ? (
                    <Portal>
                        <ModalWndTemplate onClose={isErrAutoDetectLocation}>
                            <p>Не удалось определить ваши координаты.</p>
                        </ModalWndTemplate>
                    </Portal>
                ) : errorCode == 4 ? (
                    <Portal>
                        <ModalWndTemplate onClose={isErrAutoDetectLocation}>
                            <p>На вашем устройстве не поддерживается автоматическое определение города.</p>
                        </ModalWndTemplate>
                    </Portal>
                ) : errorCode == 1 ? (
                    <Portal>
                        <ModalWndTemplate onClose={isErrAutoDetectLocation}>
                            <p>
                                Не удается получить разрешение для автоматического определения города. На некоторых устроиствах эта ошибка
                                может возникнуть изза выключенной геолокации.
                            </p>
                        </ModalWndTemplate>
                    </Portal>
                ) : errorCode == 2 ? (
                    <Portal>
                        <ModalWndTemplate onClose={isErrAutoDetectLocation}>
                            <p>Ошибка при автоматическом определении города.</p>
                        </ModalWndTemplate>
                    </Portal>
                ) : null
            ) : null}
        </div>
    );
}

const CityPosSearch_memo = memo(CityPosSearch, deep_object_is_equal);

export { CityPosSearch, CityPosSearch_memo };
