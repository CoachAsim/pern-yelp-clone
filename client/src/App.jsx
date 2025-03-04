import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import RestaurantDetail from "./routes/RestaurantDetail";
import RestaurantUpdate from "./routes/RestaurantUpdate";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";

const App = () => {
	return (
		<RestaurantsContextProvider>
			<div className="container">
				<Router>
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route
							exact
							path="/restaurants/:id"
							element={<RestaurantDetail />}
						/>
						<Route
							exact
							path="/restaurants/:id/update"
							element={<RestaurantUpdate />}
						/>
					</Routes>
				</Router>
			</div>
		</RestaurantsContextProvider>
	);
};

export default App;
