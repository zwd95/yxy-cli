import inquirer from 'inquirer'
import ora from 'ora';
const util = require('util')
const exec = util.promisify(require('child_process').exec)

// 命令行交互
const prompt = (promptList) => {
  return new Promise(resolve => {
    inquirer
      .prompt(promptList)
      .then(answer => {
        resolve(answer);
      })
  })
}

// loadCmd v2.0
const loadCmd = async (cmd, text) => {
  const loading = ora()

  loading.start(`${text}：命令执行中...`)

  const res = await exec(cmd)

  loading.succeed(`${text}：命令执行完成`)
  return res
}

module.exports = {
  prompt,
  loadCmd
}
