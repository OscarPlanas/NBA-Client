import * as bcu from 'bigint-crypto-utils';
import * as bc from 'bigint-conversion';

export interface MyRsaJsonPrivateKey {
    d: string // base64
    n: string // base64
  }

export class MyRsaPrivateKey {
    d: bigint;
    n: bigint;
   
    constructor(d: bigint,
        n: bigint,
        ){
            this.d = d;
            this.n = n;
        }
    sign (message: bigint): bigint {
        console.log("firmando");
        const s = bcu.modPow(message, this.d, this.n)
        return s
    }
    toJSON(): MyRsaJsonPrivateKey {
        return {
            d: bc.bigintToBase64(this.d),
            n: bc.bigintToBase64(this.n)
        }
    }
    static fromJSON(jsonKey: MyRsaJsonPrivateKey) {
        const d = bc.base64ToBigint(jsonKey.d)
        const n = bc.base64ToBigint(jsonKey.n)
        return new MyRsaPrivateKey(d, n)
    }
}