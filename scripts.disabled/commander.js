import { Argument, InvalidArgumentError } from 'commander'
import { packages } from './packages.js'

export function cleanupArgsFromPackageArgs(args = [], includeAllOption = true) {
  return args.filter((v) => {
    if (includeAllOption && v === 'all') return false
    return !packages.includes(v)
  })
}

export class PackageArgument extends Argument {

  constructor(
    name = '<packages...>',
    description = 'The packages to act on',
  ) {
    super(name, description)
    this.packages = packages
    this._includeAllOption = true
    this.parseArg = parsePackageArg
  }

  get argChoices() {
    return this._includeAllOption ?
      ['all', ...this.packages] :
      this.packages
  }

  set argChoices(choices) {
    // Setting argChoice is not allowed. The choices depends by the actual packages and the includeAllOption flag.
  }

  includeAllOption(includeAllOption = true) {
    this._includeAllOption = includeAllOption
    if (includeAllOption && !this.defaultValue) {
      this.default(['all'], '"all"')
    }
    return this
  }

  filterPackages(packagesToFilter) {
    if (packagesToFilter && !Array.isArray(packagesToFilter)) {
      packagesToFilter = [packagesToFilter]
    }
    this.packages = packages.filter((p) => { return !packagesToFilter.includes(p) })
    return this
  }

  default(value, description) {
    if (this.required) {
      throw new Error(`The argument "${this.name()}" is not an optional argument and cannot have a default value. Please remove the ".default()" method call or make the argument optional replacing the '<' with '[' in the name definition, like '[${this.name()}${this.variadic ? '...' : ''}]'.`)
    }
    this.defaultValue = this.parseArg(value, this.defaultValue, true)
    this.defaultValueDescription = description
    return this
  }

}

function parsePackageArg(newArg, previous, shipDefaultValueCheck) {
  if (!shipDefaultValueCheck && !this.required && !this.defaultValue) {
    throw new Error(`The argument "${this.name()}" is marked as optional but it doesn't have a default value. Please use the '.default(value, description)' method to set one or make the argument required replacing '[' with '<' in the name definition, like '<${this.name()}${this.variadic ? '...' : ''}>'.`)
  }

  const isUnknownFlag = newArg.startsWith('-')
  if (isUnknownFlag) {
    this._interruptParse = true
  }

  if (this._interruptParse) {
    if (!previous) {
      throw new InvalidArgumentError(`The argument requires a value. The existing packages are ${formatPackageOptions(this.packages, this._includeAllOption)}`)
    }
    return previous
  }

  const isAll = this._includeAllOption && (newArg === 'all' || (Array.isArray(newArg) && newArg.includes('all')))
  if (isAll) {
    return [...this.packages]
  }

  if (!this.argChoices.includes(newArg)) {
    throw new InvalidArgumentError(
      `Existing packages are ${formatPackageOptions(this.packages, this._includeAllOption)}`,
    )
  }

  const isFirstRun = previous === this.defaultValue
  if (isFirstRun) {
    previous = []
  }

  return [...new Set([...previous, newArg])]
}

function formatPackages(packages) {
  return packages.map((v) => { return `"${v}"` }).join(', ')
}

function formatPackageOptions(packages, includeAllOption) {
  return `${formatPackages(packages)}. ${includeAllOption ? 'You can also use "all" to include all the packages.' : ''}`
}


// export class PackageOption extends Option {
//   constructor(
//     name = '-p, -packages [packages...]',
//     description = 'The packages to act on',
//   ) {
//     super(name, description)
//     this._packages = packages
//     this._includeAllOption = true
//     this.choices(this.argChoices)
//     this.choicesParseArg = this.parseArg
//     this.parseArg = (arg, previous) => {
//       if (!this.argChoices.includes(arg)) {
//         const errorMessage = [
//           'Existing packages are ',
//           this._packages.map((v) => `"${v}"`).join(', '),
//           this._includeAllOption ? ' or "all" to include them all.' : '.'
//         ].join('')
//         throw new InvalidArgumentError(errorMessage)
//       }
//       return this.choicesParseArg(arg, previous)
//     }
//   }

