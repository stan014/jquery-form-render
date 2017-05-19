import {isArray} from 'lodash'
import BaseInput from './base'
export default class extends BaseInput {
    constructor(props) {
        super(props)
        this.$e = $(`<select${this.renderAttr(['key', 'value', 'defaultvalue'])}/>`)
    }
    componentDidMount(dfd) {
        this.$e.on('change', this.onChange.bind(this))
        dfd.resolve()
    }
    setValue(v) {
        let value = this.value
        this.$e.val(v || this.props.defaultvalue)
        if (v !== value) {
            this.$e.trigger('change')
        }
    }
    options(options) {
        if (options === undefined)
            return
        let current = this.value
        let $options = []
        if (isArray(options)) {
            $options = options.map(o => this.generateOption(o))
        } else if (typeof options === 'object') {
            $options = Object.keys(options).map(text => {
                return {text, value: options[text]}
            })
        }
        let currentValue = this.value
        this.$e.html($options.reduce((h, {text, value}) => {
            return h + `<option value="${value}" data-content='${text}'>${text}</option>`
        }, ''))
        if (this.value != current) {
            this.onChange()
        }
    }
    onChange() {
        if (this.events['onChange'] !== undefined) {
            this.events['onChange'](this.value)
        }
    }
    generateOption(option) {
        const {text, value} = this.props
        if (typeof option === 'object') {
            return {
                text: option[text || 'text'],
                value: option[value || 'value']
            }
        } else {
            return {text: option, value: option}
        }
    }
}
