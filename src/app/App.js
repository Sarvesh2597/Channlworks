/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { proxy } from "valtio";

export const valtioState = proxy({
	navRoles: {},
});

export default function App({ basename }) {
	const auth = useSelector(state => state.auth);

	React.useEffect(() => {
		const userDetails = JSON.parse(localStorage.getItem("user-details"));
		const navRoles = userDetails?.Partner?.navRoles[userDetails.userRole];

		valtioState.navRoles = navRoles?.roles;
	}, [auth]);

	return (
		<React.Suspense fallback={<LayoutSplashScreen />}>
			{/* Override `basename` (e.g: `homepage` in `package.json`) */}
			<BrowserRouter basename={basename}>
				{/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
				<MaterialThemeProvider>
					{/* Provide `react-intl` context synchronized with Redux state.  */}
					<I18nProvider>
						{/* Render routes with provided `Layout`. */}
						<Routes />
					</I18nProvider>
				</MaterialThemeProvider>
			</BrowserRouter>
		</React.Suspense>
	);
}
