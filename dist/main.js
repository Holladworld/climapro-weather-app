/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/controllers/mainController.js":
/*!***************************************************!*\
  !*** ./src/scripts/controllers/mainController.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainController)
/* harmony export */ });
class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.city = {};
    this.unit = "metric";
    document.getElementById("search").addEventListener("blur", e => this.loadPage(document.getElementById("search").value));
    document.getElementById("search").addEventListener("keypress", e => this.checkIfEnter(e));
    window.addEventListener("load", () => this.loadPage("Abuja"));
    document.getElementById("checkbox-unit").addEventListener("change", e => this.changeTemperature(e));
  }
  async loadPage(city) {
    document.getElementById("video").playbackRate = 0.5;
    this.city = city;
    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    const forecastWeather = await this.model.getForecastWeather(city, this.unit);
    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }
  checkIfEnter(e) {
    if (e.key === "Enter") document.getElementById("search").blur();
  }
  changeTemperature(e) {
    const unit = e.currentTarget.checked ? "imperial" : "metric";
    this.view.changeUnitTemp(unit);
    this.unit = unit;
    this.loadPage(this.city);
  }
}

/***/ }),

/***/ "./src/scripts/models/APIs.js":
/*!************************************!*\
  !*** ./src/scripts/models/APIs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ APIs)
/* harmony export */ });
class APIs {
  constructor() {
    this.urlGenerator = new UrlGenerator("e52320b984040185e6040a1e67f254e0");
  }
  async getGeoCoordinates(city) {
    try {
      const url = this.urlGenerator.generateGeoCoordsUrl(city);
      const response = await fetch(url, {
        mode: "cors"
      });
      const geocodingData = await response.json();
      const {
        lat,
        lon
      } = geocodingData[0];
      document.getElementById("error").style.display = "none";
      return {
        lat,
        lon
      };
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
  async getCurrentWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateCurrentWeatherUrl(lat, lon, unit);
      const response = await fetch(url, {
        mode: "cors"
      });
      const weatherData = await response.json();
      document.getElementById("error").style.display = "none";
      return weatherData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
  async getForecastWeatherData(city, unit) {
    try {
      const {
        lat,
        lon
      } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateForecastWeatherUrl(lat, lon, unit);
      const response = await fetch(url, {
        mode: "cors"
      });
      const forecastData = await response.json();
      document.getElementById("error").style.display = "none";
      return forecastData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
}
class UrlGenerator {
  constructor(appId) {
    this.baseUrl = "https://api.openweathermap.org";
    this.appId = appId;
  }
  generateGeoCoordsUrl(city) {
    return `${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.appId}`;
  }
  generateCurrentWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.appId}&units=${unit}`;
  }
  generateForecastWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=${this.appId}&units=${unit}`;
  }
}

/***/ }),

/***/ "./src/scripts/models/cityInfo.js":
/*!****************************************!*\
  !*** ./src/scripts/models/cityInfo.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfo)
/* harmony export */ });
class CityInfo {
  constructor(ApiData) {
    this.cityDescription = this.createCityDescription(ApiData);
    this.dateDescription = this.createDateDescription(ApiData);
  }
  createCityDescription(ApiData) {
    const city = ApiData.name;
    const {
      country
    } = ApiData.sys;
    return `${city}, ${country}`;
  }
  createDateDescription(ApiData) {
    const day = this.getDay();
    const month = this.getMonth();
    const date = this.getDate();
    return `${day}, ${month} ${date}`;
  }
  getDay() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = weekday[d.getDay()];
    return day;
  }
  getMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month = monthNames[d.getMonth()];
    return month;
  }
  getDate() {
    const d = new Date();
    const date = d.getDate();
    return date;
  }
}

/***/ }),

