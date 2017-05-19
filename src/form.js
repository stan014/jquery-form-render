import {
    values,
    forIn,
    isFunction,
    set,
    get,
    flatten,
    transform
} from 'lodash'
import Task from './task'
import components from './components'
export default class Form {
    constructor(container, validator = {}) {
        this.container = container
        this.dfd = $.Deferred()
        this.fields = {}
        this.error = {}
        this.errorElements = {}
        this.obsoletes = {}
        Object.defineProperty(this, 'data', {
            get: this.getData,
            set: this.setData
        })
        Object.defineProperty(this, 'viewMode', {
            set: v => values(this.fields).map(f => f.enable(v !== true))
        })
    }
    render(html, myComponents = {}) {
        this.container.html(html)
        let task = new Task()
        forIn({
            ...components,
            ...myComponents
        }, (v, k) => {
            this.initComponents(k, v, task)
        })
        task.run().done(() => {
            this.container.find('L20N').each((i, e) => {
                $(e).children().unwrap()
            })
            this.initError()
            this.dfd.resolve()
        })
        return this.dfd.promise()
    }
    submit(mapper = {}) {
        let dfd = $.Deferred()
        if (this.validateAll()) {
            dfd.resolve(this.getData(mapper))
        } else {
            dfd.reject(this.error)
        }
        return dfd.promise()
    }
    validate(name) {
        let validator = this.validator
        if (typeof validator === 'function') {
            validator = validator()
        }
        let result = true
        delete this.error[name]
        this.showAllError(name, true)
        if (this.obsoletes[name])
            return true
        if (validator && validator[name]) {
            forIn(validator[name], (handler, key) => {
                let value = this.fields[name].value
                let form = this.getData()
                if ((key === 'required' && this.requiredValidate(handler, value)) || (key !== 'required' && isFunction(handler) && handler(value, form))) {
                    this.showError(name, key, true)
                    return
                }
                this.error[name] = this.error[name] || {}
                this.error[name][key] = true
                this.showError(name, key, false)
                result = false
            })
        }
        return result
    }
    getValue(name) {
        if (this.fields[name] == undefined)
            return
        return this.fields[name].value
    }
    setValue(name, value = undefined) {
        if (this.fields[name] == undefined)
            return
        this.fields[name].value = value
    }
    validateAll() {
        let result = Object.keys(this.fields).reduce((r, name) => {
            let vr = this.validate(name)
            return r && vr
        }, true)
        return result
    }
    getData(mapper = {}) {
        let data = Object.keys(this.fields).reduce((d, name) => {
            if (this.obsoletes[name] !== undefined)
                return d
            let path = mapper[name] || name
            let value = this.fields[name].value
            if (!value || value === '')
                return d
            set(d, path, value)
            return d
        }, {})
        return data
    }
    setData(data, mapper = {}) {
        Object.keys(this.fields).map(name => this.setValue(name, get(data, name)))
        forIn(mapper, (name, path) => {
            this.setValue(name, get(data, path))
        })
    }
    field(name) {
        return this.fields[name]
    }
    enable(names, enable = true) {
        flatten([names]).map(name => this.fields[name] && this.fields[name].enable && this.fields[name].enable(enable))
    }
    obsolete(names, obsolete = true) {
        flatten([names]).map(name => {
            this.fields[name] && this.fields[name].show && this.fields[name].show(!obsolete)
            if (obsolete && this.fields[name]) {
                this.fields[name].value = undefined
                this.obsoletes[name] = true
                this.showAllError(name, true)
            } else {
                delete this.obsoletes[name]
            }
        })
    }
    show(names, show = true) {
        flatten([names]).map(name => this.fields[name] && this.fields[name].show && this.fields[name].show(show))
    }
    options(name, options) {
        this.fields[name] && this.fields[name].options && this.fields[name].options(options)
    }
    event(event, name, handler) {
        if (this.fields[name] === undefined)
            return
        this.fields[name].events[event] = handler
    }
    find(selector) {
        return this.container.find(selector)
    }
    method(names, ...parms) {
        flatten([names]).map(name => {
            this.fields[name] && this.fields[name].method.apply(this.fields[name], parms)
        })
    }
    reset(names = []) {
        values(this.fields).map(f => f.clear())
    }
    requiredValidate(handler, value) {
        if (handler === undefined)
            return true
        if (handler === true)
            return !Helper.StringHelper.isEmpty(value)
        if (typeof handler === 'string') {
            return !this.getValue(handler) || !Helper.StringHelper.isEmpty(value)
        }
        if (typeof handler === 'function') {
            return !handler() || !Helper.StringHelper.isEmpty(value)
        }
        return true
    }
    initComponents(key, component, task) {
        let inputs = this.container.find(key)
            let todo = inputs.length,
                count = 0,
                dfd = $.Deferred()
            for (var i = 0; i < inputs.length; i++) {
                let e = inputs[i]
                if (key != 'SwitchInput' && $(e).closest('SwitchInput').length > 0)
                    continue
                let props = this.getAttributes(e)
                if (props.name == undefined)
                    return
                if (typeof component === 'function') {
                    let input = new component(props, $(e).children())
                    this.fields[props.name] = input
                    task.push(input, input.render, e)
                }
            }
        }
        initError() {
            let errors = this.container.find('OnError')
            for (var i = 0; i < errors.length; i++) {
                let target = $(errors[i])
                let name = target.attr('name')
                let type = target.attr('type')
                let $e = target.children().unwrap().hide()
                set(this.errorElements, `['${name}'].${type}`, $e)
            }
        }
        showError(name, type, isValid) {
            let $e = get(this.errorElements, `['${name}'].${type}`)
            if ($e === undefined)
                return
            if (isValid) {
                $e.hide()
            } else {
                $e.show()
            }
        }
        showAllError(name, isValid) {
            let e = get(this.errorElements, `['${name}']`)
            values(e).map($e => {
                if (isValid) {
                    $e.hide()
                } else {
                    $e.show()
                }
            })
        }
        getAttributes(node) {
            let props = transform(node.attributes, function(attrs, attribute) {
                attrs[attribute.name] = attribute.value
            }, {})
            this.l20n(node, props)
            return props
        }
        l20n(node, props) {
            let l20n = $(node).parent('L20N')
            if (l20n[0]) {
                let id = l20n.attr('id')
                let target = l20n.attr('target')
                if (target) {
                    let args = {}
                    l20n.find('args').each((i, e) => {
                        let argId = $(e).attr('id')
                        if (argId) {
                            args[argId] = $(e).html()
                        }
                    }).remove()
                    if (props[target]) {
                        args.id = props[target]
                    }
                    props[target] = `<text data-l10n-id="${id}" data-l10n-args='${JSON.stringify(args)}'/>`
                }
            }
        }
    }
