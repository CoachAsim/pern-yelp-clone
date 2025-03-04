import React, { useState, useContext } from "react";
import RestaurantsApi from "../apis/RestaurantsApi";
import { RestaurantsContext } from "../context/RestaurantsContext";

const AddRestaurant = () => {
	const { addRestaurant } = useContext(RestaurantsContext);
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [priceRange, setPriceRange] = useState("Price Range");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const body = {
				name: name,
				location: location,
				price_range: priceRange,
			};
			const response = await RestaurantsApi.post("/", body);
			const restaurant = response.data.data.restaurant;

			addRestaurant(restaurant);
		} catch (error) {}
	};

	return (
		<div className="mb-4">
			<form>
				<div className="row g-3 align-items-center">
					<div className="col">
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							type="text"
							className="form-control"
							placeholder="name"
						/>
					</div>
					<div className="col">
						<input
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							type="text"
							className="form-control"
							placeholder="location"
						/>
					</div>
					<div className="col">
						<select
							value={priceRange}
							onChange={(e) => setPriceRange(e.target.value)}
							className="form-select"
						>
							<option disabled value="">
								Price Range
							</option>
							<option value="1">$</option>
							<option value="2">$$</option>
							<option value="3">$$$</option>
							<option value="4">$$$$</option>
							<option value="5">$$$$$</option>
						</select>
					</div>
					<div className="col-auto">
						<button
							onClick={handleSubmit}
							type="submit"
							className="btn btn-primary"
						>
							Add
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AddRestaurant;
