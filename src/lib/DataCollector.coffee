'Use strict'

@UserTracking ?= {}

class @UserTracking.DataCollector
	INTERVAL: 3000

	constructor: (@saver) ->
		@fields = {}
		@init()

	init: =>
		@data = (field.init() for id, field of @fields)
		setTimeout @save, @INTERVAL

	create: (tracker = {}) =>
		field = new UserTracking.Field(tracker.fieldName, tracker.pageName, tracker.formName)
		@data.push field.data
		@fields[tracker.id] = field

	get: (tracker) =>
		@fields[tracker.id] or @create(tracker)

	save: =>
		@saver?(@data)
		@init()
