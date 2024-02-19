import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations'
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { NxMessageToastConfig, NxMessageToastService } from '@aposin/ng-aquila/message'
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal'
import { BehaviorSubject, Observable, Subject, debounceTime, filter, lastValueFrom, map, merge } from 'rxjs'
import { ApiService, PrivateData } from './services/api.service'
import packageJson from '../../package.json'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

enum ModalType {
	CHILDREN = 'CHILDREN',
	HOTEL = 'HOTEL',
	BEST_MAN_MAID_OF_HONOR = 'BEST_MAN_MAID_OF_HONOR',
	PRESENTS = 'PRESENTS',
	DEBUG = 'DEBUG',
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
export class AppComponent implements OnInit {
	@ViewChild(`${ModalType.CHILDREN}`) childrenAlternativeTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.HOTEL}`) hotelTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.BEST_MAN_MAID_OF_HONOR}`) bestManAndMaidOfHonorTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.PRESENTS}`) presentsTemplateRef!: TemplateRef<any>
	@ViewChild(`${ModalType.DEBUG}`) debugTemplateRef!: TemplateRef<any>
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
	codeSucessfullyEntered = false
	privateData: PrivateData = {} as PrivateData
	codeInputValue = ''
	backendVersion = ''
	frontendVersion = ''
	codeForm!: FormGroup
	readonly ModalType = ModalType
	private _guests: any = {}
	private debugSubject = new BehaviorSubject<number>(0)
	private snackbarOptions: NxMessageToastConfig = {
		duration: 5000,
		context: 'info',
	}

	constructor(readonly dialogService: NxDialogService, private api: ApiService, private activatedRoute: ActivatedRoute, private messageToastService: NxMessageToastService, private router: Router, private translateService: TranslateService) {}

	ngOnInit(): void {
		this.codeForm = new FormGroup({
			keyCode: new FormControl(this.codeInputValue, {
				validators: [Validators.required, Validators.minLength(6)],
				updateOn: 'change',
			}),
		})

		this.setInitialLoadingState()

		const uuid = localStorage.getItem('uuid')
		if (uuid) {
			this.init({ value: uuid, isUuid: true })
			this.codeSucessfullyEntered = true
			return
		}

		this.finalQueryParams$.subscribe(params => {
			const code = params['code']
			if (code) {
				this.init({ value: code, isUuid: false })
			} else {
				this.isLoading = false
				this.showContent = false
			}
		})

		this.codeForm.valueChanges.subscribe(async value => {
			if (value.keyCode.length === 6) {
				try {
					const { uuid } = await this.api.getUuidByCode(value.keyCode).toPromise()
					this.init({ value: uuid, isUuid: true })
					this.codeSucessfullyEntered = true
				} catch (error: any) {
					this.messageToastService.open(error.error.message, this.snackbarOptions)
					this.codeSucessfullyEntered = false
				}
			}
		})
	}

	get keyCode() {
		return this.codeForm.get('keyCode')
	}

	setInitialLoadingState() {
		if (!localStorage.getItem('disableLoadingAnimation')) {
			localStorage.setItem('disableLoadingAnimation', 'false')
		}
	}

	get showLoadingAnimation(): boolean {
		return localStorage.getItem('disableLoadingAnimation') === 'false'
	}

	toggleLoadingAnimation() {
		this.showDebug()
		const currentState = localStorage.getItem('disableLoadingAnimation')
		localStorage.setItem('disableLoadingAnimation', currentState === 'true' ? 'false' : 'true')
	}

	async init({ value, isUuid }: { value: string; isUuid: boolean }) {
		try {
			let uuid
			this.postVersions()
			this.startClickIconTimer()
			if (!isUuid) {
				const response = (await lastValueFrom(this.api.getUuidByCode(value))) as { uuid: string }
				this.codeSucessfullyEntered = true
				uuid = response.uuid
			} else {
				uuid = value
			}
			localStorage.setItem('uuid', uuid)
			this._guests = await this.api.getGuests(uuid)
			this.privateData = await this.api.getPrivateData(uuid)
			if (localStorage.getItem('disableLoadingAnimation') !== 'true') {
				this.isStartingAnimation = true
				this.setBackGroundImage()
			} else {
				this.enterApp()
			}
			this.router.navigate([], {
				queryParams: {
					code: null,
				},
				queryParamsHandling: 'merge',
			})
		} catch (error) {
			this.messageToastService.open('Invitation link seems to be unknown. Contact Sofia or Dimi 🤷‍♀️', this.snackbarOptions)
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
			[ModalType.DEBUG]: this.debugTemplateRef,
		}

		this.dialogRef = this.dialogService.open(ModalTypeToTemplateRefMap[type], {
			showCloseIcon: true,
		})
		this.dialogRef.afterClosed().subscribe(() => {
			this.debugSubject.next(0)
		})
	}

	closeDialog() {
		this.dialogRef.close()
	}

	toggleAudio() {
		if (this.audio.paused) {
			this.audio.src = this.translateService.currentLang === 'lol' ? '/assets/sounds/shitty_flute.mp3' : '/assets/sounds/bridal_chorus.mp3'
			this.audio.load()
			this.isAudioLoaded = true
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

	private async postVersions() {
		const frontendVersion: string = packageJson.version
		const { version: backendVersion } = await this.api.getVersion()
		this.backendVersion = backendVersion
		this.frontendVersion = frontendVersion
		const styleGreen = 'color:white; background:#28d79f'
		const stylePink = 'color:white; background:#B14D9A'
		const stylePurple = 'color:white; background:#2B3060'
		const styleOrange = 'color:white; background:#f48042'
		console.log(`%c 🤵‍♀️👰🏻‍♂️ %c KokkSlat %c kokkslat-wedding Frontend %c v${frontendVersion} `, styleGreen, stylePink, stylePurple, styleOrange)
		console.log(`%c 🤵‍♀️👰🏻‍♂️ %c KokkSlat %c kokkslat-wedding API      %c v${backendVersion} `, styleGreen, stylePink, stylePurple, styleOrange)
	}

	private showDebug() {
		const value = this.debugSubject.getValue()
		this.debugSubject.next(value + 1)

		if (value === 5) {
			this.openModal(ModalType.DEBUG)
		}

		this.startDebugCountdown()
	}

	private startDebugCountdown() {
		setTimeout(() => {
			this.debugSubject.next(0)
		}, 5000)
	}
}
