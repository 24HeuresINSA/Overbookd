
import { resolve } from 'path'

export default {
  resolve: {
    alias: {
      '@overbook/list': resolve('./libraries/list/src'),
      '@overbook/period': resolve('./libraries/period/src'),
      '@overbook/string': resolve('./libraries/string/src'),
    }
  }
}
