import { pathToFileURL } from 'url'
import fs from 'fs'
import path from 'path'


const getInstances = async ({ path, suffix = '.controller.js' }) => {
 const files = readFilesRecursively(path)

  const instances = {}
  for (const file of files) {
    console.log(file)
    // if 
    const def = await import(pathToFileURL(file.url))
    
    console.log(file.url, Object.keys(file).length)
    
    if(!def.default && Object.keys(file).length === 0) 
      throw new Error(`Controller not found for ${key}. Use a default export`)

    const normalizedName = file.name.replace(suffix, '')

    instances[normalizedName] = def.default
  }

  return instances
}

const readFilesRecursively = (dir) => {
  const files = fs.readdirSync(dir)
  const result = []
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      readFilesRecursively(filePath)
    } else {
      result.push({ name: file, url: filePath })
    }
  })
  return result
}

const instances = await getInstances({ 
    path: './src/server/api/controller', 
    suffix: '.controller.js' 
})

console.log(instances)

// read files recursively

// get name and url by file
