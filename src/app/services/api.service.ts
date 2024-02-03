import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, lastValueFrom } from 'rxjs'

const FAKE_GUESTS = {
	uuid: '5b975dc4-d606-4331-bd44-eeb37b8ed247',
	guests: [
		{
			name: 'Dimitrios Singlekonias',
			gender: 'MALE',
			willAttend: true,
		},
	],
	isPlusOneEligable: true,
}

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private guests = new BehaviorSubject<any>({})
	currentGuests = this.guests.asObservable()

	constructor(private http: HttpClient) {}

	async getGuests(uuid: string) {
		const guests = await lastValueFrom(this.http.get(`http://localhost:3000/guests/${uuid}`))
		// const guests = FAKE_GUESTS
		this.guests.next(guests)
		return guests
	}
}
