import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { ApiService } from './services/api.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	@ViewChild('childrenAlternative') childrenAlternativeTemplateRef!: TemplateRef<any>
	dialogRef!: NxModalRef<any>
	showContent: boolean = false
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
			this.showContent = true
			console.log('loaded guests', this._guests)
		} catch (error) {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 0,
				context: 'info',
			}
			this.messageToastService.open('Invitation link is not know. Contact Sofia & Dimi', myCustomOptions)
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
