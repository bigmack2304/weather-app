import React, { useState, useCallback } from "react";

// хук на случай если понадобится ручное обновление компонента
// handleUpdate функция неизменна между рендерами

function useHandleUpdate(): [handleupdate: () => void] {
    let [HandleUpdateVal, setHandleUpdateVal] = useState<{ val: boolean }>({ val: true });

    const handleUpdate = useCallback(() => {
        setHandleUpdateVal({ ...HandleUpdateVal, val: !HandleUpdateVal.val });
    }, []);

    return [handleUpdate];
}

export { useHandleUpdate };
