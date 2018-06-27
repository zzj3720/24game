type Zero = {
    isZero: true
}

type Succ<T extends Num> = {
    pre: T
    isZero: false
}

type Num = Zero | { pre: Num, isZero: false }

type Pre<T extends Num> = T extends { pre: infer P, isZero: false } ? P : Zero

type _4 = Succ<Succ<Succ<Succ<Zero>>>>

interface Table {
    0: Zero
    1: Succ<this[0]>
    2: Succ<this[1]>
    3: Succ<this[2]>
    4: Succ<this[3]>
    5: Succ<this[4]>
    6: Succ<this[5]>
    7: Succ<this[6]>
    8: Succ<this[7]>
    9: Succ<this[8]>
}
type FromNumber<T extends number> = (Table & { [k: number]: never })[T]

type Z = []
type S<T extends Nat, U = (x: any, ...args: T) => void> = U extends (...args: infer P) => void ? P : never
type Nat = any[]


type NatToNumber<T extends Nat> = T["length"]
type NumberToNat<T extends number> = NumberToNatHelper<T, Z>
type NumberToNatHelper<T extends number, N extends Nat> = {
    "equal": N
    "not equal": NumberToNatHelper<T, S<N>>
}[N["length"] extends T ? "equal" : "not equal"]

type Nat5 = NumberToNat<5> // [any, any, any, any, any]

type Number5 = NatToNumber<Nat5> // 5

// type PreNat<T extends Nat, U = (...args: T) => void> = U extends (x: any, ...args: infer P) => void ? P : never
type NumToNumber<T extends Num> = NumToNumberHelper<T, Z>
type NumToNumberHelper<N extends Num, Na extends Nat> = {
    "Zero": Na["length"]
    "Num": NumToNumberHelper<Pre<N>, S<Na>>
}[N extends Zero ? "Zero" : "Num"]

type NumberToNum<T extends number> = NumberToNumHelper<T, [], Zero>
type NumberToNumHelper<T extends number, N extends Nat, R extends Num> = {
    "equal": R
    "not equal": NumberToNumHelper<T, S<N>, Succ<R>>
}[N["length"] extends T ? "equal" : "not equal"]

type Num5 = NumberToNum<5> // Succ<Succ<Succ<Succ<Succ<Zero>>>>>
type _5 = NumToNumber<Num5> // 5