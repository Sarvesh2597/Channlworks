import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import PrincipalPage from "./pages/PrincipalPage";
import PrincipalContactsPage from "./pages/PrincipalContactsPage";
import { DashboardPage } from "./pages/DashboardPage";
import Settings from "./pages/Settings";
import CaseStudies from "./pages/CaseStudies";
import CertifiedEmployees from "./pages/CertifiedEmployees";
import Programs from "./pages/Programs/index";
import AR from "./pages/AR";
import DashboardMonthlyRevenue from "./pages/DashboardMonthlyRevenue";
import DashboardLeads from "./pages/DashboardLeads";
import DashboardTotalBudget from "./pages/DashboardTotalBudget";
import DashboardCertification from "./pages/DashboardCertification";
import { NewPage } from "./pages/NewPage";

import { LeadsPage } from "./pages/LeadsPage";
import { APNLeads } from "./pages/APNLeads";
import { APNOpportunity } from "./pages/APNOpportunity";

import { ClientsPage } from "./pages/ClientsPage";
import { RevenuePage } from "./pages/Revenue/index";
import { Marketing_Campaigns } from "./pages/Marketing_Campaigns";
import { ProgramDefinition } from "./pages/Programs/ProgramDefinition";

const GoogleMaterialPage = lazy(() =>
	import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
	import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
	import("./modules/ECommerce/pages/eCommercePage")
);
const UserProfilepage = lazy(() =>
	import("./modules/UserProfile/UserProfilePage")
);

// const NewPage = lazy(()=> import("./pages/NewPage"));

const Home = lazy(() => import("../_metronic/_partials/dashboards/home"));

//const Settings = lazy(() => import("./pages/Settings"));

export default function BasePage() {
	// useEffect(() => {
	//   console.log('Base page');
	// }, []) // [] - is required if you need only one call
	// https://reactjs.org/docs/hooks-reference.html#useeffect

	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<Switch>
				{
					/* Redirect from root URL to /dashboard. */
					<Redirect exact from="/" to="/home" />
				}
				<ContentRoute path="/dashboard" component={DashboardPage} />
				<ContentRoute path="/builder" component={BuilderPage} />
				<ContentRoute path="/my-page" component={MyPage} />
				<Route path="/google-material" component={GoogleMaterialPage} />
				<Route path="/react-bootstrap" component={ReactBootstrapPage} />
				<Route path="/e-commerce" component={ECommercePage} />
				<Route path="/user-profile" component={UserProfilepage} />
				<Route path="/home" component={Home} />
				<ContentRoute
					path="/program-definiton/:accociationId/:partnerId/:programName"
					component={ProgramDefinition}
				/>
				<ContentRoute path="/settings" component={Settings} />
				<ContentRoute path="/newpage" component={NewPage} />
				<ContentRoute path="/case-studies" component={CaseStudies} />
				<ContentRoute path="/principal" component={PrincipalPage} />
				<ContentRoute
					path="/dashboard-monthly-revenue"
					component={DashboardMonthlyRevenue}
				/>
				<ContentRoute path="/dashboard-leads" component={DashboardLeads} />
				<ContentRoute
					path="/dashboard-total-budget"
					component={DashboardTotalBudget}
				/>
				<ContentRoute
					path="/dashboard-certification"
					component={DashboardCertification}
				/>

				<ContentRoute
					path="/principal-contacts"
					component={PrincipalContactsPage}
				/>
				<ContentRoute path="/leads" component={LeadsPage} />
				<ContentRoute path="/apn-leads" component={APNLeads} />
				<ContentRoute path="/apn-opportunity" component={APNOpportunity} />

				<ContentRoute path="/clients" component={ClientsPage} />
				<ContentRoute path="/revenue" component={RevenuePage} />
				<ContentRoute
					path="/marketing/campaigns"
					component={Marketing_Campaigns}
				/>
				<ContentRoute path="/AR" component={AR} />

				<ContentRoute
					path="/employee-management"
					component={CertifiedEmployees}
				/>
				<ContentRoute path="/programs" component={Programs} />

				<Redirect to="error/error-v1" />
			</Switch>
		</Suspense>
	);
}
