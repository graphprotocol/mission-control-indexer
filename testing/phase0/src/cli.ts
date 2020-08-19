#!/usr/bin/env ts-node

import * as path from 'path'
import * as yargs from 'yargs'

yargs
  .scriptName('cli.ts')
  .usage('$0 <cmd> [args]')
  .command(require('./cmds/prometheus-config').default)
  .command(require('./cmds/test').default)
  .help()
  .demandCommand(1)
  .parse()
