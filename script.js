// Fetch Element
const yourWeatherBTN = document.querySelector('.your_weather');
const searchWeatherBTN = document.querySelector('.search_weather');
const SearchBox = document.querySelector('.user-search-box');
const locationAccess = document.querySelector('.user-location-access')
const userWeather = document.querySelector('.user-weather-show');
const loadingScreen = document.querySelector('.loading-box')

const API_KEY = '11be61f1c320d777e9fc0d03a43b72b5';

// Set Default View
let currentTab = yourWeatherBTN;
currentTab.classList.add('switchcss');

// SwitchTab Function
function switchTab(clickTab) {
    if (currentTab != clickTab) {
        currentTab.classList.remove('switchcss');
        clickTab.classList.add('switchcss');
        currentTab = clickTab;
        currentTab.classList.add('switchcss');

        if (!SearchBox.classList.contains('active')) {
            locationAccess.classList.remove('active');
            userWeather.classList.remove('active');
            SearchBox.classList.add('active');
        }
        else {
            SearchBox.classList.remove('active');
            userWeather.classList.remove('active');
            locationAccess.classList.add('active');
            getSectionStorage(); // 10
        }
    }
}

// Create Switch Btn
yourWeatherBTN.addEventListener('click', () => {
    switchTab(yourWeatherBTN);
})

searchWeatherBTN.addEventListener('click', () => {
    switchTab(searchWeatherBTN);
})

// Fetch Input Box
let inputBox = document.querySelector('.input-box');
let submitBtn = document.querySelector('.btn-search');


submitBtn.addEventListener('click', () => {
    getValue();
    SearchBox.classList.remove('active');
})

//  Search Value Store
let value = '';

function getValue() {
    value = inputBox.value;
    fetchWeatherInfo(value);
}

// Fetch Weather Info
async function fetchWeatherInfo(value) {
    SearchBox.classList.remove('active');
    locationAccess.classList.remove('active');
    userWeather.classList.remove('active');
    loadingScreen.classList.add('active');
    try {
        let sorce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}&units=metric`)
        let data = await sorce.json();

        loadingScreen.classList.remove('active');
        userWeather.classList.add('active');
        SearchBox.classList.remove('active');

        yourWeatherBTN.addEventListener('click', () => {
            SearchBox.classList.remove('active');
            if (!localCordinates) {
                SearchBox.classList.remove('active');
                userWeather.classList.remove('active');
                locationAccess.classList.add('active');
            }
            else {
                let cordinates = JSON.parse(localCordinates);
                getweatherinfo(cordinates);
            }
        })

        // Rander Function Call 
        randerData(data);
    }
    catch (err) {

    }
}

function randerData(data) {
    let cityName = document.querySelector('.city-name')
    let temp = document.querySelector('.temp')
    let desc = document.querySelector('.desc')
    let weatherImg = document.querySelector('.weather-img')
    let Windspeed = document.querySelector('.speed')
    let Humidity = document.querySelector('.Humidity')
    let cloud = document.querySelector('.cloud')

    cityName.innerHTML = data?.name;
    temp.innerHTML = data?.main?.temp;
    desc.innerHTML = data?.weather[0]?.description;
    weatherImg.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    Windspeed.innerHTML = data?.wind?.speed;
    Humidity.innerHTML = data?.main?.humidity;
    cloud.innerHTML = data?.clouds?.all;
}
let localCordinates ='';

// 10 ===================================================================

function getSectionStorage() {
    localCordinates = sessionStorage.getItem('user-cordinates');
    if (!localCordinates) {
        SearchBox.classList.remove('active');
        userWeather.classList.remove('active');
        locationAccess.classList.add('active');
    }
    else {
        let cordinates = JSON.parse(localCordinates);
        getweatherinfo(cordinates);
    }
}

async function getweatherinfo(cordinates) {
    const { lat, lon } = cordinates;
    locationAccess.classList.remove('active');
    loadingScreen.classList.add('active');

    // API Call 
    try {
        let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let info = await resp.json();
        locationAccess.classList.remove('active');
        loadingScreen.classList.remove('active');
        userWeather.classList.add('active');

        randerData(info);
    }
    catch (err) {
        alert(err);
    }
}

let accessBTN = document.querySelector('.btn-grant-access');
accessBTN.addEventListener('click',getlocation);

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Location are not supported');
    }
}

function showPosition(position){
    const userCordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-cordinates", JSON.stringify(userCordinates));
    getweatherinfo(userCordinates);
}