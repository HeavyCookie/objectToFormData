// @flow
import objectToFormData, { formatPath } from '../src/objectToFormData'

describe('#formatPath', () => {
  test('with only 1 element', () => {
    expect(formatPath(['bla'])).toEqual('bla')
  })

  test('with `n` elements', () => {
    expect(formatPath(['bla', 'bla'])).toEqual('bla[bla]')
  })
})

describe('#convert', () => {
  test('flat object', () => {
    const object = { test: 'test' }
    expect(objectToFormData(object).get('test')).toEqual('test')
  })

  test('object in an object', () => {
    const object = { test: { test: 'test' } }
    expect(objectToFormData(object).get('test[test]')).toEqual('test')
  })

  test('object with an array value', () => {
    const myArray = ['value 1', 'value 2']
    const object = { test: myArray }
    expect(objectToFormData(object).getAll('test[]')).toEqual(myArray)
    expect(objectToFormData(object).get('test[]')).toEqual(myArray[0])
  })

  test('object with a file field', () => {
    const myFile = new Blob(['bla'], { type: 'text/plain' })
    const myObject = { test: myFile }
    const field = objectToFormData(myObject).get('test')

    expect(field).toBeInstanceOf(Blob)
  })

  test('object with a boolean', () => {
    const object = { test: true }
    expect(objectToFormData(object).get('test')).toEqual('true')
  })

  test('object with array of number return string array', () => {
    const object = { test: [1, 2] }
    const result = objectToFormData(object)

    expect(result.getAll('test[]')).toEqual([1, 2].map(i => i.toString()))
    expect(result.get('test[]')).toEqual("1")
  })

  test('object with an array of object', () => {
    const object = { test: [{key1: 'val1'}, {key2: 'val2'}]}
    const result = objectToFormData(object)

    expect(result.get('test[0][key1]')).toEqual('val1')
  })
})
