import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Guests } from '../services/api.service'

@Component({
	selector: 'app-language-switcher',
	templateUrl: './language-switcher.component.html',
	styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements OnInit {
	@Input() guests: Guests = {} as Guests

	constructor(private translate: TranslateService) {}

	ngOnInit() {
		this.translate.setDefaultLang('de')
		const browserLang = navigator.language.split('-')[0]
		const predefinedLang = this.getPredefinedLanguage()
		const localStorageLang = this.getLocalStorageLanguage()

		if (localStorageLang) {
			this.translate.use(localStorageLang)
			console.log(`Setting language to: ${this.getCurrentLanguage()} - loaded from local storage`)
		} else if (predefinedLang) {
			this.translate.use(predefinedLang)
			console.log(`Setting language to: ${this.getCurrentLanguage()} - loaded from backend`)
		} else {
			this.translate.use(browserLang)
			console.log(`Setting language to: ${this.getCurrentLanguage()} - loaded from browser language`)
		}
	}

	changeLanguage(key: string): void {
		this.translate.use(key)
		localStorage.setItem('wedding_language', key)
	}

	getCurrentLanguage(): string {
		const languageToFlagMappping: Record<string, string> = {
			de: '🇩🇪',
			en: '🇺🇸',
			gr: '🇬🇷',
			lol: '🏳️‍🌈',
		}
		return languageToFlagMappping[this.translate.currentLang] || '🇩🇪'
	}

	getPredefinedLanguage(): string {
		return this.guests.language
	}

	getLocalStorageLanguage(): string | null {
		return localStorage.getItem('wedding_language')
	}
}
