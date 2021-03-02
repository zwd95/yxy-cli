module.exports = {
  'pull-request': {
    description: '向主工程提交合并请求前的步骤。。。',
    usages: [ // 使用方法
      'yxy-cli pull-request',
      'y-cli pull-request',
      'yxy pull-request'
    ],
    alias: 'pr' // 命令简称
  },

  'cherry-pick': {
    description: '合并分支记录',
    usages: [
      'yxy-cli cherry-pick',
      'y-cli cherry-pick',
      'yxy cherry-pick'
    ],
    alias: 'cp'
  },

  'dev': {
    description: '本地启动项目',
    usages: [
      'yxy-cli dev',
      'y-cli dev',
      'yxy dev'
    ],

    options: [
      {
        flags: '-p --port <port>',
        description: '端口',
        defaultValue: 3000
      },
      {
        flags: '-e --env_config <env_config>',
        description: '配置文件名字',
        defaultValue: ''
      }
    ],

    alias: 'd'
  },

  'build': {
    description: '打包项目',
    usages: [
      'yxy-cli build',
      'y-cli build',
      'yxy build'
    ],

    alias: 'b'
  },

  // 'start': {
  //   description: 'npm run dev'
  // },

  // 'build': {
  //   description: '打包项目'
  // }
}
