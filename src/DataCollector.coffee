'Use strict'

angular.module 'touk.userTracking.DataCollector', []

.provider 'TrackingDataCollector', class DataCollector
	dependency = null
	saveFn = null

	setSaverDependency: (name) ->
		dependency = name

	setSaverFn: (name) ->
		saveFn = name

	$get: ['$injector', ($injector) ->
		if dependency and saveFn
			saver = $injector.get(dependency)?[saveFn]
		new UserTracking.DataCollector(saver)
	]
