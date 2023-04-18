import React, { useEffect, useState, useRef, useCallback } from "react";
import "./HoverHint.scss";
import { Portal } from "../Portal/Portal";
import { GetElementOffsetsInDocument } from "../../utils/util_functions";
import { first_caller_delay_callback } from "../../utils/decorators";

// HOC добавляет внутреннему элементу всплывающее окно с текстом, при наведении курсора или при клике
// расчитано что внутрь этого HOC будет помещен только один дочерний эемент. Если более одного то всплывающее окошко
// будет добавлено только первому дочернему элементу

interface IHoverHintProps {
    children: React.ReactElement;
    hoverText?: React.ReactNode; // текст всплывающего окна
    gap_vertical?: number; // нужный отступ по вертикали
    gap_horizontal?: number; // нужный отступ по горизонтали
    delay?: number; // задержка перед появленрием
}

type TProps = Readonly<IHoverHintProps>;

// всякие данные для события hover
type THoverData = {
    cursor_x: number; // координаты курсора мыши
    cursor_y: number;
    target_w: number; // ширина и высота элемента на который повешан обработчик события
    target_h: number;
    target_document_left: number; // смещение элемента относительно ДОКУМЕНТА, на который повешан обработчик события
    target_document_top: number;
    target_vp_left: number; // смещение элемента относительно ВЪЮПОРТА, на который повешан обработчик события
    target_vp_top: number;
    hint_w: number; // ширина и высота всплывающего окна
    hint_h: number;
    to_render_hint_top: boolean; // можноли отрендерить его сверху целоевого элемента
};

function HoverHint({ children, hoverText = "", gap_vertical = 5, gap_horizontal = 0, delay = 1000 }: TProps) {
    const [isHover, setIsHover] = useState<boolean>(false); // показываетсяли подсказка
    const isHoverOut = useRef<boolean>(false); // курсор покинул элемент
    const hintRef = useRef<HTMLDivElement>(null); // ссылка на элемент с подсказкой
    const hoverHintRef = useRef<HTMLDivElement>(null); // ссылка на этот компонент в DOM
    const hoverData = useRef<THoverData>({
        cursor_x: 0,
        cursor_y: 0,
        target_w: 0,
        target_h: 0,
        target_document_left: 0,
        target_document_top: 0,
        target_vp_left: 0,
        target_vp_top: 0,
        hint_w: 0,
        hint_h: 0,
        to_render_hint_top: false,
    });

    // курсор наводится на элемент, ллибо клик по элементу на мобиле
    const onEnter = useCallback(
        (e: MouseEvent) => {
            if (isHover) return;

            // обновим данные в hoverData
            isHoverOut.current = false;
            let taget_data = (e.currentTarget as HTMLElement).getBoundingClientRect();
            let offsets = GetElementOffsetsInDocument(e.currentTarget as HTMLElement);
            hoverData.current = {
                ...hoverData.current,
                target_w: Math.floor(taget_data.width),
                target_h: Math.floor(taget_data.height),
                target_document_left: offsets.left,
                target_document_top: offsets.top,
                target_vp_left: taget_data.left,
                target_vp_top: taget_data.top,
            };

            // показ подсказки с задержкой
            const updateHover = first_caller_delay_callback(
                () => {
                    if (isHoverOut.current) return;
                    setIsHover(true);
                },
                () => {},
                delay
            );

            // решаем как показать подсказку, с задержкой или нет
            if (e.type && e.type === "click") {
                setIsHover(true);
            } else {
                updateHover();
            }
        },

        []
    );

    // курсор уходит с эемента
    const onOut = () => {
        isHoverOut.current = true;
        setIsHover(false);
    };

    // курсор движется над элементом
    const onMove = (e: React.MouseEvent) => {
        if (isHover) {
            hoverData.current = {
                ...hoverData.current,
                cursor_x: e.nativeEvent.x,
                cursor_y: e.nativeEvent.y,
            };
        }
    };

    useEffect(() => {
        if (isHover) {
            // обновляем данные в hoverData
            let hint_data = hintRef.current!.getBoundingClientRect();
            let to_render_hint_top = hoverData.current.target_vp_top - gap_vertical >= hoverData.current.hint_h;

            hoverData.current = {
                ...hoverData.current,
                hint_h: Math.floor(hint_data.height),
                hint_w: Math.floor(hint_data.width),
                to_render_hint_top: to_render_hint_top,
            };

            // расчитываем положение подсказки на экране
            const calcHintPosition = () => {
                if (hoverData.current.to_render_hint_top) {
                    return hoverData.current.target_document_top - hoverData.current.hint_h - gap_vertical;
                }

                return hoverData.current.target_document_top + hoverData.current.target_h + gap_vertical;
            };

            const setHintPosition = () => {
                hintRef.current!.style.left = `${
                    hoverData.current.target_document_left + hoverData.current.target_w / 2 - hoverData.current.hint_w / 2 + gap_horizontal
                }px`;
                hintRef.current!.style.top = `${calcHintPosition()}px`;
            };

            setHintPosition();

            // при скролле будем выключать подсказку
            const onScroll = () => {
                if (isHover) {
                    onOut();
                }
            };
            document.addEventListener("scroll", onScroll);

            return () => {
                document.removeEventListener("scroll", onScroll);
            };
        }
    }, [isHover]);

    // вешаем нормальный обработчик на дочерний элемент этого компонента
    // 1. реакт использует делегирование что не позволит заюзать e.currentTarget в onEnter
    useEffect(() => {
        (hoverHintRef.current!.children[0] as HTMLElement).addEventListener("mouseenter", onEnter);
        (hoverHintRef.current!.children[0] as HTMLElement).addEventListener("click", onEnter);

        return () => {
            (hoverHintRef.current!.children[0] as HTMLElement).removeEventListener("mouseenter", onEnter);
            (hoverHintRef.current!.children[0] as HTMLElement).removeEventListener("click", onEnter);
        };
    }, []);

    return (
        <div className="HoverHint" onMouseLeave={onOut} onMouseMove={onMove} ref={hoverHintRef}>
            {children}
            {isHover ? (
                <Portal>
                    <div className="HoverHint__hint" ref={hintRef}>
                        {hoverText}
                    </div>
                </Portal>
            ) : null}
        </div>
    );
}

export { HoverHint };
export type { IHoverHintProps };
