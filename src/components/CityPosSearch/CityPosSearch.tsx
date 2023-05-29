import React, { memo, useEffect, useState } from "react";
import { FormSearh } from "../FormSearh/FormSearh";
import { deep_object_is_equal } from "../../utils/is_equal";
import { useSearchCityPos } from "../../hooks/useSearchCityPos";
import type * as fetchCityLatLon from "../../utils/fetch_LatLon";
import type { TStorageHistoryCity } from "./../../appLocalStorage/appLoacalStorage";
import { get_full_country_by_code, get_localed_city_name, get_system_language, delete_obj_from_array } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import { ClosableItem } from "../ClosableItem/ClosableItem";
import "./CityPosSearch.scss";
import { Portal } from "../../HOC/Portal/Portal";

// компонент делает запрос на сервер для определления координат города
// указанного в форме, после ответа, если найден один город то происходит вызов
// колбека selectCityCallback с передачей в него широты и долготы
// еслиже найденных городов более одного то под формой появляется список найденных
// городов, юсер кликает на нужный ему город, после этого также происходит вызов
// selectCityCallback с координатами выбранного города

import { updateCity } from "../../redux/slises/weather_lat_lon";
import { useAppStoreDispatch } from "../../redux/redux_hooks";

interface ICityPosSearchProps {}

type TProps = Readonly<ICityPosSearchProps>;

function CityPosSearch({}: TProps) {
    let [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);
    let [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
    let [localStorageData, setLocalStorageData] = useLoacalStorage(true);
    let [readFormValue, setReadFormValue] = useState<string>(""); // эта строка изменяется в след на изменением текста в форме
    const storeDispatch = useAppStoreDispatch();

    // если при запросе произошла ошибка
    const onErrorFetchCityPos = () => {
        setIsLoadingVisible(false);
    };

    const onStartFetchCityPos = () => {
        setIsLoadingVisible(true);
    };

    const onEndFetchCityPos = () => {
        setIsLoadingVisible(false);
    };

    let [cityPosResponse, fetchCityPos, removeResponse] = useSearchCityPos(onErrorFetchCityPos, onEndFetchCityPos, onStartFetchCityPos);
    let sorted_cityPosResponse: fetchCityLatLon.TResponseObj[] = cityPosResponse ? [...cityPosResponse] : [];

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
        if (cityPosResponse && cityPosResponse.length !== 0) {
            if (cityPosResponse.length === 1) {
                selectCallback(cityPosResponse[0]);
            }
        }
    }, [cityPosResponse]);

    // вызывается при субмите формы
    const searchCity = (seachVal: string) => {
        fetchCityPos(seachVal);
        closeHistory();
        setReadFormValue("");
    };

    const onFormChange = (str: string) => {
        setReadFormValue(str);
    };

    // начать поиск города по выбранному результату GEO запроса
    const selectCallback = (selectedCity: fetchCityLatLon.TResponseObj) => {
        storeDispatch(updateCity({ lat: selectedCity.lat, lon: selectedCity.lon, cityName: get_localed_city_name(selectedCity) }));
        removeResponse();
    };

    // тут нужно показать историю (начало ввода в форму)
    const onFormFocus = () => {
        setIsHistoryVisible(true);
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
        closeHistory();
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

            {cityPosResponse && cityPosResponse.length > 1 ? (
                <Portal>
                    <div className="CityPosSearch__history_outer" onClick={removeResponse}></div>
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
                        {/* <ButtonClose clickCallback={removeResponse} addClassName={["CityPosSearch__geo_hints_buttonClose"]} /> */}
                    </div>
                </Portal>
            ) : null}

            {isHistoryVisible && filtred_storage_history.length !== 0 && !cityPosResponse ? (
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

            {isLoadingVisible ? <IconLoader addClassName={["CityPosSearch__loader"]} /> : null}
        </div>
    );
}

const CityPosSearch_memo = memo(CityPosSearch, deep_object_is_equal);

export { CityPosSearch, CityPosSearch_memo };
