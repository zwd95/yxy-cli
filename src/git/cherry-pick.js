import symbol from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import { loadCmd, prompt } from '../utils'

const promptList1 = [
  {
    type: 'input',
    name: 'branchName',
    message: '请输入查看分支记录名称',
    validate: function (input) {
      const done = this.async()

      if (!input) {
        done('请输入分支名称')
        return
      }

      done(null, true)
    }
  }
]

const promptList2 = [
  {
    type: 'input',
    name: 'commitId',
    message: '请复制要提交的 commit id',
    validate: function (input) {
      const done = this.async()

      if (!input) {
        done('请输入 commit id')
        return
      }

      done(null, true)
    }
  }
]

const cherryPick = async () => {
  try {
    const loading = ora()
    const { branchName } = await prompt(promptList1)
    const { stdout } = await loadCmd(`git log -2 ${branchName}`, '执行 git log')

    console.log(chalk.green(stdout))

    const { commitId } = await prompt(promptList2)

    await loadCmd(`git cherry-pick ${commitId}`, '执行 git cherry-pick')

    try {
      await loadCmd('git commit -m "merge"', '执行 git commit')
    } catch (err) {
      await loadCmd(`git push`, '执行 git push')
      loading.succeed('脚本执行完毕...')
      process.exit(1)
    }

  } catch (err) {
    console.log(chalk.red(err))
    console.log(symbol.error, chalk.red('脚本执行失败...'))
    process.exit(1)
  }
}

module.exports = cherryPick
