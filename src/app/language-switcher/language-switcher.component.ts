import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
	selector: 'app-language-switcher',
	templateUrl: './language-switcher.component.html',
	styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
	constructor(private translate: TranslateService) {
		translate.setDefaultLang('de')
		translate.use('de')
	}
	changeLanguage(key: string): void {
		this.translate.use(key)
	}
}
