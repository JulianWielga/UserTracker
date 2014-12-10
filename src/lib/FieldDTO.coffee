'Use strict'

class UserTracking.FieldDTO
	constructor: (@pole, @strona, @formularz) ->
		@pole ?= null
		@strona ?= null
		@formularz ?= null
		@liczbaWejsc = 0
		@czasFokusa = 0
		@zdarzenia = {}
		@wpisanychDuzychZnakow = 0
		@wpisanychMalychZnakow = 0
		@wpisanychZnakow = 0
		@skasowanychZnakow = 0
