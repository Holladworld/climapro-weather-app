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
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --clr-neutral: hsl(0, 0%, 100%);
  --clr-neutral-transp: rgba(255, 255, 255, 0.171);
  --ff-primary: "Poppins", sans-serif;
  --fw-300: 300;
  --fw-400: 400;
  --fw-500: 500;
  --fw-600: 600;
  --fw-700: 700;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-shadow: 2px 2px 8px #000000;
}

body {
  width: 100vw;
  min-height: 100vh;
  background-image: url(https://i.pinimg.com/originals/e7/7f/c3/e77fc3197e445ac3e61e628e0a8cfbf9.gif);
  background-color: rgb(13, 0, 132);
  font-family: var(--ff-primary);
  color: var(--clr-neutral);
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 4rem 2rem;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -5;
}

video {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  animation: slowLoop 1000s infinite linear;
}
@keyframes slowLoop {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0.5, 0.5); 
}

footer {
  background-color: #33333322; 
  color: white; 
  padding: 20px;
  text-align: center;
}

.footer-content {
  max-width: 1200px; 
  margin: 0 auto;
   
}
.footer-content a {
  color: #ff8400;
}


.unitC,
.unitF {
  font-size: 0.85rem;
  height: 16px;
  width: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  z-index: 20;
  pointer-events: none;
  text-shadow: none;
}

.unitF {
  color: white;
}

.checkbox-container {
  position: absolute;
  top: 3rem;
  right: 3rem;
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.label {
  background-color: #111;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  height: 26px;
  width: 50px;
  transform: scale(1.5);
}

.label .ball {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  height: 22px;
  width: 22px;
  transform: translateX(0px);
  transition: transform 0.2s linear;
}

.checkbox:checked + .label .ball {
  transform: translateX(24px);
}

.search-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.search-wrapper input {
  width: 40%;
  padding: 10px 10px 10px 40px;
  border-radius: 2rem;
  border: none;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: calc(1rem + 0.5vw);
  background-color: white;
  text-shadow: none;
}

#error {
  display: none;
}

.city-info h1 {
  margin: 0.3rem 0;
  letter-spacing: 0.1rem;
  font-weight: var(--fw-600);
  font-size: 2.5rem;
}

h2 {
  font-size: 1.1rem;
  font-weight: var(--fw-300);
}

.current-weather {
  display: flex;
  justify-content: space-around;
}

.current-weather_cointainer {
  display: flex;
}

.current-weather_cointainer img {
  width: calc(10rem + 10vw);
}

.current-weather_cointainer h1 {
  margin: 0.3rem 0;
  font-size: 4rem;
  font-weight: var(--fw-400);
}

