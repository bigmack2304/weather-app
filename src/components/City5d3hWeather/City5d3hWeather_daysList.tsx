import React from "react";
import type { TresponseObjListObj } from "../../utils/fetch_5d3h_weather";
import { get_text_date } from "../../utils/util_functions";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import "./City5d3hWeather.scss";
import { dt_from_string, decode_dataIdRender } from "./City5d3hWeather";

type TCity5d3hWeather__daysListProps = {
    sortedForecast: TresponseObjListObj[][];
    setDataIdRender: (val: string) => void;
    dataIdRender: string;
};

type TProps = Readonly<TCity5d3hWeather__daysListProps>;

function City5d3hWeather__daysList({ sortedForecast, setDataIdRender, dataIdRender }: TProps) {
    const gen_classnames = (day: TresponseObjListObj[], date_txt: ReturnType<typeof get_text_date>) => {
        let classes: string[] = [];

        if (decode_dataIdRender(dataIdRender).date == dt_from_string(day[0].dt)) {
            classes.push("City5d3hWeather__day--active");
        }

        if (date_txt.day_name_short.toLocaleUpperCase() == "СБ" || date_txt.day_name_short.toLocaleUpperCase() == "ВС") {
            classes.push("City5d3hWeather__day--weekend");
        }

        return classes;
    };

    return (
        <div className="City5d3hWeather__days_list">
            {sortedForecast.map((day, index) => {
                let date_txt = get_text_date(new Date(day[0].dt * 1000));

                const onClick = (e: React.MouseEvent, data_id: string) => {
                    setDataIdRender(`${data_id}--${index}`);
                };

                return (
                    <React.Fragment key={day[0].dt}>
                        <WeatherAltInfoTemplate
                            slot_header={date_txt.day_name_short}
                            slot_main={date_txt.dayNum_monthNameUTC}
                            onClick={onClick}
                            data_id={dt_from_string(day[0].dt)}
                            addClassName={gen_classnames(day, date_txt)}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export { City5d3hWeather__daysList };
