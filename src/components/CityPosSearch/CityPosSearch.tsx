import React, { memo, useEffect, useState, useContext } from "react";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { FormSearh } from "../FormSearh/FormSearh";
import { deep_object_is_equal } from "../../utils/is_equal";
import { useSearchCityPos } from "../../hooks/useSearchCityPos";
import type * as fetchCityLatLon from "../../utils/fetch_LatLon";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import { get_full_country_by_code, get_localed_city_name, get_system_language } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import "./CityPosSearch.scss";

// компонент делает запрос на сервер для определления координат города
// указанного в форме, после ответа, если найден один город то происходит вызов
// колбека selectCityCallback с передачей в него широты и долготы
// еслиже найденных городов более одного то под формой появляется список найденных
// городов, юсер кликает на нужный ему город, после этого также происходит вызов
// selectCityCallback с координатами выбранного города

interface ICityPosSearchProps {}

type TProps = Readonly<ICityPosSearchProps>;

function CityPosSearch({}: TProps) {
    let [isLoading, setIsLoading] = useState<boolean>(false);
    const selectCityCallback = useContext(WeatherContext).selectCityCallback;

    const onErrorFetchCityPos = () => {
        setIsLoading(false);
    };

    let [cityPosResponse, fetchCityPos, removeResponse] = useSearchCityPos(onErrorFetchCityPos);
    let sorted_cityPosResponse: fetchCityLatLon.TResponseObj[] = cityPosResponse ? [...cityPosResponse] : [];
    sorted_cityPosResponse = sorted_cityPosResponse.sort((a, b) => {
        let sys_locale = get_system_language();
        if (a.country.toLowerCase() === sys_locale) {
            return -1;
        }
        return 1;
    });

    useEffect(() => {
        if (cityPosResponse && cityPosResponse.length !== 0) {
            if (cityPosResponse.length === 1) {
                selectCallback(cityPosResponse[0]);
            }
            setIsLoading(false);
        }
    }, [cityPosResponse]);

    const searchCity = (seachVal: string) => {
        fetchCityPos(seachVal);
        setIsLoading(true);
    };

    const selectCallback = (selectedCity: fetchCityLatLon.TResponseObj) => {
        selectCityCallback(selectedCity.lat, selectedCity.lon, get_localed_city_name(selectedCity));
        removeResponse();
    };

    const onFormFocus = () => {};

    const onFormBlur = () => {};

    return (
        <div className="CityPosSearch">
            <FormSearh submitCallback={searchCity} focusCallback={onFormFocus} blurCallback={onFormBlur} />
            {cityPosResponse && cityPosResponse.length > 1 ? (
                <div className="CityPosSearch__elements_wrapper">
                    <ul className="CityPosSearch__elements">
                        {sorted_cityPosResponse.map((city) => {
                            return (
                                <li
                                    tabIndex={0}
                                    className="CityPosSearch__element"
                                    key={`${city.lat}-${city.lon}`}
                                    onClick={selectCallback.bind(null, city)}
                                >
                                    <span className="CityPosSearch__cityName">{get_localed_city_name(city)}</span>
                                    <span>
                                        {get_full_country_by_code(city.country) ? `: ${get_full_country_by_code(city.country)}` : null}
                                    </span>
                                    <span>{city.state ? `, ${city.state}` : null}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <ButtonClose clickCallback={removeResponse} />
                </div>
            ) : null}

            {isLoading ? <IconLoader addClassName={["CityPosSearch__loader"]} /> : null}
        </div>
    );
}

const CityPosSearch_memo = memo(CityPosSearch, deep_object_is_equal);

export { CityPosSearch, CityPosSearch_memo };
