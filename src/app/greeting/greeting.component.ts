import { Component, Input, TemplateRef, ViewChild } from '@angular/core'
import { getGuestName } from '../utils'
import { Guests } from '../services/api.service'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'

@Component({
	selector: 'app-greeting',
	templateUrl: './greeting.component.html',
	styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent {
	@ViewChild('LOCATION_INFO') locationInfoTemplateRef!: TemplateRef<any>
	@Input() guests: Guests = {} as Guests

	dialogRef!: NxModalRef<any>

	constructor(private dialogService: NxDialogService) {}

	getName(gender: string) {
		return getGuestName(this.guests, gender)
	}

	hasGender(gender: string) {
		return this.guests.guests?.filter((guest: any) => guest.gender === gender).length > 0
	}

	isSingle() {
		return this.guests.guests?.length === 1
	}

	openModal(): void {
		this.dialogRef = this.dialogService.open(this.locationInfoTemplateRef, {
			showCloseIcon: true,
		})
	}
}
