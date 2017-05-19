import {includes} from 'lodash'
export default class BaseInput {
    constructor(props, children) {
        this.props = props
        this.children = children
        this.events = {}
        this.name = props.name
        this.dfd = $.Deferred()
        Object.defineProperty(this, 'value', {
            get: () => {
                if (this.$e === undefined) 
                    return
                return this.getValue()
            },
            set: (v) => {
                if (this.$e === undefined)
                    return
                this.setValue(v)
            }
        })
    }
    renderAttr(ignore = []) {
        let attr = Object.keys(this.props).filter(k => !includes(ignore, k)).reduce((a, k) => {
            return a + ` ${k}="${this.props[k]}"`
        }, '')
        return attr
    }
    render(target) {
        $(target).after(this.$e).remove()
        if (this.props.defaultvalue) {
            this.value = this.props.defaultvalue
        }
        if (this['componentDidMount']) {
            this['componentDidMount'](this.dfd)
        } else {
            this.dfd.resolve()
        }
        return this.dfd.promise()
    }
    show(show) {
        if (show) {
            this.$e.show()
        } else {
            this.$e.hide()
        }
    }
    enable(enable) {
        if (enable) {
            this.$e.removeAttr('disabled')
        } else {
            this.$e.attr('disabled', 'disabled')
        }
    }
    getValue() {
        return this.$e.val()
    }
    setValue(v) {
        this.$e.val(v)
    }
    method(method, ...parms) {
        if (method !== 'method' && this[method] !== undefined) {
            this[method].apply(this, parms)
        }
    }
    clear() {
        this.setValue(undefined)
    }
    l20n(propName) {
        let l20n = $(this.props[propName])
        let value = ''
        if (l20n.data('l10n-id')) {
            return document['l10n'].formatValue(l20n.data('l10n-id'), l20n.data('l10n-args'))
        }
    }
    isL20n(propName) {
        let l20n = $(this.props[propName])
        return l20n.data('l10n-id') !== undefined
    }
}
