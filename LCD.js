var phidget22 = require('phidget22');

var SERVER_PORT = 5661;

function main() {

	if (process.argv.length != 3) {
		console.log('usage: node LCD.js <server address>');
		process.exit(1);
	}
	var hostname = process.argv[2];

	console.log('connecting to:' + hostname);
	var conn = new phidget22.Connection(SERVER_PORT, hostname, { name: 'Server Connection', passwd: '' });
	conn.connect()
		.then(runExample)
		.catch(function (err) {
			console.error('Error running example:', err.message);
			process.exit(1);
		});
}

function runExample() {

	console.log('connected to server');
	var ch = new phidget22.LCD();

	ch.onAttach = function (ch) {
		console.log(ch + ' attached');
		if (ch.getDeviceID() === phidget22.DeviceID.PN_1204)
			ch.setScreenSize(phidget22.LCDScreenSize.DIMENSIONS_2X40);
		ch.setBacklight(1);
		ch.writeText(phidget22.LCDFont.DIMENSIONS_5X8, 0, 0, "hello world");
		ch.flush();
	};

	ch.onDetach = function (ch) {
		console.log(ch + ' detached');
	};

	ch.open().then(function (ch) {
		console.log('channel open');
	}).catch(function (err) {
		console.log('failed to open the channel:' + err);
	});
}

if (require.main === module)
	main();
