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

            // Today's Weather
            weatherToday.html("<h2>Today's Weather in "+cityEl.val()+"</h2>");
            
            // Clears query in search bar
            cityEl.val('');
        }

    });
});