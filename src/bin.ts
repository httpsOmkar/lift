#!/usr/bin/env ts-node

/**
 * Dependencies
 */
import { CLI } from './cli/CLI'
import { isError } from './cli/utils'
import { LiftCommand } from './cli/commands/LiftCommand'
import { LiftCreate } from './cli/commands/LiftCreate'
import { LiftUp } from './cli/commands/LiftUp'
import { HelpError } from './cli/Help'
import { Env } from './cli/Env'

/**
 * Main function
 */
async function main(): Promise<number> {
  // load the environment
  const env = await Env.load(process.env, process.cwd())
  if (isError(env)) {
    console.error(env)
    return 1
  }
  // create a new CLI with our subcommands
  const cli = CLI.new({
    lift: LiftCommand.new({
      create: LiftCreate.new(env),
      up: LiftUp.new(env),
    }),
  })
  // parse the arguments
  var result = await cli.parse(process.argv.slice(2))
  if (result instanceof HelpError) {
    console.error(result.message)
    return 1
  } else if (isError(result)) {
    console.error(result)
    return 1
  }
  console.log(result)

  return 0
}
/**
 * Run our program
 */
main()
  .then(code => process.exit(code))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })