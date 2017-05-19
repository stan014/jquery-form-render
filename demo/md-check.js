import {Checkbox} from '../src'
export default class MDCheckbox extends Checkbox {
     constructor( props) {
        super(props)
        this.props['class'] = 'md-checkbox ' + (this.props['class'] || '')
        const {label, name} = this.props
        this.$e = $(`<div data-form=${name} ${this.renderAttr(['name', 'label'])}>
            <input id=${name} type="checkbox" class="md-check">
            <label for="${name}">
                <span></span>
                <span class="check"></span>
                <span class="box"></span>${label || ''}</label>
        </div>`)
    }

     getValue() {
        return this.$e.find('input').is(':checked')
    }

     setValue(v) {
        this.$e.find('input').prop('checked', v === true)
    }

     enable(enable) {
        if (enable) {
            this.$e.find('input').removeAttr('disabled')
        }
        else {
            this.$e.find('input').attr('disabled', 'disabled')
        }
    }
}
