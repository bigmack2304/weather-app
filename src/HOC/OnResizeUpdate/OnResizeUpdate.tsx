import React, { useRef, useEffect } from "react";
import { useHandleUpdate } from "../../hooks/useHandleUpdate";
import { first_caller_delay_callback } from "../../utils/decorators";

// Вызывает перерендер содержимого после ресайза окна

interface IOnResizeUpdateProps {}

type TProps = Readonly<IOnResizeUpdateProps>;

function HocOnResizeUpdate<TWrapperProps extends {}>(
    WrappedComponent: React.ComponentType<TWrapperProps>
): React.FC<TWrapperProps & TProps> {
    const OnResizeUpdate: React.FC<TWrapperProps & TProps> = (props) => {
        let { ...wrappedOnlyProps } = props;
        let wrappedFullProps = { ...(wrappedOnlyProps as unknown as TWrapperProps) };
        const [handleupdate] = useHandleUpdate();

        useEffect(() => {
            const onResize = first_caller_delay_callback(
                (e: Event) => {
                    handleupdate();
                },
                () => {},
                100
            );

            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
            };
        }, []);

        return (
            <React.Fragment>
                <WrappedComponent {...wrappedFullProps} />;
            </React.Fragment>
        );
    };

    return OnResizeUpdate;
}

export { HocOnResizeUpdate };
