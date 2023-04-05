function get_text_date() {
    const date = new Date();
    const locale = Intl.DateTimeFormat(["ru"], {
        hour12: false,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });

    let text_date = locale.format(date);
    console.log(text_date);
    return {
        day_num: Intl.DateTimeFormat(["ru"], { day: "numeric" }).format(date),
        day_name: Intl.DateTimeFormat(["ru"], { weekday: "long" }).format(date),
        year_num: Intl.DateTimeFormat(["ru"], { year: "numeric" }).format(date),
        month_name: Intl.DateTimeFormat(["ru"], { month: "long" }).format(date),
        dayNum_monthName: Intl.DateTimeFormat(["ru"], { month: "long", day: "numeric" }).format(date),
        minutes: Intl.DateTimeFormat(["ru"], { minute: "numeric" }).format(date),
        hours: Intl.DateTimeFormat(["ru"], { hour: "numeric" }).format(date),
    };
}
console.log(get_text_date());
