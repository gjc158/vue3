import { setTitle } from '@/utils/utils'

function afterEachHandler(to: any, from: any) {
  let { title } = to.meta
  title || (title = to.name)
  if (title) {
    setTitle(title)
  }
  window.scrollTo(0, 0)
}

export default afterEachHandler
