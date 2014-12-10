'Use strict'

class UserTracking.Field
	INTERVAL: 200

	constructor: (@pole, @strona, @formularz) ->
		@init()

	init: =>
		@data = new UserTracking.FieldDTO(@pole, @strona, @formularz)

	focus: => unless @focused
		@focused = yes
		@data.liczbaWejsc++
		@lastFocus = new Date().getTime()
		@updater = setInterval =>
			@lastFocus = @updateFocusTimer()
		, @INTERVAL

	blur: =>
		clearInterval @updater
		@focused = no
		@updateFocusTimer()

	event: (type) =>
		@data.zdarzenia[type] ?= 0
		@data.zdarzenia[type]++
		@test()

	updateFocusTimer: => if @lastFocus
		time = new Date().getTime()
		@data.czasFokusa += time - @lastFocus
		@lastFocus = null
		return time

	checkValueChange: (getValue) =>
		valueBefore = getValue()
		setTimeout =>
			@countChars getValue(), valueBefore
		, 10

	countChars: (newValue, oldValue) =>
		diff = newValue.length - oldValue.length
		@data.skasowanychZnakow++ if diff < 0
		@data.wpisanychZnakow++ if diff > 0

		re = /[A-ZĄĆĘŁŃÓŚŹŻÉÖÜßČĎÉĚÍŇÓŘŠŤÚŽÝŮÀÂÆÇÈÉÊËÎÏÔÙÛÜ]/g
		diff = (newValue.match(re)?.length or 0) - (oldValue.match(re)?.length or 0)
		@data.wpisanychDuzychZnakow++ if diff > 0

		re = /[a-ząćęłńóśźżéöüßčďéěíňóřšťúžýůàâæçèéêëîïôùûü]/g
		diff = (newValue.match(re)?.length or 0) - (oldValue.match(re)?.length or 0)
		@data.wpisanychMalychZnakow++ if diff > 0

	test: =>
		console.log angular.toJson(@data)
