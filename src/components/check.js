import BaseInput from './base'
export default class extends BaseInput {
    constructor(props) {
        super(props)
        this.$e = $(`<input type="checkbox"${this.renderAttr()}>`)
    }
    getValue() {
        return this.$e.is(':checked')
    }
    setValue(v) {
        this.$e.prop('checked', v === true)
    }
}
