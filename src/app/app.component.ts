import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations'
import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { Observable, filter, map, merge } from 'rxjs'
import { ApiService, PrivateData } from './services/api.service'
import { SwPush } from '@angular/service-worker'

enum ModalType {
	CHILDREN = 'CHILDREN',
	HOTEL = 'HOTEL',
	BEST_MAN_MAID_OF_HONOR = 'BEST_MAN_MAID_OF_HONOR',
	PRESENTS = 'PRESENTS',
}

function FadeIn(timingIn: number, height: boolean = false): AnimationTriggerMetadata {
	return trigger('fadeIn', [transition(':enter', [style(height ? { opacity: 0, height: 0 } : { opacity: 0 }), animate(timingIn, style(height ? { opacity: 1, height: '0' } : { opacity: 1 }))])])
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
	@ViewChild(`${ModalType.PRESENTS}`) presentsTemplateRef!: TemplateRef<any>
	@HostListener('window:resize', ['$event'])
	onResize() {
		this.setBackGroundImage()
		this.innerWidth = window.innerWidth
	}
	innerWidth = window.innerWidth
	dialogRef!: NxModalRef<any>
	showContent = false
	isLoading = true
	isStartingAnimation = false
	audio = new Audio()
	isAudioPlaying = false
	isAudioLoaded = false
	showClickIcon = false
	privateData: PrivateData = {} as PrivateData
	readonly ModalType = ModalType
	readonly VAPID_PUBLIC_KEY = 'BKFExe9faH6xT-J0bCSmx3GFTaFfZovDAeF0Brk3uyvZdd_I2NkbhIEsx67MywmbSKR250N3mPAIBssgsNHZpQw'
	private _guests: any = {}

	constructor(readonly dialogService: NxDialogService, private api: ApiService, private activatedRoute: ActivatedRoute, private messageToastService: NxMessageToastService, private swPush: SwPush) {
		this.finalQueryParams$.subscribe(params => {
			const uuid = params['uuid']
			if (uuid) {
				this.init(uuid)
				this.subscribeToNotifications()
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
	subscribeToNotifications() {
		this.swPush
			.requestSubscription({
				serverPublicKey: this.VAPID_PUBLIC_KEY,
			})
			.then(sub => {
				console.log(sub)
			})
			.catch(err => console.error('Could not subscribe to notifications', err))
	}

	async init(uuid: string) {
		// alone: 5b975dc4-d606-4331-bd44-eeb37b8ed247
		// zwei : 5b975dc4-d606-4331-bd44-eeb37b8ed248
		try {
			this.startClickIconTimer()
			this._guests = await this.api.getGuests(uuid)
			this.privateData = await this.api.getPrivateData(uuid)
			localStorage.setItem('uuid', uuid)
			if (localStorage.getItem('disableLoadingAnimation') !== 'true') {
				this.isStartingAnimation = true
				this.setBackGroundImage()
			} else {
				this.enterApp()
			}
		} catch (error) {
			const myCustomOptions: NxMessageToastConfig = {
				duration: 0,
				context: 'info',
			}
			this.messageToastService.open('Invitation link seems to be unknown. Contact Sofia or Dimi 🤷‍♀️', myCustomOptions)
			console.log(error)
		}
	}

	getUuid() {
		return localStorage.getItem('uuid')
	}

	enterApp() {
		this.resetScene()
		this.showContent = true
		this.isStartingAnimation = false
		this.isLoading = false
	}

	getGuests() {
		return this._guests
	}

	startClickIconTimer() {
		setTimeout(() => {
			this.showClickIcon = true
		}, 4000)
	}

	openModal(type: ModalType): void {
		const ModalTypeToTemplateRefMap = {
			[ModalType.CHILDREN]: this.childrenAlternativeTemplateRef,
			[ModalType.HOTEL]: this.hotelTemplateRef,
			[ModalType.BEST_MAN_MAID_OF_HONOR]: this.bestManAndMaidOfHonorTemplateRef,
			[ModalType.PRESENTS]: this.presentsTemplateRef,
		}

		this.dialogRef = this.dialogService.open(ModalTypeToTemplateRefMap[type], {
			showCloseIcon: true,
		})
	}

	closeDialog() {
		this.dialogRef.close()
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
			this.activatedRoute.queryParams.pipe(filter(params => Object.keys(params).length > 0)),
			this.activatedRoute.queryParams.pipe(
				filter(() => !(window.location.href || '').includes('?')),
				map(() => ({}))
			)
		)
	}

	private resetScene() {
		document.body.style.backgroundImage = 'none'
		document.body.style.opacity = '1'
		document.body.style.backgroundColor = '#3e213a94'
	}

	private setBackGroundImage() {
		if (!this.isStartingAnimation) return
		document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url('/assets/images/sofia_and_dimi.jpeg')`
	}
}
