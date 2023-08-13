import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from './services/api.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	@ViewChild('childrenAlternative') childrenAlternativeTemplateRef!: TemplateRef<any>
	dialogRef!: NxModalRef<any>
	private guests: any[] = []

	constructor(readonly dialogService: NxDialogService, private api: ApiService) {}

	ngOnInit() {
		this.init()
	}

	async init() {
		const guests = await this.api.getGuests()
	}

	getGuests() {
		return this.guests
	}

	openConsentDialog(): void {
		this.dialogRef = this.dialogService.open(this.childrenAlternativeTemplateRef, {
			ariaLabel: 'A modal with content',
			showCloseIcon: true,
		})
	}

	closeDialog() {
		this.dialogRef.close()
	}
}
