import {Form} from '../src'
import MDCheckbox from './md-check'
$(() => {
    let form = new Form($('#app'))
    let template = `
    <div>text: <TextInput name="name"/></div>
    <div>useful: <Checkbox name="useful"/></div>
    <div>select: <SelectInput name="select"/></div>
    <div style="display:flex;">md-check: <MDCheckbox name="md"/></div>
    <div><button id="submit" type="button">submit</button></div>
  `
    form.render(template, {MDCheckbox}).done(() => {
        form.options('select', [1, 2, 3])
        form.find('#submit').click(() => {
            form.submit().done(data => {
                console.log(data)
            })
        })
    })
})
