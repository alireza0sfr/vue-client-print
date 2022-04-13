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
  }
}

export default mixins