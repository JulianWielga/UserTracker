'Use strict'

@UserTracking ?= {}

class @UserTracking.DataCollector
	INTERVAL: 3000

	constructor: (@saver, @INTERVAL) ->
		@fields = {}
		@init()

	init: =>
		@data = (field.init() for id, field of @fields)
		setTimeout @save, @INTERVAL

	create: (trackerOpts = {}) =>
		field = new UserTracking.Field(trackerOpts.fieldName, trackerOpts.pageName, trackerOpts.formName)
		@data.push field.data
		@fields[trackerOpts.id] = field

	get: (trackerOpts) =>
		@fields[trackerOpts.id] or @create(trackerOpts)

	destroy: (trackerOpts) =>
		delete @fields[trackerOpts.id]

	save: =>
		@saver?(@data)
		@init()
