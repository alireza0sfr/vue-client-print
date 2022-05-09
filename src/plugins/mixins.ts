var mixins: object = {
  methods: {
    /**
     * Converts given image to base64.
     * @param {Number} n - number of digits
     * @return {String} - id
     */
    idGenerator(n: number): string {
      return Math.random().toString(36).substr(2, n)
    },

    /**
     * Converts the given number to persian digits.
     * @param {Number} n - given number
     * @return {string} - converted number
     */
    toPersianDigits(n: number): string {
      console.log('n', n)
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

      return n.toString().replace(/\d/g, (x) => persianDigits[x])
    },

    /**
     * Check weather given item is object.
     * @param {any} item - given item to check.
     * @return {Boolean} - true if item is object.
     */
    isObject(item: any): boolean {
      return (item && typeof item === 'object' && !Array.isArray(item))
    },

    /**
     * Deep merge sources to target object recuresively.
     * @param {Object} target - Target object.
     * @param {Array} sources - Array of sources.
     * @return {Object} - Merged object.
     */
    merge(target: object, ...sources: object[]): object {

      if (!sources.length) return target
      const source = sources.shift()

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, {
              [key]: {}
            })
            this.merge(target[key], source[key])
          } else {
            Object.assign(target, {
              [key]: source[key]
            })
          }
        }
      }

      return this.merge(target, ...sources)
    }
  }
}

export default mixins