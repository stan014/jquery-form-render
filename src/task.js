export default class Task {

    constructor() {
        this.dfd = $.Deferred()
        this.queue = []
        this.result = []
        Object.defineProperty(this, 'hasError', {
            get: () => {
                return this.result.filter(({done}) => !done).length === 0
            }
        })
    }

    push(context, handler, ...parms) {
        this.queue.push({
            context,
            handler,
            parms
        })
    }

    run(async = true) {
        this.dfd = $.Deferred()
        if (async) {
            this.queue.map(i => {
                this.execute(i)
            })
        }
        else {
            let sync = $.Deferred()
            let s = $.when(sync.promise())
            this.queue.map(i => {
                s = s.then(() => {
                    return this.execute(i)
                })
            })
            sync.resolve()
        }
        return this.dfd.promise()
    }

    execute({context, handler, parms}) {
        let dfd = $.Deferred()
        handler.apply(context, parms).done(dr => {
            this.result.push({
                done: true,
                parms,
                result: dr
            })
        }).fail(fr => {
            this.result.push({
                done: false,
                parms,
                result: fr
            })
        }).always(() => {
            dfd.resolve()
            if (this.result.length === this.queue.length) {
                this.dfd.resolve(this.result)
            }
        })
        return dfd
    }
}
