// Declare variables
var openWeatherMapAPIkey = "e0f8ef0d68d0fa761676e0a5997449c5";
var cityName = "";
var lat;
var lon;
var currentTemp;
var currentHumidity;
var currentWindSpeed;
var today;

// Retrieve the previous searches from local storage
// var citiesHistory = localStorage.getItem("citiesHistory") || "";
var citiesHistory = ["New York", "San Francisco", "Birmingham"]

// When the document has loaded, display the weather for the last searched city
$(document).ready(function() {
    
    // If there is city history data, pass into the createCityHistory and getWeather functions 
    if(citiesHistory !== ""){
        
        // Pass all searched cities into the createCityHistory function
        createCityHistory(citiesHistory);
        
        // Pass the last searched city into the getWeather function    
        getWeather(citiesHistory[citiesHistory.length - 1]);
    }
});

// Event listener for the listed cities. A clicked city is passed into the getWeather function
$(".city-history").click(function() {
    var cityName = this.textContent;
    getWeather(cityName);
});

// Event listener for the search button
$("#submit-btn").click(function() {
    
    // Prevent default actions from happening - e.g. page flickering
    event.preventDefault();
    
    
    // Checks if the user has typed anything into the search field
    if($("#city-input").val() == ""){
        alert("You must type a city in the Search field");
    }
    else{
        // Passes the input text into the getWeather function
        cityName = $("#city-input").val();
        getWeather(cityName);
        
        // Inserts the city name into citiesHistory array
        var cityNameIndex = citiesHistory.indexOf(cityName);
        
        // If the searched city was not in the citiesHistory array, put it at the end
        if(cityNameIndex === -1){
            citiesHistory.push(cityName);
        }
        // If the searched city was already in the citiesHistory array, move to the last element
        else{
            var endOfLoop = citiesHistory.length
            for(i = cityNameIndex; i < endOfLoop; i++){
                citiesHistory[i] = citiesHistory[i + 1];
            }
            citiesHistory[citiesHistory.length - 1] = cityName;
        }
        
        // Update the cities shown in the city history
        createCityHistory(citiesHistory); 
        
        // Clear the searched text from the input
        $("#city-input").val("");
    }
    
    console.log(citiesHistory);
    
});

// A function to retrieve the current & forecast weather and update the display on the web page 
// Example API call api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=e0f8ef0d68d0fa761676e0a5997449c5
function getWeather(cityName){
    
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + openWeatherMapAPIkey + "&units=metric"; 
    
    // API call for weather: "http://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}"
    
    // Example API call: "http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}&units=imperial"
    
    $.ajax({
        type: "GET",
        url: queryURL,
        dataType: "json",
        success: function(data) {
            console.log(data);
            dataCityName = data.name + ", " + data.sys.country;
            console.log("dataCityName = " + dataCityName);
            
            today = new Date();

            // Turn current date into a string
            currentDateArray = [
                today.getDate(),
                today.getMonth(),
                today.getFullYear()
            ]
        
            //Add a zero in front of the date and month if less than 10
            currentDateArray.forEach(formatDate);

            // Concatenate current date into a string
            currentDateString = currentDateArray[0] + "/" + currentDateArray[1] + "/" + currentDateArray[2];         
            
            // Get weather icon
            currentWeatherIconID = data.weather[0].icon;
            currentWeatherIconURL = "http://openweathermap.org/img/wn/" + currentWeatherIconID +"@2x.png";

            // Update the current weather header
            $("#current-weather-header").text(dataCityName + " (" + currentDateString + ")  ");
            $("#current-weather-icon").attr("src",currentWeatherIconURL);

            // Round the temperature to the nearest 0.1 degrees
            currentTemp = Math.round(data.main.temp * 10) / 10;
            currentHumidity = data.main.humidity;
            currentWindSpeed = data.wind.speed;
            
            //Update the weather data displayed (except UV index, which comes from its own API)
            $("#current-temp").text("Temperature: " + currentTemp + " °C");
            $("#current-hum").text("Humidity: " + currentHumidity + " %");
            $("#current-wind").text("Wind speed: " + currentWindSpeed + " m/s");

            //Pass data.coordinate.lat and data.coordinate.lon to getUVIndex() (and execute this function)
            lat = data.coord.lat;
            lon = data.coord.lon;

            getUVIndex(lat,lon);

            //Call getForecast function, and pass the cityName
            getForecast(cityName);
        }
    });
}

function getForecast(cityName){
    // $.ajax({
    //     type: "GET",
    //     url:`http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=${apiKey}&units=imperial`,
    //     dataType: "json",
    //     success: function(data) {
    //         //Update the 5 days forecast section - dynamically create the 5 cards
    //     }
    // });

}


// A function to retrieve the UV index and update the display on the web page 
function getUVIndex(lat,lon) {
    
}

// A function to update the display of city search history on the web page 
function createCityHistory(citiesHistory){

}

// Adds a zero in front of date and month if <10
function formatDate(item, index, arr){
    if(arr[index] < 10){
        arr[index] = "0" + arr[index];
    }
}