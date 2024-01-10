//Conversion from Kelvin to Ferenheit
function tempF (kelvin){
    let ferenheit = (kelvin-273.15)*(9/5)+32;
    return ferenheit.toFixed(2);
}

//Conversion from meters/sec to miles/hour
function windMi (meters){
    let miles = meters*2.2369;
    return miles.toFixed(2);
}

$(function (){
    // Document Variables
    const cityEl = $('#city');
    const searchBtn = $('#search-btn');
    const cityHistory = $('#city-history');
    const weatherToday = $('#today-weather');

    // Counter to keep track of number of cities searched
    let counter;
    // Search history buttons
    let cityBtn = {
        div: [],
        btn: [],
    };
    if(localStorage.getItem('counter')){
        counter=localStorage.getItem('counter');
        for(let i=0;i<=counter;i++){
            cityBtn.div[i] = $('<div>');
            cityBtn.div[i].addClass('row');
            cityBtn.btn[i] = $('<button>');
            cityBtn.btn[i].text(JSON.parse(localStorage.getItem('city'+i)));
            cityBtn.btn[i].addClass('btn btn-outline-secondary');
            cityBtn.btn[i].attr('type','button');
            cityHistory.append(cityBtn.div[i]);
            cityBtn.div[i].append(cityBtn.btn[i]);
        }
    }

    // Get latitude and longitude from city query
    function getGeocode(city) {
        const requestUrl= 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=4a3078e250edd66b3fd95a4671c5608b';

        fetch (requestUrl)
            .then(function (response){
                return response.json();
            })
            .then(function(data){
                // Store data
                localStorage.setItem('lat',data[0].lat);
                localStorage.setItem('lon',data[0].lon);
                
                // Initiate function to get today's weather
                getWeather();
            });
    }

    // Get current weather from latitude and longitude
    function getWeather(){
        const requestUrl='https://api.openweathermap.org/data/2.5/weather?lat='+JSON.parse(localStorage.getItem('lat'))+'&lon='+JSON.parse(localStorage.getItem('lon'))+'&appid=4a3078e250edd66b3fd95a4671c5608b';

        fetch (requestUrl)
            .then(function (response){
                return response.json();
            })
            .then(function(data){
                //Saving data
                let temp=tempF(data.main.temp);
                localStorage.setItem('weather-temp',temp);
                let wind=windMi(data.wind.speed);
                localStorage.setItem('weather-wind',wind);
                localStorage.setItem('weather-humidity',data.main.humidity);

                //Today's weather
                tempToday=$('<p>');
                tempToday.text('Temperature: '+JSON.parse(localStorage.getItem('weather-temp'))+'°F');
                windToday=$('<p>');
                windToday.text('Wind: '+JSON.parse(localStorage.getItem('weather-wind'))+' mi/hr');
                humidityToday=$('<p>');
                humidityToday.text('Humidity: '+JSON.parse(localStorage.getItem('weather-humidity'))+'%');
                todayDiv=$('<div>');
                weatherToday.append(todayDiv);
                todayDiv.append(tempToday);
                todayDiv.append(windToday);
                todayDiv.append(humidityToday);
            });
    }

    // Search button event listner
    searchBtn.on('click',function(event){
        event.preventDefault();

        // Loads query when filled out
        if (cityEl.val()) {
            // Gets counter stored in local storage or sets counter in local storage
            if(localStorage.getItem('counter')){
                counter = localStorage.getItem('counter');
                counter++;
                localStorage.setItem('counter',counter);
            } else {
                localStorage.setItem('counter','0');
                counter = localStorage.getItem('counter');
            }

            // Saves city in search history
            localStorage.setItem('city'+counter,JSON.stringify(cityEl.val()));
            cityBtn.div[counter] = $('<div>');
            cityBtn.div[counter].addClass('row');
            cityBtn.btn[counter] = $('<button>');
            cityBtn.btn[counter].text(JSON.parse(localStorage.getItem('city'+counter)));
            cityBtn.btn[counter].addClass('btn btn-outline-secondary');
            cityBtn.btn[counter].attr('type','button');
            cityHistory.append(cityBtn.div[counter]);
            cityBtn.div[counter].append(cityBtn.btn[counter]);

            //Fetch City
            getGeocode(cityEl.val());

            // Today's Weather Heading
            weatherToday.html("<h2>Today's Weather in "+cityEl.val()+"</h2>");

            // Clears query in search bar
            cityEl.val('');
        }

    });
});