.current-weather_temp {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.current-weather__details {
  display: flex;
  align-items: center;
  align-self: center;
  height: max-content;
  padding: 2rem 4rem;
  gap: 4rem;
  border-radius: 0.5rem;
  background-color: var(--clr-neutral-transp);
}

.current-weather__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.current-weather__item img {
  width: calc(1rem + 1vw);
}

.current-weather__details__column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forecast {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  background-color: var(--clr-neutral-transp);
}

.forecast__item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forecast__item img {
  width: calc(2rem + 3vw);
}
`, "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"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","sourcesContent":["@import url(./normalize.css);\r\n\r\n:root {\r\n  --clr-neutral: hsl(0, 0%, 100%);\r\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\r\n  --ff-primary: \"Poppins\", sans-serif;\r\n  --fw-300: 300;\r\n  --fw-400: 400;\r\n  --fw-500: 500;\r\n  --fw-600: 600;\r\n  --fw-700: 700;\r\n}\r\n\r\n*,\r\n*::before,\r\n*::after {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n  text-shadow: 2px 2px 8px #000000;\r\n}\r\n\r\nbody {\r\n  width: 100vw;\r\n  min-height: 100vh;\r\n  background-image: url(https://i.pinimg.com/originals/e7/7f/c3/e77fc3197e445ac3e61e628e0a8cfbf9.gif);\r\n  background-color: rgb(13, 0, 132);\r\n  font-family: var(--ff-primary);\r\n  color: var(--clr-neutral);\r\n}\r\n\r\nmain {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-evenly;\r\n  position: relative;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  padding: 4rem 2rem;\r\n  overflow: hidden;\r\n}\r\n\r\n.video-container {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  z-index: -5;\r\n}\r\n\r\nvideo {\r\n  width: 100vw;\r\n  height: 100vh;\r\n  object-fit: cover;\r\n  animation: slowLoop 1000s infinite linear;\r\n}\r\n@keyframes slowLoop {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; }\r\n  90% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n}\r\n\r\n.overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0.5, 0.5); \r\n}\r\n\r\nfooter {\r\n  background-color: #33333322; \r\n  color: white; \r\n  padding: 20px;\r\n  text-align: center;\r\n}\r\n\r\n.footer-content {\r\n  max-width: 1200px; \r\n  margin: 0 auto;\r\n   \r\n}\r\n.footer-content a {\r\n  color: #ff8400;\r\n}\r\n\r\n\r\n.unitC,\r\n.unitF {\r\n  font-size: 0.85rem;\r\n  height: 16px;\r\n  width: 16px;\r\n  border-radius: 8px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  color: black;\r\n  z-index: 20;\r\n  pointer-events: none;\r\n  text-shadow: none;\r\n}\r\n\r\n.unitF {\r\n  color: white;\r\n}\r\n\r\n.checkbox-container {\r\n  position: absolute;\r\n  top: 3rem;\r\n  right: 3rem;\r\n}\r\n\r\n.checkbox {\r\n  opacity: 0;\r\n  position: absolute;\r\n}\r\n\r\n.label {\r\n  background-color: #111;\r\n  border-radius: 50px;\r\n  cursor: pointer;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  padding: 5px;\r\n  position: relative;\r\n  height: 26px;\r\n  width: 50px;\r\n  transform: scale(1.5);\r\n}\r\n\r\n.label .ball {\r\n  background-color: #fff;\r\n  border-radius: 50%;\r\n  position: absolute;\r\n  top: 2px;\r\n  left: 2px;\r\n  height: 22px;\r\n  width: 22px;\r\n  transform: translateX(0px);\r\n  transition: transform 0.2s linear;\r\n}\r\n\r\n.checkbox:checked + .label .ball {\r\n  transform: translateX(24px);\r\n}\r\n\r\n.search-wrapper {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 10px;\r\n}\r\n\r\n.search-wrapper input {\r\n  width: 40%;\r\n  padding: 10px 10px 10px 40px;\r\n  border-radius: 2rem;\r\n  border: none;\r\n  background-image: url(../images/magnify.png);\r\n  background-repeat: no-repeat;\r\n  background-position: 10px center;\r\n  background-size: calc(1rem + 0.5vw);\r\n  background-color: white;\r\n  text-shadow: none;\r\n}\r\n\r\n#error {\r\n  display: none;\r\n}\r\n\r\n.city-info h1 {\r\n  margin: 0.3rem 0;\r\n  letter-spacing: 0.1rem;\r\n  font-weight: var(--fw-600);\r\n  font-size: 2.5rem;\r\n}\r\n\r\nh2 {\r\n  font-size: 1.1rem;\r\n  font-weight: var(--fw-300);\r\n}\r\n\r\n.current-weather {\r\n  display: flex;\r\n  justify-content: space-around;\r\n}\r\n\r\n.current-weather_cointainer {\r\n  display: flex;\r\n}\r\n\r\n.current-weather_cointainer img {\r\n  width: calc(10rem + 10vw);\r\n}\r\n\r\n.current-weather_cointainer h1 {\r\n  margin: 0.3rem 0;\r\n  font-size: 4rem;\r\n  font-weight: var(--fw-400);\r\n}\r\n\r\n.current-weather_temp {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n}\r\n\r\n.current-weather__details {\r\n  display: flex;\r\n  align-items: center;\r\n  align-self: center;\r\n  height: max-content;\r\n  padding: 2rem 4rem;\r\n  gap: 4rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.current-weather__item {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  font-size: 1rem;\r\n}\r\n\r\n.current-weather__item img {\r\n  width: calc(1rem + 1vw);\r\n}\r\n\r\n.current-weather__details__column {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1rem;\r\n}\r\n\r\n.forecast {\r\n  display: flex;\r\n  justify-content: space-around;\r\n  width: 100%;\r\n  padding: 1rem 2rem;\r\n  border-radius: 0.5rem;\r\n  background-color: var(--clr-neutral-transp);\r\n}\r\n\r\n.forecast__item {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.forecast__item img {\r\n  width: calc(2rem + 3vw);\r\n}\r\n"],"sourceRoot":""}]);
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
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

 html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}`, "",{"version":3,"sources":["webpack://./src/styles/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;CAED;EACC,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,SAAS;AACX;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,uBAAuB,EAAE,MAAM;EAC/B,SAAS,EAAE,MAAM;EACjB,iBAAiB,EAAE,MAAM;AAC3B;;AAEA;;;EAGE;;AAEF;EACE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB,EAAE,MAAM;EAC3B,0BAA0B,EAAE,MAAM;EAClC,iCAAiC,EAAE,MAAM;AAC3C;;AAEA;;EAEE;;AAEF;;EAEE,mBAAmB;AACrB;;AAEA;;;EAGE;;AAEF;;;EAGE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;EAGE;;AAEF;QACQ,MAAM;EACZ,iBAAiB;AACnB;;AAEA;;;EAGE;;AAEF;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;EAEE;;AAEF;;;;EAIE,0BAA0B;AAC5B;;AAEA;;EAEE;;AAEF;;;;EAIE,kBAAkB;EAClB,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;EAIE,8BAA8B;AAChC;;AAEA;;EAEE;;AAEF;EACE,8BAA8B;AAChC;;AAEA;;;;;EAKE;;AAEF;EACE,sBAAsB,EAAE,MAAM;EAC9B,cAAc,EAAE,MAAM;EACtB,cAAc,EAAE,MAAM;EACtB,eAAe,EAAE,MAAM;EACvB,UAAU,EAAE,MAAM;EAClB,mBAAmB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,sBAAsB,EAAE,MAAM;EAC9B,UAAU,EAAE,MAAM;AACpB;;AAEA;;EAEE;;AAEF;;EAEE,YAAY;AACd;;AAEA;;;EAGE;;AAEF;EACE,6BAA6B,EAAE,MAAM;EACrC,oBAAoB,EAAE,MAAM;AAC9B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,0BAA0B,EAAE,MAAM;EAClC,aAAa,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,aAAa;AACf;;AAEA;;EAEE;;AAEF;EACE,aAAa;AACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\r\n\r\n/* Document\r\n   ========================================================================== */\r\n\r\n/**\r\n * 1. Correct the line height in all browsers.\r\n * 2. Prevent adjustments of font size after orientation changes in iOS.\r\n */\r\n\r\n html {\r\n  line-height: 1.15; /* 1 */\r\n  -webkit-text-size-adjust: 100%; /* 2 */\r\n}\r\n\r\n/* Sections\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove the margin in all browsers.\r\n */\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n/**\r\n * Render the `main` element consistently in IE.\r\n */\r\n\r\nmain {\r\n  display: block;\r\n}\r\n\r\n/**\r\n * Correct the font size and margin on `h1` elements within `section` and\r\n * `article` contexts in Chrome, Firefox, and Safari.\r\n */\r\n\r\nh1 {\r\n  font-size: 2em;\r\n  margin: 0.67em 0;\r\n}\r\n\r\n/* Grouping content\r\n   ========================================================================== */\r\n\r\n/**\r\n * 1. Add the correct box sizing in Firefox.\r\n * 2. Show the overflow in Edge and IE.\r\n */\r\n\r\nhr {\r\n  box-sizing: content-box; /* 1 */\r\n  height: 0; /* 1 */\r\n  overflow: visible; /* 2 */\r\n}\r\n\r\n/**\r\n * 1. Correct the inheritance and scaling of font size in all browsers.\r\n * 2. Correct the odd `em` font sizing in all browsers.\r\n */\r\n\r\npre {\r\n  font-family: monospace, monospace; /* 1 */\r\n  font-size: 1em; /* 2 */\r\n}\r\n\r\n/* Text-level semantics\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove the gray background on active links in IE 10.\r\n */\r\n\r\na {\r\n  background-color: transparent;\r\n}\r\n\r\n/**\r\n * 1. Remove the bottom border in Chrome 57-\r\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\r\n */\r\n\r\nabbr[title] {\r\n  border-bottom: none; /* 1 */\r\n  text-decoration: underline; /* 2 */\r\n  text-decoration: underline dotted; /* 2 */\r\n}\r\n\r\n/**\r\n * Add the correct font weight in Chrome, Edge, and Safari.\r\n */\r\n\r\nb,\r\nstrong {\r\n  font-weight: bolder;\r\n}\r\n\r\n/**\r\n * 1. Correct the inheritance and scaling of font size in all browsers.\r\n * 2. Correct the odd `em` font sizing in all browsers.\r\n */\r\n\r\ncode,\r\nkbd,\r\nsamp {\r\n  font-family: monospace, monospace; /* 1 */\r\n  font-size: 1em; /* 2 */\r\n}\r\n\r\n/**\r\n * Add the correct font size in all browsers.\r\n */\r\n\r\nsmall {\r\n  font-size: 80%;\r\n}\r\n\r\n/**\r\n * Prevent `sub` and `sup` elements from affecting the line height in\r\n * all browsers.\r\n */\r\n\r\nsub,\r\nsup {\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  position: relative;\r\n  vertical-align: baseline;\r\n}\r\n\r\nsub {\r\n  bottom: -0.25em;\r\n}\r\n\r\nsup {\r\n  top: -0.5em;\r\n}\r\n\r\n/* Embedded content\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove the border on images inside links in IE 10.\r\n */\r\n\r\nimg {\r\n  border-style: none;\r\n}\r\n\r\n/* Forms\r\n   ========================================================================== */\r\n\r\n/**\r\n * 1. Change the font styles in all browsers.\r\n * 2. Remove the margin in Firefox and Safari.\r\n */\r\n\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  font-family: inherit; /* 1 */\r\n  font-size: 100%; /* 1 */\r\n  line-height: 1.15; /* 1 */\r\n  margin: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Show the overflow in IE.\r\n * 1. Show the overflow in Edge.\r\n */\r\n\r\nbutton,\r\ninput { /* 1 */\r\n  overflow: visible;\r\n}\r\n\r\n/**\r\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\r\n * 1. Remove the inheritance of text transform in Firefox.\r\n */\r\n\r\nbutton,\r\nselect { /* 1 */\r\n  text-transform: none;\r\n}\r\n\r\n/**\r\n * Correct the inability to style clickable types in iOS and Safari.\r\n */\r\n\r\nbutton,\r\n[type=\"button\"],\r\n[type=\"reset\"],\r\n[type=\"submit\"] {\r\n  -webkit-appearance: button;\r\n}\r\n\r\n/**\r\n * Remove the inner border and padding in Firefox.\r\n */\r\n\r\nbutton::-moz-focus-inner,\r\n[type=\"button\"]::-moz-focus-inner,\r\n[type=\"reset\"]::-moz-focus-inner,\r\n[type=\"submit\"]::-moz-focus-inner {\r\n  border-style: none;\r\n  padding: 0;\r\n}\r\n\r\n/**\r\n * Restore the focus styles unset by the previous rule.\r\n */\r\n\r\nbutton:-moz-focusring,\r\n[type=\"button\"]:-moz-focusring,\r\n[type=\"reset\"]:-moz-focusring,\r\n[type=\"submit\"]:-moz-focusring {\r\n  outline: 1px dotted ButtonText;\r\n}\r\n\r\n/**\r\n * Correct the padding in Firefox.\r\n */\r\n\r\nfieldset {\r\n  padding: 0.35em 0.75em 0.625em;\r\n}\r\n\r\n/**\r\n * 1. Correct the text wrapping in Edge and IE.\r\n * 2. Correct the color inheritance from `fieldset` elements in IE.\r\n * 3. Remove the padding so developers are not caught out when they zero out\r\n *    `fieldset` elements in all browsers.\r\n */\r\n\r\nlegend {\r\n  box-sizing: border-box; /* 1 */\r\n  color: inherit; /* 2 */\r\n  display: table; /* 1 */\r\n  max-width: 100%; /* 1 */\r\n  padding: 0; /* 3 */\r\n  white-space: normal; /* 1 */\r\n}\r\n\r\n/**\r\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\r\n */\r\n\r\nprogress {\r\n  vertical-align: baseline;\r\n}\r\n\r\n/**\r\n * Remove the default vertical scrollbar in IE 10+.\r\n */\r\n\r\ntextarea {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * 1. Add the correct box sizing in IE 10.\r\n * 2. Remove the padding in IE 10.\r\n */\r\n\r\n[type=\"checkbox\"],\r\n[type=\"radio\"] {\r\n  box-sizing: border-box; /* 1 */\r\n  padding: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Correct the cursor style of increment and decrement buttons in Chrome.\r\n */\r\n\r\n[type=\"number\"]::-webkit-inner-spin-button,\r\n[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\n\r\n/**\r\n * 1. Correct the odd appearance in Chrome and Safari.\r\n * 2. Correct the outline style in Safari.\r\n */\r\n\r\n[type=\"search\"] {\r\n  -webkit-appearance: textfield; /* 1 */\r\n  outline-offset: -2px; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove the inner padding in Chrome and Safari on macOS.\r\n */\r\n\r\n[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\n\r\n/**\r\n * 1. Correct the inability to style clickable types in iOS and Safari.\r\n * 2. Change font properties to `inherit` in Safari.\r\n */\r\n\r\n::-webkit-file-upload-button {\r\n  -webkit-appearance: button; /* 1 */\r\n  font: inherit; /* 2 */\r\n}\r\n\r\n/* Interactive\r\n   ========================================================================== */\r\n\r\n/*\r\n * Add the correct display in Edge, IE 10+, and Firefox.\r\n */\r\n\r\ndetails {\r\n  display: block;\r\n}\r\n\r\n/*\r\n * Add the correct display in all browsers.\r\n */\r\n\r\nsummary {\r\n  display: list-item;\r\n}\r\n\r\n/* Misc\r\n   ========================================================================== */\r\n\r\n/**\r\n * Add the correct display in IE 10+.\r\n */\r\n\r\ntemplate {\r\n  display: none;\r\n}\r\n\r\n/**\r\n * Add the correct display in IE 10.\r\n */\r\n\r\n[hidden] {\r\n  display: none;\r\n}"],"sourceRoot":""}]);
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
  var list = [];

  // return the list of modules as css string
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
  };

  // import a list of modules into the list
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
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
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
    return [content].concat([sourceMapping]).join("\n");
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
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
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
  }

  // For old IE
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
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1BLGNBQWMsQ0FBQztFQUNsQ0MsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFQyxJQUFJLEVBQUU7SUFDdkIsSUFBSSxDQUFDRCxLQUFLLEdBQUdBLEtBQUs7SUFDbEIsSUFBSSxDQUFDQyxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxDQUFDQyxJQUFJLEdBQUcsUUFBUTtJQUVwQkMsUUFBUSxDQUFDQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUNDLGdCQUFnQixDQUFDLE1BQU0sRUFBR0MsQ0FBQyxJQUFLLElBQUksQ0FBQ0MsUUFBUSxDQUFDSixRQUFRLENBQUNDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQ0ksS0FBSyxDQUFDLENBQUM7SUFDekhMLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUdDLENBQUMsSUFBSyxJQUFJLENBQUNHLFlBQVksQ0FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDM0ZJLE1BQU0sQ0FBQ0wsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxDQUFDRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0RKLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUdDLENBQUMsSUFBSyxJQUFJLENBQUNLLGlCQUFpQixDQUFDTCxDQUFDLENBQUMsQ0FBQztFQUN2RztFQUVBLE1BQU1DLFFBQVFBLENBQUNOLElBQUksRUFBRTtJQUNuQkUsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNRLFlBQVksR0FBRyxHQUFHO0lBRW5ELElBQUksQ0FBQ1gsSUFBSSxHQUFHQSxJQUFJO0lBRWhCLE1BQU1ZLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQ2QsS0FBSyxDQUFDZSxXQUFXLENBQUNiLElBQUksRUFBRSxJQUFJLENBQUNDLElBQUksQ0FBQztJQUM5RCxNQUFNYSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUNoQixLQUFLLENBQUNpQixpQkFBaUIsQ0FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBQzFFLE1BQU1lLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ21CLGtCQUFrQixDQUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBRTVFLElBQUksQ0FBQ0YsSUFBSSxDQUFDbUIsY0FBYyxDQUFDTixRQUFRLENBQUM7SUFDbEMsSUFBSSxDQUFDYixJQUFJLENBQUNvQixvQkFBb0IsQ0FBQ0wsY0FBYyxDQUFDO0lBQzlDLElBQUksQ0FBQ2YsSUFBSSxDQUFDcUIscUJBQXFCLENBQUNKLGVBQWUsQ0FBQztFQUNsRDtFQUVBUixZQUFZQSxDQUFDSCxDQUFDLEVBQUU7SUFDZCxJQUFJQSxDQUFDLENBQUNnQixHQUFHLEtBQUssT0FBTyxFQUFFbkIsUUFBUSxDQUFDQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUNtQixJQUFJLENBQUMsQ0FBQztFQUNqRTtFQUVBWixpQkFBaUJBLENBQUNMLENBQUMsRUFBRTtJQUNuQixNQUFNSixJQUFJLEdBQUdJLENBQUMsQ0FBQ2tCLGFBQWEsQ0FBQ0MsT0FBTyxHQUFHLFVBQVUsR0FBRyxRQUFRO0lBQzVELElBQUksQ0FBQ3pCLElBQUksQ0FBQzBCLGNBQWMsQ0FBQ3hCLElBQUksQ0FBQztJQUM5QixJQUFJLENBQUNBLElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJLENBQUNLLFFBQVEsQ0FBQyxJQUFJLENBQUNOLElBQUksQ0FBQztFQUMxQjtBQUNGOzs7Ozs7Ozs7Ozs7OztBQ3JDZSxNQUFNMEIsSUFBSSxDQUFDO0VBQ3hCN0IsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osSUFBSSxDQUFDOEIsWUFBWSxHQUFHLElBQUlDLFlBQVksQ0FBQyxrQ0FBa0MsQ0FBQztFQUMxRTtFQUVBLE1BQU1DLGlCQUFpQkEsQ0FBQzdCLElBQUksRUFBRTtJQUM1QixJQUFJO01BQ0YsTUFBTThCLEdBQUcsR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQ0ksb0JBQW9CLENBQUMvQixJQUFJLENBQUM7TUFDeEQsTUFBTWdDLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQUNILEdBQUcsRUFBRTtRQUFFSSxJQUFJLEVBQUU7TUFBTyxDQUFDLENBQUM7TUFDbkQsTUFBTUMsYUFBYSxHQUFHLE1BQU1ILFFBQVEsQ0FBQ0ksSUFBSSxDQUFDLENBQUM7TUFDM0MsTUFBTTtRQUFFQyxHQUFHO1FBQUVDO01BQUksQ0FBQyxHQUFHSCxhQUFhLENBQUMsQ0FBQyxDQUFDO01BQ3JDakMsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNvQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxNQUFNO01BQ3ZELE9BQU87UUFBRUgsR0FBRztRQUFFQztNQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU9HLEdBQUcsRUFBRTtNQUNaQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0YsR0FBRyxDQUFDO01BQ2hCdkMsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNvQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxPQUFPO01BQ3hELE9BQU8sSUFBSTtJQUNiO0VBQ0Y7RUFFQSxNQUFNSSxxQkFBcUJBLENBQUM1QyxJQUFJLEVBQUVDLElBQUksRUFBRTtJQUN0QyxJQUFJO01BQ0YsTUFBTTtRQUFFb0MsR0FBRztRQUFFQztNQUFJLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQ1QsaUJBQWlCLENBQUM3QixJQUFJLENBQUM7TUFDdkQsTUFBTThCLEdBQUcsR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQ2tCLHlCQUF5QixDQUFDUixHQUFHLEVBQUVDLEdBQUcsRUFBRXJDLElBQUksQ0FBQztNQUN2RSxNQUFNK0IsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQ0gsR0FBRyxFQUFFO1FBQUVJLElBQUksRUFBRTtNQUFPLENBQUMsQ0FBQztNQUNuRCxNQUFNWSxXQUFXLEdBQUcsTUFBTWQsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztNQUN6Q2xDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDb0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsTUFBTTtNQUN2RCxPQUFPTSxXQUFXO0lBQ3BCLENBQUMsQ0FBQyxPQUFPTCxHQUFHLEVBQUU7TUFDWkMsT0FBTyxDQUFDQyxHQUFHLENBQUNGLEdBQUcsQ0FBQztNQUNoQnZDLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDb0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsT0FBTztNQUN4RCxPQUFPLElBQUk7SUFDYjtFQUNGO0VBRUEsTUFBTU8sc0JBQXNCQSxDQUFDL0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDdkMsSUFBSTtNQUNGLE1BQU07UUFBRW9DLEdBQUc7UUFBRUM7TUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUNULGlCQUFpQixDQUFDN0IsSUFBSSxDQUFDO01BQ3ZELE1BQU04QixHQUFHLEdBQUcsSUFBSSxDQUFDSCxZQUFZLENBQUNxQiwwQkFBMEIsQ0FBQ1gsR0FBRyxFQUFFQyxHQUFHLEVBQUVyQyxJQUFJLENBQUM7TUFDeEUsTUFBTStCLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQUNILEdBQUcsRUFBRTtRQUFFSSxJQUFJLEVBQUU7TUFBTyxDQUFDLENBQUM7TUFDbkQsTUFBTWUsWUFBWSxHQUFHLE1BQU1qQixRQUFRLENBQUNJLElBQUksQ0FBQyxDQUFDO01BQzFDbEMsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNvQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxNQUFNO01BQ3ZELE9BQU9TLFlBQVk7SUFDckIsQ0FBQyxDQUFDLE9BQU9SLEdBQUcsRUFBRTtNQUNaQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0YsR0FBRyxDQUFDO01BQ2hCdkMsUUFBUSxDQUFDQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUNvQyxLQUFLLENBQUNDLE9BQU8sR0FBRyxPQUFPO01BQ3hELE9BQU8sSUFBSTtJQUNiO0VBQ0Y7QUFDRjtBQUVBLE1BQU1aLFlBQVksQ0FBQztFQUNqQi9CLFdBQVdBLENBQUNxRCxLQUFLLEVBQUU7SUFDakIsSUFBSSxDQUFDQyxPQUFPLEdBQUcsZ0NBQWdDO0lBQy9DLElBQUksQ0FBQ0QsS0FBSyxHQUFHQSxLQUFLO0VBQ3BCO0VBRUFuQixvQkFBb0JBLENBQUMvQixJQUFJLEVBQUU7SUFDekIsT0FBUSxHQUFFLElBQUksQ0FBQ21ELE9BQVEscUJBQW9CbkQsSUFBSyxVQUFTLElBQUksQ0FBQ2tELEtBQU0sRUFBQztFQUN2RTtFQUVBTCx5QkFBeUJBLENBQUNSLEdBQUcsRUFBRUMsR0FBRyxFQUFFckMsSUFBSSxFQUFFO0lBQ3hDLE9BQVEsR0FBRSxJQUFJLENBQUNrRCxPQUFRLHlCQUF3QmQsR0FBSSxRQUFPQyxHQUFJLFVBQVMsSUFBSSxDQUFDWSxLQUFNLFVBQVNqRCxJQUFLLEVBQUM7RUFDbkc7RUFFQStDLDBCQUEwQkEsQ0FBQ1gsR0FBRyxFQUFFQyxHQUFHLEVBQUVyQyxJQUFJLEVBQUU7SUFDekMsT0FBUSxHQUFFLElBQUksQ0FBQ2tELE9BQVEsMEJBQXlCZCxHQUFJLFFBQU9DLEdBQUksZ0JBQWUsSUFBSSxDQUFDWSxLQUFNLFVBQVNqRCxJQUFLLEVBQUM7RUFDMUc7QUFDRjs7Ozs7Ozs7Ozs7Ozs7QUNwRWUsTUFBTW1ELFFBQVEsQ0FBQztFQUM1QnZELFdBQVdBLENBQUN3RCxPQUFPLEVBQUU7SUFDbkIsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDQyxxQkFBcUIsQ0FBQ0YsT0FBTyxDQUFDO0lBQzFELElBQUksQ0FBQ0csZUFBZSxHQUFHLElBQUksQ0FBQ0MscUJBQXFCLENBQUNKLE9BQU8sQ0FBQztFQUM1RDtFQUVBRSxxQkFBcUJBLENBQUNGLE9BQU8sRUFBRTtJQUM3QixNQUFNckQsSUFBSSxHQUFHcUQsT0FBTyxDQUFDSyxJQUFJO0lBQ3pCLE1BQU07TUFBRUM7SUFBUSxDQUFDLEdBQUdOLE9BQU8sQ0FBQ08sR0FBRztJQUMvQixPQUFRLEdBQUU1RCxJQUFLLEtBQUkyRCxPQUFRLEVBQUM7RUFDOUI7RUFFQUYscUJBQXFCQSxDQUFDSixPQUFPLEVBQUU7SUFDN0IsTUFBTVEsR0FBRyxHQUFHLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUM7SUFDekIsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQ0MsUUFBUSxDQUFDLENBQUM7SUFDN0IsTUFBTUMsSUFBSSxHQUFHLElBQUksQ0FBQ0MsT0FBTyxDQUFDLENBQUM7SUFDM0IsT0FBUSxHQUFFTCxHQUFJLEtBQUlFLEtBQU0sSUFBR0UsSUFBSyxFQUFDO0VBQ25DO0VBRUFILE1BQU1BLENBQUEsRUFBRztJQUNQLE1BQU1LLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQztJQUM5RixNQUFNQyxDQUFDLEdBQUcsSUFBSUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsTUFBTVIsR0FBRyxHQUFHTSxPQUFPLENBQUNDLENBQUMsQ0FBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvQixPQUFPRCxHQUFHO0VBQ1o7RUFFQUcsUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsTUFBTU0sVUFBVSxHQUFHLENBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsT0FBTyxFQUNQLE9BQU8sRUFDUCxLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsV0FBVyxFQUNYLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxDQUNYO0lBQ0QsTUFBTUYsQ0FBQyxHQUFHLElBQUlDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLE1BQU1OLEtBQUssR0FBR08sVUFBVSxDQUFDRixDQUFDLENBQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEMsT0FBT0QsS0FBSztFQUNkO0VBRUFHLE9BQU9BLENBQUEsRUFBRztJQUNSLE1BQU1FLENBQUMsR0FBRyxJQUFJQyxJQUFJLENBQUMsQ0FBQztJQUNwQixNQUFNSixJQUFJLEdBQUdHLENBQUMsQ0FBQ0YsT0FBTyxDQUFDLENBQUM7SUFDeEIsT0FBT0QsSUFBSTtFQUNiO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7O0FDbkRlLE1BQU1NLGNBQWMsQ0FBQztFQUNsQzFFLFdBQVdBLENBQUMyRSxrQkFBa0IsRUFBRXZFLElBQUksRUFBRTtJQUNwQyxJQUFJLENBQUN3RSxXQUFXLEdBQUcsSUFBSSxDQUFDQyxjQUFjLENBQUNDLElBQUksQ0FBQ0MsS0FBSyxDQUFDSixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDQyxJQUFJLENBQUMsRUFBRTdFLElBQUksQ0FBQztJQUN0RixJQUFJLENBQUM4RSxhQUFhLEdBQUcsSUFBSSxDQUFDTCxjQUFjLENBQUNDLElBQUksQ0FBQ0MsS0FBSyxDQUFDSixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDRyxVQUFVLENBQUMsRUFBRS9FLElBQUksQ0FBQztJQUM5RixJQUFJLENBQUNnRixRQUFRLEdBQUksR0FBRVQsa0JBQWtCLENBQUNLLElBQUksQ0FBQ0ksUUFBUyxHQUFFO0lBQ3RELElBQUksQ0FBQ0MsU0FBUyxHQUFJLEdBQUVWLGtCQUFrQixDQUFDVyxJQUFJLENBQUNDLEtBQU0sTUFBSztJQUN2RCxJQUFJLENBQUNDLFFBQVEsR0FBSSxHQUFFYixrQkFBa0IsQ0FBQ0ssSUFBSSxDQUFDUSxRQUFTLE1BQUs7SUFDekQsSUFBSSxDQUFDQyxPQUFPLEdBQUcsSUFBSSxDQUFDQyx5QkFBeUIsQ0FBQ2Ysa0JBQWtCLENBQUNaLEdBQUcsQ0FBQzBCLE9BQU8sRUFBRWQsa0JBQWtCLENBQUNnQixRQUFRLENBQUM7SUFDMUcsSUFBSSxDQUFDQyxNQUFNLEdBQUcsSUFBSSxDQUFDRix5QkFBeUIsQ0FBQ2Ysa0JBQWtCLENBQUNaLEdBQUcsQ0FBQzZCLE1BQU0sRUFBRWpCLGtCQUFrQixDQUFDZ0IsUUFBUSxDQUFDO0lBQ3hHLElBQUksQ0FBQ0Usb0JBQW9CLEdBQUdsQixrQkFBa0IsQ0FBQ21CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsV0FBVztJQUNyRSxJQUFJLENBQUNDLG1CQUFtQixHQUFHLElBQUksQ0FBQ0Msc0JBQXNCLENBQ3BEdEIsa0JBQWtCLENBQUNtQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUNkLElBQUksRUFDbENMLGtCQUFrQixDQUFDWixHQUFHLENBQUMwQixPQUFPLEVBQzlCZCxrQkFBa0IsQ0FBQ1osR0FBRyxDQUFDNkIsTUFBTSxFQUM3QmpCLGtCQUFrQixDQUFDZ0IsUUFDckIsQ0FBQztJQUNELElBQUksQ0FBQ08sZUFBZSxHQUFHLElBQUksQ0FBQ0Msc0JBQXNCLENBQUMsSUFBSSxDQUFDSCxtQkFBbUIsQ0FBQztFQUM5RTtFQUVBbkIsY0FBY0EsQ0FBQ3VCLE1BQU0sRUFBRWhHLElBQUksRUFBRTtJQUMzQixPQUFPQSxJQUFJLEtBQUssUUFBUSxHQUFJLEdBQUVnRyxNQUFPLEdBQUUsR0FBSSxHQUFFQSxNQUFPLEdBQUU7RUFDeEQ7RUFFQUMseUJBQXlCQSxDQUFDQyxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUM1QyxNQUFNWSxTQUFTLEdBQUdELFFBQVEsS0FBSyxDQUFDLEdBQUcsSUFBSTlCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSUEsSUFBSSxDQUFDOEIsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6RSxNQUFNRSxXQUFXLEdBQUdELFNBQVMsQ0FBQ0UsT0FBTyxDQUFDLENBQUMsR0FBR0YsU0FBUyxDQUFDRyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsS0FBSztJQUMvRSxNQUFNQyxzQkFBc0IsR0FBR0gsV0FBVyxHQUFHYixRQUFRLEdBQUcsSUFBSTtJQUM1RCxNQUFNaUIsa0JBQWtCLEdBQUcsSUFBSXBDLElBQUksQ0FBQ21DLHNCQUFzQixDQUFDO0lBQzNELE9BQU9DLGtCQUFrQjtFQUMzQjtFQUVBbEIseUJBQXlCQSxDQUFDWSxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUM1QyxNQUFNaUIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDUCx5QkFBeUIsQ0FBQ0MsUUFBUSxFQUFFWCxRQUFRLENBQUM7SUFDN0UsTUFBTWtCLEtBQUssR0FBR0Qsa0JBQWtCLENBQUNFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU1DLE9BQU8sR0FBSSxJQUFHSCxrQkFBa0IsQ0FBQ0ksVUFBVSxDQUFDLENBQUUsRUFBQztJQUNyRCxNQUFNQyxhQUFhLEdBQUksR0FBRUosS0FBTSxJQUFHRSxPQUFPLENBQUNHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBRSxFQUFDO0lBQ3RELE9BQU9ELGFBQWE7RUFDdEI7RUFFQWhCLHNCQUFzQkEsQ0FBQ3ZGLEtBQUssRUFBRXlHLFdBQVcsRUFBRUMsVUFBVSxFQUFFekIsUUFBUSxFQUFFO0lBQy9ELElBQUlqRixLQUFLLEtBQUssU0FBUyxFQUFFLE9BQU8sTUFBTTtJQUN0QyxNQUFNMkcsZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztJQUNyRyxJQUFJQSxnQkFBZ0IsQ0FBQ0MsUUFBUSxDQUFDNUcsS0FBSyxDQUFDLEVBQUUsT0FBTyxNQUFNO0lBQ25ELElBQUlBLEtBQUssS0FBSyxPQUFPLEVBQUUsT0FBT0EsS0FBSztJQUNuQyxNQUFNNkcsV0FBVyxHQUFHLElBQUksQ0FBQ2xCLHlCQUF5QixDQUFDLENBQUMsRUFBRVYsUUFBUSxDQUFDO0lBQy9ELE1BQU02QixXQUFXLEdBQUcsSUFBSSxDQUFDbkIseUJBQXlCLENBQUNjLFdBQVcsRUFBRXhCLFFBQVEsQ0FBQztJQUN6RSxNQUFNOEIsVUFBVSxHQUFHLElBQUksQ0FBQ3BCLHlCQUF5QixDQUFDZSxVQUFVLEVBQUV6QixRQUFRLENBQUM7SUFDdkUsT0FBTzRCLFdBQVcsR0FBR0MsV0FBVyxJQUFJRCxXQUFXLEdBQUdFLFVBQVUsR0FBSSxHQUFFL0csS0FBTSxLQUFJLEdBQUksR0FBRUEsS0FBTSxPQUFNO0VBQ2hHO0VBRUF5RixzQkFBc0JBLENBQUN1QixnQkFBZ0IsRUFBRTtJQUN2QyxNQUFNQyxVQUFVLEdBQUc7TUFDakJDLFFBQVEsRUFDTix1SUFBdUk7TUFDeklDLFVBQVUsRUFDUix1SUFBdUk7TUFDeklDLE1BQU0sRUFDSix1SUFBdUk7TUFDeklDLElBQUksRUFBRSx1SUFBdUk7TUFDN0lDLElBQUksRUFBRSx1SUFBdUk7TUFDN0lDLElBQUksRUFBRSx1SUFBdUk7TUFDN0lDLFlBQVksRUFDVjtJQUNKLENBQUM7SUFDRCxPQUFPUCxVQUFVLENBQUNELGdCQUFnQixDQUFDO0VBQ3JDO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7O0FDbEVlLE1BQU1TLGVBQWUsQ0FBQztFQUNuQ25JLFdBQVdBLENBQUNvSSxtQkFBbUIsRUFBRWhJLElBQUksRUFBRTtJQUNyQyxJQUFJLENBQUNpSSxZQUFZLEdBQUcsSUFBSSxDQUFDQyxlQUFlLENBQUNGLG1CQUFtQixFQUFFaEksSUFBSSxDQUFDO0lBQ25FLElBQUksQ0FBQ3NILGdCQUFnQixHQUFHLElBQUksQ0FBQ2Esb0JBQW9CLENBQUNILG1CQUFtQixDQUFDO0lBQ3RFLElBQUksQ0FBQ0ksSUFBSSxHQUFHLElBQUksQ0FBQ0MsUUFBUSxDQUFDTCxtQkFBbUIsQ0FBQztFQUNoRDtFQUVBRSxlQUFlQSxDQUFDRixtQkFBbUIsRUFBRWhJLElBQUksRUFBRTtJQUN6QyxNQUFNaUksWUFBWSxHQUFHLEVBQUU7SUFDdkJELG1CQUFtQixDQUFDTSxJQUFJLENBQUNDLE9BQU8sQ0FBRUMsSUFBSSxJQUFLO01BQ3pDLE1BQU0zRCxJQUFJLEdBQUdILElBQUksQ0FBQ0MsS0FBSyxDQUFDNkQsSUFBSSxDQUFDNUQsSUFBSSxDQUFDQyxJQUFJLENBQUM7TUFDdkMsTUFBTTRELFlBQVksR0FBRyxJQUFJLENBQUNDLGtCQUFrQixDQUFDN0QsSUFBSSxFQUFFN0UsSUFBSSxDQUFDO01BQ3hEaUksWUFBWSxDQUFDVSxJQUFJLENBQUNGLFlBQVksQ0FBQztJQUNqQyxDQUFDLENBQUM7SUFDRixPQUFPUixZQUFZO0VBQ3JCO0VBRUFTLGtCQUFrQkEsQ0FBQzFDLE1BQU0sRUFBRWhHLElBQUksRUFBRTtJQUMvQixPQUFPQSxJQUFJLEtBQUssUUFBUSxHQUFJLEdBQUVnRyxNQUFPLEdBQUUsR0FBSSxHQUFFQSxNQUFPLEdBQUU7RUFDeEQ7RUFFQUMseUJBQXlCQSxDQUFDQyxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUM1QyxNQUFNWSxTQUFTLEdBQUcsSUFBSS9CLElBQUksQ0FBQzhCLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDM0MsTUFBTUUsV0FBVyxHQUFHRCxTQUFTLENBQUNFLE9BQU8sQ0FBQyxDQUFDLEdBQUdGLFNBQVMsQ0FBQ0csaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDL0UsTUFBTUMsc0JBQXNCLEdBQUdILFdBQVcsR0FBR2IsUUFBUSxHQUFHLElBQUk7SUFDNUQsTUFBTWlCLGtCQUFrQixHQUFHLElBQUlwQyxJQUFJLENBQUNtQyxzQkFBc0IsQ0FBQztJQUMzRCxPQUFPQyxrQkFBa0I7RUFDM0I7RUFFQVgsc0JBQXNCQSxDQUFDdkYsS0FBSyxFQUFFOEgsSUFBSSxFQUFFckIsV0FBVyxFQUFFQyxVQUFVLEVBQUV6QixRQUFRLEVBQUU7SUFDckUsSUFBSWpGLEtBQUssS0FBSyxPQUFPLEVBQUUsT0FBT0EsS0FBSztJQUNuQyxNQUFNc0ksV0FBVyxHQUFHLElBQUksQ0FBQzNDLHlCQUF5QixDQUFDbUMsSUFBSSxFQUFFN0MsUUFBUSxDQUFDLENBQUNtQixRQUFRLENBQUMsQ0FBQztJQUM3RSxNQUFNbUMsV0FBVyxHQUFHLElBQUksQ0FBQzVDLHlCQUF5QixDQUFDYyxXQUFXLEVBQUV4QixRQUFRLENBQUMsQ0FBQ21CLFFBQVEsQ0FBQyxDQUFDO0lBQ3BGLE1BQU1vQyxVQUFVLEdBQUcsSUFBSSxDQUFDN0MseUJBQXlCLENBQUNlLFVBQVUsRUFBRXpCLFFBQVEsQ0FBQyxDQUFDbUIsUUFBUSxDQUFDLENBQUM7SUFDbEYsT0FBT2tDLFdBQVcsR0FBR0MsV0FBVyxJQUFJRCxXQUFXLEdBQUdFLFVBQVUsR0FBSSxHQUFFeEksS0FBTSxLQUFJLEdBQUksR0FBRUEsS0FBTSxPQUFNO0VBQ2hHO0VBRUE2SCxvQkFBb0JBLENBQUNILG1CQUFtQixFQUFFO0lBQ3hDLE1BQU1WLGdCQUFnQixHQUFHLEVBQUU7SUFDM0IsTUFBTVAsV0FBVyxHQUFHaUIsbUJBQW1CLENBQUNqSSxJQUFJLENBQUNzRixPQUFPO0lBQ3BELE1BQU0yQixVQUFVLEdBQUdnQixtQkFBbUIsQ0FBQ2pJLElBQUksQ0FBQ3lGLE1BQU07SUFDbEQsTUFBTTtNQUFFRDtJQUFTLENBQUMsR0FBR3lDLG1CQUFtQixDQUFDakksSUFBSTtJQUM3Q2lJLG1CQUFtQixDQUFDTSxJQUFJLENBQUNDLE9BQU8sQ0FBRUMsSUFBSSxJQUFLO01BQ3pDLE1BQU1PLElBQUksR0FBRyxJQUFJLENBQUNsRCxzQkFBc0IsQ0FBQzJDLElBQUksQ0FBQzlDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQ2QsSUFBSSxFQUFFNEQsSUFBSSxDQUFDUSxFQUFFLEVBQUVqQyxXQUFXLEVBQUVDLFVBQVUsRUFBRXpCLFFBQVEsQ0FBQztNQUMxRytCLGdCQUFnQixDQUFDcUIsSUFBSSxDQUFDSSxJQUFJLENBQUM7SUFDN0IsQ0FBQyxDQUFDO0lBQ0YsT0FBT3pCLGdCQUFnQjtFQUN6QjtFQUVBZSxRQUFRQSxDQUFDTCxtQkFBbUIsRUFBRTtJQUM1QixNQUFNaUIsS0FBSyxHQUFHLEVBQUU7SUFDaEIsTUFBTTtNQUFFMUQ7SUFBUyxDQUFDLEdBQUd5QyxtQkFBbUIsQ0FBQ2pJLElBQUk7SUFDN0NpSSxtQkFBbUIsQ0FBQ00sSUFBSSxDQUFDQyxPQUFPLENBQUVDLElBQUksSUFBSztNQUN6QyxNQUFNSixJQUFJLEdBQUcsSUFBSSxDQUFDOUMseUJBQXlCLENBQUNrRCxJQUFJLEVBQUVqRCxRQUFRLENBQUM7TUFDM0QwRCxLQUFLLENBQUNOLElBQUksQ0FBQ1AsSUFBSSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztJQUNGLE9BQU9hLEtBQUs7RUFDZDtFQUVBM0QseUJBQXlCQSxDQUFDWSxRQUFRLEVBQUVYLFFBQVEsRUFBRTtJQUM1QyxNQUFNWSxTQUFTLEdBQUcsSUFBSS9CLElBQUksQ0FBQzhCLFFBQVEsQ0FBQzhDLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDOUMsTUFBTTVDLFdBQVcsR0FBR0QsU0FBUyxDQUFDRSxPQUFPLENBQUMsQ0FBQyxHQUFHRixTQUFTLENBQUNHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxLQUFLO0lBQy9FLE1BQU1DLHNCQUFzQixHQUFHSCxXQUFXLEdBQUdiLFFBQVEsR0FBRyxJQUFJO0lBQzVELE1BQU1pQixrQkFBa0IsR0FBRyxJQUFJcEMsSUFBSSxDQUFDbUMsc0JBQXNCLENBQUM7SUFDM0QsTUFBTUUsS0FBSyxHQUFHRCxrQkFBa0IsQ0FBQ0UsUUFBUSxDQUFDLENBQUM7SUFDM0MsTUFBTTBCLElBQUksR0FBSSxHQUFFM0IsS0FBTSxLQUFJO0lBQzFCLE9BQU8yQixJQUFJO0VBQ2I7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEU4QztBQUNFO0FBQ2Q7QUFDUjtBQUVYLE1BQU1jLFNBQVMsQ0FBQztFQUM3QnRKLFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQ3VKLElBQUksR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLENBQUMxSCxJQUFJLEdBQUcsSUFBSUEsNkNBQUksQ0FBQyxDQUFDO0VBQ3hCO0VBRUEsTUFBTWIsV0FBV0EsQ0FBQ2IsSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDNUIsTUFBTW9ELE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQzNCLElBQUksQ0FBQ2tCLHFCQUFxQixDQUFDNUMsSUFBSSxFQUFFQyxJQUFJLENBQUM7SUFDakUsTUFBTVcsUUFBUSxHQUFHLElBQUl3QyxpREFBUSxDQUFDQyxPQUFPLENBQUM7SUFDdEMsT0FBT3pDLFFBQVE7RUFDakI7RUFFQSxNQUFNRyxpQkFBaUJBLENBQUNmLElBQUksRUFBRUMsSUFBSSxFQUFFO0lBQ2xDLE1BQU11RSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQzlDLElBQUksQ0FBQ2tCLHFCQUFxQixDQUFDNUMsSUFBSSxFQUFFQyxJQUFJLENBQUM7SUFDNUUsTUFBTWEsY0FBYyxHQUFHLElBQUl5RCx1REFBYyxDQUFDQyxrQkFBa0IsRUFBRXZFLElBQUksQ0FBQztJQUNuRSxPQUFPYSxjQUFjO0VBQ3ZCO0VBRUEsTUFBTUcsa0JBQWtCQSxDQUFDakIsSUFBSSxFQUFFQyxJQUFJLEVBQUU7SUFDbkMsTUFBTWdJLG1CQUFtQixHQUFHLE1BQU0sSUFBSSxDQUFDdkcsSUFBSSxDQUFDcUIsc0JBQXNCLENBQUMvQyxJQUFJLEVBQUVDLElBQUksQ0FBQztJQUM5RSxNQUFNZSxlQUFlLEdBQUcsSUFBSWdILHdEQUFlLENBQUNDLG1CQUFtQixFQUFFaEksSUFBSSxDQUFDO0lBQ3RFLE9BQU9lLGVBQWU7RUFDeEI7QUFDRjs7Ozs7Ozs7Ozs7Ozs7QUM1QmUsTUFBTXFJLFlBQVksQ0FBQztFQUNoQ3hKLFdBQVdBLENBQUN5SixPQUFPLEVBQUVDLGFBQWEsRUFBRTtJQUNsQyxJQUFJLENBQUNELE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUN4SixLQUFLLEdBQUd5SixhQUFhO0lBQzFCLElBQUksQ0FBQ3ZKLElBQUksR0FBR3VKLGFBQWEsQ0FBQ2pHLGVBQWU7SUFDekMsSUFBSSxDQUFDVyxJQUFJLEdBQUdzRixhQUFhLENBQUMvRixlQUFlO0VBQzNDO0VBRUEsSUFBSXhELElBQUlBLENBQUEsRUFBRztJQUNULE9BQU8sSUFBSSxDQUFDc0osT0FBTyxDQUFDRSxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ3pDO0VBRUEsSUFBSXhKLElBQUlBLENBQUNPLEtBQUssRUFBRTtJQUNkLElBQUksQ0FBQ1AsSUFBSSxDQUFDeUosV0FBVyxHQUFHbEosS0FBSztFQUMvQjtFQUVBLElBQUkwRCxJQUFJQSxDQUFBLEVBQUc7SUFDVCxPQUFPLElBQUksQ0FBQ3FGLE9BQU8sQ0FBQ0UsYUFBYSxDQUFDLElBQUksQ0FBQztFQUN6QztFQUVBLElBQUl2RixJQUFJQSxDQUFDMUQsS0FBSyxFQUFFO0lBQ2QsSUFBSSxDQUFDMEQsSUFBSSxDQUFDd0YsV0FBVyxHQUFHbEosS0FBSztFQUMvQjtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCMEM7QUFDWTtBQUNFO0FBRXpDLE1BQU1xSixRQUFRLENBQUM7RUFDNUIxSSxjQUFjQSxDQUFDTixRQUFRLEVBQUU7SUFDdkIsTUFBTTBJLE9BQU8sR0FBR3BKLFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFdBQVcsQ0FBQztJQUNwRCxJQUFJa0oscURBQVksQ0FBQ0MsT0FBTyxFQUFFMUksUUFBUSxDQUFDO0VBQ3JDO0VBRUFPLG9CQUFvQkEsQ0FBQ0wsY0FBYyxFQUFFO0lBQ25DLE1BQU13SSxPQUFPLEdBQUdwSixRQUFRLENBQUNDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztJQUMxRCxJQUFJdUosMkRBQWtCLENBQUNKLE9BQU8sRUFBRXhJLGNBQWMsQ0FBQztFQUNqRDtFQUVBTSxxQkFBcUJBLENBQUNKLGVBQWUsRUFBRTtJQUNyQyxNQUFNc0ksT0FBTyxHQUFHcEosUUFBUSxDQUFDQyxjQUFjLENBQUMsVUFBVSxDQUFDO0lBQ25ELElBQUl3Siw0REFBbUIsQ0FBQ0wsT0FBTyxFQUFFdEksZUFBZSxDQUFDO0VBQ25EO0VBRUFTLGNBQWNBLENBQUN4QixJQUFJLEVBQUU7SUFDbkIsSUFBSUEsSUFBSSxLQUFLLFVBQVUsRUFBRTtNQUN2QkMsUUFBUSxDQUFDc0osYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDakgsS0FBSyxDQUFDc0gsS0FBSyxHQUFHLE9BQU87TUFDdEQzSixRQUFRLENBQUNzSixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUNqSCxLQUFLLENBQUNzSCxLQUFLLEdBQUcsT0FBTztJQUN4RCxDQUFDLE1BQU07TUFDTDNKLFFBQVEsQ0FBQ3NKLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQ2pILEtBQUssQ0FBQ3NILEtBQUssR0FBRyxPQUFPO01BQ3REM0osUUFBUSxDQUFDc0osYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDakgsS0FBSyxDQUFDc0gsS0FBSyxHQUFHLE9BQU87SUFDeEQ7RUFDRjtBQUNGOzs7Ozs7Ozs7Ozs7OztBQzdCZSxNQUFNSCxrQkFBa0IsQ0FBQztFQUN0QzdKLFdBQVdBLENBQUN5SixPQUFPLEVBQUVRLG1CQUFtQixFQUFFO0lBQ3hDLElBQUksQ0FBQ1IsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ3hKLEtBQUssR0FBR2dLLG1CQUFtQjtJQUNoQyxJQUFJLENBQUNqRSxtQkFBbUIsR0FBR2lFLG1CQUFtQixDQUFDakUsbUJBQW1CO0lBQ2xFLElBQUksQ0FBQ3BCLFdBQVcsR0FBR3FGLG1CQUFtQixDQUFDckYsV0FBVztJQUNsRCxJQUFJLENBQUNpQixvQkFBb0IsR0FBR29FLG1CQUFtQixDQUFDcEUsb0JBQW9CO0lBQ3BFLElBQUksQ0FBQ1gsYUFBYSxHQUFHK0UsbUJBQW1CLENBQUMvRSxhQUFhO0lBQ3RELElBQUksQ0FBQ08sT0FBTyxHQUFHd0UsbUJBQW1CLENBQUN4RSxPQUFPO0lBQzFDLElBQUksQ0FBQ0csTUFBTSxHQUFHcUUsbUJBQW1CLENBQUNyRSxNQUFNO0lBQ3hDLElBQUksQ0FBQ1IsUUFBUSxHQUFHNkUsbUJBQW1CLENBQUM3RSxRQUFRO0lBQzVDLElBQUksQ0FBQ0MsU0FBUyxHQUFHNEUsbUJBQW1CLENBQUM1RSxTQUFTO0lBQzlDLElBQUksQ0FBQ0csUUFBUSxHQUFHeUUsbUJBQW1CLENBQUN6RSxRQUFRO0lBQzVDLElBQUksQ0FBQzBFLG1CQUFtQixHQUFHRCxtQkFBbUIsQ0FBQ2pFLG1CQUFtQjtJQUNsRSxJQUFJLENBQUNtRSxjQUFjLEdBQUdGLG1CQUFtQixDQUFDckYsV0FBVztJQUNyRCxJQUFJLENBQUNzQixlQUFlLEdBQUcrRCxtQkFBbUIsQ0FBQy9ELGVBQWU7RUFDNUQ7RUFFQSxJQUFJRixtQkFBbUJBLENBQUEsRUFBRztJQUN4QixPQUFPLElBQUksQ0FBQ3lELE9BQU8sQ0FBQ0UsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUMxQztFQUVBLElBQUkzRCxtQkFBbUJBLENBQUN0RixLQUFLLEVBQUU7SUFDN0IsSUFBSSxDQUFDc0YsbUJBQW1CLENBQUNvRSxHQUFHLEdBQUksVUFBUzFKLEtBQU0sTUFBSztFQUN0RDtFQUVBLElBQUlrRSxXQUFXQSxDQUFBLEVBQUc7SUFDaEIsT0FBTyxJQUFJLENBQUM2RSxPQUFPLENBQUNFLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDekM7RUFFQSxJQUFJL0UsV0FBV0EsQ0FBQ2xFLEtBQUssRUFBRTtJQUNyQixJQUFJLENBQUNrRSxXQUFXLENBQUNnRixXQUFXLEdBQUdsSixLQUFLO0VBQ3RDO0VBRUEsSUFBSW1GLG9CQUFvQkEsQ0FBQSxFQUFHO0lBQ3pCLE9BQU8sSUFBSSxDQUFDNEQsT0FBTyxDQUFDRSxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ3pDO0VBRUEsSUFBSTlELG9CQUFvQkEsQ0FBQ25GLEtBQUssRUFBRTtJQUM5QixJQUFJLENBQUNtRixvQkFBb0IsQ0FBQytELFdBQVcsR0FBR2xKLEtBQUs7RUFDL0M7RUFFQSxJQUFJd0UsYUFBYUEsQ0FBQSxFQUFHO0lBQ2xCLE9BQU8sSUFBSSxDQUFDdUUsT0FBTyxDQUFDRSxhQUFhLENBQUMsYUFBYSxDQUFDO0VBQ2xEO0VBRUEsSUFBSXpFLGFBQWFBLENBQUN4RSxLQUFLLEVBQUU7SUFDdkIsSUFBSSxDQUFDd0UsYUFBYSxDQUFDMEUsV0FBVyxHQUFHbEosS0FBSztFQUN4QztFQUVBLElBQUkrRSxPQUFPQSxDQUFBLEVBQUc7SUFDWixPQUFPLElBQUksQ0FBQ2dFLE9BQU8sQ0FBQ0UsYUFBYSxDQUFDLFVBQVUsQ0FBQztFQUMvQztFQUVBLElBQUlsRSxPQUFPQSxDQUFDL0UsS0FBSyxFQUFFO0lBQ2pCLElBQUksQ0FBQytFLE9BQU8sQ0FBQ21FLFdBQVcsR0FBR2xKLEtBQUs7RUFDbEM7RUFFQSxJQUFJa0YsTUFBTUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUM2RCxPQUFPLENBQUNFLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDOUM7RUFFQSxJQUFJL0QsTUFBTUEsQ0FBQ2xGLEtBQUssRUFBRTtJQUNoQixJQUFJLENBQUNrRixNQUFNLENBQUNnRSxXQUFXLEdBQUdsSixLQUFLO0VBQ2pDO0VBRUEsSUFBSTBFLFFBQVFBLENBQUEsRUFBRztJQUNiLE9BQU8sSUFBSSxDQUFDcUUsT0FBTyxDQUFDRSxhQUFhLENBQUMsV0FBVyxDQUFDO0VBQ2hEO0VBRUEsSUFBSXZFLFFBQVFBLENBQUMxRSxLQUFLLEVBQUU7SUFDbEIsSUFBSSxDQUFDMEUsUUFBUSxDQUFDd0UsV0FBVyxHQUFHbEosS0FBSztFQUNuQztFQUVBLElBQUkyRSxTQUFTQSxDQUFBLEVBQUc7SUFDZCxPQUFPLElBQUksQ0FBQ29FLE9BQU8sQ0FBQ0UsYUFBYSxDQUFDLGFBQWEsQ0FBQztFQUNsRDtFQUVBLElBQUl0RSxTQUFTQSxDQUFDM0UsS0FBSyxFQUFFO0lBQ25CLElBQUksQ0FBQzJFLFNBQVMsQ0FBQ3VFLFdBQVcsR0FBR2xKLEtBQUs7RUFDcEM7RUFFQSxJQUFJOEUsUUFBUUEsQ0FBQSxFQUFHO0lBQ2IsT0FBTyxJQUFJLENBQUNpRSxPQUFPLENBQUNFLGFBQWEsQ0FBQyxXQUFXLENBQUM7RUFDaEQ7RUFFQSxJQUFJbkUsUUFBUUEsQ0FBQzlFLEtBQUssRUFBRTtJQUNsQixJQUFJLENBQUM4RSxRQUFRLENBQUNvRSxXQUFXLEdBQUdsSixLQUFLO0VBQ25DO0VBRUEsSUFBSXdKLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQ3hCLE9BQU83SixRQUFRLENBQUNDLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQztFQUNyRTtFQUVBLElBQUk0SixtQkFBbUJBLENBQUN4SixLQUFLLEVBQUU7SUFDN0IsSUFBSSxDQUFDd0osbUJBQW1CLENBQUNFLEdBQUcsR0FBSSxVQUFTMUosS0FBTSxNQUFLO0VBQ3REO0VBRUEsSUFBSXlKLGNBQWNBLENBQUEsRUFBRztJQUNuQixPQUFPOUosUUFBUSxDQUFDQyxjQUFjLENBQUMsNkJBQTZCLENBQUM7RUFDL0Q7RUFFQSxJQUFJNkosY0FBY0EsQ0FBQ3pKLEtBQUssRUFBRTtJQUN4QixJQUFJLENBQUN5SixjQUFjLENBQUNQLFdBQVcsR0FBR2xKLEtBQUs7RUFDekM7RUFFQSxJQUFJd0YsZUFBZUEsQ0FBQSxFQUFHO0lBQ3BCLE9BQU83RixRQUFRLENBQUNDLGNBQWMsQ0FBQyxPQUFPLENBQUM7RUFDekM7RUFFQSxJQUFJNEYsZUFBZUEsQ0FBQ3hGLEtBQUssRUFBRTtJQUN6QixJQUFJLENBQUN3RixlQUFlLENBQUNrRSxHQUFHLEdBQUcxSixLQUFLO0VBQ2xDO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7O0FDakhlLE1BQU0ySixtQkFBbUIsQ0FBQztFQUN2Q3JLLFdBQVdBLENBQUN5SixPQUFPLEVBQUVhLG9CQUFvQixFQUFFO0lBQ3pDLElBQUksQ0FBQ2IsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ3hKLEtBQUssR0FBR3FLLG9CQUFvQjtJQUNqQyxJQUFJLENBQUM5QixJQUFJLEdBQUc4QixvQkFBb0IsQ0FBQzlCLElBQUk7SUFDckMsSUFBSSxDQUFDZCxnQkFBZ0IsR0FBRzRDLG9CQUFvQixDQUFDNUMsZ0JBQWdCO0lBQzdELElBQUksQ0FBQ1csWUFBWSxHQUFHaUMsb0JBQW9CLENBQUNqQyxZQUFZO0VBQ3ZEO0VBRUEsSUFBSUcsSUFBSUEsQ0FBQSxFQUFHO0lBQ1QsT0FBTyxJQUFJLENBQUNpQixPQUFPLENBQUNjLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDO0VBQy9EO0VBRUEsSUFBSS9CLElBQUlBLENBQUM5SCxLQUFLLEVBQUU7SUFDZCxLQUFLLElBQUk4SixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDaEMsSUFBSSxDQUFDaUMsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtNQUN6QyxJQUFJLENBQUNoQyxJQUFJLENBQUNnQyxDQUFDLENBQUMsQ0FBQ1osV0FBVyxHQUFHbEosS0FBSyxDQUFDOEosQ0FBQyxDQUFDO0lBQ3JDO0VBQ0Y7RUFFQSxJQUFJOUMsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDckIsT0FBTyxJQUFJLENBQUMrQixPQUFPLENBQUNjLGdCQUFnQixDQUFDLEtBQUssQ0FBQztFQUM3QztFQUVBLElBQUk3QyxnQkFBZ0JBLENBQUNoSCxLQUFLLEVBQUU7SUFDMUIsS0FBSyxJQUFJOEosQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLElBQUksQ0FBQzlDLGdCQUFnQixDQUFDK0MsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtNQUNyRCxJQUFJLENBQUM5QyxnQkFBZ0IsQ0FBQzhDLENBQUMsQ0FBQyxDQUFDSixHQUFHLEdBQUksVUFBUzFKLEtBQUssQ0FBQzhKLENBQUMsR0FBRyxDQUFDLENBQUUsTUFBSztJQUM3RDtFQUNGO0VBRUEsSUFBSW5DLFlBQVlBLENBQUEsRUFBRztJQUNqQixPQUFPLElBQUksQ0FBQ29CLE9BQU8sQ0FBQ2MsZ0JBQWdCLENBQUMsOEJBQThCLENBQUM7RUFDdEU7RUFFQSxJQUFJbEMsWUFBWUEsQ0FBQzNILEtBQUssRUFBRTtJQUN0QixLQUFLLElBQUk4SixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDaEMsSUFBSSxDQUFDaUMsTUFBTSxFQUFFRCxDQUFDLEVBQUUsRUFBRTtNQUN6QyxJQUFJLENBQUNuQyxZQUFZLENBQUNtQyxDQUFDLENBQUMsQ0FBQ1osV0FBVyxHQUFHbEosS0FBSyxDQUFDOEosQ0FBQyxDQUFDO0lBQzdDO0VBQ0Y7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdENBO0FBQzZHO0FBQ2pCO0FBQ2dCO0FBQ1Q7QUFDbkcsNENBQTRDLHNIQUF3QztBQUNwRiw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GLDBCQUEwQiwwRkFBaUM7QUFDM0QseUNBQXlDLHNGQUErQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsUUFBUTtBQUNSLFFBQVE7QUFDUixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixtQ0FBbUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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c291cmNlcyI6WyJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9BUElzLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2NpdHlJbmZvLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2ZvcmVjYXN0V2VhdGhlci5qcyIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9tYWluTW9kZWwuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jaXR5SW5mb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jbGltYXByb1ZpZXcuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9jdXJyZW50V2VhdGhlclZpZXcuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9mb3JlY2FzdFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vc3JjL3N0eWxlcy9tYWluLmNzcyIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9zcmMvc3R5bGVzL21haW4uY3NzP2U4MGEiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jbGltYXByby13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2xpbWFwcm8td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2NsaW1hcHJvLXdlYXRoZXItYXBwLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkNvbnRyb2xsZXIge1xyXG4gIGNvbnN0cnVjdG9yKG1vZGVsLCB2aWV3KSB7XHJcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XHJcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xyXG4gICAgdGhpcy5jaXR5ID0ge307XHJcbiAgICB0aGlzLnVuaXQgPSBcIm1ldHJpY1wiO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlKSA9PiB0aGlzLmxvYWRQYWdlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpLnZhbHVlKSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHRoaXMuY2hlY2tJZkVudGVyKGUpKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB0aGlzLmxvYWRQYWdlKFwiQWJ1amFcIikpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveC11bml0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHRoaXMuY2hhbmdlVGVtcGVyYXR1cmUoZSkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZFBhZ2UoY2l0eSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wbGF5YmFja1JhdGUgPSAwLjU7XHJcblxyXG4gICAgdGhpcy5jaXR5ID0gY2l0eTtcclxuXHJcbiAgICBjb25zdCBjaXR5SW5mbyA9IGF3YWl0IHRoaXMubW9kZWwuZ2V0Q2l0eUluZm8oY2l0eSwgdGhpcy51bml0KTtcclxuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihjaXR5LCB0aGlzLnVuaXQpO1xyXG4gICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRGb3JlY2FzdFdlYXRoZXIoY2l0eSwgdGhpcy51bml0KTtcclxuXHJcbiAgICB0aGlzLnZpZXcuYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pO1xyXG4gICAgdGhpcy52aWV3LmFwcGVuZEN1cnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyKTtcclxuICAgIHRoaXMudmlldy5hcHBlbmRGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyKTtcclxuICB9XHJcblxyXG4gIGNoZWNrSWZFbnRlcihlKSB7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikuYmx1cigpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVGVtcGVyYXR1cmUoZSkge1xyXG4gICAgY29uc3QgdW5pdCA9IGUuY3VycmVudFRhcmdldC5jaGVja2VkID8gXCJpbXBlcmlhbFwiIDogXCJtZXRyaWNcIjtcclxuICAgIHRoaXMudmlldy5jaGFuZ2VVbml0VGVtcCh1bml0KTtcclxuICAgIHRoaXMudW5pdCA9IHVuaXQ7XHJcbiAgICB0aGlzLmxvYWRQYWdlKHRoaXMuY2l0eSk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFQSXMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51cmxHZW5lcmF0b3IgPSBuZXcgVXJsR2VuZXJhdG9yKFwiZTUyMzIwYjk4NDA0MDE4NWU2MDQwYTFlNjdmMjU0ZTBcIik7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRHZW9Db29yZGluYXRlcyhjaXR5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcbiAgICAgIGNvbnN0IGdlb2NvZGluZ0RhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGdlb2NvZGluZ0RhdGFbMF07XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICByZXR1cm4geyBsYXQsIGxvbiB9O1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcclxuICAgICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xyXG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG4gICAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICByZXR1cm4gZm9yZWNhc3REYXRhO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBVcmxHZW5lcmF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKGFwcElkKSB7XHJcbiAgICB0aGlzLmJhc2VVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xyXG4gICAgdGhpcy5hcHBJZCA9IGFwcElkO1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVHZW9Db29yZHNVcmwoY2l0eSkge1xyXG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7dGhpcy5hcHBJZH1gO1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCkge1xyXG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyVXJsKGxhdCwgbG9uLCB1bml0KSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mY250PTgmYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0eUluZm8ge1xyXG4gIGNvbnN0cnVjdG9yKEFwaURhdGEpIHtcclxuICAgIHRoaXMuY2l0eURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSk7XHJcbiAgICB0aGlzLmRhdGVEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpIHtcclxuICAgIGNvbnN0IGNpdHkgPSBBcGlEYXRhLm5hbWU7XHJcbiAgICBjb25zdCB7IGNvdW50cnkgfSA9IEFwaURhdGEuc3lzO1xyXG4gICAgcmV0dXJuIGAke2NpdHl9LCAke2NvdW50cnl9YDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKSB7XHJcbiAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheSgpO1xyXG4gICAgY29uc3QgbW9udGggPSB0aGlzLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBkYXRlID0gdGhpcy5nZXREYXRlKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF5fSwgJHttb250aH0gJHtkYXRlfWA7XHJcbiAgfVxyXG5cclxuICBnZXREYXkoKSB7XHJcbiAgICBjb25zdCB3ZWVrZGF5ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRheSA9IHdlZWtkYXlbZC5nZXREYXkoKV07XHJcbiAgICByZXR1cm4gZGF5O1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9udGgoKSB7XHJcbiAgICBjb25zdCBtb250aE5hbWVzID0gW1xyXG4gICAgICBcIkphbnVhcnlcIixcclxuICAgICAgXCJGZWJydWFyeVwiLFxyXG4gICAgICBcIk1hcmNoXCIsXHJcbiAgICAgIFwiQXByaWxcIixcclxuICAgICAgXCJNYXlcIixcclxuICAgICAgXCJKdW5lXCIsXHJcbiAgICAgIFwiSnVseVwiLFxyXG4gICAgICBcIkF1Z3VzdFwiLFxyXG4gICAgICBcIlNlcHRlbWJlclwiLFxyXG4gICAgICBcIk9jdG9iZXJcIixcclxuICAgICAgXCJOb3ZlbWJlclwiLFxyXG4gICAgICBcIkRlY2VtYmVyXCIsXHJcbiAgICBdO1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBtb250aCA9IG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXTtcclxuICAgIHJldHVybiBtb250aDtcclxuICB9XHJcblxyXG4gIGdldERhdGUoKSB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRhdGUgPSBkLmdldERhdGUoKTtcclxuICAgIHJldHVybiBkYXRlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50V2VhdGhlciB7XHJcbiAgY29uc3RydWN0b3IoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KSB7XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gdGhpcy5nZXRUZW1wZXJhdHVyZShNYXRoLnJvdW5kKGN1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnRlbXApLCB1bml0KTtcclxuICAgIHRoaXMuZmVlbHNMaWtlVGVtcCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlKSwgdW5pdCk7XHJcbiAgICB0aGlzLmh1bWlkaXR5ID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLm1haW4uaHVtaWRpdHl9JWA7XHJcbiAgICB0aGlzLndpbmRTcGVlZCA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS53aW5kLnNwZWVkfSBtL3NgO1xyXG4gICAgdGhpcy5wcmVzc3VyZSA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS5tYWluLnByZXNzdXJlfSBoUGFgO1xyXG4gICAgdGhpcy5zdW5yaXNlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3VucmlzZSwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcclxuICAgIHRoaXMuc3Vuc2V0ID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LCBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmUpO1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYyA9IGN1cnJlbnRXZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gdGhpcy5nZXRXZWF0aGVyQ29uZGl0aW9uSW1nKFxyXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEud2VhdGhlclswXS5tYWluLFxyXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnJpc2UsXHJcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LFxyXG4gICAgICBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmVcclxuICAgICk7XHJcbiAgICB0aGlzLmJhY2tncm91bmRWaWRlbyA9IHRoaXMuZ2V0QmFja2dyb3VuZFZpZGVvTGluayh0aGlzLndlYXRoZXJDb25kaXRpb25JbWcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVtcGVyYXR1cmUoZGVncmVlLCB1bml0KSB7XHJcbiAgICByZXR1cm4gdW5pdCA9PT0gXCJtZXRyaWNcIiA/IGAke2RlZ3JlZX3ihINgIDogYCR7ZGVncmVlfeKEiWA7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSkge1xyXG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcclxuICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XHJcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XHJcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcclxuICAgIHJldHVybiBkYXRlSW5TZWFyY2hlZENpdHk7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xyXG4gICAgY29uc3QgZGF0ZUluU2VhcmNoZWRDaXR5ID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHVuaXhUaW1lLCB0aW1lem9uZSk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IGAwJHtkYXRlSW5TZWFyY2hlZENpdHkuZ2V0TWludXRlcygpfWA7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWRUaW1lID0gYCR7aG91cnN9OiR7bWludXRlcy5zdWJzdHIoLTIpfWA7XHJcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcclxuICB9XHJcblxyXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSBcIkRyaXp6bGVcIikgcmV0dXJuIFwiUmFpblwiO1xyXG4gICAgY29uc3QgbWlzdEVxdWl2YWxlbnRlcyA9IFtcIlNtb2tlXCIsIFwiSGF6ZVwiLCBcIkR1c3RcIiwgXCJGb2dcIiwgXCJTYW5kXCIsIFwiRHVzdFwiLCBcIkFzaFwiLCBcIlNxdWFsbFwiLCBcIlRvcm5hZG9cIl07XHJcbiAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcclxuICAgIGlmICh2YWx1ZSAhPT0gXCJDbGVhclwiKSByZXR1cm4gdmFsdWU7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSgwLCB0aW1lem9uZSk7XHJcbiAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xyXG4gICAgY29uc3Qgc3Vuc2V0RGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5zZXRVbml4LCB0aW1lem9uZSk7XHJcbiAgICByZXR1cm4gY3VycmVudERhdGUgPiBzdW5yaXNlRGF0ZSAmJiBjdXJyZW50RGF0ZSA8IHN1bnNldERhdGUgPyBgJHt2YWx1ZX1EYXlgIDogYCR7dmFsdWV9TmlnaHRgO1xyXG4gIH1cclxuXHJcbiAgZ2V0QmFja2dyb3VuZFZpZGVvTGluayh3ZWF0aGVyQ29uZGl0aW9uKSB7XHJcbiAgICBjb25zdCB2aWRlb0xpbmtzID0ge1xyXG4gICAgICBDbGVhckRheTpcclxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC8zNDU4MDUxNTAuaGQubXA0P3M9MzZjNGU1OTZiNDgwZWYwZTgwNDkzNzBiZWNiYWYyNjFiMzk4OWEwMSZwcm9maWxlX2lkPTE3MCZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcclxuICAgICAgQ2xlYXJOaWdodDpcclxuICAgICAgICBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC80NjkzMDc5NTAuaGQubXA0P3M9MmU2N2FhMDJhMjFkNWM2NGM2NTc5MDQzYTc4ZjA5NzIzZWJjNWRkYiZwcm9maWxlX2lkPTE3NSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcclxuICAgICAgQ2xvdWRzOlxyXG4gICAgICAgIFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzQ0NDIxMjY3NC5oZC5tcDQ/cz00MDcxOTgxMjY0ZDllNzhhY2YwOWEwNDAwZTQ2Mzg0MzI0OTVjNGYwJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxyXG4gICAgICBNaXN0OiBcImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC8zNDM3MzIxMzIuaGQubXA0P3M9NWJmZGUyM2YxN2UzODU4ZGJkYzE0MGFmZTdhMzViNmE5ZWYxMTI3ZCZwcm9maWxlX2lkPTE3NSZvYXV0aDJfdG9rZW5faWQ9NTc0NDc3NjFcIixcclxuICAgICAgUmFpbjogXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNTY5MjE3NjAyLmhkLm1wND9zPTlhOTYxNzhjOTFmZTE5YTYzMTdlZDU5NDc4NWYyZTM2OGNkMWVhZGUmcHJvZmlsZV9pZD0xNzQmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXHJcbiAgICAgIFNub3c6IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzUxMDgzMTE2OS5oZC5tcDQ/cz1kOTAwNDk1NTliNzZmMGI5ZTBiZGExMDJlYThhNzQyMWQ3YTY0ZDgxJnByb2ZpbGVfaWQ9MTc1Jm9hdXRoMl90b2tlbl9pZD01NzQ0Nzc2MVwiLFxyXG4gICAgICBUaHVuZGVyc3Rvcm06XHJcbiAgICAgICAgXCJodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNDgwMjIzODk2LmhkLm1wND9zPWU0Yjk0ZjBiNTcwMGJmYTY4Y2I2ZjAyYjQxZjk0ZWNjYTkxMjQyZTkmcHJvZmlsZV9pZD0xNjkmb2F1dGgyX3Rva2VuX2lkPTU3NDQ3NzYxXCIsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHZpZGVvTGlua3Nbd2VhdGhlckNvbmRpdGlvbl07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcmVjYXN0V2VhdGhlciB7XHJcbiAgY29uc3RydWN0b3IoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCkge1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSB0aGlzLmdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbiA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbnMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XHJcbiAgICB0aGlzLnRpbWUgPSB0aGlzLmdldFRpbWVzKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVtcGVyYXR1cmVzKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpIHtcclxuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IFtdO1xyXG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgdGVtcCA9IE1hdGgucm91bmQoaXRlbS5tYWluLnRlbXApO1xyXG4gICAgICBjb25zdCB0ZW1wV2l0aFVuaXQgPSB0aGlzLmdldFRlbXBlcmF0dXJlVW5pdCh0ZW1wLCB1bml0KTtcclxuICAgICAgdGVtcGVyYXR1cmVzLnB1c2godGVtcFdpdGhVbml0KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRlbXBlcmF0dXJlcztcclxuICB9XHJcblxyXG4gIGdldFRlbXBlcmF0dXJlVW5pdChkZWdyZWUsIHVuaXQpIHtcclxuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XHJcbiAgICBjb25zdCBsb2NhbERhdGUgPSBuZXcgRGF0ZSh1bml4VGltZSAqIDEwMDApO1xyXG4gICAgY29uc3QgdXRjVW5peFRpbWUgPSBsb2NhbERhdGUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcclxuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcclxuICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IG5ldyBEYXRlKHVuaXhUaW1lSW5TZWFyY2hlZENpdHkpO1xyXG4gICAgcmV0dXJuIGRhdGVJblNlYXJjaGVkQ2l0eTtcclxuICB9XHJcblxyXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHRpbWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xyXG4gICAgaWYgKHZhbHVlICE9PSBcIkNsZWFyXCIpIHJldHVybiB2YWx1ZTtcclxuICAgIGNvbnN0IGN1cnJlbnRIb3VyID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHRpbWUsIHRpbWV6b25lKS5nZXRIb3VycygpO1xyXG4gICAgY29uc3Qgc3VucmlzZUhvdXIgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKS5nZXRIb3VycygpO1xyXG4gICAgY29uc3Qgc3Vuc2V0SG91ciA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5zZXRVbml4LCB0aW1lem9uZSkuZ2V0SG91cnMoKTtcclxuICAgIHJldHVybiBjdXJyZW50SG91ciA+IHN1bnJpc2VIb3VyICYmIGN1cnJlbnRIb3VyIDwgc3Vuc2V0SG91ciA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XHJcbiAgfVxyXG5cclxuICBnZXRXZWF0aGVyQ29uZGl0aW9ucyhmb3JlY2FzdFdlYXRoZXJEYXRhKSB7XHJcbiAgICBjb25zdCB3ZWF0aGVyQ29uZGl0aW9uID0gW107XHJcbiAgICBjb25zdCBzdW5yaXNlVW5peCA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eS5zdW5yaXNlO1xyXG4gICAgY29uc3Qgc3Vuc2V0VW5peCA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eS5zdW5zZXQ7XHJcbiAgICBjb25zdCB7IHRpbWV6b25lIH0gPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHk7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBjb25kID0gdGhpcy5nZXRXZWF0aGVyQ29uZGl0aW9uSW1nKGl0ZW0ud2VhdGhlclswXS5tYWluLCBpdGVtLmR0LCBzdW5yaXNlVW5peCwgc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xyXG4gICAgICB3ZWF0aGVyQ29uZGl0aW9uLnB1c2goY29uZCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB3ZWF0aGVyQ29uZGl0aW9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xyXG4gICAgY29uc3QgdGltZXMgPSBbXTtcclxuICAgIGNvbnN0IHsgdGltZXpvbmUgfSA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eTtcclxuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoaXRlbSwgdGltZXpvbmUpO1xyXG4gICAgICB0aW1lcy5wdXNoKHRpbWUpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGltZXM7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKHVuaXhUaW1lLCB0aW1lem9uZSkge1xyXG4gICAgY29uc3QgbG9jYWxEYXRlID0gbmV3IERhdGUodW5peFRpbWUuZHQgKiAxMDAwKTtcclxuICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XHJcbiAgICBjb25zdCB1bml4VGltZUluU2VhcmNoZWRDaXR5ID0gdXRjVW5peFRpbWUgKyB0aW1lem9uZSAqIDEwMDA7XHJcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcclxuICAgIGNvbnN0IGhvdXJzID0gZGF0ZUluU2VhcmNoZWRDaXR5LmdldEhvdXJzKCk7XHJcbiAgICBjb25zdCB0aW1lID0gYCR7aG91cnN9OjAwYDtcclxuICAgIHJldHVybiB0aW1lO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ3VycmVudFdlYXRoZXIgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJcIjtcclxuaW1wb3J0IEZvcmVjYXN0V2VhdGhlciBmcm9tIFwiLi9mb3JlY2FzdFdlYXRoZXJcIjtcclxuaW1wb3J0IENpdHlJbmZvIGZyb20gXCIuL2NpdHlJbmZvXCI7XHJcbmltcG9ydCBBUElzIGZyb20gXCIuL0FQSXNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgIHRoaXMuQVBJcyA9IG5ldyBBUElzKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRDaXR5SW5mbyhjaXR5LCB1bml0KSB7XHJcbiAgICBjb25zdCBBcGlEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcclxuICAgIGNvbnN0IGNpdHlJbmZvID0gbmV3IENpdHlJbmZvKEFwaURhdGEpO1xyXG4gICAgcmV0dXJuIGNpdHlJbmZvO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0Q3VycmVudFdlYXRoZXIoY2l0eSwgdW5pdCkge1xyXG4gICAgY29uc3QgY3VycmVudFdlYXRoZXJEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcclxuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gbmV3IEN1cnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyRGF0YSwgdW5pdCk7XHJcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXI7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXIoY2l0eSwgdW5pdCkge1xyXG4gICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xyXG4gICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyID0gbmV3IEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KTtcclxuICAgIHJldHVybiBmb3JlY2FzdFdlYXRoZXI7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvVmlldyB7XHJcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY2l0eUluZm9Nb2RlbCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMubW9kZWwgPSBjaXR5SW5mb01vZGVsO1xyXG4gICAgdGhpcy5jaXR5ID0gY2l0eUluZm9Nb2RlbC5jaXR5RGVzY3JpcHRpb247XHJcbiAgICB0aGlzLmRhdGUgPSBjaXR5SW5mb01vZGVsLmRhdGVEZXNjcmlwdGlvbjtcclxuICB9XHJcblxyXG4gIGdldCBjaXR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgY2l0eSh2YWx1ZSkge1xyXG4gICAgdGhpcy5jaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgZGF0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgyXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhdGUodmFsdWUpIHtcclxuICAgIHRoaXMuZGF0ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ2l0eUluZm9WaWV3IGZyb20gXCIuL2NpdHlJbmZvVmlld1wiO1xyXG5pbXBvcnQgQ3VycmVudFdlYXRoZXJWaWV3IGZyb20gXCIuL2N1cnJlbnRXZWF0aGVyVmlld1wiO1xyXG5pbXBvcnQgRm9yZWNhc3RXZWF0aGVyVmlldyBmcm9tIFwiLi9mb3JlY2FzdFdlYXRoZXJWaWV3XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XHJcbiAgYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHktaW5mb1wiKTtcclxuICAgIG5ldyBDaXR5SW5mb1ZpZXcoZWxlbWVudCwgY2l0eUluZm8pO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kQ3VycmVudFdlYXRoZXIoY3VycmVudFdlYXRoZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtd2VhdGhlclwiKTtcclxuICAgIG5ldyBDdXJyZW50V2VhdGhlclZpZXcoZWxlbWVudCwgY3VycmVudFdlYXRoZXIpO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RcIik7XHJcbiAgICBuZXcgRm9yZWNhc3RXZWF0aGVyVmlldyhlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXIpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVW5pdFRlbXAodW5pdCkge1xyXG4gICAgaWYgKHVuaXQgPT09IFwiaW1wZXJpYWxcIikge1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVuaXRDXCIpLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVuaXRGXCIpLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0RlwiKS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51bml0Q1wiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VycmVudFdlYXRoZXJWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXJyZW50V2VhdGhlck1vZGVsKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgdGhpcy5tb2RlbCA9IGN1cnJlbnRXZWF0aGVyTW9kZWw7XHJcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25JbWcgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC50ZW1wZXJhdHVyZTtcclxuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkRlc2MgPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25EZXNjO1xyXG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gY3VycmVudFdlYXRoZXJNb2RlbC5mZWVsc0xpa2VUZW1wO1xyXG4gICAgdGhpcy5zdW5yaXNlID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5yaXNlO1xyXG4gICAgdGhpcy5zdW5zZXQgPSBjdXJyZW50V2VhdGhlck1vZGVsLnN1bnNldDtcclxuICAgIHRoaXMuaHVtaWRpdHkgPSBjdXJyZW50V2VhdGhlck1vZGVsLmh1bWlkaXR5O1xyXG4gICAgdGhpcy53aW5kU3BlZWQgPSBjdXJyZW50V2VhdGhlck1vZGVsLndpbmRTcGVlZDtcclxuICAgIHRoaXMucHJlc3N1cmUgPSBjdXJyZW50V2VhdGhlck1vZGVsLnByZXNzdXJlO1xyXG4gICAgdGhpcy5ub3dXZWF0aGVyQ29uZGl0aW9uID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uSW1nO1xyXG4gICAgdGhpcy5ub3dUZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XHJcbiAgICB0aGlzLmJhY2tncm91bmRWaWRlbyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuYmFja2dyb3VuZFZpZGVvO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHdlYXRoZXJDb25kaXRpb25JbWcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nLnNyYyA9IGBpbWFnZXMvJHt2YWx1ZX0ucG5nYDtcclxuICB9XHJcblxyXG4gIGdldCB0ZW1wZXJhdHVyZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHRlbXBlcmF0dXJlKHZhbHVlKSB7XHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKTtcclxuICB9XHJcblxyXG4gIHNldCB3ZWF0aGVyQ29uZGl0aW9uRGVzYyh2YWx1ZSkge1xyXG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uRGVzYy50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZlZWxzTGlrZVRlbXAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcclxuICB9XHJcblxyXG4gIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XHJcbiAgICB0aGlzLmZlZWxzTGlrZVRlbXAudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzdW5yaXNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1bnJpc2VcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgc3VucmlzZSh2YWx1ZSkge1xyXG4gICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc3Vuc2V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1bnNldFwiKTtcclxuICB9XHJcblxyXG4gIHNldCBzdW5zZXQodmFsdWUpIHtcclxuICAgIHRoaXMuc3Vuc2V0LnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgaHVtaWRpdHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcclxuICAgIHRoaXMuaHVtaWRpdHkudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCB3aW5kU3BlZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZC1zcGVlZFwiKTtcclxuICB9XHJcblxyXG4gIHNldCB3aW5kU3BlZWQodmFsdWUpIHtcclxuICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgcHJlc3N1cmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJlc3N1cmVcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgcHJlc3N1cmUodmFsdWUpIHtcclxuICAgIHRoaXMucHJlc3N1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBub3dXZWF0aGVyQ29uZGl0aW9uKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cnJlbnQtY29uZGl0aW9uXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IG5vd1dlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcclxuICAgIHRoaXMubm93V2VhdGhlckNvbmRpdGlvbi5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XHJcbiAgfVxyXG5cclxuICBnZXQgbm93VGVtcGVyYXR1cmUoKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JlY2FzdF9faXRlbV9fY3VyZW50LXRlbXBcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgbm93VGVtcGVyYXR1cmUodmFsdWUpIHtcclxuICAgIHRoaXMubm93VGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBiYWNrZ3JvdW5kVmlkZW8oKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKTtcclxuICB9XHJcblxyXG4gIHNldCBiYWNrZ3JvdW5kVmlkZW8odmFsdWUpIHtcclxuICAgIHRoaXMuYmFja2dyb3VuZFZpZGVvLnNyYyA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBmb3JlY2FzdFdlYXRoZXJWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXJNb2RlbCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMubW9kZWwgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbDtcclxuICAgIHRoaXMudGltZSA9IGZvcmVjYXN0V2VhdGhlck1vZGVsLnRpbWU7XHJcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC50ZW1wZXJhdHVyZXM7XHJcbiAgfVxyXG5cclxuICBnZXQgdGltZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb3JlY2FzdF9faXRlbV9fdGltZVwiKTtcclxuICB9XHJcblxyXG4gIHNldCB0aW1lKHZhbHVlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLnRpbWVbaV0udGV4dENvbnRlbnQgPSB2YWx1ZVtpXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCB3ZWF0aGVyQ29uZGl0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHdlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy53ZWF0aGVyQ29uZGl0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbltpXS5zcmMgPSBgaW1hZ2VzLyR7dmFsdWVbaSAtIDFdfS5wbmdgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHRlbXBlcmF0dXJlcygpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb3JlY2FzdF9faXRlbV9fdGVtcGVyYXR1cmVcIik7XHJcbiAgfVxyXG5cclxuICBzZXQgdGVtcGVyYXR1cmVzKHZhbHVlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLnRlbXBlcmF0dXJlc1tpXS50ZXh0Q29udGVudCA9IHZhbHVlW2ldO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XHJcbiAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xyXG4gIC0tZmYtcHJpbWFyeTogXCJQb3BwaW5zXCIsIHNhbnMtc2VyaWY7XHJcbiAgLS1mdy0zMDA6IDMwMDtcclxuICAtLWZ3LTQwMDogNDAwO1xyXG4gIC0tZnctNTAwOiA1MDA7XHJcbiAgLS1mdy02MDA6IDYwMDtcclxuICAtLWZ3LTcwMDogNzAwO1xyXG59XHJcblxyXG4qLFxyXG4qOjpiZWZvcmUsXHJcbio6OmFmdGVyIHtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDhweCAjMDAwMDAwO1xyXG59XHJcblxyXG5ib2R5IHtcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGh0dHBzOi8vaS5waW5pbWcuY29tL29yaWdpbmFscy9lNy83Zi9jMy9lNzdmYzMxOTdlNDQ1YWMzZTYxZTYyOGUwYThjZmJmOS5naWYpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMywgMCwgMTMyKTtcclxuICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XHJcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcclxufVxyXG5cclxubWFpbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBwYWRkaW5nOiA0cmVtIDJyZW07XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLnZpZGVvLWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHdpZHRoOiAxMDB2dztcclxuICBoZWlnaHQ6IDEwMHZoO1xyXG4gIHotaW5kZXg6IC01O1xyXG59XHJcblxyXG52aWRlbyB7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgYW5pbWF0aW9uOiBzbG93TG9vcCAxMDAwcyBpbmZpbml0ZSBsaW5lYXI7XHJcbn1cclxuQGtleWZyYW1lcyBzbG93TG9vcCB7XHJcbiAgMCUgeyBvcGFjaXR5OiAwOyB9XHJcbiAgMTAlIHsgb3BhY2l0eTogMTsgfVxyXG4gIDkwJSB7IG9wYWNpdHk6IDE7IH1cclxuICAxMDAlIHsgb3BhY2l0eTogMDsgfVxyXG59XHJcblxyXG4ub3ZlcmxheSB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAuNSwgMC41KTsgXHJcbn1cclxuXHJcbmZvb3RlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzMzIyOyBcclxuICBjb2xvcjogd2hpdGU7IFxyXG4gIHBhZGRpbmc6IDIwcHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uZm9vdGVyLWNvbnRlbnQge1xyXG4gIG1heC13aWR0aDogMTIwMHB4OyBcclxuICBtYXJnaW46IDAgYXV0bztcclxuICAgXHJcbn1cclxuLmZvb3Rlci1jb250ZW50IGEge1xyXG4gIGNvbG9yOiAjZmY4NDAwO1xyXG59XHJcblxyXG5cclxuLnVuaXRDLFxyXG4udW5pdEYge1xyXG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcclxuICBoZWlnaHQ6IDE2cHg7XHJcbiAgd2lkdGg6IDE2cHg7XHJcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgei1pbmRleDogMjA7XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XHJcbn1cclxuXHJcbi51bml0RiB7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uY2hlY2tib3gtY29udGFpbmVyIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAzcmVtO1xyXG4gIHJpZ2h0OiAzcmVtO1xyXG59XHJcblxyXG4uY2hlY2tib3gge1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG59XHJcblxyXG4ubGFiZWwge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XHJcbiAgYm9yZGVyLXJhZGl1czogNTBweDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICBwYWRkaW5nOiA1cHg7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGhlaWdodDogMjZweDtcclxuICB3aWR0aDogNTBweDtcclxuICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XHJcbn1cclxuXHJcbi5sYWJlbCAuYmFsbCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMnB4O1xyXG4gIGxlZnQ6IDJweDtcclxuICBoZWlnaHQ6IDIycHg7XHJcbiAgd2lkdGg6IDIycHg7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgbGluZWFyO1xyXG59XHJcblxyXG4uY2hlY2tib3g6Y2hlY2tlZCArIC5sYWJlbCAuYmFsbCB7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI0cHgpO1xyXG59XHJcblxyXG4uc2VhcmNoLXdyYXBwZXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDEwcHg7XHJcbn1cclxuXHJcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XHJcbiAgd2lkdGg6IDQwJTtcclxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDJyZW07XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcclxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gIHRleHQtc2hhZG93OiBub25lO1xyXG59XHJcblxyXG4jZXJyb3Ige1xyXG4gIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5jaXR5LWluZm8gaDEge1xyXG4gIG1hcmdpbjogMC4zcmVtIDA7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcclxuICBmb250LXdlaWdodDogdmFyKC0tZnctNjAwKTtcclxuICBmb250LXNpemU6IDIuNXJlbTtcclxufVxyXG5cclxuaDIge1xyXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy0zMDApO1xyXG59XHJcblxyXG4uY3VycmVudC13ZWF0aGVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG59XHJcblxyXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbn1cclxuXHJcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBpbWcge1xyXG4gIHdpZHRoOiBjYWxjKDEwcmVtICsgMTB2dyk7XHJcbn1cclxuXHJcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XHJcbiAgbWFyZ2luOiAwLjNyZW0gMDtcclxuICBmb250LXNpemU6IDRyZW07XHJcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XHJcbn1cclxuXHJcbi5jdXJyZW50LXdlYXRoZXJfdGVtcCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xyXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XHJcbiAgcGFkZGluZzogMnJlbSA0cmVtO1xyXG4gIGdhcDogNHJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcclxufVxyXG5cclxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxufVxyXG5cclxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xyXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xyXG59XHJcblxyXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDFyZW07XHJcbn1cclxuXHJcbi5mb3JlY2FzdCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICB3aWR0aDogMTAwJTtcclxuICBwYWRkaW5nOiAxcmVtIDJyZW07XHJcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XHJcbn1cclxuXHJcbi5mb3JlY2FzdF9faXRlbSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xyXG4gIHdpZHRoOiBjYWxjKDJyZW0gKyAzdncpO1xyXG59XHJcbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9tYWluLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFFQTtFQUNFLCtCQUErQjtFQUMvQixnREFBZ0Q7RUFDaEQsbUNBQW1DO0VBQ25DLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0FBQ2Y7O0FBRUE7OztFQUdFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCO0VBQ3RCLGdDQUFnQztBQUNsQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsbUdBQW1HO0VBQ25HLGlDQUFpQztFQUNqQyw4QkFBOEI7RUFDOUIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0Isa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sT0FBTztFQUNQLFlBQVk7RUFDWixhQUFhO0VBQ2IsV0FBVztBQUNi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XFxyXFxuXFxyXFxuOnJvb3Qge1xcclxcbiAgLS1jbHItbmV1dHJhbDogaHNsKDAsIDAlLCAxMDAlKTtcXHJcXG4gIC0tY2xyLW5ldXRyYWwtdHJhbnNwOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTcxKTtcXHJcXG4gIC0tZmYtcHJpbWFyeTogXFxcIlBvcHBpbnNcXFwiLCBzYW5zLXNlcmlmO1xcclxcbiAgLS1mdy0zMDA6IDMwMDtcXHJcXG4gIC0tZnctNDAwOiA0MDA7XFxyXFxuICAtLWZ3LTUwMDogNTAwO1xcclxcbiAgLS1mdy02MDA6IDYwMDtcXHJcXG4gIC0tZnctNzAwOiA3MDA7XFxyXFxufVxcclxcblxcclxcbiosXFxyXFxuKjo6YmVmb3JlLFxcclxcbio6OmFmdGVyIHtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIHBhZGRpbmc6IDA7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggOHB4ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgbWluLWhlaWdodDogMTAwdmg7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoaHR0cHM6Ly9pLnBpbmltZy5jb20vb3JpZ2luYWxzL2U3LzdmL2MzL2U3N2ZjMzE5N2U0NDVhYzNlNjFlNjI4ZTBhOGNmYmY5LmdpZik7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTMsIDAsIDEzMik7XFxyXFxuICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxyXFxuICBjb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwpO1xcclxcbn1cXHJcXG5cXHJcXG5tYWluIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICB3aWR0aDogMTAwdnc7XFxyXFxuICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgcGFkZGluZzogNHJlbSAycmVtO1xcclxcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG59XFxyXFxuXFxyXFxuLnZpZGVvLWNvbnRhaW5lciB7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6IDA7XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgd2lkdGg6IDEwMHZ3O1xcclxcbiAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gIHotaW5kZXg6IC01O1xcclxcbn1cXHJcXG5cXHJcXG52aWRlbyB7XFxyXFxuICB3aWR0aDogMTAwdnc7XFxyXFxuICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgb2JqZWN0LWZpdDogY292ZXI7XFxyXFxuICBhbmltYXRpb246IHNsb3dMb29wIDEwMDBzIGluZmluaXRlIGxpbmVhcjtcXHJcXG59XFxyXFxuQGtleWZyYW1lcyBzbG93TG9vcCB7XFxyXFxuICAwJSB7IG9wYWNpdHk6IDA7IH1cXHJcXG4gIDEwJSB7IG9wYWNpdHk6IDE7IH1cXHJcXG4gIDkwJSB7IG9wYWNpdHk6IDE7IH1cXHJcXG4gIDEwMCUgeyBvcGFjaXR5OiAwOyB9XFxyXFxufVxcclxcblxcclxcbi5vdmVybGF5IHtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDogMDtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMC41LCAwLjUpOyBcXHJcXG59XFxyXFxuXFxyXFxuZm9vdGVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzMzMzMyMjsgXFxyXFxuICBjb2xvcjogd2hpdGU7IFxcclxcbiAgcGFkZGluZzogMjBweDtcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmZvb3Rlci1jb250ZW50IHtcXHJcXG4gIG1heC13aWR0aDogMTIwMHB4OyBcXHJcXG4gIG1hcmdpbjogMCBhdXRvO1xcclxcbiAgIFxcclxcbn1cXHJcXG4uZm9vdGVyLWNvbnRlbnQgYSB7XFxyXFxuICBjb2xvcjogI2ZmODQwMDtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLnVuaXRDLFxcclxcbi51bml0RiB7XFxyXFxuICBmb250LXNpemU6IDAuODVyZW07XFxyXFxuICBoZWlnaHQ6IDE2cHg7XFxyXFxuICB3aWR0aDogMTZweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBjb2xvcjogYmxhY2s7XFxyXFxuICB6LWluZGV4OiAyMDtcXHJcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcclxcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi51bml0RiB7XFxyXFxuICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi5jaGVja2JveC1jb250YWluZXIge1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOiAzcmVtO1xcclxcbiAgcmlnaHQ6IDNyZW07XFxyXFxufVxcclxcblxcclxcbi5jaGVja2JveCB7XFxyXFxuICBvcGFjaXR5OiAwO1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbn1cXHJcXG5cXHJcXG4ubGFiZWwge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDUwcHg7XFxyXFxuICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gIHBhZGRpbmc6IDVweDtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIGhlaWdodDogMjZweDtcXHJcXG4gIHdpZHRoOiA1MHB4O1xcclxcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xcclxcbn1cXHJcXG5cXHJcXG4ubGFiZWwgLmJhbGwge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDogMnB4O1xcclxcbiAgbGVmdDogMnB4O1xcclxcbiAgaGVpZ2h0OiAyMnB4O1xcclxcbiAgd2lkdGg6IDIycHg7XFxyXFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXHJcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGxpbmVhcjtcXHJcXG59XFxyXFxuXFxyXFxuLmNoZWNrYm94OmNoZWNrZWQgKyAubGFiZWwgLmJhbGwge1xcclxcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDI0cHgpO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VhcmNoLXdyYXBwZXIge1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgZ2FwOiAxMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcclxcbiAgd2lkdGg6IDQwJTtcXHJcXG4gIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxyXFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcclxcbiAgYm9yZGVyOiBub25lO1xcclxcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uL2ltYWdlcy9tYWduaWZ5LnBuZyk7XFxyXFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcclxcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCBjZW50ZXI7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IGNhbGMoMXJlbSArIDAuNXZ3KTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcclxcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbiNlcnJvciB7XFxyXFxuICBkaXNwbGF5OiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4uY2l0eS1pbmZvIGgxIHtcXHJcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxyXFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcclxcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XFxyXFxuICBmb250LXNpemU6IDIuNXJlbTtcXHJcXG59XFxyXFxuXFxyXFxuaDIge1xcclxcbiAgZm9udC1zaXplOiAxLjFyZW07XFxyXFxuICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlciB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaW1nIHtcXHJcXG4gIHdpZHRoOiBjYWxjKDEwcmVtICsgMTB2dyk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XFxyXFxuICBtYXJnaW46IDAuM3JlbSAwO1xcclxcbiAgZm9udC1zaXplOiA0cmVtO1xcclxcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfdGVtcCB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcclxcbiAgaGVpZ2h0OiBtYXgtY29udGVudDtcXHJcXG4gIHBhZGRpbmc6IDJyZW0gNHJlbTtcXHJcXG4gIGdhcDogNHJlbTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0ge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBnYXA6IDAuNXJlbTtcXHJcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xcclxcbiAgd2lkdGg6IGNhbGMoMXJlbSArIDF2dyk7XFxyXFxufVxcclxcblxcclxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHNfX2NvbHVtbiB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGdhcDogMXJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmZvcmVjYXN0IHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgcGFkZGluZzogMXJlbSAycmVtO1xcclxcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXHJcXG59XFxyXFxuXFxyXFxuLmZvcmVjYXN0X19pdGVtIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmZvcmVjYXN0X19pdGVtIGltZyB7XFxyXFxuICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcXHJcXG59XFxyXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXHJcblxyXG4vKiBEb2N1bWVudFxyXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuLyoqXHJcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cclxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXHJcbiAqL1xyXG5cclxuIGh0bWwge1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXHJcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXHJcbn1cclxuXHJcbi8qIFNlY3Rpb25zXHJcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxyXG4gKi9cclxuXHJcbmJvZHkge1xyXG4gIG1hcmdpbjogMDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbmRlciB0aGUgXFxgbWFpblxcYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cclxuICovXHJcblxyXG5tYWluIHtcclxuICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuLyoqXHJcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxyXG4gKiBcXGBhcnRpY2xlXFxgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cclxuICovXHJcblxyXG5oMSB7XHJcbiAgZm9udC1zaXplOiAyZW07XHJcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcclxufVxyXG5cclxuLyogR3JvdXBpbmcgY29udGVudFxyXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuLyoqXHJcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXHJcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxyXG4gKi9cclxuXHJcbmhyIHtcclxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xyXG4gIGhlaWdodDogMDsgLyogMSAqL1xyXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxyXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxyXG4gKi9cclxuXHJcbnByZSB7XHJcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXHJcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cclxufVxyXG5cclxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcclxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXHJcbiAqL1xyXG5cclxuYSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxyXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxyXG4gKi9cclxuXHJcbmFiYnJbdGl0bGVdIHtcclxuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXHJcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cclxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXHJcbiAqL1xyXG5cclxuYixcclxuc3Ryb25nIHtcclxuICBmb250LXdlaWdodDogYm9sZGVyO1xyXG59XHJcblxyXG4vKipcclxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cclxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cclxuICovXHJcblxyXG5jb2RlLFxyXG5rYmQsXHJcbnNhbXAge1xyXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xyXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cclxuICovXHJcblxyXG5zbWFsbCB7XHJcbiAgZm9udC1zaXplOiA4MCU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxyXG4gKiBhbGwgYnJvd3NlcnMuXHJcbiAqL1xyXG5cclxuc3ViLFxyXG5zdXAge1xyXG4gIGZvbnQtc2l6ZTogNzUlO1xyXG4gIGxpbmUtaGVpZ2h0OiAwO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XHJcbn1cclxuXHJcbnN1YiB7XHJcbiAgYm90dG9tOiAtMC4yNWVtO1xyXG59XHJcblxyXG5zdXAge1xyXG4gIHRvcDogLTAuNWVtO1xyXG59XHJcblxyXG4vKiBFbWJlZGRlZCBjb250ZW50XHJcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cclxuICovXHJcblxyXG5pbWcge1xyXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcclxufVxyXG5cclxuLyogRm9ybXNcclxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8qKlxyXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cclxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxyXG4gKi9cclxuXHJcbmJ1dHRvbixcclxuaW5wdXQsXHJcbm9wdGdyb3VwLFxyXG5zZWxlY3QsXHJcbnRleHRhcmVhIHtcclxuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xyXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXHJcbiAgbWFyZ2luOiAwOyAvKiAyICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cclxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cclxuICovXHJcblxyXG5idXR0b24sXHJcbmlucHV0IHsgLyogMSAqL1xyXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXHJcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cclxuICovXHJcblxyXG5idXR0b24sXHJcbnNlbGVjdCB7IC8qIDEgKi9cclxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXHJcbiAqL1xyXG5cclxuYnV0dG9uLFxyXG5bdHlwZT1cImJ1dHRvblwiXSxcclxuW3R5cGU9XCJyZXNldFwiXSxcclxuW3R5cGU9XCJzdWJtaXRcIl0ge1xyXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cclxuICovXHJcblxyXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXHJcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxyXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxyXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XHJcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xyXG4gIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXHJcbiAqL1xyXG5cclxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxyXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcclxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcclxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xyXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cclxuICovXHJcblxyXG5maWVsZHNldCB7XHJcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xyXG59XHJcblxyXG4vKipcclxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cclxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBJRS5cclxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxyXG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXHJcbiAqL1xyXG5cclxubGVnZW5kIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXHJcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cclxuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xyXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xyXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cclxuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxyXG4gKi9cclxuXHJcbnByb2dyZXNzIHtcclxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cclxuICovXHJcblxyXG50ZXh0YXJlYSB7XHJcbiAgb3ZlcmZsb3c6IGF1dG87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cclxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxyXG4gKi9cclxuXHJcblt0eXBlPVwiY2hlY2tib3hcIl0sXHJcblt0eXBlPVwicmFkaW9cIl0ge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cclxuICBwYWRkaW5nOiAwOyAvKiAyICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXHJcbiAqL1xyXG5cclxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXHJcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcclxuICBoZWlnaHQ6IGF1dG87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cclxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXHJcbiAqL1xyXG5cclxuW3R5cGU9XCJzZWFyY2hcIl0ge1xyXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXHJcbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cclxuICovXHJcblxyXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XHJcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xyXG59XHJcblxyXG4vKipcclxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cclxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cclxuICovXHJcblxyXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xyXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cclxufVxyXG5cclxuLyogSW50ZXJhY3RpdmVcclxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8qXHJcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXHJcbiAqL1xyXG5cclxuZGV0YWlscyB7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cclxuICovXHJcblxyXG5zdW1tYXJ5IHtcclxuICBkaXNwbGF5OiBsaXN0LWl0ZW07XHJcbn1cclxuXHJcbi8qIE1pc2NcclxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8qKlxyXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXHJcbiAqL1xyXG5cclxudGVtcGxhdGUge1xyXG4gIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cclxuICovXHJcblxyXG5baGlkZGVuXSB7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0NBRUQ7RUFDQyxpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDeEM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLFNBQVM7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtBQUNsQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtFQUNFLHVCQUF1QixFQUFFLE1BQU07RUFDL0IsU0FBUyxFQUFFLE1BQU07RUFDakIsaUJBQWlCLEVBQUUsTUFBTTtBQUMzQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSxpQ0FBaUMsRUFBRSxNQUFNO0VBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3hCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSw2QkFBNkI7QUFDL0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsbUJBQW1CLEVBQUUsTUFBTTtFQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGlDQUFpQyxFQUFFLE1BQU07QUFDM0M7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBOzs7RUFHRTs7QUFFRjs7O0VBR0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLGNBQWM7RUFDZCxjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjs7Ozs7RUFLRSxvQkFBb0IsRUFBRSxNQUFNO0VBQzVCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLGlCQUFpQixFQUFFLE1BQU07RUFDekIsU0FBUyxFQUFFLE1BQU07QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1FBQ1EsTUFBTTtFQUNaLGlCQUFpQjtBQUNuQjs7QUFFQTs7O0VBR0U7O0FBRUY7U0FDUyxNQUFNO0VBQ2Isb0JBQW9CO0FBQ3RCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsMEJBQTBCO0FBQzVCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsa0JBQWtCO0VBQ2xCLFVBQVU7QUFDWjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDhCQUE4QjtBQUNoQzs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLDhCQUE4QjtBQUNoQzs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtFQUNFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsY0FBYyxFQUFFLE1BQU07RUFDdEIsY0FBYyxFQUFFLE1BQU07RUFDdEIsZUFBZSxFQUFFLE1BQU07RUFDdkIsVUFBVSxFQUFFLE1BQU07RUFDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsVUFBVSxFQUFFLE1BQU07QUFDcEI7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsWUFBWTtBQUNkOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLDZCQUE2QixFQUFFLE1BQU07RUFDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM5Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOztFQUVFOztBQUVGO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcclxcblxcclxcbi8qIERvY3VtZW50XFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxyXFxuICovXFxyXFxuXFxyXFxuIGh0bWwge1xcclxcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXHJcXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKiBTZWN0aW9uc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmJvZHkge1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5tYWluIHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxyXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5oMSB7XFxyXFxuICBmb250LXNpemU6IDJlbTtcXHJcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxyXFxufVxcclxcblxcclxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxyXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxyXFxuICovXFxyXFxuXFxyXFxuaHIge1xcclxcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXHJcXG4gIGhlaWdodDogMDsgLyogMSAqL1xcclxcbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICovXFxyXFxuXFxyXFxucHJlIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcclxcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5hIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcclxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxyXFxuICovXFxyXFxuXFxyXFxuYWJiclt0aXRsZV0ge1xcclxcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcclxcbiAqL1xcclxcblxcclxcbmIsXFxyXFxuc3Ryb25nIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmNvZGUsXFxyXFxua2JkLFxcclxcbnNhbXAge1xcclxcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxyXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5zbWFsbCB7XFxyXFxuICBmb250LXNpemU6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxyXFxuICogYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbnN1YixcXHJcXG5zdXAge1xcclxcbiAgZm9udC1zaXplOiA3NSU7XFxyXFxuICBsaW5lLWhlaWdodDogMDtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXHJcXG59XFxyXFxuXFxyXFxuc3ViIHtcXHJcXG4gIGJvdHRvbTogLTAuMjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuc3VwIHtcXHJcXG4gIHRvcDogLTAuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBFbWJlZGRlZCBjb250ZW50XFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcclxcbiAqL1xcclxcblxcclxcbmltZyB7XFxyXFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi8qIEZvcm1zXFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcbmlucHV0LFxcclxcbm9wdGdyb3VwLFxcclxcbnNlbGVjdCxcXHJcXG50ZXh0YXJlYSB7XFxyXFxuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcclxcbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxyXFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcclxcbiAgbWFyZ2luOiAwOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcclxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcbmlucHV0IHsgLyogMSAqL1xcclxcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcclxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5idXR0b24sXFxyXFxuc2VsZWN0IHsgLyogMSAqL1xcclxcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXHJcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXHJcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcclxcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcclxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXHJcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXHJcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcclxcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXHJcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxyXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxyXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXHJcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcclxcbiAqL1xcclxcblxcclxcbmZpZWxkc2V0IHtcXHJcXG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXHJcXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxyXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcclxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmxlZ2VuZCB7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxyXFxuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcclxcbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXHJcXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcclxcbiAgcGFkZGluZzogMDsgLyogMyAqL1xcclxcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcclxcbiAqL1xcclxcblxcclxcbnByb2dyZXNzIHtcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxyXFxuICovXFxyXFxuXFxyXFxudGV4dGFyZWEge1xcclxcbiAgb3ZlcmZsb3c6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcclxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXHJcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxyXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxyXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXHJcXG4gIGhlaWdodDogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxyXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxyXFxuICovXFxyXFxuXFxyXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXHJcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxyXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxyXFxuICovXFxyXFxuXFxyXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXHJcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXHJcXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxyXFxuICovXFxyXFxuXFxyXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxyXFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcclxcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKiBJbnRlcmFjdGl2ZVxcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLypcXHJcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcclxcbiAqL1xcclxcblxcclxcbmRldGFpbHMge1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbnN1bW1hcnkge1xcclxcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBNaXNjXFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxyXFxuICovXFxyXFxuXFxyXFxudGVtcGxhdGUge1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxyXFxuICovXFxyXFxuXFxyXFxuW2hpZGRlbl0ge1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgKCFzY3JpcHRVcmwgfHwgIS9eaHR0cChzPyk6Ly50ZXN0KHNjcmlwdFVybCkpKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4uL3N0eWxlcy9tYWluLmNzc1wiO1xyXG5cclxuaW1wb3J0IE1haW5Nb2RlbCBmcm9tIFwiLi9tb2RlbHMvbWFpbk1vZGVsXCI7XHJcbmltcG9ydCBNYWluVmlldyBmcm9tIFwiLi92aWV3cy9jbGltYXByb1ZpZXdcIjtcclxuaW1wb3J0IE1haW5Db250cm9sbGVyIGZyb20gXCIuL2NvbnRyb2xsZXJzL21haW5Db250cm9sbGVyXCI7XHJcblxyXG5jb25zdCBtb2RlbCA9IG5ldyBNYWluTW9kZWwoKTtcclxuY29uc3QgdmlldyA9IG5ldyBNYWluVmlldygpO1xyXG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTtcclxuIl0sIm5hbWVzIjpbIk1haW5Db250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsInZpZXciLCJjaXR5IiwidW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImxvYWRQYWdlIiwidmFsdWUiLCJjaGVja0lmRW50ZXIiLCJ3aW5kb3ciLCJjaGFuZ2VUZW1wZXJhdHVyZSIsInBsYXliYWNrUmF0ZSIsImNpdHlJbmZvIiwiZ2V0Q2l0eUluZm8iLCJjdXJyZW50V2VhdGhlciIsImdldEN1cnJlbnRXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyIiwiYXBwZW5kQ2l0eUluZm8iLCJhcHBlbmRDdXJyZW50V2VhdGhlciIsImFwcGVuZEZvcmVjYXN0V2VhdGhlciIsImtleSIsImJsdXIiLCJjdXJyZW50VGFyZ2V0IiwiY2hlY2tlZCIsImNoYW5nZVVuaXRUZW1wIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwidXJsIiwiZ2VuZXJhdGVHZW9Db29yZHNVcmwiLCJyZXNwb25zZSIsImZldGNoIiwibW9kZSIsImdlb2NvZGluZ0RhdGEiLCJqc29uIiwibGF0IiwibG9uIiwic3R5bGUiLCJkaXNwbGF5IiwiZXJyIiwiY29uc29sZSIsImxvZyIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsImdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwiLCJ3ZWF0aGVyRGF0YSIsImdldEZvcmVjYXN0V2VhdGhlckRhdGEiLCJnZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybCIsImZvcmVjYXN0RGF0YSIsImFwcElkIiwiYmFzZVVybCIsIkNpdHlJbmZvIiwiQXBpRGF0YSIsImNpdHlEZXNjcmlwdGlvbiIsImNyZWF0ZUNpdHlEZXNjcmlwdGlvbiIsImRhdGVEZXNjcmlwdGlvbiIsImNyZWF0ZURhdGVEZXNjcmlwdGlvbiIsIm5hbWUiLCJjb3VudHJ5Iiwic3lzIiwiZGF5IiwiZ2V0RGF5IiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwid2Vla2RheSIsImQiLCJEYXRlIiwibW9udGhOYW1lcyIsIkN1cnJlbnRXZWF0aGVyIiwiY3VycmVudFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmUiLCJnZXRUZW1wZXJhdHVyZSIsIk1hdGgiLCJyb3VuZCIsIm1haW4iLCJ0ZW1wIiwiZmVlbHNMaWtlVGVtcCIsImZlZWxzX2xpa2UiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIndpbmQiLCJzcGVlZCIsInByZXNzdXJlIiwic3VucmlzZSIsImNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUiLCJ0aW1lem9uZSIsInN1bnNldCIsIndlYXRoZXJDb25kaXRpb25EZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwid2VhdGhlckNvbmRpdGlvbkltZyIsImdldFdlYXRoZXJDb25kaXRpb25JbWciLCJiYWNrZ3JvdW5kVmlkZW8iLCJnZXRCYWNrZ3JvdW5kVmlkZW9MaW5rIiwiZGVncmVlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInN1YnN0ciIsInN1bnJpc2VVbml4Iiwic3Vuc2V0VW5peCIsIm1pc3RFcXVpdmFsZW50ZXMiLCJpbmNsdWRlcyIsImN1cnJlbnREYXRlIiwic3VucmlzZURhdGUiLCJzdW5zZXREYXRlIiwid2VhdGhlckNvbmRpdGlvbiIsInZpZGVvTGlua3MiLCJDbGVhckRheSIsIkNsZWFyTmlnaHQiLCJDbG91ZHMiLCJNaXN0IiwiUmFpbiIsIlNub3ciLCJUaHVuZGVyc3Rvcm0iLCJGb3JlY2FzdFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmVzIiwiZ2V0VGVtcGVyYXR1cmVzIiwiZ2V0V2VhdGhlckNvbmRpdGlvbnMiLCJ0aW1lIiwiZ2V0VGltZXMiLCJsaXN0IiwiZm9yRWFjaCIsIml0ZW0iLCJ0ZW1wV2l0aFVuaXQiLCJnZXRUZW1wZXJhdHVyZVVuaXQiLCJwdXNoIiwiY3VycmVudEhvdXIiLCJzdW5yaXNlSG91ciIsInN1bnNldEhvdXIiLCJjb25kIiwiZHQiLCJ0aW1lcyIsIk1haW5Nb2RlbCIsImRhdGEiLCJDaXR5SW5mb1ZpZXciLCJlbGVtZW50IiwiY2l0eUluZm9Nb2RlbCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsIkN1cnJlbnRXZWF0aGVyVmlldyIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJNYWluVmlldyIsImNvbG9yIiwiY3VycmVudFdlYXRoZXJNb2RlbCIsIm5vd1dlYXRoZXJDb25kaXRpb24iLCJub3dUZW1wZXJhdHVyZSIsInNyYyIsImZvcmVjYXN0V2VhdGhlclZpZXciLCJmb3JlY2FzdFdlYXRoZXJNb2RlbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuZ3RoIiwiY29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiIn0=