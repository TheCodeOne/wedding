import { Component, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'

@Component({
	selector: 'app-natural-form',
	templateUrl: './natural-form.component.html',
	styleUrls: ['./natural-form.component.scss'],
})
export class NaturalFormComponent {
	@ViewChild('submitTemplate') submitTemplateRef!: TemplateRef<any>

	naturalForm = this.fb.group({
		mealType: new FormControl('', [Validators.required]),
		childrenAmount: new FormControl('', [Validators.pattern('[0-9]*'), Validators.required]),
		hasPlusOne: new FormControl('', [Validators.required]),
		plusOne: this.fb.group({
			name: new FormControl(''),
			mealType: new FormControl(''),
		}),
	})
	dialogRef!: NxModalRef<any>
	plusOneEligable: boolean = true
	hasPlusOne: boolean = true

	constructor(private readonly fb: FormBuilder, readonly dialogService: NxDialogService) {}

	showChildrenPhrase(): boolean {
		return !!Number(this.naturalForm.get('childrenAmount')?.value)
	}

	showPlusOnePhrase(): boolean {
		return this.naturalForm.get('hasPlusOne')?.value === 'true'
	}

	getPlusOneName(): string {
		return this.naturalForm.get('plusOne')!.value?.name || ''
	}

	closeDialog() {
		this.dialogRef.close()
	}

	openSubmitDialog(): void {
		console.log('as')
		this.validate()
		console.log(this.naturalForm)
		if (!this.naturalForm.valid) return
		this.dialogRef = this.dialogService.open(this.submitTemplateRef, {
			ariaLabel: 'The final modal of the Starter App',
			showCloseIcon: false,
		})
	}

	private validate() {
		Object.values(this.naturalForm.controls).forEach(control => {
			control?.markAsTouched({ onlySelf: true })
		})
	}
}
