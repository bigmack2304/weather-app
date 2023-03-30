// конвертирует код страны в полное название страны, с учетом языка пользователя
// испоьзование get_full_country_by_code.of("код страны, US например")
const intlDisplayNames = new Intl.DisplayNames([get_system_language()], { type: "region" });

// более удобный интерфейс для intlDisplayNames
function get_full_country_by_code(countryCode: string) {
    return intlDisplayNames.of(countryCode) ?? "";
}

// получить код используемого устройством языка ("ru", "en", ...)
function get_system_language(): string {
    return window.navigator.language;
}

export { get_full_country_by_code, get_system_language };
