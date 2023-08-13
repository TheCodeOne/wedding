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
	@ViewChild('childrenAlternative') childrenAlternativeTemplateRef!: TemplateRef<any>
	dialogRef!: NxModalRef<any>

	constructor(readonly dialogService: NxDialogService) {}

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
