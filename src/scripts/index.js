import "../styles/main.css";

import MainModel from "./models/mainModel";
import MainView from "./views/climaproView";
import MainController from "./controllers/mainController";

const model = new MainModel();
const view = new MainView();
const controller = new MainController(model, view);
