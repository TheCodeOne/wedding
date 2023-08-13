import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { TranslateService } from '@ngx-translate/core'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	@ViewChild('consentTemplate') consentTemplateRef!: TemplateRef<any>
	@ViewChild('submitTemplate') submitTemplateRef!: TemplateRef<any>
	@ViewChild('clickTriggerIcon') _clickTriggerIcon!: ElementRef<HTMLElement>
	@ViewChild('manualTriggerIcon') _manualTriggerIcon!: ElementRef<HTMLElement>
	dialogRef!: NxModalRef<any>
	naturalForm = this.fb.group({
		who: new FormControl('', [Validators.required]),
		city: new FormControl('', [Validators.required]),
		childrenAmount: new FormControl('', [Validators.pattern('[0-9]*'), Validators.required]),
		hasPlusOne: new FormControl('', [Validators.required]),
		plusOne: new FormControl(''),
	})
	plusOneEligable: boolean = true
	hasPlusOne: boolean = true

	constructor(readonly dialogService: NxDialogService, private readonly fb: FormBuilder, private translate: TranslateService) {
		translate.setDefaultLang('de')
		translate.use('de')
	}

	changeLanguage(key: string): void {
		this.translate.use(key)
	}

	showChildrenPhrase(): boolean {
		return !!Number(this.naturalForm.get('childrenAmount')?.value)
	}

	showPlusOnePhrase(): boolean {
		return this.naturalForm.get('hasPlusOne')?.value === 'true'
	}

	getPlusOneName(): string {
		return this.naturalForm.get('plusOne')!.value || ''
	}

	openConsentDialog(): void {
		this.dialogRef = this.dialogService.open(this.consentTemplateRef, {
			ariaLabel: 'A modal with content',
			showCloseIcon: true,
		})
	}

	openSubmitDialog(): void {
		this.validate()
		if (!this.naturalForm.valid) return
		this.dialogRef = this.dialogService.open(this.submitTemplateRef, {
			ariaLabel: 'The final modal of the Starter App',
			showCloseIcon: false,
		})
	}

	closeDialog() {
		this.dialogRef.close()
	}

	private validate() {
		Object.values(this.naturalForm.controls).forEach(control => {
			control?.markAsTouched({ onlySelf: true })
		})
	}
}
