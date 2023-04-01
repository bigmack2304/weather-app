import React, { useState, useCallback } from "react";

// хук на случай если понадобится ручное обновление компонента
// handleUpdate функция неизменна между рендерами

function useHandleUpdate(): [handleupdate: () => void] {
    let [HandleUpdateVal, setHandleUpdateVal] = useState<object>({});

    const handleUpdate = useCallback(() => {
        setHandleUpdateVal({ ...HandleUpdateVal });
    }, []);

    return [handleUpdate];
}

export { useHandleUpdate };
