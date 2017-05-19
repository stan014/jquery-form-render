import BaseInput from './base'
export default class extends BaseInput {
    constructor(props) {
        super(props)
        this.$e = $(`<textarea${this.renderAttr()}/>`)
    }
}
