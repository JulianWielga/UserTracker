'Use strict'

angular.module 'touk.userTracking', [
	'touk.userTracking.DataCollector'
	'touk.userTracking.directive'
]

# EXAMPLE RESOURCE
# .factory 'TrackingDataResource', [
# 	'$resource'
# 	($resource) ->
# 		$resource 'something'
# ]

# EXAMPLE CONFIG
# .config ['TrackingDataCollectorProvider', (provider) ->
# 	provider.setSaverDependency 'TrackingDataResource'
# 	provider.setSaverFn 'save'
# ]