//   get mandatory() {
//     return this.required && !this.defaultValue
//   }

//   set mandatory(mandatory) {
//     // Setting mandatory flag is not allowed. It is calculated by .required and .defaultValue.
//   }

//   get argChoices() {
//     return this._includeAllOption ?
//       ['all', ...this._packages] :
//       this._packages
//   }

//   set argChoices(choices) {
//     // Setting argChoice is not allowed. The choices depends by the actual packages and the includeAllOption flag.
//   }

//   default(value, description) {
//     if (
//       (!Array.isArray(value) && !this.argChoices.includes(value)) ||
//       Array.isArray(value) && !value.every((v) => this.argChoices.includes(v))
//     ) {
//       throw new Error([
//         `Invalid default value "${value}" for option "${this.name()}".\n`,
//         `The default value must be one of the following: ${this.argChoices.join(', ')}.`
//       ].join(''))
//     }
//     super.default(value, description)
//     return this
//   }

//   includeAllOption(includeAllOption = true) {
//     this._includeAllOption = includeAllOption
//     return this
//   }
// }


// function getPackagesFromOptions(options) {
//   const packageNames = options.packages
//   if (packageNames === 'all') {
//     return packages
//   }
//   return packageNames.map((packageName) => {
//     if (packages.includes(packageName)) {
//       return packageName
//     }
//     throw new InvalidArgumentError(`Unknown package: ${packageName}`)
//   })
// }


// export function getPackagesFromOptions(options, command, deleteFromOptions = true) {
//   const packageOptions = command.options.filter((option) => option instanceof PackageOption)
//   if (packageOptions.length > 1) {
//     throw new Error('Only one PackageOption is allowed')
//   }
//   const packageOption = packageOptions[0]
//   const packageOptionName = packageOption.name()
//   const packageOptionValue = options[packageOptionName]

//   if (deleteFromOptions) {
//     delete options[packageOptionName]
//   }

//   if (
//     packageOption._includeAllPackages &&
//     Array.isArray(packageOptionValue) &&
//     packageOptionValue.includes('all')
//   ) {
//     return [...packages]
//   } else {
//     return packageOptionValue
//   }
// }

// export class PackageCommander extends Command {
//   constructor(name) {
//     super(name)
//     this.on('option:packages', (val) => {
//       console.log('OOON', val)
//     })
//   }

//   // parseOptions(argv) {
//   //   const { operands, unknown } = super.parseOptions(argv)
//   //   console.log('parseOptions', operands, unknown)
//   //   return { operands, unknown }
//   // }

//   // action(fn) {
//   //   super.action(fn)
//   //   const originalActionHandler = this._actionHandler
//   //   this._actionHandler = (args) => {
//   //     const result = originalActionHandler(args)
//   //     console.log('action', args, result)
//   //     return result
//   //   }
//   //   return this
//   // }

//   // action(fn) {
//   //   console.log('action', fn)
//   //   const listener = (args) => {
//   //     console.log('listener', args)
//   //     // The .action callback takes an extra parameter which is the command or options.
//   //     const expectedArgsCount = this._args.length
//   //     console.log('expectedArgsCount', expectedArgsCount)
//   //     const actionArgs = args.slice(0, expectedArgsCount)
//   //     console.log('actionArgs', actionArgs)
//   //     console.log('this._storeOptionsAsProperties', this._storeOptionsAsProperties)
//   //     if (this._storeOptionsAsProperties) {
//   //       actionArgs[expectedArgsCount] = this // backwards compatible "options"
//   //     } else {
//   //       actionArgs[expectedArgsCount] = this.opts()
//   //     }
//   //     actionArgs.push(this)

//   //     return fn.apply(this, actionArgs)
//   //   }
//   //   this._actionHandler = listener
//   //   return this
//   // }

// }
