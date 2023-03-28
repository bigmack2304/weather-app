import React, { memo } from "react";
import { deep_object_is_equal } from "../../utils/is_equal";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import "./Home.scss";

// Начальная страница

function HomePage() {
    return (
        <main className="Home">
            <section className="Home__weather_now">
                <h2 className="visually_hidden">Погода на сегодня</h2>
                <Header />
            </section>
            <section className="Home__weather_week">
                <h2 className="visually_hidden">Погода на неделю</h2>
            </section>
            <Footer />
        </main>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
