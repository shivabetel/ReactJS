class BaseStack {
  constructor () {
    if (this.instance) {
      return this.instance
    }
    this.stack = []
    this.instance = this
    return this
  }

  push (obj = {}) {
    let stack = this.stack
    return stack.push(obj)
  }

  peek (peekTo = null) {
    let stack = this.stack
    if (peekTo) {
      return stack.slice(peekTo - 1, peekTo)
    }
    return stack.slice(0, 1)
  }

  pop () {
    let stack = this.stack
    return stack.splice(0, 1)
  }

  clear () {
    this.stack = []
  }

  getStackSize () {
    return this.stack.length
  }
}
export default BaseStack
