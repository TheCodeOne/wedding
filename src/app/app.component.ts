import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { ApiService } from './services/api.service'
import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations'
import { Observable, merge, filter, map } from 'rxjs'

enum ModalType {
	CHILDREN = 'CHILDREN',
	HOTEL = 'HOTEL',
	BEST_MAN_MAID_OF_HONOR = 'BEST_MAN_MAID_OF_HONOR',
}

function FadeIn(timingIn: number, height: boolean = false): AnimationTriggerMetadata {
	return trigger('fadeIn', [transition(':enter', [style(height ? { opacity: 0, height: 0 } : { opacity: 0 }), animate(timingIn, style(height ? { opacity: 1, height: 'fit-content' } : { opacity: 1 }))])])
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [FadeIn(1000, true)],
})
export class AppComponent {
	@ViewChild(`${ModalType.CHILDREN}`) childrenAlternativeTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.HOTEL}`) hotelTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.BEST_MAN_MAID_OF_HONOR}`) bestManAndMaidOfHonorTemplateRef!: TemplateRef<any>
	dialogRef!: NxModalRef<any>
	showContent = false
	isLoading = true
	isStartingAnimation = false
	audio = new Audio()
	isAudioPlaying = false
	isAudioLoaded = false
	readonly ModalType = ModalType
	private _guests: any = {}

	constructor(readonly dialogService: NxDialogService, private api: ApiService, private activatedRoute: ActivatedRoute, private messageToastService: NxMessageToastService) {
		this.finalQueryParams$.subscribe(params => {
			const uuid = params['uuid']
			if (uuid) {
				this.init(uuid)
			} else {
				this.isLoading = false
				this.showContent = false
			}
		})
	}

	get loadingAnimationText() {
		return localStorage.getItem('disableLoadingAnimation') === 'true' ? 'Enable starting animation' : 'Disable starting animation'
	}

	toggleLoadingAnimation() {
		const currentState = localStorage.getItem('disableLoadingAnimation')
		localStorage.setItem('disableLoadingAnimation', currentState === 'true' ? 'false' : 'true')
	}

	async init(uuid: string) {
		// alone: 5b975dc4-d606-4331-bd44-eeb37b8ed247
		// zwei : 5b975dc4-d606-4331-bd44-eeb37b8ed248
		try {
			this._guests = await this.api.getGuests(uuid)
			console.log('loaded guests', this._guests)
			if (localStorage.getItem('disableLoadingAnimation') !== 'true') {
				document.body.style.backgroundImage = "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url('/assets/images/sofia_and_dimi.jpeg')"
				this.isStartingAnimation = true
				await this.sleep(7000)
			}
			this.resetScene()
			this.showContent = true
			this.isStartingAnimation = false
			this.isLoading = false
		} catch (error) {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 0,
				context: 'info',
			}
			this.messageToastService.open('Invitation link seems to be unknow. Contact Sofia or Dimi 🤷‍♀️', myCustomOptions)
			console.log(error)
		}
	}

	getGuests() {
		return this._guests
	}

	openModal(type: ModalType): void {
		const ModalTypeToTemplateRefMap = {
			[ModalType.CHILDREN]: this.childrenAlternativeTemplateRef,
			[ModalType.HOTEL]: this.hotelTemplateRef,
			[ModalType.BEST_MAN_MAID_OF_HONOR]: this.bestManAndMaidOfHonorTemplateRef,
		}

		this.dialogRef = this.dialogService.open(ModalTypeToTemplateRefMap[type], {
			showCloseIcon: true,
		})
	}

	closeDialog() {
		this.dialogRef.close()
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	toggleAudio() {
		if (this.audio.paused) {
			if (!this.isAudioLoaded) {
				this.audio.src = '/assets/Bridal-chorus.wav'
				this.audio.load()
				this.isAudioLoaded = true
			}
			this.audio.play()
			this.isAudioPlaying = true
		} else {
			this.audio.pause()
			this.isAudioPlaying = false
		}
	}

	private get finalQueryParams$(): Observable<Params> {
		return merge(
			// get urls with query params like /test?project=test
			this.activatedRoute.queryParams.pipe(filter(params => Object.keys(params).length > 0)),
			// get urls without query params like /test
			this.activatedRoute.queryParams.pipe(
				filter(() => !(window.location.href || '').includes('?')),
				map(() => ({}))
			)
		)
	}

	private resetScene() {
		// remove background image from body
		document.body.style.backgroundImage = 'none'
		document.body.style.opacity = '1'
	}
}
