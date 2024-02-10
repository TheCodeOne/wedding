import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'
import { NgModule, isDevMode } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { NxButtonModule } from '@aposin/ng-aquila/button'
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox'
import { NxDocumentationIconModule } from '@aposin/ng-aquila/documentation-icons'
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown'
import { NxFooterModule } from '@aposin/ng-aquila/footer'
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield'
import { NxGridModule } from '@aposin/ng-aquila/grid'
import { NxHeadlineModule } from '@aposin/ng-aquila/headline'
import { NxIconModule } from '@aposin/ng-aquila/icon'
import { NxInputModule } from '@aposin/ng-aquila/input'
import { NxLinkModule } from '@aposin/ng-aquila/link'
import { NxMessageModule } from '@aposin/ng-aquila/message'
import { NxModalModule } from '@aposin/ng-aquila/modal'
import { NxOverlayModule } from '@aposin/ng-aquila/overlay'
import { NxPopoverModule } from '@aposin/ng-aquila/popover'
import { NxSmallStageModule } from '@aposin/ng-aquila/small-stage'
import { NxNaturalLanguageFormModule } from '@aposin/ng-aquila/natural-language-form'
import { NxCardModule } from '@aposin/ng-aquila/card'

import { AppComponent } from './app.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component'
import { NaturalFormComponent } from './natural-form/natural-form.component'
import { GreetingComponent } from './greeting/greeting.component';
import { ServiceWorkerModule } from '@angular/service-worker'

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http)
}

@NgModule({
	declarations: [AppComponent, LanguageSwitcherComponent, NaturalFormComponent, GreetingComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientJsonpModule,
		HttpClientModule,
		ReactiveFormsModule,
		RouterModule.forRoot([]),
		NxButtonModule,
		NxCheckboxModule,
		NxDocumentationIconModule,
		NxDropdownModule,
		NxFooterModule,
		NxFormfieldModule,
		NxGridModule,
		NxHeadlineModule,
		NxIconModule,
		NxInputModule,
		NxLinkModule,
		NxMessageModule,
		NxModalModule,
		NxOverlayModule,
		NxPopoverModule,
		NxSmallStageModule,
		NxNaturalLanguageFormModule,
		NxCardModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
			defaultLanguage: 'de',
		}),
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