/***/ "./src/scripts/models/currentWeather.js":
/*!**********************************************!*\
  !*** ./src/scripts/models/currentWeather.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeather)
/* harmony export */ });
class CurrentWeather {
  constructor(currentWeatherData, unit) {
    this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
    this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = this.getWeatherConditionImg(currentWeatherData.weather[0].main, currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.backgroundVideo = this.getBackgroundVideoLink(this.weatherConditionImg);
  }
  getTemperature(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }
  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = unixTime === 0 ? new Date() : new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }
  convertToSearchedCityTime(unixTime, timezone) {
    const dateInSearchedCity = this.convertToSearchedCityDate(unixTime, timezone);
    const hours = dateInSearchedCity.getHours();
    const minutes = `0${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
  }
  getWeatherConditionImg(value, sunriseUnix, sunsetUnix, timezone) {
    if (value === "Drizzle") return "Rain";
    const mistEquivalentes = ["Smoke", "Haze", "Dust", "Fog", "Sand", "Dust", "Ash", "Squall", "Tornado"];
    if (mistEquivalentes.includes(value)) return "Mist";
    if (value !== "Clear") return value;
    const currentDate = this.convertToSearchedCityDate(0, timezone);
    const sunriseDate = this.convertToSearchedCityDate(sunriseUnix, timezone);
    const sunsetDate = this.convertToSearchedCityDate(sunsetUnix, timezone);
    return currentDate > sunriseDate && currentDate < sunsetDate ? `${value}Day` : `${value}Night`;
  }
  getBackgroundVideoLink(weatherCondition) {
    const videoLinks = {
      ClearDay: "https://player.vimeo.com/external/345805150.hd.mp4?s=36c4e596b480ef0e8049370becbaf261b3989a01&profile_id=170&oauth2_token_id=57447761",
      ClearNight: "https://player.vimeo.com/external/469307950.hd.mp4?s=2e67aa02a21d5c64c6579043a78f09723ebc5ddb&profile_id=175&oauth2_token_id=57447761",
      Clouds: "https://player.vimeo.com/external/444212674.hd.mp4?s=4071981264d9e78acf09a0400e4638432495c4f0&profile_id=175&oauth2_token_id=57447761",
      Mist: "https://player.vimeo.com/external/343732132.hd.mp4?s=5bfde23f17e3858dbdc140afe7a35b6a9ef1127d&profile_id=175&oauth2_token_id=57447761",
      Rain: "https://player.vimeo.com/external/569217602.hd.mp4?s=9a96178c91fe19a6317ed594785f2e368cd1eade&profile_id=174&oauth2_token_id=57447761",
      Snow: "https://player.vimeo.com/external/510831169.hd.mp4?s=d90049559b76f0b9e0bda102ea8a7421d7a64d81&profile_id=175&oauth2_token_id=57447761",
      Thunderstorm: "https://player.vimeo.com/external/480223896.hd.mp4?s=e4b94f0b5700bfa68cb6f02b41f94ecca91242e9&profile_id=169&oauth2_token_id=57447761"
    };
    return videoLinks[weatherCondition];
  }
}

/***/ }),

/***/ "./src/scripts/models/forecastWeather.js":
/*!***********************************************!*\
  !*** ./src/scripts/models/forecastWeather.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForecastWeather)
/* harmony export */ });
class ForecastWeather {
  constructor(forecastWeatherData, unit) {
    this.temperatures = this.getTemperatures(forecastWeatherData, unit);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
    this.time = this.getTimes(forecastWeatherData);
  }
  getTemperatures(forecastWeatherData, unit) {
    const temperatures = [];
    forecastWeatherData.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      const tempWithUnit = this.getTemperatureUnit(temp, unit);
      temperatures.push(tempWithUnit);
    });
    return temperatures;
  }
  getTemperatureUnit(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }
  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }
  getWeatherConditionImg(value, time, sunriseUnix, sunsetUnix, timezone) {
    if (value !== "Clear") return value;
    const currentHour = this.convertToSearchedCityDate(time, timezone).getHours();
    const sunriseHour = this.convertToSearchedCityDate(sunriseUnix, timezone).getHours();
    const sunsetHour = this.convertToSearchedCityDate(sunsetUnix, timezone).getHours();
    return currentHour > sunriseHour && currentHour < sunsetHour ? `${value}Day` : `${value}Night`;
  }
  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    const sunriseUnix = forecastWeatherData.city.sunrise;
    const sunsetUnix = forecastWeatherData.city.sunset;
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const cond = this.getWeatherConditionImg(item.weather[0].main, item.dt, sunriseUnix, sunsetUnix, timezone);
      weatherCondition.push(cond);
    });
    return weatherCondition;
  }
  getTimes(forecastWeatherData) {
    const times = [];
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const time = this.convertToSearchedCityTime(item, timezone);
      times.push(time);
    });
    return times;
  }
  convertToSearchedCityTime(unixTime, timezone) {
    const localDate = new Date(unixTime.dt * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    const hours = dateInSearchedCity.getHours();
    const time = `${hours}:00`;
    return time;
  }
}

/***/ }),

/***/ "./src/scripts/models/mainModel.js":
/*!*****************************************!*\
  !*** ./src/scripts/models/mainModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainModel)
/* harmony export */ });
/* harmony import */ var _currentWeather__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currentWeather */ "./src/scripts/models/currentWeather.js");
/* harmony import */ var _forecastWeather__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forecastWeather */ "./src/scripts/models/forecastWeather.js");
/* harmony import */ var _cityInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cityInfo */ "./src/scripts/models/cityInfo.js");
/* harmony import */ var _APIs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./APIs */ "./src/scripts/models/APIs.js");




class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new _APIs__WEBPACK_IMPORTED_MODULE_3__["default"]();
  }
  async getCityInfo(city, unit) {
    const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
    const cityInfo = new _cityInfo__WEBPACK_IMPORTED_MODULE_2__["default"](ApiData);
    return cityInfo;
  }
  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new _currentWeather__WEBPACK_IMPORTED_MODULE_0__["default"](currentWeatherData, unit);
    return currentWeather;
  }
  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new _forecastWeather__WEBPACK_IMPORTED_MODULE_1__["default"](forecastWeatherData, unit);
    return forecastWeather;
  }
}

/***/ }),

/***/ "./src/scripts/views/cityInfoView.js":
/*!*******************************************!*\
  !*** ./src/scripts/views/cityInfoView.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfoView)
/* harmony export */ });
class CityInfoView {
  constructor(element, cityInfoModel) {
    this.element = element;
    this.model = cityInfoModel;
    this.city = cityInfoModel.cityDescription;
    this.date = cityInfoModel.dateDescription;
  }
  get city() {
    return this.element.querySelector("h1");
  }
  set city(value) {
    this.city.textContent = value;
  }
  get date() {
    return this.element.querySelector("h2");
  }
  set date(value) {
    this.date.textContent = value;
  }
}

/***/ }),

/***/ "./src/scripts/views/climaproView.js":
/*!*******************************************!*\
  !*** ./src/scripts/views/climaproView.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainView)
/* harmony export */ });
/* harmony import */ var _cityInfoView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cityInfoView */ "./src/scripts/views/cityInfoView.js");
/* harmony import */ var _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currentWeatherView */ "./src/scripts/views/currentWeatherView.js");
/* harmony import */ var _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forecastWeatherView */ "./src/scripts/views/forecastWeatherView.js");



class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById("city-info");
    new _cityInfoView__WEBPACK_IMPORTED_MODULE_0__["default"](element, cityInfo);
  }
  appendCurrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__["default"](element, currentWeather);
  }
  appendForecastWeather(forecastWeather) {
    const element = document.getElementById("forecast");
    new _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__["default"](element, forecastWeather);
  }
  changeUnitTemp(unit) {
    if (unit === "imperial") {
      document.querySelector(".unitC").style.color = "white";
      document.querySelector(".unitF").style.color = "black";
    } else {
      document.querySelector(".unitF").style.color = "white";
      document.querySelector(".unitC").style.color = "black";
    }
  }
}

/***/ }),

/***/ "./src/scripts/views/currentWeatherView.js":
/*!*************************************************!*\
  !*** ./src/scripts/views/currentWeatherView.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeatherView)
/* harmony export */ });
class CurrentWeatherView {
  constructor(element, currentWeatherModel) {
    this.element = element;
    this.model = currentWeatherModel;
    this.weatherConditionImg = currentWeatherModel.weatherConditionImg;
    this.temperature = currentWeatherModel.temperature;
    this.weatherConditionDesc = currentWeatherModel.weatherConditionDesc;
    this.feelsLikeTemp = currentWeatherModel.feelsLikeTemp;
    this.sunrise = currentWeatherModel.sunrise;
    this.sunset = currentWeatherModel.sunset;
    this.humidity = currentWeatherModel.humidity;
    this.windSpeed = currentWeatherModel.windSpeed;
    this.pressure = currentWeatherModel.pressure;
    this.nowWeatherCondition = currentWeatherModel.weatherConditionImg;
    this.nowTemperature = currentWeatherModel.temperature;
    this.backgroundVideo = currentWeatherModel.backgroundVideo;
  }
  get weatherConditionImg() {
    return this.element.querySelector("img");
  }
  set weatherConditionImg(value) {
    this.weatherConditionImg.src = `images/${value}.png`;
  }
  get temperature() {
    return this.element.querySelector("h1");
  }
  set temperature(value) {
    this.temperature.textContent = value;
  }
  get weatherConditionDesc() {
    return this.element.querySelector("h2");
  }
  set weatherConditionDesc(value) {
    this.weatherConditionDesc.textContent = value;
  }
  get feelsLikeTemp() {
    return this.element.querySelector(".feels-like");
  }
  set feelsLikeTemp(value) {
    this.feelsLikeTemp.textContent = value;
  }
  get sunrise() {
    return this.element.querySelector(".sunrise");
  }
  set sunrise(value) {
    this.sunrise.textContent = value;
  }
  get sunset() {
    return this.element.querySelector(".sunset");
  }
  set sunset(value) {
    this.sunset.textContent = value;
  }
  get humidity() {
    return this.element.querySelector(".humidity");
  }
  set humidity(value) {
    this.humidity.textContent = value;
  }
  get windSpeed() {
    return this.element.querySelector(".wind-speed");
  }
  set windSpeed(value) {
    this.windSpeed.textContent = value;
  }
  get pressure() {
    return this.element.querySelector(".pressure");
  }
  set pressure(value) {
    this.pressure.textContent = value;
  }
  get nowWeatherCondition() {
    return document.getElementById("forecast__item__current-condition");
  }
  set nowWeatherCondition(value) {
    this.nowWeatherCondition.src = `images/${value}.png`;
  }
  get nowTemperature() {
    return document.getElementById("forecast__item__curent-temp");
  }
  set nowTemperature(value) {
    this.nowTemperature.textContent = value;
  }
  get backgroundVideo() {
    return document.getElementById("video");
  }
  set backgroundVideo(value) {
    this.backgroundVideo.src = value;
  }
}

/***/ }),

/***/ "./src/scripts/views/forecastWeatherView.js":
/*!**************************************************!*\
  !*** ./src/scripts/views/forecastWeatherView.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ forecastWeatherView)
/* harmony export */ });
class forecastWeatherView {
  constructor(element, forecastWeatherModel) {
    this.element = element;
    this.model = forecastWeatherModel;
    this.time = forecastWeatherModel.time;
    this.weatherCondition = forecastWeatherModel.weatherCondition;
    this.temperatures = forecastWeatherModel.temperatures;
  }
  get time() {
    return this.element.querySelectorAll(".forecast__item__time");
  }
  set time(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.time[i].textContent = value[i];
    }
  }
  get weatherCondition() {
    return this.element.querySelectorAll("img");
  }
  set weatherCondition(value) {
    for (let i = 1; i < this.weatherCondition.length; i++) {
      this.weatherCondition[i].src = `images/${value[i - 1]}.png`;
    }
  }
  get temperatures() {
    return this.element.querySelectorAll(".forecast__item__temperature");
  }
  set temperatures(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.temperatures[i].textContent = value[i];
    }
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../images/magnify.png */ "./src/images/magnify.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\r\n  --clr-neutral: hsl(0, 0%, 100%);\r\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\r\n  --ff-primary: \"Poppins\", sans-serif;\r\n  --fw-300: 300;\r\n  --fw-400: 400;\r\n  --fw-500: 500;\r\n  --fw-600: 600;\r\n  --fw-700: 700;\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n  text-shadow: 2px 2px 8px #000000;\r\n}\r\n\r\nbody {\r\n  width: 100vw;\r\n  min-height: 100vh;\r\n  background-image: url(https://i.pinimg.com/originals/e7/7f/c3/e77fc3197e445ac3e61e628e0a8cfbf9.gif);\r\n  background-color: rgb(13, 0, 132);\r\n  font-family: var(--ff-primary);\r\n  color: var(--clr-neutral);\r\n}\r\n\r\nmain {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-evenly;\r\n  position: relative;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  padding: 4rem 2rem;\r\n  overflow: hidden;\r\n}\r\n\r\n.video-container {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  z-index: -5;\r\n}\r\n\r\nvideo {\r\n  width: 100vw;\r\n  height: 100vh;\r\n  object-fit: cover;\r\n  animation: slowLoop 1000s infinite linear;\r\n}\r\n@keyframes slowLoop {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; }\r\n  90% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n}\r\n\r\n.overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0.5, 0.5); \r\n}\r\n\r\nfooter {\r\n  background-color: #33333322; \r\n  color: white; \r\n  padding: 20px;\r\n  text-align: center;\r\n}\r\n\r\n.footer-content {\r\n  max-width: 1200px; \r\n  margin: 0 auto;\r\n   \r\n}\r\n.footer-content a {\r\n  color: #ff8400;\r\n}\r\n\r\n\r\n.unitC,\r\n.unitF {\r\n  font-size: 0.85rem;\r\n  height: 16px;\r\n  width: 16px;\r\n  border-radius: 8px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  color: black;\r\n  z-index: 20;\r\n  pointer-events: none;\r\n  text-shadow: none;\r\n}\r\n\r\n.unitF {\r\n  color: white;\r\n}\r\n\r\n.checkbox-container {\r\n  position: absolute;\r\n  top: 3rem;\r\n  right: 3rem;\r\n}\r\n\r\n.checkbox {\r\n  opacity: 0;\r\n  position: absolute;\r\n}\r\n\r\n.label {\r\n  background-color: #111;\r\n  border-radius: 50px;\r\n  cursor: pointer;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  padding: 5px;\r\n  position: relative;\r\n  height: 26px;\r\n  width: 50px;\r\n  transform: scale(1.5);\r\n}\r\n\r\n.label .ball {\r\n  background-color: #fff;\r\n  border-radius: 50%;\r\n  position: absolute;\r\n  top: 2px;\r\n  left: 2px;\r\n  height: 22px;\r\n  width: 22px;\r\n  transform: translateX(0px);\r\n  transition: transform 0.2s linear;\r\n}\r\n\r\n.checkbox:checked + .label .ball {\r\n  transform: translateX(24px);\r\n}\r\n\r\n.search-wrapper {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 10px;\r\n}\r\n\r\n.search-wrapper input {\r\n  width: 40%;\r\n  padding: 10px 10px 10px 40px;\r\n  border-radius: 2rem;\r\n  border: none;\r\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\r\n  background-repeat: no-repeat;\r\n  background-position: 10px center;\r\n  background-size: calc(1rem + 0.5vw);\r\n  background-color: white;\r\n  text-shadow: none;\r\n}\r\n\r\n#error {\r\n  display: none;\r\n}\r\n\r\n.city-info h1 {\r\n  margin: 0.3rem 0;\r\n  letter-spacing: 0.1rem;\r\n  font-weight: var(--fw-600);\r\n  font-size: 2.5rem;\r\n}\r\n\r\nh2 {\r\n  font-size: 1.1rem;\r\n  font-weight: var(--fw-300);\r\n}\r\n\r\n.current-weather {\r\n  display: flex;\r\n  justify-content: space-around;\r\n}\r\n\r\n.current-weather_cointainer {\r\n  display: flex;\r\n}\r\n\r\n.current-weather_cointainer img {\r\n  width: calc(10rem + 10vw);\r\n}\r\n\r\n.current-weather_cointainer h1 {\r\n  margin: 0.3rem 0;\r\n  font-size: 4rem;\r\n  font-weight: var(--fw-400);\r\n}\r\n\r\n.current-weather_temp {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n}\r\n\r\n.current-weather__details {\r\n  display: flex;\r\n  align-items: center;\r\n  align-self: center;\r\n  height: max-content;\r\n  padding: 2rem 4rem;\r\n  gap: 4rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.current-weather__item {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  font-size: 1rem;\r\n}\r\n\r\n.current-weather__item img {\r\n  width: calc(1rem + 1vw);\r\n}\r\n\r\n.current-weather__details__column {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1rem;\r\n}\r\n\r\n.forecast {\r\n  display: flex;\r\n  justify-content: space-around;\r\n  width: 100%;\r\n  padding: 1rem 2rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.forecast__item {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.forecast__item img {\r\n  width: calc(2rem + 3vw);\r\n}\r\n", "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"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","sourcesContent":["@import url(./normalize.css);\r\n\r\n:root {\r\n  --clr-neutral: hsl(0, 0%, 100%);\r\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\r\n  --ff-primary: \"Poppins\", sans-serif;\r\n  --fw-300: 300;\r\n  --fw-400: 400;\r\n  --fw-500: 500;\r\n  --fw-600: 600;\r\n  --fw-700: 700;\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n  text-shadow: 2px 2px 8px #000000;\r\n}\r\n\r\nbody {\r\n  width: 100vw;\r\n  min-height: 100vh;\r\n  background-image: url(https://i.pinimg.com/originals/e7/7f/c3/e77fc3197e445ac3e61e628e0a8cfbf9.gif);\r\n  background-color: rgb(13, 0, 132);\r\n  font-family: var(--ff-primary);\r\n  color: var(--clr-neutral);\r\n}\r\n\r\nmain {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-evenly;\r\n  position: relative;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  padding: 4rem 2rem;\r\n  overflow: hidden;\r\n}\r\n\r\n.video-container {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  z-index: -5;\r\n}\r\n\r\nvideo {\r\n  width: 100vw;\r\n  height: 100vh;\r\n  object-fit: cover;\r\n  animation: slowLoop 1000s infinite linear;\r\n}\r\n@keyframes slowLoop {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; }\r\n  90% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n}\r\n\r\n.overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0.5, 0.5); \r\n}\r\n\r\nfooter {\r\n  background-color: #33333322; \r\n  color: white; \r\n  padding: 20px;\r\n  text-align: center;\r\n}\r\n\r\n.footer-content {\r\n  max-width: 1200px; \r\n  margin: 0 auto;\r\n   \r\n}\r\n.footer-content a {\r\n  color: #ff8400;\r\n}\r\n\r\n\r\n.unitC,\r\n.unitF {\r\n  font-size: 0.85rem;\r\n  height: 16px;\r\n  width: 16px;\r\n  border-radius: 8px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  color: black;\r\n  z-index: 20;\r\n  pointer-events: none;\r\n  text-shadow: none;\r\n}\r\n\r\n.unitF {\r\n  color: white;\r\n}\r\n\r\n.checkbox-container {\r\n  position: absolute;\r\n  top: 3rem;\r\n  right: 3rem;\r\n}\r\n\r\n.checkbox {\r\n  opacity: 0;\r\n  position: absolute;\r\n}\r\n\r\n.label {\r\n  background-color: #111;\r\n  border-radius: 50px;\r\n  cursor: pointer;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  padding: 5px;\r\n  position: relative;\r\n  height: 26px;\r\n  width: 50px;\r\n  transform: scale(1.5);\r\n}\r\n\r\n.label .ball {\r\n  background-color: #fff;\r\n  border-radius: 50%;\r\n  position: absolute;\r\n  top: 2px;\r\n  left: 2px;\r\n  height: 22px;\r\n  width: 22px;\r\n  transform: translateX(0px);\r\n  transition: transform 0.2s linear;\r\n}\r\n\r\n.checkbox:checked + .label .ball {\r\n  transform: translateX(24px);\r\n}\r\n\r\n.search-wrapper {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 10px;\r\n}\r\n\r\n.search-wrapper input {\r\n  width: 40%;\r\n  padding: 10px 10px 10px 40px;\r\n  border-radius: 2rem;\r\n  border: none;\r\n  background-image: url(../images/magnify.png);\r\n  background-repeat: no-repeat;\r\n  background-position: 10px center;\r\n  background-size: calc(1rem + 0.5vw);\r\n  background-color: white;\r\n  text-shadow: none;\r\n}\r\n\r\n#error {\r\n  display: none;\r\n}\r\n\r\n.city-info h1 {\r\n  margin: 0.3rem 0;\r\n  letter-spacing: 0.1rem;\r\n  font-weight: var(--fw-600);\r\n  font-size: 2.5rem;\r\n}\r\n\r\nh2 {\r\n  font-size: 1.1rem;\r\n  font-weight: var(--fw-300);\r\n}\r\n\r\n.current-weather {\r\n  display: flex;\r\n  justify-content: space-around;\r\n}\r\n\r\n.current-weather_cointainer {\r\n  display: flex;\r\n}\r\n\r\n.current-weather_cointainer img {\r\n  width: calc(10rem + 10vw);\r\n}\r\n\r\n.current-weather_cointainer h1 {\r\n  margin: 0.3rem 0;\r\n  font-size: 4rem;\r\n  font-weight: var(--fw-400);\r\n}\r\n\r\n.current-weather_temp {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n}\r\n\r\n.current-weather__details {\r\n  display: flex;\r\n  align-items: center;\r\n  align-self: center;\r\n  height: max-content;\r\n  padding: 2rem 4rem;\r\n  gap: 4rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.current-weather__item {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  font-size: 1rem;\r\n}\r\n\r\n.current-weather__item img {\r\n  width: calc(1rem + 1vw);\r\n}\r\n\r\n.current-weather__details__column {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1rem;\r\n}\r\n\r\n.forecast {\r\n  display: flex;\r\n  justify-content: space-around;\r\n  width: 100%;\r\n  padding: 1rem 2rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.forecast__item {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.forecast__item img {\r\n  width: calc(2rem + 3vw);\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\r\n\r\n/* Document\r\n   ========================================================================== */\r\n\r\n/**\r\n * 1. Correct the line height in all browsers.\r\n * 2. Prevent adjustments of font size after orientation changes in iOS.\r\n */\r\n\r\n html {\r\n    line-height: 1.15; /* 1 */\r\n    -webkit-text-size-adjust: 100%; /* 2 */\r\n  }\r\n  \r\n  /* Sections\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the margin in all browsers.\r\n   */\r\n  \r\n  body {\r\n    margin: 0;\r\n  }\r\n  \r\n  /**\r\n   * Render the `main` element consistently in IE.\r\n   */\r\n  \r\n  main {\r\n    display: block;\r\n  }\r\n  \r\n  /**\r\n   * Correct the font size and margin on `h1` elements within `section` and\r\n   * `article` contexts in Chrome, Firefox, and Safari.\r\n   */\r\n  \r\n  h1 {\r\n    font-size: 2em;\r\n    margin: 0.67em 0;\r\n  }\r\n  \r\n  /* Grouping content\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * 1. Add the correct box sizing in Firefox.\r\n   * 2. Show the overflow in Edge and IE.\r\n   */\r\n  \r\n  hr {\r\n    box-sizing: content-box; /* 1 */\r\n    height: 0; /* 1 */\r\n    overflow: visible; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inheritance and scaling of font size in all browsers.\r\n   * 2. Correct the odd `em` font sizing in all browsers.\r\n   */\r\n  \r\n  pre {\r\n    font-family: monospace, monospace; /* 1 */\r\n    font-size: 1em; /* 2 */\r\n  }\r\n  \r\n  /* Text-level semantics\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the gray background on active links in IE 10.\r\n   */\r\n  \r\n  a {\r\n    background-color: transparent;\r\n  }\r\n  \r\n  /**\r\n   * 1. Remove the bottom border in Chrome 57-\r\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\r\n   */\r\n  \r\n  abbr[title] {\r\n    border-bottom: none; /* 1 */\r\n    text-decoration: underline; /* 2 */\r\n    text-decoration: underline dotted; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct font weight in Chrome, Edge, and Safari.\r\n   */\r\n  \r\n  b,\r\n  strong {\r\n    font-weight: bolder;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inheritance and scaling of font size in all browsers.\r\n   * 2. Correct the odd `em` font sizing in all browsers.\r\n   */\r\n  \r\n  code,\r\n  kbd,\r\n  samp {\r\n    font-family: monospace, monospace; /* 1 */\r\n    font-size: 1em; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct font size in all browsers.\r\n   */\r\n  \r\n  small {\r\n    font-size: 80%;\r\n  }\r\n  \r\n  /**\r\n   * Prevent `sub` and `sup` elements from affecting the line height in\r\n   * all browsers.\r\n   */\r\n  \r\n  sub,\r\n  sup {\r\n    font-size: 75%;\r\n    line-height: 0;\r\n    position: relative;\r\n    vertical-align: baseline;\r\n  }\r\n  \r\n  sub {\r\n    bottom: -0.25em;\r\n  }\r\n  \r\n  sup {\r\n    top: -0.5em;\r\n  }\r\n  \r\n  /* Embedded content\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the border on images inside links in IE 10.\r\n   */\r\n  \r\n  img {\r\n    border-style: none;\r\n  }\r\n  \r\n  /* Forms\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * 1. Change the font styles in all browsers.\r\n   * 2. Remove the margin in Firefox and Safari.\r\n   */\r\n  \r\n  button,\r\n  input,\r\n  optgroup,\r\n  select,\r\n  textarea {\r\n    font-family: inherit; /* 1 */\r\n    font-size: 70%; /* 1 */\r\n    line-height: 1.15; /* 1 */\r\n    margin: 0; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Show the overflow in IE.\r\n   * 1. Show the overflow in Edge.\r\n   */\r\n  \r\n  button,\r\n  input { /* 1 */\r\n    overflow: visible;\r\n  }\r\n  \r\n  /**\r\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\r\n   * 1. Remove the inheritance of text transform in Firefox.\r\n   */\r\n  \r\n  button,\r\n  select { /* 1 */\r\n    text-transform: none;\r\n  }\r\n  \r\n  /**\r\n   * Correct the inability to style clickable types in iOS and Safari.\r\n   */\r\n  \r\n  button,\r\n  [type=\"button\"],\r\n  [type=\"reset\"],\r\n  [type=\"submit\"] {\r\n    -webkit-appearance: button;\r\n  }\r\n  \r\n  /**\r\n   * Remove the inner border and padding in Firefox.\r\n   */\r\n  \r\n  button::-moz-focus-inner,\r\n  [type=\"button\"]::-moz-focus-inner,\r\n  [type=\"reset\"]::-moz-focus-inner,\r\n  [type=\"submit\"]::-moz-focus-inner {\r\n    border-style: none;\r\n    padding: 0;\r\n  }\r\n  \r\n  /**\r\n   * Restore the focus styles unset by the previous rule.\r\n   */\r\n  \r\n  button:-moz-focusring,\r\n  [type=\"button\"]:-moz-focusring,\r\n  [type=\"reset\"]:-moz-focusring,\r\n  [type=\"submit\"]:-moz-focusring {\r\n    outline: 1px dotted ButtonText;\r\n  }\r\n  \r\n  /**\r\n   * Correct the padding in Firefox.\r\n   */\r\n  \r\n  fieldset {\r\n    padding: 0.35em 0.75em 0.625em;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the text wrapping in Edge and IE.\r\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\r\n   * 3. Remove the padding so developers are not caught out when they zero out\r\n   *    `fieldset` elements in all browsers.\r\n   */\r\n  \r\n  legend {\r\n    box-sizing: border-box; /* 1 */\r\n    color: inherit; /* 2 */\r\n    display: table; /* 1 */\r\n    max-width: 100%; /* 1 */\r\n    padding: 0; /* 3 */\r\n    white-space: normal; /* 1 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\r\n   */\r\n  \r\n  progress {\r\n    vertical-align: baseline;\r\n  }\r\n  \r\n  /**\r\n   * Remove the default vertical scrollbar in IE 10+.\r\n   */\r\n  \r\n  textarea {\r\n    overflow: auto;\r\n  }\r\n  \r\n  /**\r\n   * 1. Add the correct box sizing in IE 10.\r\n   * 2. Remove the padding in IE 10.\r\n   */\r\n  \r\n  [type=\"checkbox\"],\r\n  [type=\"radio\"] {\r\n    box-sizing: border-box; /* 1 */\r\n    padding: 0; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Correct the cursor style of increment and decrement buttons in Chrome.\r\n   */\r\n  \r\n  [type=\"number\"]::-webkit-inner-spin-button,\r\n  [type=\"number\"]::-webkit-outer-spin-button {\r\n    height: auto;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the odd appearance in Chrome and Safari.\r\n   * 2. Correct the outline style in Safari.\r\n   */\r\n  \r\n  [type=\"search\"] {\r\n    -webkit-appearance: textfield; /* 1 */\r\n    outline-offset: -2px; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Remove the inner padding in Chrome and Safari on macOS.\r\n   */\r\n  \r\n  [type=\"search\"]::-webkit-search-decoration {\r\n    -webkit-appearance: none;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inability to style clickable types in iOS and Safari.\r\n   * 2. Change font properties to `inherit` in Safari.\r\n   */\r\n  \r\n  ::-webkit-file-upload-button {\r\n    -webkit-appearance: button; /* 1 */\r\n    font: inherit; /* 2 */\r\n  }\r\n  \r\n  /* Interactive\r\n     ========================================================================== */\r\n  \r\n  /*\r\n   * Add the correct display in Edge, IE 10+, and Firefox.\r\n   */\r\n  \r\n  details {\r\n    display: block;\r\n  }\r\n  \r\n  /*\r\n   * Add the correct display in all browsers.\r\n   */\r\n  \r\n  summary {\r\n    display: list-item;\r\n  }\r\n  \r\n  /* Misc\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Add the correct display in IE 10+.\r\n   */\r\n  \r\n  template {\r\n    display: none;\r\n  }\r\n  \r\n  /**\r\n   * Add the correct display in IE 10.\r\n   */\r\n  \r\n  [hidden] {\r\n    display: none;\r\n  }", "",{"version":3,"sources":["webpack://./src/styles/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;CAED;IACG,iBAAiB,EAAE,MAAM;IACzB,8BAA8B,EAAE,MAAM;EACxC;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,SAAS;EACX;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;IACE,cAAc;IACd,gBAAgB;EAClB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;IACE,uBAAuB,EAAE,MAAM;IAC/B,SAAS,EAAE,MAAM;IACjB,iBAAiB,EAAE,MAAM;EAC3B;;EAEA;;;IAGE;;EAEF;IACE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,6BAA6B;EAC/B;;EAEA;;;IAGE;;EAEF;IACE,mBAAmB,EAAE,MAAM;IAC3B,0BAA0B,EAAE,MAAM;IAClC,iCAAiC,EAAE,MAAM;EAC3C;;EAEA;;IAEE;;EAEF;;IAEE,mBAAmB;EACrB;;EAEA;;;IAGE;;EAEF;;;IAGE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,wBAAwB;EAC1B;;EAEA;IACE,eAAe;EACjB;;EAEA;IACE,WAAW;EACb;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;;;;;IAKE,oBAAoB,EAAE,MAAM;IAC5B,cAAc,EAAE,MAAM;IACtB,iBAAiB,EAAE,MAAM;IACzB,SAAS,EAAE,MAAM;EACnB;;EAEA;;;IAGE;;EAEF;UACQ,MAAM;IACZ,iBAAiB;EACnB;;EAEA;;;IAGE;;EAEF;WACS,MAAM;IACb,oBAAoB;EACtB;;EAEA;;IAEE;;EAEF;;;;IAIE,0BAA0B;EAC5B;;EAEA;;IAEE;;EAEF;;;;IAIE,kBAAkB;IAClB,UAAU;EACZ;;EAEA;;IAEE;;EAEF;;;;IAIE,8BAA8B;EAChC;;EAEA;;IAEE;;EAEF;IACE,8BAA8B;EAChC;;EAEA;;;;;IAKE;;EAEF;IACE,sBAAsB,EAAE,MAAM;IAC9B,cAAc,EAAE,MAAM;IACtB,cAAc,EAAE,MAAM;IACtB,eAAe,EAAE,MAAM;IACvB,UAAU,EAAE,MAAM;IAClB,mBAAmB,EAAE,MAAM;EAC7B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,sBAAsB,EAAE,MAAM;IAC9B,UAAU,EAAE,MAAM;EACpB;;EAEA;;IAEE;;EAEF;;IAEE,YAAY;EACd;;EAEA;;;IAGE;;EAEF;IACE,6BAA6B,EAAE,MAAM;IACrC,oBAAoB,EAAE,MAAM;EAC9B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;;IAGE;;EAEF;IACE,0BAA0B,EAAE,MAAM;IAClC,aAAa,EAAE,MAAM;EACvB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,aAAa;EACf;;EAEA;;IAEE;;EAEF;IACE,aAAa;EACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\r\n\r\n/* Document\r\n   ========================================================================== */\r\n\r\n/**\r\n * 1. Correct the line height in all browsers.\r\n * 2. Prevent adjustments of font size after orientation changes in iOS.\r\n */\r\n\r\n html {\r\n    line-height: 1.15; /* 1 */\r\n    -webkit-text-size-adjust: 100%; /* 2 */\r\n  }\r\n  \r\n  /* Sections\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the margin in all browsers.\r\n   */\r\n  \r\n  body {\r\n    margin: 0;\r\n  }\r\n  \r\n  /**\r\n   * Render the `main` element consistently in IE.\r\n   */\r\n  \r\n  main {\r\n    display: block;\r\n  }\r\n  \r\n  /**\r\n   * Correct the font size and margin on `h1` elements within `section` and\r\n   * `article` contexts in Chrome, Firefox, and Safari.\r\n   */\r\n  \r\n  h1 {\r\n    font-size: 2em;\r\n    margin: 0.67em 0;\r\n  }\r\n  \r\n  /* Grouping content\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * 1. Add the correct box sizing in Firefox.\r\n   * 2. Show the overflow in Edge and IE.\r\n   */\r\n  \r\n  hr {\r\n    box-sizing: content-box; /* 1 */\r\n    height: 0; /* 1 */\r\n    overflow: visible; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inheritance and scaling of font size in all browsers.\r\n   * 2. Correct the odd `em` font sizing in all browsers.\r\n   */\r\n  \r\n  pre {\r\n    font-family: monospace, monospace; /* 1 */\r\n    font-size: 1em; /* 2 */\r\n  }\r\n  \r\n  /* Text-level semantics\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the gray background on active links in IE 10.\r\n   */\r\n  \r\n  a {\r\n    background-color: transparent;\r\n  }\r\n  \r\n  /**\r\n   * 1. Remove the bottom border in Chrome 57-\r\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\r\n   */\r\n  \r\n  abbr[title] {\r\n    border-bottom: none; /* 1 */\r\n    text-decoration: underline; /* 2 */\r\n    text-decoration: underline dotted; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct font weight in Chrome, Edge, and Safari.\r\n   */\r\n  \r\n  b,\r\n  strong {\r\n    font-weight: bolder;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inheritance and scaling of font size in all browsers.\r\n   * 2. Correct the odd `em` font sizing in all browsers.\r\n   */\r\n  \r\n  code,\r\n  kbd,\r\n  samp {\r\n    font-family: monospace, monospace; /* 1 */\r\n    font-size: 1em; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct font size in all browsers.\r\n   */\r\n  \r\n  small {\r\n    font-size: 80%;\r\n  }\r\n  \r\n  /**\r\n   * Prevent `sub` and `sup` elements from affecting the line height in\r\n   * all browsers.\r\n   */\r\n  \r\n  sub,\r\n  sup {\r\n    font-size: 75%;\r\n    line-height: 0;\r\n    position: relative;\r\n    vertical-align: baseline;\r\n  }\r\n  \r\n  sub {\r\n    bottom: -0.25em;\r\n  }\r\n  \r\n  sup {\r\n    top: -0.5em;\r\n  }\r\n  \r\n  /* Embedded content\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Remove the border on images inside links in IE 10.\r\n   */\r\n  \r\n  img {\r\n    border-style: none;\r\n  }\r\n  \r\n  /* Forms\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * 1. Change the font styles in all browsers.\r\n   * 2. Remove the margin in Firefox and Safari.\r\n   */\r\n  \r\n  button,\r\n  input,\r\n  optgroup,\r\n  select,\r\n  textarea {\r\n    font-family: inherit; /* 1 */\r\n    font-size: 70%; /* 1 */\r\n    line-height: 1.15; /* 1 */\r\n    margin: 0; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Show the overflow in IE.\r\n   * 1. Show the overflow in Edge.\r\n   */\r\n  \r\n  button,\r\n  input { /* 1 */\r\n    overflow: visible;\r\n  }\r\n  \r\n  /**\r\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\r\n   * 1. Remove the inheritance of text transform in Firefox.\r\n   */\r\n  \r\n  button,\r\n  select { /* 1 */\r\n    text-transform: none;\r\n  }\r\n  \r\n  /**\r\n   * Correct the inability to style clickable types in iOS and Safari.\r\n   */\r\n  \r\n  button,\r\n  [type=\"button\"],\r\n  [type=\"reset\"],\r\n  [type=\"submit\"] {\r\n    -webkit-appearance: button;\r\n  }\r\n  \r\n  /**\r\n   * Remove the inner border and padding in Firefox.\r\n   */\r\n  \r\n  button::-moz-focus-inner,\r\n  [type=\"button\"]::-moz-focus-inner,\r\n  [type=\"reset\"]::-moz-focus-inner,\r\n  [type=\"submit\"]::-moz-focus-inner {\r\n    border-style: none;\r\n    padding: 0;\r\n  }\r\n  \r\n  /**\r\n   * Restore the focus styles unset by the previous rule.\r\n   */\r\n  \r\n  button:-moz-focusring,\r\n  [type=\"button\"]:-moz-focusring,\r\n  [type=\"reset\"]:-moz-focusring,\r\n  [type=\"submit\"]:-moz-focusring {\r\n    outline: 1px dotted ButtonText;\r\n  }\r\n  \r\n  /**\r\n   * Correct the padding in Firefox.\r\n   */\r\n  \r\n  fieldset {\r\n    padding: 0.35em 0.75em 0.625em;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the text wrapping in Edge and IE.\r\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\r\n   * 3. Remove the padding so developers are not caught out when they zero out\r\n   *    `fieldset` elements in all browsers.\r\n   */\r\n  \r\n  legend {\r\n    box-sizing: border-box; /* 1 */\r\n    color: inherit; /* 2 */\r\n    display: table; /* 1 */\r\n    max-width: 100%; /* 1 */\r\n    padding: 0; /* 3 */\r\n    white-space: normal; /* 1 */\r\n  }\r\n  \r\n  /**\r\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\r\n   */\r\n  \r\n  progress {\r\n    vertical-align: baseline;\r\n  }\r\n  \r\n  /**\r\n   * Remove the default vertical scrollbar in IE 10+.\r\n   */\r\n  \r\n  textarea {\r\n    overflow: auto;\r\n  }\r\n  \r\n  /**\r\n   * 1. Add the correct box sizing in IE 10.\r\n   * 2. Remove the padding in IE 10.\r\n   */\r\n  \r\n  [type=\"checkbox\"],\r\n  [type=\"radio\"] {\r\n    box-sizing: border-box; /* 1 */\r\n    padding: 0; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Correct the cursor style of increment and decrement buttons in Chrome.\r\n   */\r\n  \r\n  [type=\"number\"]::-webkit-inner-spin-button,\r\n  [type=\"number\"]::-webkit-outer-spin-button {\r\n    height: auto;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the odd appearance in Chrome and Safari.\r\n   * 2. Correct the outline style in Safari.\r\n   */\r\n  \r\n  [type=\"search\"] {\r\n    -webkit-appearance: textfield; /* 1 */\r\n    outline-offset: -2px; /* 2 */\r\n  }\r\n  \r\n  /**\r\n   * Remove the inner padding in Chrome and Safari on macOS.\r\n   */\r\n  \r\n  [type=\"search\"]::-webkit-search-decoration {\r\n    -webkit-appearance: none;\r\n  }\r\n  \r\n  /**\r\n   * 1. Correct the inability to style clickable types in iOS and Safari.\r\n   * 2. Change font properties to `inherit` in Safari.\r\n   */\r\n  \r\n  ::-webkit-file-upload-button {\r\n    -webkit-appearance: button; /* 1 */\r\n    font: inherit; /* 2 */\r\n  }\r\n  \r\n  /* Interactive\r\n     ========================================================================== */\r\n  \r\n  /*\r\n   * Add the correct display in Edge, IE 10+, and Firefox.\r\n   */\r\n  \r\n  details {\r\n    display: block;\r\n  }\r\n  \r\n  /*\r\n   * Add the correct display in all browsers.\r\n   */\r\n  \r\n  summary {\r\n    display: list-item;\r\n  }\r\n  \r\n  /* Misc\r\n     ========================================================================== */\r\n  \r\n  /**\r\n   * Add the correct display in IE 10+.\r\n   */\r\n  \r\n  template {\r\n    display: none;\r\n  }\r\n  \r\n  /**\r\n   * Add the correct display in IE 10.\r\n   */\r\n  \r\n  [hidden] {\r\n    display: none;\r\n  }"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/images/magnify.png":
/*!********************************!*\
  !*** ./src/images/magnify.png ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "001051c069dde3ca2ccb.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _models_mainModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/mainModel */ "./src/scripts/models/mainModel.js");
/* harmony import */ var _views_climaproView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/climaproView */ "./src/scripts/views/climaproView.js");
/* harmony import */ var _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controllers/mainController */ "./src/scripts/controllers/mainController.js");




const model = new _models_mainModel__WEBPACK_IMPORTED_MODULE_1__["default"]();
const view = new _views_climaproView__WEBPACK_IMPORTED_MODULE_2__["default"]();
const controller = new _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__["default"](model, view);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9zcmMvc2NyaXB0cy9tb2RlbHMvQVBJcy5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL2NsaW1hLXByby8uL3NyYy9zY3JpcHRzL21vZGVscy9mb3JlY2FzdFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vc3JjL3NjcmlwdHMvbW9kZWxzL21haW5Nb2RlbC5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9zcmMvc2NyaXB0cy92aWV3cy9jaXR5SW5mb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vc3JjL3NjcmlwdHMvdmlld3MvY2xpbWFwcm9WaWV3LmpzIiwid2VicGFjazovL2NsaW1hLXByby8uL3NyYy9zY3JpcHRzL3ZpZXdzL2N1cnJlbnRXZWF0aGVyVmlldy5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9zcmMvc2NyaXB0cy92aWV3cy9mb3JlY2FzdFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL2NsaW1hLXByby8uL3NyYy9zdHlsZXMvbWFpbi5jc3MiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vc3JjL3N0eWxlcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL2NsaW1hLXByby8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9zcmMvc3R5bGVzL21haW4uY3NzP2U4MGEiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2NsaW1hLXByby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2NsaW1hLXByby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NsaW1hLXByby93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2xpbWEtcHJvL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2NsaW1hLXByby93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jbGltYS1wcm8vd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2NsaW1hLXByby8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Db250cm9sbGVyIHtcclxuICBjb25zdHJ1Y3Rvcihtb2RlbCwgdmlldykge1xyXG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xyXG4gICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIHRoaXMuY2l0eSA9IHt9O1xyXG4gICAgdGhpcy51bml0ID0gXCJtZXRyaWNcIjtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4gdGhpcy5sb2FkUGFnZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSkpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChlKSA9PiB0aGlzLmNoZWNrSWZFbnRlcihlKSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gdGhpcy5sb2FkUGFnZShcIkFidWphXCIpKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2tib3gtdW5pdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB0aGlzLmNoYW5nZVRlbXBlcmF0dXJlKGUpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGxvYWRQYWdlKGNpdHkpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikucGxheWJhY2tSYXRlID0gMC41O1xyXG5cclxuICAgIHRoaXMuY2l0eSA9IGNpdHk7XHJcblxyXG4gICAgY29uc3QgY2l0eUluZm8gPSBhd2FpdCB0aGlzLm1vZGVsLmdldENpdHlJbmZvKGNpdHksIHRoaXMudW5pdCk7XHJcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdGhpcy51bml0KTtcclxuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlciA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Rm9yZWNhc3RXZWF0aGVyKGNpdHksIHRoaXMudW5pdCk7XHJcblxyXG4gICAgdGhpcy52aWV3LmFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKTtcclxuICAgIHRoaXMudmlldy5hcHBlbmRDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlcik7XHJcbiAgICB0aGlzLnZpZXcuYXBwZW5kRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlcik7XHJcbiAgfVxyXG5cclxuICBjaGVja0lmRW50ZXIoZSkge1xyXG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmJsdXIoKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVRlbXBlcmF0dXJlKGUpIHtcclxuICAgIGNvbnN0IHVuaXQgPSBlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZCA/IFwiaW1wZXJpYWxcIiA6IFwibWV0cmljXCI7XHJcbiAgICB0aGlzLnZpZXcuY2hhbmdlVW5pdFRlbXAodW5pdCk7XHJcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xyXG4gICAgdGhpcy5sb2FkUGFnZSh0aGlzLmNpdHkpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBUElzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudXJsR2VuZXJhdG9yID0gbmV3IFVybEdlbmVyYXRvcihcImU1MjMyMGI5ODQwNDAxODVlNjA0MGExZTY3ZjI1NGUwXCIpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVHZW9Db29yZHNVcmwoY2l0eSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBjb25zdCBnZW9jb2RpbmdEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBnZW9jb2RpbmdEYXRhWzBdO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgcmV0dXJuIHsgbGF0LCBsb24gfTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XHJcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICByZXR1cm4gd2VhdGhlckRhdGE7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcclxuICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpO1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuICAgICAgY29uc3QgZm9yZWNhc3REYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgcmV0dXJuIGZvcmVjYXN0RGF0YTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgVXJsR2VuZXJhdG9yIHtcclxuICBjb25zdHJ1Y3RvcihhcHBJZCkge1xyXG4gICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcclxuICAgIHRoaXMuYXBwSWQgPSBhcHBJZDtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2dlby8xLjAvZGlyZWN0P3E9JHtjaXR5fSZhcHBpZD0ke3RoaXMuYXBwSWR9YDtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xyXG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0fSZsb249JHtsb259JmNudD04JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvIHtcclxuICBjb25zdHJ1Y3RvcihBcGlEYXRhKSB7XHJcbiAgICB0aGlzLmNpdHlEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpO1xyXG4gICAgdGhpcy5kYXRlRGVzY3JpcHRpb24gPSB0aGlzLmNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUNpdHlEZXNjcmlwdGlvbihBcGlEYXRhKSB7XHJcbiAgICBjb25zdCBjaXR5ID0gQXBpRGF0YS5uYW1lO1xyXG4gICAgY29uc3QgeyBjb3VudHJ5IH0gPSBBcGlEYXRhLnN5cztcclxuICAgIHJldHVybiBgJHtjaXR5fSwgJHtjb3VudHJ5fWA7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSkge1xyXG4gICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXkoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gdGhpcy5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xyXG4gICAgcmV0dXJuIGAke2RheX0sICR7bW9udGh9ICR7ZGF0ZX1gO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGF5KCkge1xyXG4gICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBkYXkgPSB3ZWVrZGF5W2QuZ2V0RGF5KCldO1xyXG4gICAgcmV0dXJuIGRheTtcclxuICB9XHJcblxyXG4gIGdldE1vbnRoKCkge1xyXG4gICAgY29uc3QgbW9udGhOYW1lcyA9IFtcclxuICAgICAgXCJKYW51YXJ5XCIsXHJcbiAgICAgIFwiRmVicnVhcnlcIixcclxuICAgICAgXCJNYXJjaFwiLFxyXG4gICAgICBcIkFwcmlsXCIsXHJcbiAgICAgIFwiTWF5XCIsXHJcbiAgICAgIFwiSnVuZVwiLFxyXG4gICAgICBcIkp1bHlcIixcclxuICAgICAgXCJBdWd1c3RcIixcclxuICAgICAgXCJTZXB0ZW1iZXJcIixcclxuICAgICAgXCJPY3RvYmVyXCIsXHJcbiAgICAgIFwiTm92ZW1iZXJcIixcclxuICAgICAgXCJEZWNlbWJlclwiLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV07XHJcbiAgICByZXR1cm4gbW9udGg7XHJcbiAgfVxyXG5cclxuICBnZXREYXRlKCkge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBkYXRlID0gZC5nZXREYXRlKCk7XHJcbiAgICByZXR1cm4gZGF0ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VycmVudFdlYXRoZXIge1xyXG4gIGNvbnN0cnVjdG9yKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCkge1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi50ZW1wKSwgdW5pdCk7XHJcbiAgICB0aGlzLmZlZWxzTGlrZVRlbXAgPSB0aGlzLmdldFRlbXBlcmF0dXJlKE1hdGgucm91bmQoY3VycmVudFdlYXRoZXJEYXRhLm1haW4uZmVlbHNfbGlrZSksIHVuaXQpO1xyXG4gICAgdGhpcy5odW1pZGl0eSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xyXG4gICAgdGhpcy53aW5kU3BlZWQgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEud2luZC5zcGVlZH0gbS9zYDtcclxuICAgIHRoaXMucHJlc3N1cmUgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEubWFpbi5wcmVzc3VyZX0gaFBhYDtcclxuICAgIHRoaXMuc3VucmlzZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsIGN1cnJlbnRXZWF0aGVyRGF0YS50aW1lem9uZSk7XHJcbiAgICB0aGlzLnN1bnNldCA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MgPSBjdXJyZW50V2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhcclxuICAgICAgY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0ubWFpbixcclxuICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5yaXNlLFxyXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCxcclxuICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lXHJcbiAgICApO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSB0aGlzLmdldEJhY2tncm91bmRWaWRlb0xpbmsodGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nKTtcclxuICB9XHJcblxyXG4gIGdldFRlbXBlcmF0dXJlKGRlZ3JlZSwgdW5pdCkge1xyXG4gICAgcmV0dXJuIHVuaXQgPT09IFwibWV0cmljXCIgPyBgJHtkZWdyZWV94oSDYCA6IGAke2RlZ3JlZX3ihIlgO1xyXG4gIH1cclxuXHJcbiAgY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh1bml4VGltZSwgdGltZXpvbmUpIHtcclxuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IHVuaXhUaW1lID09PSAwID8gbmV3IERhdGUoKSA6IG5ldyBEYXRlKHVuaXhUaW1lICogMTAwMCk7XHJcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xyXG4gICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lICsgdGltZXpvbmUgKiAxMDAwO1xyXG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XHJcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xyXG4gIH1cclxuXHJcbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcclxuICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh1bml4VGltZSwgdGltZXpvbmUpO1xyXG4gICAgY29uc3QgaG91cnMgPSBkYXRlSW5TZWFyY2hlZENpdHkuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBgMCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xyXG4gICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IGAke2hvdXJzfToke21pbnV0ZXMuc3Vic3RyKC0yKX1gO1xyXG4gICAgcmV0dXJuIGZvcm1hdHRlZFRpbWU7XHJcbiAgfVxyXG5cclxuICBnZXRXZWF0aGVyQ29uZGl0aW9uSW1nKHZhbHVlLCBzdW5yaXNlVW5peCwgc3Vuc2V0VW5peCwgdGltZXpvbmUpIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcIlJhaW5cIjtcclxuICAgIGNvbnN0IG1pc3RFcXVpdmFsZW50ZXMgPSBbXCJTbW9rZVwiLCBcIkhhemVcIiwgXCJEdXN0XCIsIFwiRm9nXCIsIFwiU2FuZFwiLCBcIkR1c3RcIiwgXCJBc2hcIiwgXCJTcXVhbGxcIiwgXCJUb3JuYWRvXCJdO1xyXG4gICAgaWYgKG1pc3RFcXVpdmFsZW50ZXMuaW5jbHVkZXModmFsdWUpKSByZXR1cm4gXCJNaXN0XCI7XHJcbiAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoMCwgdGltZXpvbmUpO1xyXG4gICAgY29uc3Qgc3VucmlzZURhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKTtcclxuICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xyXG4gICAgcmV0dXJuIGN1cnJlbnREYXRlID4gc3VucmlzZURhdGUgJiYgY3VycmVudERhdGUgPCBzdW5zZXREYXRlID8gYCR7dmFsdWV9RGF5YCA6IGAke3ZhbHVlfU5pZ2h0YDtcclxuICB9XHJcblxyXG4gIGdldEJhY2tncm91bmRWaWRlb0xpbmsod2VhdGhlckNvbmRpdGlvbikge1xyXG4gICAgY29uc3QgdmlkZW9MaW5rcyA9IHtcclxuICAgICAgQ2xlYXJEYXk6XHJcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzQ1ODA1MTUwLmhkLm1wND9zPTM2YzRlNTk2YjQ4MGVmMGU4MDQ5MzcwYmVjYmFmMjYxYjM5ODlhMDEmcHJvZmlsZV9pZD0xNzAmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXHJcbiAgICAgIENsZWFyTmlnaHQ6XHJcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDY5MzA3OTUwLmhkLm1wND9zPTJlNjdhYTAyYTIxZDVjNjRjNjU3OTA0M2E3OGYwOTcyM2ViYzVkZGImcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXHJcbiAgICAgIENsb3VkczpcclxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80NDQyMTI2NzQuaGQubXA0P3M9NDA3MTk4MTI2NGQ5ZTc4YWNmMDlhMDQwMGU0NjM4NDMyNDk1YzRmMCZwcm9maWxlX2lkPTE3NSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcclxuICAgICAgTWlzdDogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvMzQzNzMyMTMyLmhkLm1wND9zPTViZmRlMjNmMTdlMzg1OGRiZGMxNDBhZmU3YTM1YjZhOWVmMTEyN2QmcHJvZmlsZV9pZD0xNzUmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXHJcbiAgICAgIFJhaW46IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzU2OTIxNzYwMi5oZC5tcDQ/cz05YTk2MTc4YzkxZmUxOWE2MzE3ZWQ1OTQ3ODVmMmUzNjhjZDFlYWRlJnByb2ZpbGVfaWQ9MTc0Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxyXG4gICAgICBTbm93OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC81MTA4MzExNjkuaGQubXA0P3M9ZDkwMDQ5NTU5Yjc2ZjBiOWUwYmRhMTAyZWE4YTc0MjFkN2E2NGQ4MSZwcm9maWxlX2lkPTE3NSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcclxuICAgICAgVGh1bmRlcnN0b3JtOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ4MDIyMzg5Ni5oZC5tcDQ/cz1lNGI5NGYwYjU3MDBiZmE2OGNiNmYwMmI0MWY5NGVjY2E5MTI0MmU5JnByb2ZpbGVfaWQ9MTY5Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxyXG4gICAgfTtcclxuICAgIHJldHVybiB2aWRlb0xpbmtzW3dlYXRoZXJDb25kaXRpb25dO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xyXG4gIGNvbnN0cnVjdG9yKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpIHtcclxuICAgIHRoaXMudGVtcGVyYXR1cmVzID0gdGhpcy5nZXRUZW1wZXJhdHVyZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCk7XHJcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xyXG4gICAgdGhpcy50aW1lID0gdGhpcy5nZXRUaW1lcyhmb3JlY2FzdFdlYXRoZXJEYXRhKTtcclxuICB9XHJcblxyXG4gIGdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KSB7XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZXMgPSBbXTtcclxuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRlbXAgPSBNYXRoLnJvdW5kKGl0ZW0ubWFpbi50ZW1wKTtcclxuICAgICAgY29uc3QgdGVtcFdpdGhVbml0ID0gdGhpcy5nZXRUZW1wZXJhdHVyZVVuaXQodGVtcCwgdW5pdCk7XHJcbiAgICAgIHRlbXBlcmF0dXJlcy5wdXNoKHRlbXBXaXRoVW5pdCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0ZW1wZXJhdHVyZXM7XHJcbiAgfVxyXG5cclxuICBnZXRUZW1wZXJhdHVyZVVuaXQoZGVncmVlLCB1bml0KSB7XHJcbiAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZX3ihINgIDogYCR7ZGVncmVlfeKEiWA7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xyXG4gICAgY29uc3QgbG9jYWxEYXRlID0gbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcclxuICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XHJcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XHJcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcclxuICAgIHJldHVybiBkYXRlSW5TZWFyY2hlZENpdHk7XHJcbiAgfVxyXG5cclxuICBnZXRXZWF0aGVyQ29uZGl0aW9uSW1nKHZhbHVlLCB0aW1lLCBzdW5yaXNlVW5peCwgc3Vuc2V0VW5peCwgdGltZXpvbmUpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XHJcbiAgICBjb25zdCBjdXJyZW50SG91ciA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSh0aW1lLCB0aW1lem9uZSkuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IHN1bnJpc2VIb3VyID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHN1bnJpc2VVbml4LCB0aW1lem9uZSkuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IHN1bnNldEhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpLmdldEhvdXJzKCk7XHJcbiAgICByZXR1cm4gY3VycmVudEhvdXIgPiBzdW5yaXNlSG91ciAmJiBjdXJyZW50SG91ciA8IHN1bnNldEhvdXIgPyBgJHt2YWx1ZX1EYXlgIDogYCR7dmFsdWV9TmlnaHRgO1xyXG4gIH1cclxuXHJcbiAgZ2V0V2VhdGhlckNvbmRpdGlvbnMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xyXG4gICAgY29uc3Qgd2VhdGhlckNvbmRpdGlvbiA9IFtdO1xyXG4gICAgY29uc3Qgc3VucmlzZVVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3VucmlzZTtcclxuICAgIGNvbnN0IHN1bnNldFVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3Vuc2V0O1xyXG4gICAgY29uc3QgeyB0aW1lem9uZSB9ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5O1xyXG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgY29uZCA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhpdGVtLndlYXRoZXJbMF0ubWFpbiwgaXRlbS5kdCwgc3VucmlzZVVuaXgsIHN1bnNldFVuaXgsIHRpbWV6b25lKTtcclxuICAgICAgd2VhdGhlckNvbmRpdGlvbi5wdXNoKGNvbmQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gd2VhdGhlckNvbmRpdGlvbjtcclxuICB9XHJcblxyXG4gIGdldFRpbWVzKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcclxuICAgIGNvbnN0IHRpbWVzID0gW107XHJcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGl0ZW0sIHRpbWV6b25lKTtcclxuICAgICAgdGltZXMucHVzaCh0aW1lKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRpbWVzO1xyXG4gIH1cclxuXHJcbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcclxuICAgIGNvbnN0IGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHVuaXhUaW1lLmR0ICogMTAwMCk7XHJcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xyXG4gICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lICsgdGltZXpvbmUgKiAxMDAwO1xyXG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gbmV3IERhdGUodW5peFRpbWVJblNlYXJjaGVkQ2l0eSk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xyXG4gICAgY29uc3QgdGltZSA9IGAke2hvdXJzfTowMGA7XHJcbiAgICByZXR1cm4gdGltZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEN1cnJlbnRXZWF0aGVyIGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyXCI7XHJcbmltcG9ydCBGb3JlY2FzdFdlYXRoZXIgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyXCI7XHJcbmltcG9ydCBDaXR5SW5mbyBmcm9tIFwiLi9jaXR5SW5mb1wiO1xyXG5pbXBvcnQgQVBJcyBmcm9tIFwiLi9BUElzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kYXRhID0ge307XHJcbiAgICB0aGlzLkFQSXMgPSBuZXcgQVBJcygpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0Q2l0eUluZm8oY2l0eSwgdW5pdCkge1xyXG4gICAgY29uc3QgQXBpRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XHJcbiAgICBjb25zdCBjaXR5SW5mbyA9IG5ldyBDaXR5SW5mbyhBcGlEYXRhKTtcclxuICAgIHJldHVybiBjaXR5SW5mbztcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEN1cnJlbnRXZWF0aGVyKGNpdHksIHVuaXQpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XHJcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IG5ldyBDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlckRhdGEsIHVuaXQpO1xyXG4gICAgcmV0dXJuIGN1cnJlbnRXZWF0aGVyO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyKGNpdHksIHVuaXQpIHtcclxuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcclxuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlciA9IG5ldyBGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCk7XHJcbiAgICByZXR1cm4gZm9yZWNhc3RXZWF0aGVyO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXR5SW5mb1ZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNpdHlJbmZvTW9kZWwpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLm1vZGVsID0gY2l0eUluZm9Nb2RlbDtcclxuICAgIHRoaXMuY2l0eSA9IGNpdHlJbmZvTW9kZWwuY2l0eURlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5kYXRlID0gY2l0eUluZm9Nb2RlbC5kYXRlRGVzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICBnZXQgY2l0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGNpdHkodmFsdWUpIHtcclxuICAgIHRoaXMuY2l0eS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKTtcclxuICB9XHJcblxyXG4gIHNldCBkYXRlKHZhbHVlKSB7XHJcbiAgICB0aGlzLmRhdGUudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENpdHlJbmZvVmlldyBmcm9tIFwiLi9jaXR5SW5mb1ZpZXdcIjtcclxuaW1wb3J0IEN1cnJlbnRXZWF0aGVyVmlldyBmcm9tIFwiLi9jdXJyZW50V2VhdGhlclZpZXdcIjtcclxuaW1wb3J0IEZvcmVjYXN0V2VhdGhlclZpZXcgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyVmlld1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpblZpZXcge1xyXG4gIGFwcGVuZENpdHlJbmZvKGNpdHlJbmZvKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5LWluZm9cIik7XHJcbiAgICBuZXcgQ2l0eUluZm9WaWV3KGVsZW1lbnQsIGNpdHlJbmZvKTtcclxuICB9XHJcblxyXG4gIGFwcGVuZEN1cnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXdlYXRoZXJcIik7XHJcbiAgICBuZXcgQ3VycmVudFdlYXRoZXJWaWV3KGVsZW1lbnQsIGN1cnJlbnRXZWF0aGVyKTtcclxuICB9XHJcblxyXG4gIGFwcGVuZEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0XCIpO1xyXG4gICAgbmV3IEZvcmVjYXN0V2VhdGhlclZpZXcoZWxlbWVudCwgZm9yZWNhc3RXZWF0aGVyKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVVuaXRUZW1wKHVuaXQpIHtcclxuICAgIGlmICh1bml0ID09PSBcImltcGVyaWFsXCIpIHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0Q1wiKS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudW5pdEZcIikuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudW5pdENcIikuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnJlbnRXZWF0aGVyVmlldyB7XHJcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY3VycmVudFdlYXRoZXJNb2RlbCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMubW9kZWwgPSBjdXJyZW50V2VhdGhlck1vZGVsO1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XHJcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uRGVzYztcclxuICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuZmVlbHNMaWtlVGVtcDtcclxuICAgIHRoaXMuc3VucmlzZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuc3VucmlzZTtcclxuICAgIHRoaXMuc3Vuc2V0ID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5zZXQ7XHJcbiAgICB0aGlzLmh1bWlkaXR5ID0gY3VycmVudFdlYXRoZXJNb2RlbC5odW1pZGl0eTtcclxuICAgIHRoaXMud2luZFNwZWVkID0gY3VycmVudFdlYXRoZXJNb2RlbC53aW5kU3BlZWQ7XHJcbiAgICB0aGlzLnByZXNzdXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC5wcmVzc3VyZTtcclxuICAgIHRoaXMubm93V2VhdGhlckNvbmRpdGlvbiA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkltZztcclxuICAgIHRoaXMubm93VGVtcGVyYXR1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnRlbXBlcmF0dXJlO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kVmlkZW8gPSBjdXJyZW50V2VhdGhlck1vZGVsLmJhY2tncm91bmRWaWRlbztcclxuICB9XHJcblxyXG4gIGdldCB3ZWF0aGVyQ29uZGl0aW9uSW1nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUpIHtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGVyYXR1cmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKTtcclxuICB9XHJcblxyXG4gIHNldCB0ZW1wZXJhdHVyZSh2YWx1ZSkge1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHdlYXRoZXJDb25kaXRpb25EZXNjKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBmZWVsc0xpa2VUZW1wKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmZlZWxzLWxpa2VcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgZmVlbHNMaWtlVGVtcCh2YWx1ZSkge1xyXG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc3VucmlzZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5yaXNlXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHN1bnJpc2UodmFsdWUpIHtcclxuICAgIHRoaXMuc3VucmlzZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN1bnNldCgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5zZXRcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgc3Vuc2V0KHZhbHVlKSB7XHJcbiAgICB0aGlzLnN1bnNldC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGh1bWlkaXR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmh1bWlkaXR5XCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGh1bWlkaXR5KHZhbHVlKSB7XHJcbiAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgd2luZFNwZWVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmQtc3BlZWRcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgd2luZFNwZWVkKHZhbHVlKSB7XHJcbiAgICB0aGlzLndpbmRTcGVlZC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHByZXNzdXJlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnByZXNzdXJlXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XHJcbiAgICB0aGlzLnByZXNzdXJlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm93V2VhdGhlckNvbmRpdGlvbigpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0X19pdGVtX19jdXJyZW50LWNvbmRpdGlvblwiKTtcclxuICB9XHJcblxyXG4gIHNldCBub3dXZWF0aGVyQ29uZGl0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24uc3JjID0gYGltYWdlcy8ke3ZhbHVlfS5wbmdgO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5vd1RlbXBlcmF0dXJlKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cmVudC10ZW1wXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IG5vd1RlbXBlcmF0dXJlKHZhbHVlKSB7XHJcbiAgICB0aGlzLm5vd1RlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgYmFja2dyb3VuZFZpZGVvKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIik7XHJcbiAgfVxyXG5cclxuICBzZXQgYmFja2dyb3VuZFZpZGVvKHZhbHVlKSB7XHJcbiAgICB0aGlzLmJhY2tncm91bmRWaWRlby5zcmMgPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgZm9yZWNhc3RXZWF0aGVyVmlldyB7XHJcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgZm9yZWNhc3RXZWF0aGVyTW9kZWwpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLm1vZGVsID0gZm9yZWNhc3RXZWF0aGVyTW9kZWw7XHJcbiAgICB0aGlzLnRpbWUgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC50aW1lO1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbjtcclxuICAgIHRoaXMudGVtcGVyYXR1cmVzID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRpbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZm9yZWNhc3RfX2l0ZW1fX3RpbWVcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgdGltZSh2YWx1ZSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy50aW1lW2ldLnRleHRDb250ZW50ID0gdmFsdWVbaV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgd2VhdGhlckNvbmRpdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB9XHJcblxyXG4gIHNldCB3ZWF0aGVyQ29uZGl0aW9uKHZhbHVlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMud2VhdGhlckNvbmRpdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLndlYXRoZXJDb25kaXRpb25baV0uc3JjID0gYGltYWdlcy8ke3ZhbHVlW2kgLSAxXX0ucG5nYDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCB0ZW1wZXJhdHVyZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZm9yZWNhc3RfX2l0ZW1fX3RlbXBlcmF0dXJlXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHRlbXBlcmF0dXJlcyh2YWx1ZSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy50ZW1wZXJhdHVyZXNbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fIGZyb20gXCItIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9pbWFnZXMvbWFnbmlmeS5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLmkoX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCI6cm9vdCB7XFxyXFxuICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcclxcbiAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xcclxcbiAgLS1mZi1wcmltYXJ5OiBcXFwiUG9wcGluc1xcXCIsIHNhbnMtc2VyaWY7XFxyXFxuICAtLWZ3LTMwMDogMzAwO1xcclxcbiAgLS1mdy00MDA6IDQwMDtcXHJcXG4gIC0tZnctNTAwOiA1MDA7XFxyXFxuICAtLWZ3LTYwMDogNjAwO1xcclxcbiAgLS1mdy03MDA6IDcwMDtcXHJcXG59XFxyXFxuXFxyXFxuKixcXHJcXG4qOjpiZWZvcmUsXFxyXFxuKjo6YWZ0ZXIge1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCA4cHggIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICB3aWR0aDogMTAwdnc7XFxyXFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChodHRwczovL2kucGluaW1nLmNvbS9vcmlnaW5hbHMvZTcvN2YvYzMvZTc3ZmMzMTk3ZTQ0NWFjM2U2MWU2MjhlMGE4Y2ZiZjkuZ2lmKTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMywgMCwgMTMyKTtcXHJcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcXHJcXG4gIGNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbCk7XFxyXFxufVxcclxcblxcclxcbm1haW4ge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIHdpZHRoOiAxMDB2dztcXHJcXG4gIGhlaWdodDogMTAwdmg7XFxyXFxuICBwYWRkaW5nOiA0cmVtIDJyZW07XFxyXFxuICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbn1cXHJcXG5cXHJcXG4udmlkZW8tY29udGFpbmVyIHtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDogMDtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB3aWR0aDogMTAwdnc7XFxyXFxuICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgei1pbmRleDogLTU7XFxyXFxufVxcclxcblxcclxcbnZpZGVvIHtcXHJcXG4gIHdpZHRoOiAxMDB2dztcXHJcXG4gIGhlaWdodDogMTAwdmg7XFxyXFxuICBvYmplY3QtZml0OiBjb3ZlcjtcXHJcXG4gIGFuaW1hdGlvbjogc2xvd0xvb3AgMTAwMHMgaW5maW5pdGUgbGluZWFyO1xcclxcbn1cXHJcXG5Aa2V5ZnJhbWVzIHNsb3dMb29wIHtcXHJcXG4gIDAlIHsgb3BhY2l0eTogMDsgfVxcclxcbiAgMTAlIHsgb3BhY2l0eTogMTsgfVxcclxcbiAgOTAlIHsgb3BhY2l0eTogMTsgfVxcclxcbiAgMTAwJSB7IG9wYWNpdHk6IDA7IH1cXHJcXG59XFxyXFxuXFxyXFxuLm92ZXJsYXkge1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOiAwO1xcclxcbiAgbGVmdDogMDtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLjUsIDAuNSk7IFxcclxcbn1cXHJcXG5cXHJcXG5mb290ZXIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzMzIyOyBcXHJcXG4gIGNvbG9yOiB3aGl0ZTsgXFxyXFxuICBwYWRkaW5nOiAyMHB4O1xcclxcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uZm9vdGVyLWNvbnRlbnQge1xcclxcbiAgbWF4LXdpZHRoOiAxMjAwcHg7IFxcclxcbiAgbWFyZ2luOiAwIGF1dG87XFxyXFxuICAgXFxyXFxufVxcclxcbi5mb290ZXItY29udGVudCBhIHtcXHJcXG4gIGNvbG9yOiAjZmY4NDAwO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4udW5pdEMsXFxyXFxuLnVuaXRGIHtcXHJcXG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcXHJcXG4gIGhlaWdodDogMTZweDtcXHJcXG4gIHdpZHRoOiAxNnB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGNvbG9yOiBibGFjaztcXHJcXG4gIHotaW5kZXg6IDIwO1xcclxcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxyXFxuICB0ZXh0LXNoYWRvdzogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLnVuaXRGIHtcXHJcXG4gIGNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmNoZWNrYm94LWNvbnRhaW5lciB7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6IDNyZW07XFxyXFxuICByaWdodDogM3JlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmNoZWNrYm94IHtcXHJcXG4gIG9wYWNpdHk6IDA7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxufVxcclxcblxcclxcbi5sYWJlbCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNTBweDtcXHJcXG4gIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgcGFkZGluZzogNXB4O1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgaGVpZ2h0OiAyNnB4O1xcclxcbiAgd2lkdGg6IDUwcHg7XFxyXFxuICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxyXFxufVxcclxcblxcclxcbi5sYWJlbCAuYmFsbCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOiAycHg7XFxyXFxuICBsZWZ0OiAycHg7XFxyXFxuICBoZWlnaHQ6IDIycHg7XFxyXFxuICB3aWR0aDogMjJweDtcXHJcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcclxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xcclxcbn1cXHJcXG5cXHJcXG4uY2hlY2tib3g6Y2hlY2tlZCArIC5sYWJlbCAuYmFsbCB7XFxyXFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjRweCk7XFxyXFxufVxcclxcblxcclxcbi5zZWFyY2gtd3JhcHBlciB7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBnYXA6IDEwcHg7XFxyXFxufVxcclxcblxcclxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxyXFxuICB3aWR0aDogNDAlO1xcclxcbiAgcGFkZGluZzogMTBweCAxMHB4IDEwcHggNDBweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDJyZW07XFxyXFxuICBib3JkZXI6IG5vbmU7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpO1xcclxcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXHJcXG4gIHRleHQtc2hhZG93OiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4jZXJyb3Ige1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLmNpdHktaW5mbyBoMSB7XFxyXFxuICBtYXJnaW46IDAuM3JlbSAwO1xcclxcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcclxcbiAgZm9udC1zaXplOiAyLjVyZW07XFxyXFxufVxcclxcblxcclxcbmgyIHtcXHJcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcclxcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxyXFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcclxcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXHJcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXHJcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxyXFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxyXFxuICBnYXA6IDRyZW07XFxyXFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgZ2FwOiAwLjVyZW07XFxyXFxuICBmb250LXNpemU6IDFyZW07XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXHJcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBnYXA6IDFyZW07XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdCB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdF9faXRlbSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcclxcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxyXFxufVxcclxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSwrQkFBK0I7RUFDL0IsZ0RBQWdEO0VBQ2hELG1DQUFtQztFQUNuQyxhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtBQUNmOztBQUVBOzs7RUFHRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtFQUN0QixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLG1HQUFtRztFQUNuRyxpQ0FBaUM7RUFDakMsOEJBQThCO0VBQzlCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsNkJBQTZCO0VBQzdCLGtCQUFrQjtF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O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCguL25vcm1hbGl6ZS5jc3MpO1xcclxcblxcclxcbjpyb290IHtcXHJcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxyXFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxyXFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXHJcXG4gIC0tZnctMzAwOiAzMDA7XFxyXFxuICAtLWZ3LTQwMDogNDAwO1xcclxcbiAgLS1mdy01MDA6IDUwMDtcXHJcXG4gIC0tZnctNjAwOiA2MDA7XFxyXFxuICAtLWZ3LTcwMDogNzAwO1xcclxcbn1cXHJcXG5cXHJcXG4qLFxcclxcbio6OmJlZm9yZSxcXHJcXG4qOjphZnRlciB7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG5ib2R5IHtcXHJcXG4gIHdpZHRoOiAxMDB2dztcXHJcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGh0dHBzOi8vaS5waW5pbWcuY29tL29yaWdpbmFscy9lNy83Zi9jMy9lNzdmYzMxOTdlNDQ1YWMzZTYxZTYyOGUwYThjZmJmOS5naWYpO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzLCAwLCAxMzIpO1xcclxcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcclxcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXHJcXG59XFxyXFxuXFxyXFxubWFpbiB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gIHBhZGRpbmc6IDRyZW0gMnJlbTtcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxufVxcclxcblxcclxcbi52aWRlby1jb250YWluZXIge1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOiAwO1xcclxcbiAgbGVmdDogMDtcXHJcXG4gIHdpZHRoOiAxMDB2dztcXHJcXG4gIGhlaWdodDogMTAwdmg7XFxyXFxuICB6LWluZGV4OiAtNTtcXHJcXG59XFxyXFxuXFxyXFxudmlkZW8ge1xcclxcbiAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xcclxcbiAgYW5pbWF0aW9uOiBzbG93TG9vcCAxMDAwcyBpbmZpbml0ZSBsaW5lYXI7XFxyXFxufVxcclxcbkBrZXlmcmFtZXMgc2xvd0xvb3Age1xcclxcbiAgMCUgeyBvcGFjaXR5OiAwOyB9XFxyXFxuICAxMCUgeyBvcGFjaXR5OiAxOyB9XFxyXFxuICA5MCUgeyBvcGFjaXR5OiAxOyB9XFxyXFxuICAxMDAlIHsgb3BhY2l0eTogMDsgfVxcclxcbn1cXHJcXG5cXHJcXG4ub3ZlcmxheSB7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6IDA7XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDEwMCU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAuNSwgMC41KTsgXFxyXFxufVxcclxcblxcclxcbmZvb3RlciB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzMzMzMjI7IFxcclxcbiAgY29sb3I6IHdoaXRlOyBcXHJcXG4gIHBhZGRpbmc6IDIwcHg7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5mb290ZXItY29udGVudCB7XFxyXFxuICBtYXgtd2lkdGg6IDEyMDBweDsgXFxyXFxuICBtYXJnaW46IDAgYXV0bztcXHJcXG4gICBcXHJcXG59XFxyXFxuLmZvb3Rlci1jb250ZW50IGEge1xcclxcbiAgY29sb3I6ICNmZjg0MDA7XFxyXFxufVxcclxcblxcclxcblxcclxcbi51bml0QyxcXHJcXG4udW5pdEYge1xcclxcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xcclxcbiAgaGVpZ2h0OiAxNnB4O1xcclxcbiAgd2lkdGg6IDE2cHg7XFxyXFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgY29sb3I6IGJsYWNrO1xcclxcbiAgei1pbmRleDogMjA7XFxyXFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXHJcXG4gIHRleHQtc2hhZG93OiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4udW5pdEYge1xcclxcbiAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG5cXHJcXG4uY2hlY2tib3gtY29udGFpbmVyIHtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDogM3JlbTtcXHJcXG4gIHJpZ2h0OiAzcmVtO1xcclxcbn1cXHJcXG5cXHJcXG4uY2hlY2tib3gge1xcclxcbiAgb3BhY2l0eTogMDtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmxhYmVsIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxyXFxuICBib3JkZXItcmFkaXVzOiA1MHB4O1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICBwYWRkaW5nOiA1cHg7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICBoZWlnaHQ6IDI2cHg7XFxyXFxuICB3aWR0aDogNTBweDtcXHJcXG4gIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcXHJcXG59XFxyXFxuXFxyXFxuLmxhYmVsIC5iYWxsIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxyXFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6IDJweDtcXHJcXG4gIGxlZnQ6IDJweDtcXHJcXG4gIGhlaWdodDogMjJweDtcXHJcXG4gIHdpZHRoOiAyMnB4O1xcclxcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7XFxyXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBsaW5lYXI7XFxyXFxufVxcclxcblxcclxcbi5jaGVja2JveDpjaGVja2VkICsgLmxhYmVsIC5iYWxsIHtcXHJcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNHB4KTtcXHJcXG59XFxyXFxuXFxyXFxuLnNlYXJjaC13cmFwcGVyIHtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGdhcDogMTBweDtcXHJcXG59XFxyXFxuXFxyXFxuLnNlYXJjaC13cmFwcGVyIGlucHV0IHtcXHJcXG4gIHdpZHRoOiA0MCU7XFxyXFxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXHJcXG4gIGJvcmRlcjogbm9uZTtcXHJcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWFnZXMvbWFnbmlmeS5wbmcpO1xcclxcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXHJcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXHJcXG4gIHRleHQtc2hhZG93OiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4jZXJyb3Ige1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLmNpdHktaW5mbyBoMSB7XFxyXFxuICBtYXJnaW46IDAuM3JlbSAwO1xcclxcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcclxcbiAgZm9udC1zaXplOiAyLjVyZW07XFxyXFxufVxcclxcblxcclxcbmgyIHtcXHJcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcclxcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxyXFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcclxcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXHJcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXHJcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxyXFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxyXFxuICBnYXA6IDRyZW07XFxyXFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgZ2FwOiAwLjVyZW07XFxyXFxuICBmb250LXNpemU6IDFyZW07XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXHJcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBnYXA6IDFyZW07XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdCB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdF9faXRlbSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcclxcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxyXFxufVxcclxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXHJcXG5cXHJcXG4vKiBEb2N1bWVudFxcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcclxcbiAqL1xcclxcblxcclxcbiBodG1sIHtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXHJcXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIFNlY3Rpb25zXFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBib2R5IHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIG1haW4ge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxyXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGgxIHtcXHJcXG4gICAgZm9udC1zaXplOiAyZW07XFxyXFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXHJcXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGhyIHtcXHJcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXHJcXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxyXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBwcmUge1xcclxcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXHJcXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGEge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcclxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBhYmJyW3RpdGxlXSB7XFxyXFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBiLFxcclxcbiAgc3Ryb25nIHtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGNvZGUsXFxyXFxuICBrYmQsXFxyXFxuICBzYW1wIHtcXHJcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxyXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgc21hbGwge1xcclxcbiAgICBmb250LXNpemU6IDgwJTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXHJcXG4gICAqIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBzdWIsXFxyXFxuICBzdXAge1xcclxcbiAgICBmb250LXNpemU6IDc1JTtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICBzdWIge1xcclxcbiAgICBib3R0b206IC0wLjI1ZW07XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIHN1cCB7XFxyXFxuICAgIHRvcDogLTAuNWVtO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgaW1nIHtcXHJcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBGb3Jtc1xcclxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBidXR0b24sXFxyXFxuICBpbnB1dCxcXHJcXG4gIG9wdGdyb3VwLFxcclxcbiAgc2VsZWN0LFxcclxcbiAgdGV4dGFyZWEge1xcclxcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcclxcbiAgICBmb250LXNpemU6IDcwJTsgLyogMSAqL1xcclxcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcclxcbiAgICBtYXJnaW46IDA7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXHJcXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgYnV0dG9uLFxcclxcbiAgaW5wdXQgeyAvKiAxICovXFxyXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcclxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGJ1dHRvbixcXHJcXG4gIHNlbGVjdCB7IC8qIDEgKi9cXHJcXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBidXR0b24sXFxyXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxyXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXSxcXHJcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcclxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcclxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxyXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcclxcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGJ1dHRvbjotbW96LWZvY3VzcmluZyxcXHJcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXHJcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcclxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXHJcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBmaWVsZHNldCB7XFxyXFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcclxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcclxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgbGVnZW5kIHtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcclxcbiAgICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcclxcbiAgICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcclxcbiAgICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXHJcXG4gICAgcGFkZGluZzogMDsgLyogMyAqL1xcclxcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBwcm9ncmVzcyB7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICB0ZXh0YXJlYSB7XFxyXFxuICAgIG92ZXJmbG93OiBhdXRvO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcclxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcclxcbiAgW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxyXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcclxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXHJcXG4gICAgaGVpZ2h0OiBhdXRvO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXHJcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXHJcXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXHJcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxyXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxyXFxuICAgIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogSW50ZXJhY3RpdmVcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qXFxyXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGRldGFpbHMge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLypcXHJcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBzdW1tYXJ5IHtcXHJcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBNaXNjXFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICB0ZW1wbGF0ZSB7XFxyXFxuICAgIGRpc3BsYXk6IG5vbmU7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW2hpZGRlbl0ge1xcclxcbiAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgfVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztDQUVEO0lBQ0csaUJBQWlCLEVBQUUsTUFBTTtJQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0VBQ3hDOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxTQUFTO0VBQ1g7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLGNBQWM7SUFDZCxnQkFBZ0I7RUFDbEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7SUFDRSx1QkFBdUIsRUFBRSxNQUFNO0lBQy9CLFNBQVMsRUFBRSxNQUFNO0lBQ2pCLGlCQUFpQixFQUFFLE1BQU07RUFDM0I7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsaUNBQWlDLEVBQUUsTUFBTTtJQUN6QyxjQUFjLEVBQUUsTUFBTTtFQUN4Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsNkJBQTZCO0VBQy9COztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLG1CQUFtQixFQUFFLE1BQU07SUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0VBQzNDOztFQUVBOztJQUVFOztFQUVGOztJQUVFLG1CQUFtQjtFQUNyQjs7RUFFQTs7O0lBR0U7O0VBRUY7OztJQUdFLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsY0FBYyxFQUFFLE1BQU07RUFDeEI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxjQUFjO0lBQ2QsY0FBYztJQUNkLGtCQUFrQjtJQUNsQix3QkFBd0I7RUFDMUI7O0VBRUE7SUFDRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7Ozs7O0lBS0Usb0JBQW9CLEVBQUUsTUFBTTtJQUM1QixjQUFjLEVBQUUsTUFBTTtJQUN0QixpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLFNBQVMsRUFBRSxNQUFNO0VBQ25COztFQUVBOzs7SUFHRTs7RUFFRjtVQUNRLE1BQU07SUFDWixpQkFBaUI7RUFDbkI7O0VBRUE7OztJQUdFOztFQUVGO1dBQ1MsTUFBTTtJQUNiLG9CQUFvQjtFQUN0Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLDBCQUEwQjtFQUM1Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLGtCQUFrQjtJQUNsQixVQUFVO0VBQ1o7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSw4QkFBOEI7RUFDaEM7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSw4QkFBOEI7RUFDaEM7O0VBRUE7Ozs7O0lBS0U7O0VBRUY7SUFDRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGVBQWUsRUFBRSxNQUFNO0lBQ3ZCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLG1CQUFtQixFQUFFLE1BQU07RUFDN0I7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLFVBQVUsRUFBRSxNQUFNO0VBQ3BCOztFQUVBOztJQUVFOztFQUVGOztJQUVFLFlBQVk7RUFDZDs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLG9CQUFvQixFQUFFLE1BQU07RUFDOUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxhQUFhLEVBQUUsTUFBTTtFQUN2Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGtCQUFrQjtFQUNwQjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXHJcXG5cXHJcXG4vKiBEb2N1bWVudFxcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcclxcbiAqL1xcclxcblxcclxcbiBodG1sIHtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXHJcXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIFNlY3Rpb25zXFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBib2R5IHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIG1haW4ge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxyXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGgxIHtcXHJcXG4gICAgZm9udC1zaXplOiAyZW07XFxyXFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXHJcXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGhyIHtcXHJcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXHJcXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxyXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBwcmUge1xcclxcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXHJcXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGEge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcclxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBhYmJyW3RpdGxlXSB7XFxyXFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBiLFxcclxcbiAgc3Ryb25nIHtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGNvZGUsXFxyXFxuICBrYmQsXFxyXFxuICBzYW1wIHtcXHJcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxyXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgc21hbGwge1xcclxcbiAgICBmb250LXNpemU6IDgwJTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXHJcXG4gICAqIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBzdWIsXFxyXFxuICBzdXAge1xcclxcbiAgICBmb250LXNpemU6IDc1JTtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICBzdWIge1xcclxcbiAgICBib3R0b206IC0wLjI1ZW07XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIHN1cCB7XFxyXFxuICAgIHRvcDogLTAuNWVtO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgaW1nIHtcXHJcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBGb3Jtc1xcclxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBidXR0b24sXFxyXFxuICBpbnB1dCxcXHJcXG4gIG9wdGdyb3VwLFxcclxcbiAgc2VsZWN0LFxcclxcbiAgdGV4dGFyZWEge1xcclxcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcclxcbiAgICBmb250LXNpemU6IDcwJTsgLyogMSAqL1xcclxcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcclxcbiAgICBtYXJnaW46IDA7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXHJcXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgYnV0dG9uLFxcclxcbiAgaW5wdXQgeyAvKiAxICovXFxyXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcclxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGJ1dHRvbixcXHJcXG4gIHNlbGVjdCB7IC8qIDEgKi9cXHJcXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBidXR0b24sXFxyXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxyXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXSxcXHJcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcclxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcclxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxyXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcclxcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGJ1dHRvbjotbW96LWZvY3VzcmluZyxcXHJcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXHJcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcclxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXHJcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBmaWVsZHNldCB7XFxyXFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcclxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcclxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgbGVnZW5kIHtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcclxcbiAgICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcclxcbiAgICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcclxcbiAgICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXHJcXG4gICAgcGFkZGluZzogMDsgLyogMyAqL1xcclxcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBwcm9ncmVzcyB7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICB0ZXh0YXJlYSB7XFxyXFxuICAgIG92ZXJmbG93OiBhdXRvO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcclxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcclxcbiAgW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxyXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcclxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXHJcXG4gICAgaGVpZ2h0OiBhdXRvO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcclxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXHJcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXHJcXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyoqXFxyXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXHJcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxyXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxyXFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxyXFxuICAgIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLyogSW50ZXJhY3RpdmVcXHJcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuICBcXHJcXG4gIC8qXFxyXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcclxcbiAgICovXFxyXFxuICBcXHJcXG4gIGRldGFpbHMge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIH1cXHJcXG4gIFxcclxcbiAgLypcXHJcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICBzdW1tYXJ5IHtcXHJcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcclxcbiAgfVxcclxcbiAgXFxyXFxuICAvKiBNaXNjXFxyXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcbiAgXFxyXFxuICAvKipcXHJcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXHJcXG4gICAqL1xcclxcbiAgXFxyXFxuICB0ZW1wbGF0ZSB7XFxyXFxuICAgIGRpc3BsYXk6IG5vbmU7XFxyXFxuICB9XFxyXFxuICBcXHJcXG4gIC8qKlxcclxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxyXFxuICAgKi9cXHJcXG4gIFxcclxcbiAgW2hpZGRlbl0ge1xcclxcbiAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgfVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7IC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfSAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG5cblxuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgKCFzY3JpcHRVcmwgfHwgIS9eaHR0cChzPyk6Ly50ZXN0KHNjcmlwdFVybCkpKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4uL3N0eWxlcy9tYWluLmNzc1wiO1xyXG5cclxuaW1wb3J0IE1haW5Nb2RlbCBmcm9tIFwiLi9tb2RlbHMvbWFpbk1vZGVsXCI7XHJcbmltcG9ydCBNYWluVmlldyBmcm9tIFwiLi92aWV3cy9jbGltYXByb1ZpZXdcIjtcclxuaW1wb3J0IE1haW5Db250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyXCI7XHJcblxyXG5jb25zdCBtb2RlbCA9IG5ldyBNYWluTW9kZWwoKTtcclxuY29uc3QgdmlldyA9IG5ldyBNYWluVmlldygpO1xyXG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTtcclxuIl0sIm5hbWVzIjpbIk1haW5Db250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsInZpZXciLCJjaXR5IiwidW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImxvYWRQYWdlIiwidmFsdWUiLCJjaGVja0lmRW50ZXIiLCJ3aW5kb3ciLCJjaGFuZ2VUZW1wZXJhdHVyZSIsInBsYXliYWNrUmF0ZSIsImNpdHlJbmZvIiwiZ2V0Q2l0eUluZm8iLCJjdXJyZW50V2VhdGhlciIsImdldEN1cnJlbnRXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyIiwiYXBwZW5kQ2l0eUluZm8iLCJhcHBlbmRDdXJyZW50V2VhdGhlciIsImFwcGVuZEZvcmVjYXN0V2VhdGhlciIsImtleSIsImJsdXIiLCJjdXJyZW50VGFyZ2V0IiwiY2hlY2tlZCIsImNoYW5nZVVuaXRUZW1wIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb2NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwic3R5bGUiLCJkaXNwbGF5IiwiZXJyIiwiY29uc29sZSIsImxvZyIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsImdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwiLCJ3ZWF0aGVyRGF0YSIsImdldEZvcmVjYXN0V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybCIsImZvcmVjYXN0RGF0YSIsImFwcElkIiwiYmFzZVVybCIsIkNpdHlJbmZvIiwiQXBpRGF0YSIsImNpdHlEZXNjcmlwdGlvbiIsImNyZWF0ZUNpdHlEZXNjcmlwdGlvbiIsImRhdGVEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGVEZXNjcmlwdGlvbiIsIm5hbWUiLCJjb3VudHJ5Iiwic3lzIiwiZGF5IiwiZ2V0RGF5IiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwid2Vla2RheSIsImQiLCJEYXRlIiwibW9udGhOYW1lcyIsIkN1cnJlbnRXZWF0aGVyIiwiY3VycmVudFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmUiLCJnZXRUZW1wZXJhdHVyZSIsIk1hdGgiLCJyb3VuZCIsIm1haW4iLCJ0ZW1wIiwiZmVlbHNMaWtlVGVtcCIsImZlZWxzX2xpa2UiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIndpbmQiLCJzcGVlZCIsInByZXNzdXJlIiwic3VucmlzZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUiLCJ0aW1lem9uZSIsInN1bnNldCIsIndlYXRoZXJDb25kaXRpb25EZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwid2VhdGhlckNvbmRpdGlvbkltZyIsImdldFdlYXRoZXJDb25kaXRpb25JbWciLCJiYWNrZ3JvdW5kVmlkZW8iLCJnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rIiwiZGVncmVlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInN1YnN0ciIsInN1bnJpc2VVbml4Iiwic3Vuc2V0VW5peCIsIm1pc3RFcXVpdmFsZW50ZXMiLCJpbmNsdWRlcyIsImN1cnJlbnREYXRlIiwic3VucmlzZURhdGUiLCJzdW5zZXREYXRlIiwid2VhdGhlckNvbmRpdGlvbiIsInZpZGVvTGlua3MiLCJDbGVhckRheSIsIkNsZWFyTmlnaHQiLCJDbG91ZHMiLCJNaXN0IiwiUmFpbiIsIlNub3ciLCJUaHVuZGVyc3Rvcm0iLCJGb3JlY2FzdFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmVzIiwiZ2V0VGVtcGVyYXR1cmVzIiwiZ2V0V2VhdGhlckNvbmRpdGlvbnMiLCJ0aW1lIiwiZ2V0VGltZXMiLCJsaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJ0ZW1wV2l0aFVuaXQiLCJnZXRUZW1wZXJhdHVyZVVuaXQiLCJwdXNoIiwiY3VycmVudEhvdXIiLCJzdW5yaXNlSG91ciIsInN1bnNldEhvdXIiLCJjb25kIiwiZHQiLCJ0aW1lcyIsIk1haW5Nb2RlbCIsImRhdGEiLCJDaXR5SW5mb1ZpZXciLCJlbGVtZW50IiwiY2l0eUluZm9Nb2RlbCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsIkN1cnJlbnRXZWF0aGVyVmlldyIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJNYWluVmlldyIsImNvbG9yIiwiY3VycmVudFdlYXRoZXJNb2RlbCIsIm5vd1dlYXRoZXJDb25kaXRpb24iLCJub3dUZW1wZXJhdHVyZSIsInNyYyIsImZvcmVjYXN0V2VhdGhlclZpZXciLCJmb3JlY2FzdFdlYXRoZXJNb2RlbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuZ3RoIiwiY29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiIn0=