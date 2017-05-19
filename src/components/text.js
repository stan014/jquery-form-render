import BaseInput from './base'
export default class extends BaseInput {
    constructor(props) {
        super(props)
        this.$e = $(`<input type="text"${this.renderAttr()}/>`)
    }
}
