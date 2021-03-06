import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'seating-plan <notenmanager-mdb>',
  alias: 'sp',
  description: 'Convert the MDB (Access) file to json.',
  checkExecutable: [
    'mdb-export'
  ]
}
