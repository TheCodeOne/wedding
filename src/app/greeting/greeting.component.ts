import { Component, Input } from '@angular/core'
import { getName } from '../utils'

@Component({
	selector: 'app-greeting',
	templateUrl: './greeting.component.html',
	styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent {
	@Input() guests: any = {}

	getName(gender: string) {
		return getName(this.guests, gender)
	}

	hasGender(gender: string) {
		return this.guests.guests?.filter((guest: any) => guest.gender === gender).length > 0
	}

	isSingle() {
		return this.guests.guests?.length === 1
	}
}
