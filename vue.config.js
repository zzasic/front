const ansiRegex = require('ansi-regex')

module.exports = {
  // 개발서버 설정
  devServer: {
    // 프록시 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8380'
      },
      '/oamsso': {
        target: 'http://localhost:8380'
      },
      '/public': {
        target: 'http://localhost:8380'
      },
      '/ws': {
        target: 'http://localhost:8380'
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  transpileDependencies: [ansiRegex]
}
