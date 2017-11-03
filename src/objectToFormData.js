// @flow
export const formatPath = ([base, ...rest]: Array<string>): string => {
  if (rest.length > 0) {
    return `${base}[${rest.join('][')}]`
  }
  return base
}

type SimpleValues = File | Blob | string | boolean | number
type ArrayValues = Array<SimpleValues | ArrayValues | ObjectValues>
type ObjectValues = {[k: string]: SimpleValues | ArrayValues | ObjectValues}

const isValidValue = (value: any): boolean =>
  ['string', 'boolean', 'number'].includes(typeof value)
    || value instanceof Array
    || value instanceof Object
    || value instanceof Blob
    || value instanceof File

const convert = (
  value: ObjectValues | ArrayValues | SimpleValues,
  path: Array<string> = [],
  formData?: FormData
): FormData => {
  const form = formData || new FormData()
  // Array
  if (value instanceof Array) {
    value.forEach((v, i) => {
      if (v instanceof Object && !(v instanceof Blob || v instanceof File)) {
        // $FlowFixMe
        convert(v, [...path, i.toString()], form)
      } else {
        // $FlowFixMe
        convert(v, [...path, ''], form)
      }
    })
    // Blob/File
  } else if (value instanceof Blob || value instanceof File) {
    form.append(formatPath(path), value)
    // String
  } else if (typeof value === 'string') {
    form.append(formatPath(path), value)
    // Object
  } else if (typeof value === 'boolean' || typeof value === 'number') {
    form.append(formatPath(path), value.toString())
  } else if (value instanceof Object) {
    Object.entries(value).forEach(([k, v]) => {
      if(isValidValue(v)) {
        // $FlowFixMe
        convert(v, [...path, k], form)
      }
    })
  }

  return form
}

export default convert
