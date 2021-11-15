import crypto from 'crypto'

const CryptoUtil = {
  keyphrase: process.env.VUE_APP_KEYPHRASE,
  iterationCount: 1078,
  encrypt: function (msg) {
    const salt = crypto.randomBytes(64)
    const key = crypto.pbkdf2Sync(Buffer.from(this.keyphrase, 'utf-8'), salt, this.iterationCount, 32, 'sha512')
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(msg, 'utf-8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([salt, iv, encrypted, tag]).toString('base64')
  }
}

export default CryptoUtil
