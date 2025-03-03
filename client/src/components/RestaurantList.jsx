import React, { useContext, useEffect } from "react";
import RestaurantsApi from "../apis/RestaurantsApi";
import { RestaurantsContext } from "../context/RestaurantsContext";

const RestaurantList = (props) => {
	const { restaurants, setRestaurants } = useContext(RestaurantsContext);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await RestaurantsApi.get("/");
				setRestaurants(response.data.data.restaurants);
			} catch (err) {}
		};
		fetchData();
	}, []);

	const handleDelete = async (id) => {
		try {
			const response = await RestaurantsApi.delete(`/${id}`);
			setRestaurants(
				restaurants.filter((restaurant) => {
					return restaurant.id !== id;
				})
			);
		} catch (error) {}
	};

	return (
		<div className="list-group">
			<table className="table table-hover table-dark">
				<thead>
					<tr className="bg-primary">
						<th scope="col">Restaurant</th>
						<th scope="col">Location</th>
						<th scope="col">Price Range</th>
						<th scope="col">Ratings</th>
						<th scope="col">Edit</th>
						<th scope="col">Delete</th>
					</tr>
				</thead>
				<tbody>
					{restaurants &&
						restaurants.map((restaurant) => {
							return (
								<tr key={restaurant.id}>
									<td>{restaurant.name}</td>
									<td>{restaurant.location}</td>
									<td>{"$".repeat(restaurant.price_range)}</td>
									<td>reviews</td>
									<td>
										<button className="btn btn-warning">Update</button>
									</td>
									<td>
										<button
											onClick={() => handleDelete(restaurant.id)}
											className="btn btn-danger"
										>
											Delete
										</button>
									</td>
								</tr>
							);
						})}
					{/* <tr>
						<td>placeholder foods</td>
						<td>placeholder place</td>
						<td>$</td>
						<td>placeholder rating</td>
						<td>
							<button className="btn btn-warning">Update</button>
						</td>
						<td>
							<button className="btn btn-danger">Delete</button>
						</td>
					</tr> */}
				</tbody>
			</table>
		</div>
	);
};

export default RestaurantList;
