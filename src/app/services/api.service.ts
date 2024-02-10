import { HttpClient } from '@angular/common/http'
import { Injectable, isDevMode } from '@angular/core'
import { BehaviorSubject, lastValueFrom } from 'rxjs'

const backendUrl = isDevMode() ? 'http://localhost:3000' : 'https://wedding-backend-kokkslat-4c9d2773f2dd.herokuapp.com'

export interface PrivateData {
	maidOfHonor: Data
	bestMan: Data
}

interface Data {
	name: string
	phone: string
	email: string
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
		const guests: Guests = (await lastValueFrom(this.http.get(`${backendUrl}/guests/${uuid}`))) as Guests
		this.guests.next(guests)
		return guests
	}

	async updateGuests(uuid: string, guests: UpdateGuests) {
		const { plusOne, hasPlusOne, attend: willAttend } = guests
		await lastValueFrom(
			this.http.patch(`${backendUrl}/guests/${uuid}`, {
				willAttend: willAttend === 'true',
				...(plusOne && { plusOne }),
				...(hasPlusOne && { hasPlusOne: hasPlusOne === 'true' }),
			})
		)
	}

	async getPrivateData(uuid: string): Promise<PrivateData> {
		const privateData: PrivateData = (await lastValueFrom(this.http.get(`${backendUrl}/private-data/${uuid}`))) as PrivateData
		return privateData
	}

	getUuidByCode(code: string): any {
		return this.http.get(`${backendUrl}/code/${code}`)
	}

	addSubscription(subscription: PushSubscription): any {
		return this.http.post(`${backendUrl}/subscription/`, subscription)
	}
}
