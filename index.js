let weather = {
    apiKey: "aedad2a53644a99d72136eb2fc6e9e9b",
    getCityCoordinates: function (city) {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`)
            .then((response) => {

                return response.json()
            })
            .then(data => {
                if (!data.length) return alert("Location not found")
                const { lat, lon } = data[0];
                this.fetchWeather(lat, lon)
            })
    },
    fetchWeather: function (latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`)
            .then(response => response.json())
            .then(data => this.displayWeather(data))
    },
    displayWeather: function (data) {

        const uniqueForecastdays = []
        const fiveForecastDays = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate()
            if (!uniqueForecastdays.includes(forecastDate)) {
                return uniqueForecastdays.push(forecastDate)
            }
        })

        forecastContainer = document.querySelector(".weather-cards")
        forecastContainer.innerHTML = ""

        fiveForecastDays.forEach((weatheritem, index) => {
            if (index === 0) {
                const { name } = data.city;
                const { icon, description } = weatheritem.weather[0]
                const { temp, humidity } = weatheritem.main
                const { speed } = weatheritem.wind
                const date = new Date(weatheritem.dt * 1000)

                document.querySelector(".city").innerText = name;
                document.querySelector(".date").innerText = date.toDateString();
                document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@4x.png";
                document.querySelector(".description").innerText = description;
                document.querySelector(".temp").innerText = "Temperature:" + temp + "°C";
                document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
                document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
                document.querySelector(".weather-data").classList.remove("blank")
            } else {
                const { icon, description } = weatheritem.weather[0];
                const { temp, humidity } = weatheritem.main;
                const { speed } = weatheritem.wind;
                const date = new Date(weatheritem.dt * 1000);


                const forecastCard = document.createElement("li");
                forecastCard.classList.add("card");

                forecastCard.innerHTML = `
                    <h3>${date.toDateString()}</h3>
                    <div class = "icon-container">
                        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon" class = "card-icon">
                        <h6>${description}</h6>
                    </div>
                    <h6>Temp: ${temp}°C</h6>
                    <h6>Wind: ${speed} M/S</h6>
                    <h6>Humidity: ${humidity}%</h6>
                `;

                forecastContainer.appendChild(forecastCard);
            }
        });


    },
    search: function () {
        this.getCityCoordinates(document.querySelector(".search-bar").value)
    },
    getuserCoordinates: function () {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            this.fetchWeather(latitude, longitude)
        })
    }
}
document.querySelector(".search-bar").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        weather.search()
    }
})

document.querySelector(".search-button").addEventListener("click", function () {
    weather.search()
})


document.querySelector(".user-location").addEventListener("click", function () {
    weather.getuserCoordinates()
})