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
