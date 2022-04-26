# ts challenges

## 实现 Pick

```ts
type Mypick<T, K extends keyof T> = {
  [p in K]: T[p];
};
```

## 实现 readonly

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

## Tuple to Object

```ts
type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K;
};
```

## 第一个元素

```ts
type First<T extends any[]> = T extends [infer first, ...(infer reset)]
  ? first
  : never;
```

## Length of Tuple

```ts
type Length<T extends readonly any[]> = T["length"];
```

## exclude

```ts
type MyExclude<T, U> = T extends U ? never : T;
```

## 获取函数返回类型

不使用 ReturnType 实现 TypeScript 的 ReturnType<T> 泛型

```ts
type MyReturnType<T> = T extends (...arg: any[]) => infer R ? R : never;
```

## 实现 Omit

不使用 Omit 实现 TypeScript 的 Omit<T, K> 泛型。

```ts
type MyOmit<T, K> = {
  [U in keyof T as U extends K ? never : U]: T[U]
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
```
