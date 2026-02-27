export default async function* customReporter(source) {
  for await (const event of source) {
    const data = event.data
    if (!data) continue

    const indent = '  '.repeat(data.nesting || 0)

    switch (event.type) {
      case 'test:start':
        if (data.nesting === 0) {
          yield `\n\x1b[1m\x1b[34m▶ ${data.name}\x1b[0m\n`
        }
        break
      case 'test:pass':
        if (data.nesting > 0) {
          yield `${indent}\x1b[32m✔ ${data.name}\x1b[0m\n`
        }
        break
      case 'test:fail':
        const error = data.details?.error || data.details?.cause
        let report = `${indent}\x1b[31m✖ ${data.name}\x1b[0m\n`

        if (error) {
          let errorData = error.message

          if (error.actual !== undefined && error.expected !== undefined) {
            errorData = JSON.stringify({
              message: error.message,
              actual: error.actual,
              expected: error.expected,
              operator: error.operator
            }, null, 2)
          } else {
            const jsonMatch = error.message?.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                errorData = JSON.stringify(JSON.parse(jsonMatch[0]), null, 2)
              } catch {
                errorData = error.message
              }
            }
          }

          const formatted = errorData
            .split('\n')
            .map(line => `${indent}    ${line}`)
            .join('\n')

          report += `\x1b[31m${formatted}\x1b[0m\n`
        }

        process.stdout.write(report)
        process.exit(1)
        break
    }
  }
}