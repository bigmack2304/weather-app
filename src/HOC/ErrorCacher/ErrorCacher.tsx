import React from "react";
import "./ErrorCacher.scss";

interface Istate {
    hasError: boolean;
    error: Error | null;
    info: string;
}

type Tprops = React.PropsWithChildren;

class ErrorCacher extends React.Component<Tprops, Istate> {
    public state: Readonly<Istate>;

    constructor(props: Tprops) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            info: "",
        };
    }

    public static getDerivedStateFromError(err: Error): Partial<Istate> {
        // Обновляем состояние для отображения резервного контента при следующем рендеринге
        return {
            hasError: true,
            error: err,
            info: `Name:${err.name}, Message:${err.message}`,
        };
    }

    public componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
    }

    public render() {
        if (this.state.hasError) {
            // Можно отрендерить запасной UI произвольного вида
            return (
                <div className="ErrorCacher">
                    <h1 className="ErrorCacher__Catch">Перехвачена ошибка</h1>
                    <pre className="ErrorCacher__Error">{String(this.state.error)}</pre>
                    <p className="ErrorCacher__Desc">{this.state.info}</p>
                </div>
            );
        }

        return this.props.children ?? <></>;
    }
}

export { ErrorCacher };
