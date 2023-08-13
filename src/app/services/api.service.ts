import { Injectable } from '@angular/core'

const mockData = {
	guests: [
		{
			name: 'Hans',
			mealType: 'vegan',
		},
		{
			name: 'Luise',
			mealType: 'vegan',
		},
	],
	spouses: [
		{
			name: 'Hans',
			age: 1,
		},
		{
			name: 'Luise',
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
		return mockData.guests
	}
}
