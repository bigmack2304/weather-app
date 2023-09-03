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
-   В качестве менеджера состояния сайта используется Redux ToolKit
-   Интегрирован React Router для генерирования URL для каждого состояния сайта.
-   Страницы и некоторые компоненты работают в конкурентном режиме React
-   Все искомые города сохраняются в Local Storage и отображаются в истории поисков на странице. Поиск по карте не сохраняется.
-   Анимированый фон, зависящий от текущего времяни и погодных условий.
-   Настроенна автоматическая сборка, тесты, и развёртывание страницы на github pages после кождого коммита или PR.

#### Используемые технологии

-   HTML 5
-   CSS 3
-   SCSS
-   Java script
-   Type script
-   React (CRA)
-   React router
-   Redux ToolKit
-   Jest

    **Дополнительно**

-   git
-   github Actions
-   github Pages

#### Используемые библиотеки

-   [Recharts (графики)](https://recharts.org/en-US/)
-   [React Transition Group (технология для анимации переключения состояния)](https://reactcommunity.org/react-transition-group/)

#### Используемые API

[OpenWeather](https://openweathermap.org/)

-   [Текущяя погода](https://openweathermap.org/current)
-   [Прогноз на 5 дней](https://openweathermap.org/forecast5)

[API 2Gis](https://api.2gis.ru/doc/maps/ru/quickstart/)
