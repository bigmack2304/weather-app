import React from "react";
import { number_to_deg360 } from "../utils/util_functions";
import "./IconDirection.scss";

interface IIconDirection {
    addClassName?: string[];
    direction?: number;
    title?: string;
}

type TProps = Readonly<IIconDirection>;

function IconDirection({ addClassName = [""], direction = 0, title }: TProps) {
    let componentClassName = [...addClassName, "IconDirection"].join(" ");
    let fixed_direction = number_to_deg360(direction);

    const onClick = (e: React.MouseEvent) => {};

    return (
        <div className={componentClassName} title={title} onClick={onClick}>
            <svg className="IconDirection__icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g fill="#010101">
                        <path
                            d="m256 480.63a225.11 225.11 0 0 1 -159.18-384.28 225.11 225.11 0 0 1 318.36 318.35 223.67 223.67 0 0 1 -159.18 65.93zm0-438.22c-117.51 0-213.11 95.59-213.11 213.11s95.6 213.11 213.11 213.11 213.11-95.63 213.11-213.11-95.6-213.11-213.11-213.11z"
                            fill="#010101"
                        ></path>
                        <path d="m256 69.34a6 6 0 0 1 -6-6v-52.84a6 6 0 0 1 12 0v52.84a6 6 0 0 1 -6 6z" fill="#010101"></path>
                        <path d="m256 507.5a6 6 0 0 1 -6-6v-52.84a6 6 0 0 1 12 0v52.84a6 6 0 0 1 -6 6z" fill="#010101"></path>
                        <path d="m63.34 262h-52.84a6 6 0 0 1 0-12h52.84a6 6 0 1 1 0 12z" fill="#010101"></path>
                        <path d="m501.5 262h-52.84a6 6 0 0 1 0-12h52.84a6 6 0 0 1 0 12z" fill="#010101"></path>
                    </g>
                    <g style={{ transform: `rotate(${fixed_direction}deg)`, transformOrigin: `50% 50%` }}>
                        <path
                            d="m395.14 345.44-125.72-225.78a15.36 15.36 0 0 0 -26.84 0l-125.72 225.78c-7.39 13.26 6.89 28.06 20.41 21.15l111.73-57.07a15.38 15.38 0 0 1 14 0l111.74 57.07c13.51 6.91 27.79-7.89 20.4-21.15z"
                            fill="#6189A8"
                        ></path>
                        <path
                            d="m232.57 317.91-95.3 48.68c-13.52 6.91-27.8-7.89-20.41-21.16l58.39-104.86a501.07 501.07 0 0 0 57.32 77.34z"
                            fill="#6189A8"
                        ></path>
                        <path
                            d="m177.16 243.12a5.94 5.94 0 0 1 -2.91-.76 6 6 0 0 1 -2.32-8.16l5-9a6 6 0 1 1 10.49 5.8l-5 9a6 6 0 0 1 -5.26 3.12z"
                            fill="#010101"
                        ></path>
                        <path
                            d="m130.14 374.36a21.47 21.47 0 0 1 -18.52-31.85l49.79-89.41a6 6 0 1 1 10.48 5.84l-49.79 89.41a9.37 9.37 0 0 0 12.44 12.9l111.74-57.07a21.42 21.42 0 0 1 19.44 0l111.74 57.07a9.37 9.37 0 0 0 12.44-12.9l-125.72-225.77a9.36 9.36 0 0 0 -16.36 0l-49.82 89.56a6 6 0 0 1 -10.48-5.84l49.87-89.56a21.08 21.08 0 0 1 18.66-11 21.07 21.07 0 0 1 18.66 11l125.67 225.77a21.36 21.36 0 0 1 -28.38 29.42l-111.74-57.07a9.38 9.38 0 0 0 -8.52 0l-111.74 57.07a21.63 21.63 0 0 1 -9.86 2.43z"
                            fill="#010101"
                        ></path>
                    </g>
                </g>
            </svg>
            <div className="IconDirection__face"></div>
        </div>
    );
}

export { IconDirection };
