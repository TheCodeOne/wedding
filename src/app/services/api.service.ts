import { Injectable } from '@angular/core'

const mockData = {
	guests: [
		{
			name: 'Hans',
			gender: 'male',
			mealType: 'vegan',
		},
		{
			name: 'Luise',
			gender: 'female',
			mealType: 'vegan',
		},
	],
	spouses: [
		{
			name: 'Hans',
			gender: 'male',
			age: 1,
		},
		{
			name: 'Luise',
			gender: 'male',
			age: 2,
		},
	],
}

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor() {}

	getGuests() {
		return mockData
	}
}
