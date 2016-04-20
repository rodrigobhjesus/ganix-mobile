module.exports = ['$translateProvider',
    function($translateProvider) {
      $translateProvider
      .useStaticFilesLoader({
        prefix: 'js/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'pt', 'es'], {
        'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
        'pt' : 'pt', 'pt_BR': 'pt', 
        'es' : 'es'
      })
      .preferredLanguage('pt')
      .fallbackLanguage('pt')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters');
    }
];
