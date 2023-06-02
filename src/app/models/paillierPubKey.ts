import * as bc from 'bigint-conversion'
import * as bcu from 'bigint-crypto-utils'

export interface MyJsonPaillierPublicKey {
    n: string // base64
    _n2: string // base64
    g: string // base64
}

export class MyPaillierPublicKey {
    readonly n: bigint
    readonly g: bigint

    readonly _n2: bigint

   
    constructor(n: bigint, g: bigint) {
        this.n = n
        this._n2 = this.n ** 2n 
        this.g = g
    }

    get bitLength(): number {
        return bcu.bitLength(this.n)
    }

    encrypt(m: bigint, r?: bigint): bigint {
        if (r === undefined) {
            do {
                r = bcu.randBetween(this.n)
            } while (bcu.gcd(r, this.n) !== 1n)
        }
        return (bcu.modPow(this.g, m, this._n2) * bcu.modPow(r, this.n, this._n2)) % this._n2
    }

    addition(...ciphertexts: bigint[]): bigint {
        return ciphertexts.reduce((sum, next) => sum * next % this._n2, 1n)
    }

    plaintextAddition(ciphertext: bigint, ...plaintexts: bigint[]): bigint {
        return plaintexts.reduce((sum, next) => sum * bcu.modPow(this.g, next, this._n2) % this._n2, ciphertext)
    }

    multiply(c: bigint, k: bigint | number): bigint {
        return bcu.modPow(c, k, this._n2)
    }

    toJSON() {
        return {
            n: bc.bigintToBase64(this.n),
            _n2: bc.bigintToBase64(this._n2),
            g: bc.bigintToBase64(this.g)
        }
    }
    static fromJSON(jsonKey: any) {
        const n = bc.base64ToBigint(jsonKey.n)
        const g = bc.base64ToBigint(jsonKey.g)
        return new MyPaillierPublicKey(n, g)
    }
}