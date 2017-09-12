// @flow
export const formatPath = ([base, ...rest]: Array<string>): string => {
  if (rest.length > 0) {
    return `${base}[${rest.join('][')}]`
  }
  return base
}

const convert = (
  object: Object,
  previousPath: Array<string> = [],
  formData?: FormData
): FormData => {
  const form = formData || new FormData()

  Object.keys(object).forEach((key) => {
    const value = object[key]
    const fullPath = [...previousPath, key]

    // Array
    if (value instanceof Array) {
      const p = `${formatPath(fullPath)}[]`
      value.forEach((v) => {
        form.append(p, v)
      })
      // Blob/File
    } else if (value instanceof Blob || value instanceof File) {
      form.append(formatPath(fullPath), value)
      // String
    } else if (typeof value === 'string') {
      form.append(formatPath(fullPath), value)
      // Object
    } else if (value instanceof Object) {
      convert(value, fullPath, form)
    }
  })

  return form
}

export default convert
