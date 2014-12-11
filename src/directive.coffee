'Use strict'

angular.module 'touk.userTracking.directive', [
	'touk.userTracking.DataCollector'
]

.directive 'analyze', [
	'$location', 'TrackingDataCollector'
	($location, collector) ->
		restrict: 'EA'
		link: (scope, element, attrs)->

			name = attrs.analyze or attrs.id or attrs.name or attrs.ngModel
			page = $location.path()

			trackerOptions =
				id: name+'@'+page
				fieldName: name
				pageName: page

			trackerGetter = -> collector.get trackerOptions

			#for non-focusable wrappers
			element.find('input').on 'focus blur', (event) ->
				element.triggerHandler event.type


			element.on 'focus blur click dblclick keydown keyup keypress contextmenu', (event) ->
				tracker = trackerGetter()
				tracker[event.type]?() or tracker.event(event.type)

			#bind character counter
			element.on 'keydown', (event) ->
				tracker = trackerGetter()
				valueGetter = -> angular.element(event.target).val()
				tracker.checkValueChange valueGetter

			scope.$on '$destroy', ->
				collector.destroy trackerOptions

]
