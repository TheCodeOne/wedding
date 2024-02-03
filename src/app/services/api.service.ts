import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, lastValueFrom } from 'rxjs'

const FAKE_GUESTS = {
	uuid: '5b975dc4-d606-4331-bd44-eeb37b8ed247',
	guests: [
		{
			name: 'Dimitrios Singlekonias',
			gender: 'MALE',
		},
	],
	willAttend: true,
	isPlusOneEligable: true,
}

interface Guests {
	uuid: string
	guests: [
		{
			name: string
			gender: string
		}
	]
	willAttend: boolean
	isPlusOneEligable: boolean
}

interface UpdateGuests {
	attend: string
	plusOne?: string
	hasPlusOne: string
}

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private guests = new BehaviorSubject<any>({})
	currentGuests = this.guests.asObservable()

	constructor(private http: HttpClient) {}

	async getGuests(uuid: string): Promise<Guests> {
		const guests: Guests = (await lastValueFrom(this.http.get(`http://localhost:3000/guests/${uuid}`))) as Guests
		// const guests = FAKE_GUESTS
		this.guests.next(guests)
		return guests
	}

	async updateGuests(uuid: string, guests: UpdateGuests) {
		const { plusOne, hasPlusOne, attend: willAttend } = guests
		await lastValueFrom(
			this.http.patch(`http://localhost:3000/guests/${uuid}`, {
				willAttend: willAttend === 'true',
				...(plusOne && { plusOne }),
				...(hasPlusOne && { hasPlusOne: hasPlusOne === 'true' }),
			})
		)
	}
}
