var app = (function()
{
	// Application object.
	var app = {};

	// Specify your beacon 128bit UUIDs here.
	var regions =
	[
		// Our UUIDs for beacons in our lab.
		{uuid:'B6559F92-9D89-462F-8B1F-3F70CAADA912'},
		{uuid:'4264BEA3-D32C-4029-BE05-A5FF9A43979C'},
		{uuid:'11ACF7E9-6D5A-4790-8F43-243DFE083A57'},
		{uuid:'8912BA10-776B-4EA5-B64E-E8A3154B1F13'},
	];

	//RSSI values for each beacon (corresponding to their UUIDs)
	var RSSIs = {
		"B6559F92-9D89-462F-8B1F-3F70CAADA912": [],
		"4264BEA3-D32C-4029-BE05-A5FF9A43979C": [],
		"11ACF7E9-6D5A-4790-8F43-243DFE083A57": [],
		"8912BA10-776B-4EA5-B64E-E8A3154B1F13": []
	};

	var colors = {
		"B6559F92-9D89-462F-8B1F-3F70CAADA912": "dark-blue",//dark-blue
		"4264BEA3-D32C-4029-BE05-A5FF9A43979C": "green", //green
		"11ACF7E9-6D5A-4790-8F43-243DFE083A57": "white", //white
		"8912BA10-776B-4EA5-B64E-E8A3154B1F13": "light-blue" //light-blue
	};

	var baseRSSIs = {
		"B6559F92-9D89-462F-8B1F-3F70CAADA912": -62.6,//dark-blue
		"4264BEA3-D32C-4029-BE05-A5FF9A43979C": -64.6, //green
		"11ACF7E9-6D5A-4790-8F43-243DFE083A57": -60.2, //white
		"8912BA10-776B-4EA5-B64E-E8A3154B1F13": -61 //light-blue
	};

	setInterval(function() {
		var today = new Date();
		document.getElementById('foo').innerHTML = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	}, 1000);

	// Background detection.
	var notificationID = 0;
	var inBackground = false;
	document.addEventListener('pause', function() { inBackground = true });
	document.addEventListener('resume', function() { inBackground = false });
	// document.getElementById('posBtn').addEventListener('click', calculatePosition);

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	app.initialize = function()
	{
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(onDeviceReady) },
			false);
	};

	function onDeviceReady()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.locationManager = cordova.plugins.locationManager;

		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 500);
		setInterval(calculatePosition, 5000);
	}

	function startScan()
	{
		// The delegate object holds the iBeacon callback functions
		// specified below.
		var delegate = new locationManager.Delegate();

		// Called continuously when ranging beacons.
		delegate.didRangeBeaconsInRegion = function(pluginResult)
		{
			//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
			for (var i in pluginResult.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = pluginResult.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		};

		// Called when starting to monitor a region.
		// (Not used in this example, included as a reference.)
		delegate.didStartMonitoringForRegion = function(pluginResult)
		{
			//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
		};

		// Called when monitoring and the state of a region changes.
		// If we are in the background, a notification is shown.
		delegate.didDetermineStateForRegion = function(pluginResult)
		{
			if (inBackground)
			{
				// Show notification if a beacon is inside the region.
				// TODO: Add check for specific beacon(s) in your app.
				if (pluginResult.region.typeName == 'BeaconRegion' &&
					pluginResult.state == 'CLRegionStateInside')
				{
					cordova.plugins.notification.local.schedule(
						{
							id: ++notificationID,
							title: 'Beacon in range',
							text: 'iBeacon Scan detected a beacon, tap here to open app.'
						});
				}
			}
		};

		// Set the delegate object to use.
		locationManager.setDelegate(delegate);

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		locationManager.requestAlwaysAuthorization();

		// Start monitoring and ranging beacons.
		for (var i in regions)
		{
			var beaconRegion = new locationManager.BeaconRegion(
				i + 1,
				regions[i].uuid);

			// Start ranging.
			locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail(console.error)
				.done();

			// Start monitoring.
			// (Not used in this example, included as a reference.)
			locationManager.startMonitoringForRegion(beaconRegion)
				.fail(console.error)
				.done();
		}
	}

	//https://community.estimote.com/hc/en-us/articles/201636913-What-are-Broadcasting-Power-RSSI-and-other-characteristics-of-a-beacon-s-signal-
	//beacon array, ascending order in RSSI (we only use the top 4 closest beacons)
	function getLocation(beacons) {
		//The closest beacon's major is the floor they are on
		const floor = beacons[0].major;
		var region = -1;


		if(beacons[0].minor == beacons[1].minor) {
			if(beacons[2].minor > beacon[0].minor && beacons[3].minor > beacon[0].minor) {
				region = beacons[0].minor;
			} else {
				region = beacons[1].minor;
			}
		} else {
			region = Math.min(beacons[0].minor, beacons[1].minor);
		}


		var location = {
			floor: floor,
			region: region
		};

		return location;
	}

	function calculateRssiAvg(uuid) {
		var sum = 0;
		RSSIs[uuid].forEach(function(rssi) {
			sum += rssi;
		});
		return sum / RSSIs[uuid].length;
	}

	function calculateDistance(uuid, averageRssi) {
		return Math.pow(10, (averageRssi - baseRSSIs[uuid]) / (-20));
	}

	function calculatePosition() {
		//alert('test');
		regions.forEach(function(beacon) {
			$('#' + beacon.uuid).html(calculateRssiAvg(beacon.uuid));
		});
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();
		
		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				// Map the RSSI value to a width in percent for the indicator.
				var rssiWidth = 1; // Used when RSSI is zero or greater.
				if (beacon.rssi < -100) { rssiWidth = 100; }
				else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }

				var averageRssi = calculateRssiAvg(beacon.uuid);
				// Create tag to display beacon data.
				var element = $(
					'<li>'
					+	'<strong>UUID: ' + beacon.uuid + '</strong><br />'
					+	'<strong>Color: ' + colors[beacon.uuid] + '</strong><br />'
					+	'Major: ' + beacon.major + '<br />'
					+	'Minor: ' + beacon.minor + '<br />'
					+	'Proximity: ' + beacon.proximity + '<br />'
					+	'RSSI: ' + beacon.rssi + '<br />'
					+   'RSSI Avg.: <span id="' + beacon.uuid + '">' + averageRssi + '</span><br />'
					+ 	'Distance: ' + calculateDistance(beacon.uuid, averageRssi) + '<br />'
					+ 	'<div style="background:rgb(255,128,64);height:20px;width:'
					+ 		rssiWidth + '%;"></div>'
					+ '</li>'
				);

				//alert(document.getElementById(beacon.uuid));

				/* ADDED CODE */
				if(RSSIs[beacon.uuid].length<=5) {
					RSSIs[beacon.uuid].push(beacon.rssi);
				}
				else {
					RSSIs[beacon.uuid].push(beacon.rssi);
					RSSIs[beacon.uuid].sort();
					RSSIs[beacon.uuid].pop();
					RSSIs[beacon.uuid].shift();
				}
				/* ADDED CODE */
				$('#warning').remove();
				$('#found-beacons').append(element);
			}
		});
	}

	return app;
})();

app.initialize();
