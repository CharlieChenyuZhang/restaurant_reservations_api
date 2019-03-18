/* E3 app.js */
'use strict';
// log(datetime.format(new Date(), 'MMM DD YYYY HH:mm:ss')) -- how you find the current time

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
// log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1])
	if (rest.length > 0) {
		/* complete */ 
		log("Added restaurant " + args[0] + ".")
	} else {
		/* complete */ 
		log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	let reservation_time = datetime.format(datetime.parse(args[1], 'MMM DD YYYY HH:mm:ss'), 'MMMM DD YYYY at h:m A ')
	let reservation_num_people = "for " + args[2].toString() + " people."
	log("Added reservation at " + args[0] + ' on ' + reservation_time + reservation_num_people)
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	
	// Produce output below
	restaurants.map((rest) => {
		log(`${rest.name}: ${rest.description} - ${rest.numReservations} active reservations`)
	})
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);

	// Produce output below
	const args = yargs_argv['restInfo']
	restaurants.map((rest) => {
		if (rest.name === args) {
			log(`${rest.name}: ${rest.description} - ${rest.numReservations} active reservations`)
		}
	})

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
	log("Reservations for Red Lobster:")
	const sortedReservations = reservationsForRestaurant.sort(
		function(a, b) {
			const int_a = parseInt(datetime.format(datetime.parse(a.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'YYYYMMDDHHmmss'))
			const int_b = parseInt(datetime.format(datetime.parse(b.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'YYYYMMDDHHmmss'))
			return int_a - int_b
		})
	
	// log the sorted array in the given format
	sortedReservations.map((reser) => {
		const dateyeartime =  datetime.format(datetime.parse(reser.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'MMM DD YYYY, h:m A,')
		log(`- ${dateyeartime} table for ${reser.people}`)
	})
	
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	log("Reservations in the next hour:")
	reservationsForRestaurant.map((reser) => {
		const dateyeartime =  datetime.format(datetime.parse(reser.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'MMM DD YYYY, h:m A,')
		log(`- ${reser.restaurant}: ${dateyeartime} table for ${reser.people}`)
	})
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
	const dateyeartime =  datetime.format(datetime.parse(earliestReservation.time, 'YYYY-MM-DDTHH:mm:ss.000Z'), 'MMM DD YYYY, h:m A,')
	log(`Checked off reservation on ${dateyeartime} table for ${earliestReservation.people}`)	
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']

	const resv = reservations.addDelayToReservations(args[0], args[1]);	
	// Produce output below
	log(`Reservations for ${args[0]}:`)
	resv.forEach((each) => {
		const dateyeartime =  datetime.format(each.time, 'MMM DD YYYY, h:m A,')
		log(`- ${dateyeartime} table for ${each.people}`)
	})
	

	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
}

