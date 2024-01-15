import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from './services/api.service'
import { ActivatedRoute, Params } from '@angular/router'
import { BehaviorSubject, lastValueFrom } from 'rxjs'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	@ViewChild('childrenAlternative') childrenAlternativeTemplateRef!: TemplateRef<any>
	dialogRef!: NxModalRef<any>
	private _guests: any = {}

	constructor(readonly dialogService: NxDialogService, private api: ApiService, private activatedRoute: ActivatedRoute, private messageToastService: NxMessageToastService) {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			const uuid = params['uuid']
			if (uuid) {
				this.init(uuid)
			}
		})
	}

	ngOnInit() {}

	async init(uuid: string) {
		// alone: 5b975dc4-d606-4331-bd44-eeb37b8ed247
		// zwei : 5b975dc4-d606-4331-bd44-eeb37b8ed248
		try {
			this._guests = await this.api.getGuests(uuid)
			console.log('loaded guests', this._guests)
		} catch (error) {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 5000,
				context: 'info',
				announcementMessage: 'Yay, you see a success message toast',
			}
			this.messageToastService.open('Something went wrong ... please try again later', myCustomOptions)
			console.log(error)
		}
	}

	getGuests() {
		return this._guests
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
