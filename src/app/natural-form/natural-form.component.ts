import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { getGuestName } from '../utils'

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
		mealTypeMale: new FormControl(null, [Validators.required]),
		mealTypeFemale: new FormControl(null, [Validators.required]),
		hasPlusOne: new FormControl(null, this.getPlusOneValidation()),
		plusOne: this.fb.group({
			name: new FormControl(null, [Validators.required]),
			mealType: new FormControl(null, [Validators.required]),
		}),
	})

	dialogRef!: NxModalRef<any>
	plusOneEligable: boolean = true
	hasPlusOne: boolean = true

	constructor(private readonly fb: FormBuilder, readonly dialogService: NxDialogService) {}

	ngOnInit(): void {
		this.naturalForm?.get('hasPlusOne')?.valueChanges.subscribe(() => {
			this.naturalForm?.get('plusOne')?.get('name')?.setValue(null)
			this.naturalForm?.get('plusOne')?.addValidators(this.getPlusOneValidation())
			this.naturalForm?.get('plusOne')?.get('name')?.addValidators(this.getPlusOneValidation())

			this.naturalForm.updateValueAndValidity()
		})
		setTimeout(() => {
			if (!this.guests?.guests) return
			console.log(this.guests?.guests[0].willAttend)
			this.naturalForm?.get('attend')?.setValue(`${this.guests?.guests[0].willAttend}`)
			this.naturalForm.updateValueAndValidity()
		}, 200)
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

	closeDialog() {
		this.dialogRef.close()
	}

	openSubmitDialog(): void {
		this.validate()
		if (!this.naturalForm.valid) return
		this.dialogRef = this.dialogService.open(this.submitTemplateRef, {
			ariaLabel: 'The final modal of the Starter App',
			showCloseIcon: false,
		})
	}

	getName(gender: string) {
		return getGuestName(this.guests, gender)
	}

	private validate() {
		Object.values(this.naturalForm.controls).forEach(control => {
			control?.markAsTouched({ onlySelf: true })
		})
		this.naturalForm.get('plusOne')?.markAsTouched({ onlySelf: true })
		this.naturalForm.get('plusOne')?.get('name')?.markAsTouched({ onlySelf: true })
		this.naturalForm.get('plusOne')?.get('mealType')?.markAsTouched({ onlySelf: true })
		console.log(this.naturalForm)
	}

	private getPlusOneValidation() {
		return this.showPlusOnePhrase() ? [Validators.required] : []
	}
}
