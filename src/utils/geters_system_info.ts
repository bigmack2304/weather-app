// получить код используемого устройством языка ("ru", "en", ...)
function get_system_language(): string {
    return window.navigator.language;
}

export { get_system_language };
