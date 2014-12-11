'Use strict'

angular.module 'touk.userTracking.DataCollector', []

.provider 'TrackingDataCollector', class DataCollector
	dependency = null
	saveFn = null
	saveInterval = 3000

	setSaverDependency: (name) ->
		dependency = name

	setSaverFn: (name) ->
		saveFn = name

	setSaverInterval: (interval) ->
		saveInterval = interval

	$get: ['$injector', ($injector) ->
		if dependency and saveFn
			saver = $injector.get(dependency)?[saveFn]
		new UserTracking?.DataCollector(saver, saveInterval)
	]
