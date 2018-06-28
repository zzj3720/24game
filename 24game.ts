type Zero = {
    isZero: true
}

type Succ<T extends Num> = {
    pre: T
    isZero: false
}

type Num = Zero | { pre: Num, isZero: false }

type Pre<T extends Num> = T extends Succ<infer P> ? P : Zero

type Equal<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

type Equal1<A, B> = A extends B ? B extends A ? true : false : false

type TestNever = Equal1<never, number> // never
type TestNever1 = Equal<never, number> // false

type _4 = FromNumber<4>
type _5 = FromNumber<5>
type _6 = FromNumber<6>
// type A5 = Equal<_5, _6> // true
// type B5 = Equal<_4, _5>// false


type If<Cond, A, B> = Equal<Cond, true> extends true ? A : B

type ToBoolean<A> = If<A, true, false>

type And<A, B> = If<A, ToBoolean<B>, false>

type Or<A, B> = If<A, true, ToBoolean<B>>

type IsZero<T extends Num> = Equal<T, Zero>

type IsNever<T> = Equal<T, never>

// type UnarrayIncorrect<T> = T extends Array<infer P> ? UnarrayIncorrect<P> : T // error:Type alias 'UnarrayIncorret' circularly references itself.
// type UnarrayCorrect<T> = {
//     "is array": T extends Array<infer P> ? UnarrayCorrect<P> : never
//     "not array": T
// }[T extends any[] ? "is array" : "not array"]


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

type Add<A extends Num, B extends Num> = {
    "A is Zero": B
    "B is Zero": A
    "No Zero": Succ<Add<Pre<A>, B>>
}[If<IsZero<A>, "A is Zero", If<IsZero<B>, "B is Zero", "No Zero">>]

type _7 = Add<FromNumber<3>, FromNumber<4>> // Succ<Succ<Succ<Succ<Succ<Succ<Succ<Zero>>>>>>>

type Sub<A extends Num, B extends Num> = {
    "B is Zero": A
    "A is Zero": never
    "No Zero": Sub<Pre<A>, Pre<B>>
}[If<IsZero<B>, "B is Zero", If<IsZero<A>, "A is Zero", "No Zero">>]

// type _2 = Sub<_7, _5> // Succ<Succ<Zero>>
// type __never = Sub<_5, _6> // never
// type _0 = Sub<_5, _5> // Zero

type Mult<A extends Num, B extends Num> = MultHelper<A, B, Zero>

type MultHelper<A extends Num, B extends Num, R extends Num> = {
    "Has Zero": R
    "No Zero": MultHelper<Pre<A>, B, Add<B, R>> // '"No Zero"' is referenced directly or indirectly in its own type annotation.
}[If<Or<IsZero<A>, IsZero<B>>, "Has Zero", "No Zero">]

type _81 = Mult<FromNumber<9>, FromNumber<9>>

type Div<A extends Num, B extends Num> = {
    "B0": never
    "A0": Zero
    "No Zero": DivHelper<A, B, B, Zero>
}[If<Or<IsZero<B>, Or<IsNever<A>, IsNever<B>>>, "B0", If<IsZero<A>, "A0", "No Zero">>]

type DivHelper<A extends Num, B extends Num, S extends Num, R extends Num> = {
    "A0S0": Succ<R>
    "A0S+": never
    "A+S0": DivHelper<A, B, B, Succ<R>>
    "A+S+": DivHelper<Pre<A>, B, Pre<S>, R>
}[If<IsZero<A>, If<IsZero<S>, "A0S0", "A0S+">, If<IsZero<S>, "A+S0", "A+S+">>]

type _24 = Mult<FromNumber<4>, FromNumber<6>>
type exp1 = Add<FromNumber<8>, Add<FromNumber<8>, Mult<FromNumber<4>, FromNumber<2>>>> // 8 + 8 + (4 * 2) = 24
type exp2 = Add<FromNumber<9>, Add<FromNumber<6>, Mult<FromNumber<5>, FromNumber<2>>>> // 9 + 6 + (5 * 2) = 25
type exp3 = Add<FromNumber<9>, Add<FromNumber<6>, Mult<FromNumber<4>, FromNumber<2>>>> // 9 + 6 + (4 * 2) = 23
type ___r1 = IsZero<Sub<_24, exp1>> // true
type ___r2 = IsZero<Sub<_24, exp2>> // false
type ___r3 = IsZero<Sub<_24, exp2>> // false

// type DivHelper<A extends Num, B extends Num, S extends Num, R extends Num> = {
//     "A is Zero": {
//         "S is Zero": Succ<R>
//         "S is not Zero": never
//     }[If<IsZero<S>, "S is Zero", "S is not Zero">]
//     "A is not Zero": {
//         "S is Zero": DivHelper<A, B, B, Succ<R>>
//         "S is not Zero": DivHelper<Pre<A>, B, Pre<S>, R>
//     }[If<IsZero<S>, "S is Zero", "S is not Zero">]
// }[If<IsZero<A>, "A is Zero", "A is not Zero">]

type _3 = Div<FromNumber<6>, FromNumber<2>> // Succ<Succ<Succ<Zero>>>
type _0 = Div<FromNumber<0>, FromNumber<2>> // Zero
type ___never = Div<FromNumber<6>, FromNumber<0>> // never

type Z = []
type S<T extends Nat, U = (x: any, ...args: T) => void> = U extends (...args: infer P) => void ? P : never
type Nat = any[]


type NatToNumber<T extends Nat> = T["length"]
type NumberToNat<T extends number> = NumberToNatHelper<T, Z>
type NumberToNatHelper<T extends number, N extends Nat> = {
    "equal": N
    "not equal": NumberToNatHelper<T, S<N>>
}[If<Equal<N["length"], T>, "equal", "not equal">]

type Nat5 = NumberToNat<5> // [any, any, any, any, any]
type Number5 = NatToNumber<Nat5> // 5

// type PreNat<T extends Nat, U = (...args: T) => void> = U extends (x: any, ...args: infer P) => void ? P : never
type NumToNumber<T extends Num> = NumToNumberHelper<T, Z>
type NumToNumberHelper<N extends Num, Na extends Nat> = {
    "Zero": Na["length"]
    "Num": NumToNumberHelper<Pre<N>, S<Na>>
}[If<IsZero<N>, "Zero", "Num">]

type NumberToNum<T extends number> = NumberToNumHelper<T, [], Zero>
type NumberToNumHelper<T extends number, N extends Nat, R extends Num> = {
    "equal": R
    "not equal": NumberToNumHelper<T, S<N>, Succ<R>>
}[If<Equal<N["length"], T>, "equal", "not equal">]

type Num5 = NumberToNum<5> // Succ<Succ<Succ<Succ<Succ<Zero>>>>>
type __5 = NumToNumber<Num5> // 5
type ____r = NumToNumber<Sub<NumberToNum<99>, NumberToNum<20>>> // 79