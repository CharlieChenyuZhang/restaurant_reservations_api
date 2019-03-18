/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/

//TODO: 
// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	const status = {}
	
	/* Add your code below */

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json', JSON.stringify(reservations))
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	const restaurant = {
		name,
		description,
		numReservations: 0
	}

	const restaurants = getAllRestaurants()
	if (Object.keys(getRestaurantByName(name)).length !== 0) {
		// if obj exist
		return []
	} else {
		// if doesen't exist
		restaurants.push(restaurant)
		saveRestaurantsToJSONFile(restaurants)
		return [restaurant];
	}
}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */

	const reservation = {
		restaurant,
		time: datetime.parse(time, 'MMM DD YYYY HH:mm:ss'),
		people
	}

	const reservations = getAllReservations()
	// Assume: There are no 'duplicate' reservations; adding a reservation to a non-existing restaurant
	reservations.push(reservation)
	saveReservationsToJSONFile(reservations)
	
	// update the restaurant info
	const restaurants = getAllRestaurants()
	restaurants.map((rest) => {
		if (rest.name === restaurant) {
			rest.numReservations += 1
		}
	})
	saveRestaurantsToJSONFile(restaurants)
	return reservation;
}


/// Getters - use functional array methods when possible! ///

// Should return an array of obj - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try {
		const restaurantsJSONString = fs.readFileSync('restaurants.json')
		return JSON.parse(restaurantsJSONString)
	} catch (e) {
		fs.writeFileSync('restaurants.json', JSON.stringify([]))
		return []
	}
};

// returns a list of objs
// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	// return the restaurant object if we can find it
	const restaurants = getAllRestaurants()
	const restaurant = restaurants.filter((rest) => rest.name === name)
	return restaurant
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
  try {
	const reservationsJSONString = fs.readFileSync('reservations.json')
	return JSON.parse(reservationsJSONString)
} catch (e) {
	fs.writeFileSync('reservations.json', JSON.stringify([]))
	return []
}
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const reservations = getAllReservations()
	const reservations_by_restaurant = reservations.filter((reser) => reser.restaurant === name)
	return reservations_by_restaurant
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	const currentDateTime = parseInt(datetime.format(datetime.parse(time, 'MMM DD YYYY HH:mm:ss'), 'YYYYMMDDHHmmss'))
	const nextHour = currentDateTime + 10000
	const reservations = getAllReservations()
	const result = []
	reservations.map((reser) => {
		const reser_time = parseInt(datetime.format(datetime.parse(reser.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'YYYYMMDDHHmmss'))
		if (reser_time >= currentDateTime && reser_time <= nextHour) {
			result.push(reser)
		}
	})
	return result
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {
	// find all the reservation associated with restaurantName

	const reservationsForRestaurant = getAllReservationsForRestaurant(restaurantName)

	const sortedReservations = reservationsForRestaurant.sort(
		function(a, b) {
			const int_a = parseInt(datetime.format(datetime.parse(a.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'YYYYMMDDHHmmss'))
			const int_b = parseInt(datetime.format(datetime.parse(b.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'YYYYMMDDHHmmss'))
			return int_a - int_b
		})

	// find the earliest reservation
	const reservation_removed = sortedReservations[0]

	// update the reservation json
	saveReservationsToJSONFile(sortedReservations.slice(1))

	// update the restaurant JSON
	const restaurants = getAllRestaurants()
	restaurants.map((rest) => {
		if (rest.name === reservation_removed.restaurant) {
			rest.numReservations -= 1
		}
	})

	saveRestaurantsToJSONFile(restaurants)
	
	// should return a reservation object
 	return reservation_removed
}

// return the new reservation info associated with the restaurant
const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	const new_reservation_info = []
	const reservations = getAllReservations()
	reservations.map((reser) => {
		if (reser.restaurant === restaurant) {
			// TODO: currently working on
			// log(typeof(datetime.parse(reser.time, 'YYYY-MM-DDTHH:mm:ss.000Z')))
			// log("old", reser.time)
			const new_time = datetime.addMinutes(datetime.parse(reser.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), minutes)
			// log("new", new_time)
			reser.time =  datetime.parse(new_time, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
			new_reservation_info.push(reser)
		}
	})

	saveReservationsToJSONFile(reservations)

	return new_reservation_info
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

