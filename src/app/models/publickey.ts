import * as bcu from 'bigint-crypto-utils';
import * as bc from 'bigint-conversion';

export interface MyRsaJsonPublicKey {
    e: string // base64
    n: string // base64
  }

export class MyRsaPublicKey {
    e: bigint;
    n: bigint;

    constructor(e2: bigint, n2: bigint) {
        this.e = e2;
        this.n = n2;
    }

    encrypt(message: bigint): bigint {
        console.log("encriptando");
        const c = bcu.modPow(message, this.e, this.n);
        return c
    }
    
    verify(s: bigint): bigint {
        const m = bcu.modPow(s, this.e, this.n)
        return m
    }

    toJSON(): MyRsaJsonPublicKey {
        return {
            e: bc.bigintToBase64(this.e),
            n: bc.bigintToBase64(this.n)
        }
    }

    static fromJSON(jsonKey: MyRsaJsonPublicKey) {
        const e = bc.base64ToBigint(jsonKey.e)
        const n = bc.base64ToBigint(jsonKey.n)
        return new MyRsaPublicKey(e, n)
    }
}
