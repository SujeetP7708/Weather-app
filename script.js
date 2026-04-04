


//Elements for displys
const url ='https://api.openweathermap.org/data/2.5/weather?&appid=7b7e924109e6ae88cfdce8e0bcba2e55';
const apiURL='https://api.openweathermap.org/data/2.5/forecast?&appid=7b7e924109e6ae88cfdce8e0bcba2e55';
const city=document.getElementById('getcity');
const searchbtn=document.getElementById('searchbtn');
const displayCity=document.getElementById('citydisplay');
const displayDeg=document.getElementById('citydeg');
const conditiondiv=document.getElementById('condition');
const errorMess=document.getElementById('fetchmessage');
const humilitydiv=document.getElementById('humility');
const winddiv=document.getElementById('wind');
const pressurediv=document.getElementById('pressure');
const feeldiv=document.getElementById('feel');
const currentlocdiv=document.getElementById('currentloc');
const imgwatherdiv=document.getElementById('imgwather');
const toggleBtn = document.getElementById("tempToggle");

//c to F uses
let isCelsius = true;
let currentTemp = 0;
let feelsLikeTemp = 0;
let forecastTemps = [];
    

//fetch the data async function
async function getDataByCity(cityName='salem') {
    try{
                const fetchApidata=await fetch(`${apiURL}&q=${cityName}&units=metric`);
                const jasonData=await fetchApidata.json();
                
                
                if( jasonData['cod'] == '200'){
                     displayData(jasonData,cityName);
                }
                else{
                     throw jasonData;
                }


    }catch(error){
        errorMess.style.display='block';
        errorMess.innerText = error['message'];
        setTimeout(()=>{
             errorMess.style.display='none';
        },10000);
    }
}

//ge the weather data by coordinates
async function getDataByCoor(lat,lon) {
    try{
                const fetchApidata=await fetch(`${apiURL}&lat=${lat}&lon=${lon}&units=metric`);
                const fetchcurrent=await fetch(`${url}&lat=${lat}&lon=${lon}&units=metric`);
                const jasonData=await fetchApidata.json();
                const curr=await fetchcurrent.json();
                if( jasonData['cod'] == '200' ){
                     displayData(jasonData,curr['name']);
                }
                else{
                     throw jasonData;
                }


    }catch(error){
        errorMess.style.display='block';
        errorMess.innerText = error['message'];
        setTimeout(()=>{
             errorMess.style.display='none';
        },10000);
    }
}


//display data for the location city name
function displayData(jasonData,cityNames){
   


    console.log(cityNames);
    console.log(jasonData);
  

    displayCity.innerHTML = cityNames.toUpperCase();
    currentTemp = jasonData.list[0].main.temp;
let cel = Math.round(currentTemp);
displayDeg.innerHTML = `${cel}°C`;
    if(cel > 40){
    errorMess.style.display='block';
    errorMess.innerText = "Extreme Heat Alert!";
     setTimeout(()=>{
             errorMess.style.display='none';
        },10000);
    }
   
    displayDeg.innerHTML = `${cel}°C`;
    conditiondiv.innerHTML =jasonData.list[0].weather[0].main;
    humilitydiv.innerHTML=`${jasonData.list[0].main.humidity}%`;
     feelsLikeTemp=Math.round(jasonData.list[0].main.feels_like);
    feeldiv.innerHTML=`${feelsLikeTemp}°C`;
    pressurediv.innerHTML=`${jasonData.list[0].main.pressure}hPa`;
    winddiv.innerHTML=`${jasonData.list[0].wind.speed}Km/h`;
     const icon = jasonData.list[0].weather[0].icon;
    const urlimg = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    imgwatherdiv.src=urlimg;

  
  
    

    displayForecast(jasonData);
}

  

//button listner for the c To F
toggleBtn.addEventListener("click",()=>{
    isCelsius=!isCelsius;

    toggleBtn.innerText = isCelsius ? "°F" : "°C";

    updateMainTemp();
    updateForecastTemp();
});

//uppdate the converted value
function updateMainTemp(){
    displayDeg.innerHTML = formatTemp(currentTemp);
    feeldiv.innerHTML = formatTemp(feelsLikeTemp);
}

//display forcast data
function updateForecastTemp(){
    const els=document.querySelectorAll(".forecast-temp");

    els.forEach((el,i)=>{
        el.innerHTML = formatTemp(forecastTemps[i]);
    });
}

//C to F convertor
function formatTemp(temp){
    if(isCelsius){
        return `${Math.round(temp)}°C`;
    } else {
        return `${Math.round((temp*9/5)+32)}°F`;
    }
}

//display function for forecast
function displayForecast(jasonData) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    forecastTemps = []; 

    const days = [
        jasonData.list[0],
        jasonData.list[8],
        jasonData.list[16],
        jasonData.list[24],
        jasonData.list[32]
    ];

    days.forEach((day, index) => {

        const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
            weekday: "short"
        });

        const temp = day.main.temp;
        forecastTemps.push(temp); // store temp

        const wind = day.wind.speed;
        const humidity = day.main.humidity;
        const icon = day.weather[0].icon;

        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        container.innerHTML += `
            <div class="bg-[#748cf1] text-white p-4 rounded-xl shadow-sm text-center hover:scale-105 transition">
                <p class="text-sm ">${date}</p>
                <img src="${iconURL}" class="mx-auto w-12 h-12">
                <p class="font-bold text-lg forecast-temp" data-index="${index}">
                    ${Math.round(temp)}°C
                </p>
                <p class="text-sm ">Wind ${wind} m/s</p>
                <p class="text-sm ">Humidity ${humidity}%</p>
            </div>
        `;
    });




}

//event listner for search bar change to trigger getData
city.addEventListener('change',()=>{
     let cityName=city.value.trim();
       if(cityName === ""){
        errorMess.style.display='block';
        errorMess.innerText = "Please enter a city name";
          setTimeout(()=>{
             errorMess.style.display='none';
        },10000);
        return;
    }
      saveRecent(cityName)
     getDataByCity(cityName);
})

//event listner for search btn change to trigger getDataByCity
searchbtn.addEventListener('click',()=>{
    let cityName=city.value.trim();
       if(cityName === ""){
        errorMess.style.display='block';
        errorMess.innerText = "Please enter a city name";
         setTimeout(()=>{
             errorMess.style.display='none';
        },10000);
        return;
    }
      saveRecent(cityName);
     getDataByCity(cityName);
})  

//curren coordinates
currentlocdiv.addEventListener('click',()=>{
  
    let lat=11.66;
    let lon=78.15;
  navigator.geolocation.getCurrentPosition((position) => {
   lat = position.coords.latitude;
   lon = position.coords.longitude; 
   getDataByCoor(lat,lon);
  });
   
})


//onload defaault location
window.addEventListener('load',()=>{
    showRecent();
    getDataByCity('salem');
});

//enter event listner
city.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchbtn.click();
    }
});

//save the dat ain local storage
function saveRecent(cityName){
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    if(!cities.includes(cityName)){
        cities.unshift(cityName);
    }

    cities = cities.slice(0,5);
    localStorage.setItem("recentCities", JSON.stringify(cities));
   
    showRecent();
}


//display recent data in datalist
function showRecent(){
    const box = document.getElementById("browsers");
     box.innerHTML = ""; 
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    if(cities.length === 0){
        box.style.display = "none";
        return;
    }

    cities.forEach(c=>{
        box.innerHTML += `<option value=${c}>`;
    });

    box.querySelectorAll("option").forEach(item=>{
        item.addEventListener("click", ()=>{
            getDataByCity(item.value);
        });
    });
}


