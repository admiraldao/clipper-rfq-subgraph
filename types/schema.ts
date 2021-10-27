// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }

  get txCount(): BigInt {
    let value = this.get("txCount");
    return value.toBigInt();
  }

  set txCount(value: BigInt) {
    this.set("txCount", Value.fromBigInt(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    return value.toBigDecimal();
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get volumeUSD(): BigDecimal {
    let value = this.get("volumeUSD");
    return value.toBigDecimal();
  }

  set volumeUSD(value: BigDecimal) {
    this.set("volumeUSD", Value.fromBigDecimal(value));
  }

  get tvl(): BigDecimal {
    let value = this.get("tvl");
    return value.toBigDecimal();
  }

  set tvl(value: BigDecimal) {
    this.set("tvl", Value.fromBigDecimal(value));
  }

  get tvlUSD(): BigDecimal {
    let value = this.get("tvlUSD");
    return value.toBigDecimal();
  }

  set tvlUSD(value: BigDecimal) {
    this.set("tvlUSD", Value.fromBigDecimal(value));
  }
}

export class Swap extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Swap entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Swap entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Swap", id.toString(), this);
  }

  static load(id: string): Swap | null {
    return store.get("Swap", id) as Swap | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get transaction(): string {
    let value = this.get("transaction");
    return value.toString();
  }

  set transaction(value: string) {
    this.set("transaction", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get inToken(): string {
    let value = this.get("inToken");
    return value.toString();
  }

  set inToken(value: string) {
    this.set("inToken", Value.fromString(value));
  }

  get outToken(): string {
    let value = this.get("outToken");
    return value.toString();
  }

  set outToken(value: string) {
    this.set("outToken", Value.fromString(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get recipient(): Bytes {
    let value = this.get("recipient");
    return value.toBytes();
  }

  set recipient(value: Bytes) {
    this.set("recipient", Value.fromBytes(value));
  }

  get origin(): Bytes {
    let value = this.get("origin");
    return value.toBytes();
  }

  set origin(value: Bytes) {
    this.set("origin", Value.fromBytes(value));
  }

  get amountIn(): BigDecimal {
    let value = this.get("amountIn");
    return value.toBigDecimal();
  }

  set amountIn(value: BigDecimal) {
    this.set("amountIn", Value.fromBigDecimal(value));
  }

  get amountOut(): BigDecimal {
    let value = this.get("amountOut");
    return value.toBigDecimal();
  }

  set amountOut(value: BigDecimal) {
    this.set("amountOut", Value.fromBigDecimal(value));
  }

  get amountInUSD(): BigDecimal {
    let value = this.get("amountInUSD");
    return value.toBigDecimal();
  }

  set amountInUSD(value: BigDecimal) {
    this.set("amountInUSD", Value.fromBigDecimal(value));
  }

  get amountOutUSD(): BigDecimal {
    let value = this.get("amountOutUSD");
    return value.toBigDecimal();
  }

  set amountOutUSD(value: BigDecimal) {
    this.set("amountOutUSD", Value.fromBigDecimal(value));
  }

  get pricePerInputToken(): BigDecimal {
    let value = this.get("pricePerInputToken");
    return value.toBigDecimal();
  }

  set pricePerInputToken(value: BigDecimal) {
    this.set("pricePerInputToken", Value.fromBigDecimal(value));
  }

  get pricePerOutputToken(): BigDecimal {
    let value = this.get("pricePerOutputToken");
    return value.toBigDecimal();
  }

  set pricePerOutputToken(value: BigDecimal) {
    this.set("pricePerOutputToken", Value.fromBigDecimal(value));
  }

  get transactionSource(): string {
    let value = this.get("transactionSource");
    return value.toString();
  }

  set transactionSource(value: string) {
    this.set("transactionSource", Value.fromString(value));
  }

  get logIndex(): BigInt | null {
    let value = this.get("logIndex");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set logIndex(value: BigInt | null) {
    if (value === null) {
      this.unset("logIndex");
    } else {
      this.set("logIndex", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Pair extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Pair entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Pair entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Pair", id.toString(), this);
  }

  static load(id: string): Pair | null {
    return store.get("Pair", id) as Pair | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asset0(): string {
    let value = this.get("asset0");
    return value.toString();
  }

  set asset0(value: string) {
    this.set("asset0", Value.fromString(value));
  }

  get asset1(): string {
    let value = this.get("asset1");
    return value.toString();
  }

  set asset1(value: string) {
    this.set("asset1", Value.fromString(value));
  }

  get txCount(): BigInt {
    let value = this.get("txCount");
    return value.toBigInt();
  }

  set txCount(value: BigInt) {
    this.set("txCount", Value.fromBigInt(value));
  }

  get volumeUSD(): BigDecimal {
    let value = this.get("volumeUSD");
    return value.toBigDecimal();
  }

  set volumeUSD(value: BigDecimal) {
    this.set("volumeUSD", Value.fromBigDecimal(value));
  }

  get swaps(): Array<string> {
    let value = this.get("swaps");
    return value.toStringArray();
  }

  set swaps(value: Array<string>) {
    this.set("swaps", Value.fromStringArray(value));
  }
}

export class TransactionSource extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TransactionSource entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TransactionSource entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TransactionSource", id.toString(), this);
  }

  static load(id: string): TransactionSource | null {
    return store.get("TransactionSource", id) as TransactionSource | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get txCount(): BigInt {
    let value = this.get("txCount");
    return value.toBigInt();
  }

  set txCount(value: BigInt) {
    this.set("txCount", Value.fromBigInt(value));
  }

  get swaps(): Array<string> {
    let value = this.get("swaps");
    return value.toStringArray();
  }

  set swaps(value: Array<string>) {
    this.set("swaps", Value.fromStringArray(value));
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transaction", id.toString(), this);
  }

  static load(id: string): Transaction | null {
    return store.get("Transaction", id) as Transaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get gasUsed(): BigInt {
    let value = this.get("gasUsed");
    return value.toBigInt();
  }

  set gasUsed(value: BigInt) {
    this.set("gasUsed", Value.fromBigInt(value));
  }

  get gasPrice(): BigInt {
    let value = this.get("gasPrice");
    return value.toBigInt();
  }

  set gasPrice(value: BigInt) {
    this.set("gasPrice", Value.fromBigInt(value));
  }

  get swaps(): Array<string> {
    let value = this.get("swaps");
    return value.toStringArray();
  }

  set swaps(value: Array<string>) {
    this.set("swaps", Value.fromStringArray(value));
  }
}
