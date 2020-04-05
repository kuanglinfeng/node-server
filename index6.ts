// 目标6：添加缓存选项（提示：Cache-Control）

import * as http from 'http'
import { IncomingMessage, ServerResponse } from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')
let cacheAge = 3600 * 24 * 265

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  const { pathname, search } = url.parse(path)

  // 过滤非GET请求
  if (method !== 'GET') {
    response.statusCode = 405
    response.end()
    return
  }
  let filename = pathname.substr(1)
  if (filename === '') {
    filename = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -2) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data.toString())
        })
      } else {
        response.statusCode = 500
        response.end('server is busy')
      }
    } else {
      // 返回文件内容，设置一下缓存
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`)
      response.end(data.toString())
    }
  })

})


server.listen(8888)