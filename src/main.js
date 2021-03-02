const { program } = require('commander')
const ActionMap = require('./config/action-map')

// ****** git ******
import pullRequest from './git/pull-request'
import cherryPick from './git/cherry-pick'

// ****** webpack ******
import dev from '../src/webpack/dev'
import build from '../src/webpack/build'

Object.keys(ActionMap).forEach(action => {
  if (ActionMap[action].options) {
    Object.keys(ActionMap[action].options).forEach(option => {
      let obj = ActionMap[action].options[option]

      program.option(obj.flags, obj.description, obj.defaultValue)
    })
  }

  program
    .command(action)
    .description(ActionMap[action].description)
    .alias(ActionMap[action].alias)
    .action(() => {
      const opts = program.opts()

      switch (action) {
        case 'pull-request':
          pullRequest()
          break;
        case 'cherry-pick':
          cherryPick()
          break;
        case 'dev':
          dev(opts)
          break;
        case 'build':
          build(opts)
          break
        default:
          break;
      }
    })
})

// 设置当前项目版本
program
  .version(require('../package.json').version, '-v --version')
  .parse(process.argv)

// yxy-cli命令后不带参数的时候，输出辅助信息
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
