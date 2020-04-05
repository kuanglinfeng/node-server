// 目标4：处理不存在的文件 （返回一个404页面）

import * as http from 'http'
import { IncomingMessage, ServerResponse } from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  const { pathname, search } = url.parse(path)

  const filename = pathname.substr(1)
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      console.log(error)
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
      response.end(data.toString())
    }
  })

})


server.listen(8888)