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
                
                // Initiate functions to get weather
                getWeather();
                getForecast();
            });
    }

    // Get current weather from latitude and longitude
    function getWeather(){
        const requestUrl='https://api.openweathermap.org/data/2.5/weather?lat='+
        JSON.parse(localStorage.getItem('lat'))+'&lon='+JSON.parse(localStorage.getItem('lon'))+'&units=imperial&appid=4a3078e250edd66b3fd95a4671c5608b';

        fetch (requestUrl)
            .then(function (response){
                return response.json();
            })
            .then(function(data){
                //Today's weather
                let iconToday=$('<img>');
                iconToday.attr('src','https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png');
                let tempToday=$('<p>');
                tempToday.text('Temperature: '+data.main.temp+'°F');
                let windToday=$('<p>');
                windToday.text('Wind: '+data.wind.speed+' mi/hr');
                let humidityToday=$('<p>');
                humidityToday.text('Humidity: '+data.main.humidity+'%');
                let todayDiv=$('<div>');
                weatherToday.append(todayDiv);
                todayDiv.append(iconToday);
                todayDiv.append(tempToday);
                todayDiv.append(windToday);
                todayDiv.append(humidityToday);
            });
    }

    function getForecast(){
        const requestUrl='https://api.openweathermap.org/data/2.5/forecast?lat='+
        JSON.parse(localStorage.getItem('lat'))+'&lon='+JSON.parse(localStorage.getItem('lon'))+'&units=imperial&appid=4a3078e250edd66b3fd95a4671c5608b';

        fetch (requestUrl)
            .then(function (response){
                return response.json();
            })
            .then(function(data){
                //Five day forecast
                for(let i=0;i<5;i++){
                    $('#day-'+i).html('<h4 class="text-center">'+dayjs(data.list[8*i].dt_txt).format('MMM D HH')+'</h4>'
                    +'<img src="https://openweathermap.org/img/wn/'+data.list[(i*8)].weather[0].icon+'@2x.png" alt="weather image"/>'
                    +'<p>Temp: '+data.list[8*i].main.temp+'°F</p>'
                    +'<p>Wind: '+data.list[8*i].wind.speed+' mi/hr</p>'
                    +'<p>Humidity: '+data.list[8*i].main.humidity+'%</p>');
                }
            });
    }

    // Search button event listner
    searchBtn.on('click',searchFunction());

    function searchFunction(event){
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

            // Headings
            weatherToday.html("<h2>Current Weather in "+cityEl.val()+"</h2> <h4>"+dayjs().format('dddd, MMMM D, YYYY')+"</h4>");

            // Clears query in search bar
            cityEl.val('');
        }

    }
});