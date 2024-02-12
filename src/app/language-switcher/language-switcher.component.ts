import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
	selector: 'app-language-switcher',
	templateUrl: './language-switcher.component.html',
	styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
	constructor(private translate: TranslateService) {
		const userLang = navigator.language.split('-')[0]
		console.log(`Setting language to: ${userLang}`)

		translate.setDefaultLang('de')
		translate.use(userLang)
	}

	changeLanguage(key: string): void {
		this.translate.use(key)
	}

	getCurrentLanguage(): string {
		const languageToFlagMappping: Record<string, string> = {
			de: '🇩🇪',
			en: '🇺🇸',
			gr: '🇬🇷',
		}
		return languageToFlagMappping[this.translate.currentLang] || '🇩🇪'
	}
}
