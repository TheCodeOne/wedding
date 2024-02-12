import { Component, Input } from '@angular/core'
import { getGuestName } from '../utils'
import { Guests } from '../services/api.service'

@Component({
	selector: 'app-greeting',
	templateUrl: './greeting.component.html',
	styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent {
	@Input() guests: Guests = {} as Guests

	getName(gender: string) {
		return getGuestName(this.guests, gender)
	}

	hasGender(gender: string) {
		return this.guests.guests?.filter((guest: any) => guest.gender === gender).length > 0
	}

	isSingle() {
		return this.guests.guests?.length === 1
	}
}
