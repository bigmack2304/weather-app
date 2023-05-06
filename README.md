<p align="center">
  <span><b>Weather App</b></span>
</p>
<p align="center">
  <a href="https://github.com/bigmack2304/weather-app"><img src="./public/logo192.png" alt=""></a>
</p>
<p align="center">
  <a href="https://github.com/bigmack2304/weather-app"><img src="https://github.com/bigmack2304/weather-app/actions/workflows/github-actions-main.yml/badge.svg" alt=""></a>
      <a href="https://github.com/bigmack2304/weather-app"><img src="https://github.com/bigmack2304/weather-app/actions/workflows/github-actions-dev.yml/badge.svg" alt=""></a>
</p>

## Описание

Прогноз погоды на сегодня и на 5 дней вперед, с интервалом от 3 до 6 часов.

## Технические особенности

-   Проект создан на базе React (Create-React-App), который включает в себя Webpack, ESlint, Jest и многие другие библиотеки.
-   Реализован "резиново-адаптивный" интерфейс, под мобильные устройства и мониторы.
-   После загрузки данных, для страницы генерируется уникальный хеш, это позволяет делится ссылкой на прогноз для нужного города.
-   Все искомые города сохраняются в Local Storage и отображаются в истории поисков на странице
-   Анимированый фон, зависящий от текущего времяни и погодных условий.
-   Настроенна автоматическая сборка, тесты, и развёртывание страницы на github pages после кождого коммита или PR.

#### Используемые технологии

-   React (CRA)
-   Type script
-   Java script
-   JSX
-   HTML 5
-   CSS 3
-   SCSS

    **Дополнительно**

-   prettier
-   github
-   github Actions
-   github Pages

#### Используемые библиотеки

-   [Recharts (графики)](https://recharts.org/en-US/)

#### Используемые API

[OpenWeather](https://openweathermap.org/)

-   [Текущяя погода](https://openweathermap.org/current)
-   [Прогноз на 5 дней](https://openweathermap.org/forecast5)
