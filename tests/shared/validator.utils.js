import assert from 'node:assert/strict'

export const validate = (data, schema) => {
  for (const key in schema) {
    const expectedType = schema[key]
    const actualValue = data[key]

    if (typeof expectedType === 'object' && expectedType !== null) {
      validate(actualValue, expectedType)
    } else {
      assert.strictEqual(
        typeof actualValue, 
        expectedType, 
        `Property "${key}" should be ${expectedType} but got ${typeof actualValue}`
      )
    }
  }
}