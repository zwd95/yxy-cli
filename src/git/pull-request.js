import symbol from 'log-symbols'
import chalk from 'chalk'
import { loadCmd, prompt } from '../utils'
import ora from 'ora'

const promptList1 = [
  {
    type: 'string',
    name: 'branchName',
    message: '请输入要获取提交记录的分支名称'
  }
]

const promptList2 = [
  {
    type: 'string',
    name: 'num',
    message: '请输入要获取最近多少条提交记录（默认最近两条）',
    default: '2'
  }
]

const promptList3 = [
  {
    type: 'string',
    name: 'commitId',
    message: '请复制要合并的 commit id'
  }
]

const getRemote = async () => {
  const { stdout } = await loadCmd('git remote -v', '')
  const str = stdout.split('\n')[0]
  const url = str.match(/http.*.git/g)[0]

  return url
}

const pullRequest = async() => {
  const loading = ora()

  // loading.start('脚本执行...')

  try {
    await loadCmd('git checkout eco', '切换 eco 分支')
    const { branchName } = await prompt(promptList1)

    if (branchName === '') {
      console.log(symbol.error, chalk.red('分支名称不能为空'))
      process.exit(1)
    }

    let { num } = await prompt(promptList2)

    if (num === '') {
      num = 2
    }

    const { stdout } = await loadCmd(`git log -${num} ${branchName}`, '查找提交记录')

    console.log(symbol.info, chalk.green('\n' + res.stdout))

    const { commitId } = await prompt(promptList3)

    if (commitId === '') {
      console.log(symbol.error, chalk.yellow('commit id 不能为空'))
      process.exit(1)
    }

    await loadCmd(`git cherry-pick ${commitId}`, '合并 commit id')
    await loadCmd('git add .', '执行 git add')

    try {
      await loadCmd('git commit -m "merge"', '执行 git commit')
    } catch (err) {
      await loadCmd('git push --set-upstream origin eco', '执行 git push')
      loading.succeed(`请到代码仓库：${await getRemote()} 提交 pull request`)
      loading.succeed('脚本执行完毕...')
      process.exit(1)
    }

    await loadCmd('git push --set-upstream origin eco', '执行 git push')
    loading.succeed(`请到代码仓库：${await getRemote()} 提交 pull request`)
    loading.succeed('脚本执行完毕...')

  } catch (err) {
    console.log(symbol.error, chalk.red(err))
    loading.warn('脚本执行失败...')
    process.exit(1)
  }
}

module.exports = pullRequest
