import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, lastValueFrom } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private guests = new BehaviorSubject<any>({})
	currentGuests = this.guests.asObservable()

	constructor(private http: HttpClient) {}

	async getGuests(uuid: string) {
		const guests = await lastValueFrom(this.http.get(`http://localhost:3000/guests/${uuid}`))
		this.guests.next(guests)
		return guests
	}
}
