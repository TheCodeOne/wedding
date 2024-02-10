import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { getGuestName } from '../utils'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'
import { debounceTime } from 'rxjs/internal/operators/debounceTime'
import { ApiService } from '../services/api.service'
import { SIZES } from '@aposin/ng-aquila/natural-language-form'

@Component({
	selector: 'app-natural-form',
	templateUrl: './natural-form.component.html',
	styleUrls: ['./natural-form.component.scss'],
})
export class NaturalFormComponent implements OnInit {
	@ViewChild('submitTemplate') submitTemplateRef!: TemplateRef<any>
	@Input() guests: any

	naturalForm: FormGroup = this.fb.group({
		attend: new FormControl(null, [Validators.required]),
		hasPlusOne: new FormControl(null, this.getPlusOneValidation()),
		plusOne: new FormControl(null, [Validators.required]),
	})

	plusOneEligable: boolean = true
	hasPlusOne: boolean = true

	constructor(private readonly fb: FormBuilder, private toastService: NxMessageToastService, private apiService: ApiService) {}

	ngOnInit(): void {
		this.naturalForm?.get('hasPlusOne')?.valueChanges.subscribe(() => {
			this.naturalForm?.get('plusOne')?.setValue(null)
			this.naturalForm?.get('plusOne')?.addValidators(this.getPlusOneValidation())

			this.naturalForm.updateValueAndValidity()
		})

		if (!this.guests?.guests) return
		this.naturalForm?.get('attend')?.setValue(`${this.guests?.willAttend}`)
		if (this.guests?.hasPlusOne !== null) this.naturalForm?.get('hasPlusOne')?.setValue(`${this.guests?.hasPlusOne}`)
		if (this.guests?.plusOne !== null) this.naturalForm?.get('plusOne')?.setValue(`${this.guests?.plusOne}`)
		this.naturalForm.updateValueAndValidity()
		this.naturalForm?.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
			this.intentSubmit()
		})
	}

	get willAttend() {
		return (this.naturalForm.get('attend')?.value as unknown as string) === 'true'
	}

	isSingle(): boolean {
		return this.guests.guests?.length === 1
	}

	showPlusOnePhrase(): boolean {
		return (this.naturalForm?.get('hasPlusOne')?.value as unknown as string) === 'true'
	}

	getPlusOneName(): string {
		return this.naturalForm.get('plusOne')!.value?.name || ''
	}

	async intentSubmit() {
		if (!this.isValid()) return
		try {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 3000,
				context: 'success',
			}
			console.log(this.naturalForm.value)
			await this.apiService.updateGuests(this.guests.uuid, this.naturalForm.value)
			this.toastService.open('Danke fuer deine Rueckmeldung 😊', myCustomOptions)
		} catch (error) {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 0,
				context: 'info',
			}
			this.toastService.open('Something went wrong! Contact Sofia or Dimi 🤷‍♀️', myCustomOptions)
			console.log(error)
		}
	}

	getName(gender: string) {
		return getGuestName(this.guests, gender)
	}

	getAttendSize(): SIZES {
		console.log(this.naturalForm.get('attend')?.value)
		return this.naturalForm.get('attend')?.value === 'true' ? ('regular' as SIZES) : ('long' as SIZES)
	}

	private isValid(): boolean {
		if (this.naturalForm.get('attend')?.value === 'false') {
			return true
		} else if (this.naturalForm.get('attend')?.value === 'true' && this.naturalForm.get('hasPlusOne')?.value === 'false') {
			return true
		} else if (this.naturalForm.get('attend')?.value === 'true' && this.naturalForm.get('hasPlusOne')?.value === 'true' && this.naturalForm.get('plusOne')?.value) {
			return true
		} else if (this.naturalForm.get('attend')?.value === 'true' && this.naturalForm.get('hasPlusOne')?.value === null) {
			return true
		}

		return false
	}

	private getPlusOneValidation() {
		return this.showPlusOnePhrase() ? [Validators.required] : []
	}
}
