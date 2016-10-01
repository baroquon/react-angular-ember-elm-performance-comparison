import Ember from 'ember';

export default Ember.Controller.extend({
	repo: Ember.inject.service(),

	tagName: 'section',
	elementId: 'main',
	queryParams: ['filterBy'],
	filterBy: null,

	filteredModel: Ember.computed('model.[]', 'filterBy', function(){
		let model     = this.get('model');
		let filterBy  = this.get('filterBy');
 		if(!!filterBy){
			let filterVal = (filterBy==='completed') ? true : false;
			return model.filterBy('completed', filterVal);
		} else {
			return model;
		}
	}),
	allCompleted: Ember.computed('model.@each.completed', function () {
		return this.get('model').isEvery('completed');
	}),

	actions: {
		toggleAll() {
			let allCompleted = this.get('allCompleted');
			this.get('model').forEach(todo => Ember.set(todo, 'completed', !allCompleted));
		},
		startEditing(todo) {
			Ember.set(todo, 'canToggle', false);
			Ember.set(todo, 'editing', true);
			Ember.run.scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(todo, e) {
			if (!Ember.get(todo, 'editing')) { return; }
			if (Ember.isBlank(e.target.value)) {
				this.send('removeTodo');
			} else {
				Ember.set(todo, 'title', e.target.value);
				Ember.set(todo, 'editing', false);
  			Ember.set(todo, 'canToggle', true);
			}
		},

		handleKeydown(todo, e) {
			if (e.keyCode === 13) {
				e.target.blur();
			} else if (e.keyCode === 27) {
				todo.set('editing', false);
			}
		},

		toggleCompleted(todo, e) {
			Ember.set(todo, 'completed', e.target.checked);
		},

		removeTodo(todo) {
			this.get('repo').delete(todo);
		},
		updateQueryParam(value){
			if(value==="null"){
				this.set('filterBy', null);
			} else {
				this.set('filterBy', value);
			}
		}
	},
  focusInput() {
		Ember.$('input.edit').focus();
	}
});
