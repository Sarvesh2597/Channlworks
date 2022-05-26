/**
 * Create React App entry point. This and `public/index.html` files can not be
 * changed or moved.
 */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import * as _redux from "./redux";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./app/App";
import "./index.scss"; // Standard version
// import "./sass/style.react.rtl.css"; // RTL version
import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css";
import "socicon/css/socicon.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
// Datepicker
import "react-datepicker/dist/react-datepicker.css";
import {
	MetronicLayoutProvider,
	MetronicSplashScreenProvider,
	MetronicSubheaderProvider,
	LayoutSplashScreen,
} from "./_metronic/layout";
import { MetronicI18nProvider } from "./_metronic/i18n";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env;

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/* const mock = */ _redux.mockAxios(axios);

/**
 * Inject metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
_redux.setupAxios(axios, store);

ReactDOM.render(
	<Provider store={store}>
		{/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
		<PersistGate persistor={persistor}>
			<MetronicI18nProvider>
				<MetronicLayoutProvider>
					<MetronicSubheaderProvider>
						<MetronicSplashScreenProvider>
							<App basename={PUBLIC_URL} />
						</MetronicSplashScreenProvider>
					</MetronicSubheaderProvider>
				</MetronicLayoutProvider>
			</MetronicI18nProvider>
		</PersistGate>
	</Provider>,
	document.getElementById("root")
);
