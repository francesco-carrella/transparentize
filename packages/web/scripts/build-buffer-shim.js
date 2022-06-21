class FakeBuffer extends Uint8ClampedArray {

  static from(arrayData) {
    return new this(arrayData)
  }

  static alloc(size) {
    return new this(size)
  }

}

window.Buffer = FakeBuffer