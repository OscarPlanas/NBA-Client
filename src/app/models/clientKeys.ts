import * as bcu from 'bigint-crypto-utils'
import * as bc from 'bigint-conversion'
import { MyRsaPublicKey } from './publickey'
import { MyRsaPrivateKey } from './privatekey'

export interface MyRsaKeys {
  publicKey: MyRsaPublicKey
  privateKey: MyRsaPrivateKey
} 

export class MyRsaKeys {
  static generateMyRsaKeys = async() => {
    const bitlength = 2048
    const p = await bcu.prime(Math.floor(bitlength / 2))
    const q = await bcu.prime(Math.floor(bitlength / 2) + 1)
    const n = p * q
    const phi = (p - 1n) * (q - 1n)
    const e = 65537n
    const d = await bcu.modInv(e, phi)

    return {
      publicKey: new MyRsaPublicKey(e, n),
      privateKey: new MyRsaPrivateKey(d, n)
    }
  }
}
