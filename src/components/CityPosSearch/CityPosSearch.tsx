import React, { memo, useEffect, useState } from "react";
import { FormSearh } from "../FormSearh/FormSearh";
import { deep_object_is_equal } from "../../utils/is_equal";
import { useSearchCityPos } from "../../hooks/useSearchCityPos";
import type * as fetchCityLatLon from "../../utils/fetch_LatLon";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import { get_full_country_by_code, get_system_language } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import "./CityPosSearch.scss";

interface ICityPosSearchProps {
    selectCityCallback?: (lat: number, lon: number) => void;
}

type TProps = Readonly<ICityPosSearchProps>;

function CityPosSearch({ selectCityCallback = () => {} }: TProps) {
    let [isLoading, setIsLoading] = useState<boolean>(false);

    const onErrorFetchCityPos = () => {
        setIsLoading(false);
    };

    let [cityPosResponse, fetchCityPos, removeResponse] = useSearchCityPos(onErrorFetchCityPos);

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
        console.log(selectedCity);
        selectCityCallback(selectedCity.lat, selectedCity.lon);
        removeResponse();
    };

    const get_localed_city_name = (city: fetchCityLatLon.TResponseObj) => {
        if (city.local_names) {
            let locale = get_system_language() as keyof typeof city.local_names;
            if (city.local_names[locale]) {
                return city.local_names[locale] as string;
            }
        }
        return city.name;
    };

    return (
        <div className="CityPosSearch">
            <FormSearh submitCallback={searchCity} />
            {cityPosResponse && cityPosResponse.length > 1 ? (
                <div className="CityPosSearch__elements_wrapper">
                    <ul className="CityPosSearch__elements">
                        {cityPosResponse.map((city) => {
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

            {isLoading === true ? <IconLoader addClassName={["CityPosSearch__loader"]} /> : null}
        </div>
    );
}

const CityPosSearch_memo = memo(CityPosSearch, deep_object_is_equal);

export { CityPosSearch, CityPosSearch_memo };
