import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as db from "./db/index.js";

dotenv.config();

// Getting the correct environment port from our .env file
const port = process.env.PORT || 3001;
// Create our instance of an express app
const app = express();

// --------------------------------------- ENDPOINTS START ------------------------------------
/**
 * ENDPOINTS: The requests that clients can make
 */

// MIDDLEWARE (app.use()) - used to process a request before sending it to the correct endpoint. In the middle between the client and the server.

// app.use((req, res, next) => {
// 	console.log(
// 		"MIDDLEWARE: If I wanted to add some middleware functionality, I could do that here : )"
// 	);
// 	next();
// });

app.use(cors());

// The middleware express.json() parses incoming JSON requests and puts the parsed data in req.body, making it accessible for further processing in our application
app.use(express.json());

// The middleware morgan creates logs for us to monitor requests to the server (Ex: GET /api/v1/restaurants 200 74 - 1.317 ms)
app.use(morgan("dev"));

// C (CREATE)
// Asking express to create a restaurant in our db
app.post("/api/v1/restaurants", async (req, res) => {
	try {
		const name = req.body.name;
		const location = req.body.location;
		const price_range = req.body.price_range;
		const results = await db.query(
			"insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *",
			[name, location, price_range]
		);
		const created_restaurant = results.rows[0];

		console.log("[SUCCESS] Create a restaurant: ");
		console.log(created_restaurant);

		res.status(201).json({
			status: "success",
			data: {
				restaurant: created_restaurant,
			},
		});
	} catch (error) {
		console.log("[FAILED] Create a restaurant: ");
		console.log(error);
	}
});

// R (READ)
// Asking express to get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
	try {
		const results = await db.query("select * from restaurants");
		const restaurants = results.rows;

		console.log("Restaurants were retrieved successfuly: ");
		console.log(results.rows);

		res.json({
			status: "success",
			num_results: restaurants.length,
			data: {
				restaurants: restaurants,
			},
		});
	} catch (error) {
		console.log("Restaurants were not retrieved successfuly: ");
		console.log(error);
	}
});

// Asking express to get a certain restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const results = await db.query(`select * from restaurants where id = $1`, [
			id,
		]);
		const restaurant = results.rows[0];

		console.log("Restaurant was retrieved successfuly: ");
		console.log(restaurant);

		res.json({
			status: "success",
			num_results: restaurant.length,
			data: {
				restaurants: restaurant,
			},
		});
	} catch (error) {
		console.log("Restaurant was not retrieved successfuly: ");
		console.log(error);
	}
});

// U (UPDATE)
// Asking express to update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const results = await db.query(
			"update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *",
			[req.body.name, req.body.location, req.body.price_range, req.params.id]
		);
		const updated_restaurant = results.rows[0];
		console.log("[SUCCESS] Restaurant update: ");
		console.log(updated_restaurant);

		res.status(200).json({
			status: "success",
			data: {
				restaurant: [updated_restaurant],
			},
		});
	} catch (error) {
		console.log("[FAILED] Restaurant update: ");
		console.log(error);
	}
});

// D (DELETE)
// Asking express to delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const results = await db.query("delete from restaurants where id = $1", [
			req.params.id,
		]);

		console.log("[SUCCESS] Delete restaurant");

		res.status(204).json({
			status: "success",
		});
	} catch (error) {
		console.log("[FAILED] Delete restaurant");
		console.log(error);
	}
});
// --------------------------------------- ENDPOINTS END ------------------------------------

// The app is listening for connections
app.listen(port, () => {
	console.log(`server is up and listening on port ${port}`);
	console.log(`Visit http://localhost:${port} in your browser to see the app!`);
});

/**
In a Node.js application, server.js (or sometimes app.js or index.js) is typically the main entry point file that contains the core server setup and configuration. 
This file usually includes the instructions for 
- creating and starting the server
- setting up middleware
- defining routes
- and other essential server-side logic that will execute when the Node.js server is initiated.

The server.js file often contains code to:
1. Import necessary modules (e.g., Express.js)
2. Create an instance of the Express application
3. Configure middleware
4. Define API routes
5. Set up database connections
6. Specify the port for the server to listen on

When you run the command node server.js; 

Node.js executes the code in this file, effectively starting your server and making it ready to handle incoming requests.
*/

/** 
Here we are requiring express in our application.
Express is a node package used to create server endpoints. 
Affording the client the ability to make requests to this server.

Key differences between URLs (Universal Resource Locators) & endpoints:
Scope: All endpoints are URLs, but not all URLs are endpoints.
Purpose: URLs locate any web resource, while endpoints specifically refer to API access points.
Functionality: Endpoints are associated with specific operations or actions in an API.
*/

/**
 * UNDERSTANDING PORTS AND app.listen()
 * ====================================
 *
 * WHAT IS A PORT?
 * Think of your computer like a house:
 * - The IP address is like your house address (which building/computer)
 * - Port numbers are like different doors to your house, each for a specific purpose:
 *   - Front door (Port 80/443) = Where web visitors normally enter
 *   - Side door (Port 3005) = Where our app accepts visitors
 *   - Garage door (Port 21) = For moving large files in/out
 *   - Secure back entrance (Port 22) = Only for authorized maintenance
 *
 * Each service running on your computer needs its own "door" (port) to avoid conflicts.
 *
 * Which port should we use?
 * There are many available ports.
 * Common development ports include 3000, 3001, 3005, 8000, 8080, etc.
 * Ports 0-1023 are reserved for system services, so we avoid those.
 *
 * WHAT DOES app.listen() DO?
 * When we call app.listen(port, callback), we're telling our application to:
 * 1. Open the door at port 3005
 * 2. Start listening for visitors (HTTP requests) at that door
 * 3. When someone knocks (sends a request), our app will answer
 * 4. The callback function runs once the server starts successfully
 *
 * Try this: If you change the port number and restart the server,
 * you'll need to use the new port number in your browser to access the app!
 *
 * Example: If you change to port 4000, you'd visit http://localhost:4000
 */
