'Use strict'

angular.module 'touk.userTracking', [
	'touk.userTracking.DataCollector'
	'touk.userTracking.directive'
]

.factory 'TrackingDataResource', [
	'$resource'
	($resource) ->
		$resource 'asdasds'
]

.config ['TrackingDataCollectorProvider', (provider) ->
	provider.setSaverDependency 'TrackingDataResource'
	provider.setSaverFn 'save'
]
