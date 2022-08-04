import { App } from '@vue/runtime-dom'

// 导入所有组件（不推荐）

// import Vant from 'vant';
// import 'vant/lib/index.css';

// 按需加载

import { Button } from 'vant';
import { List } from 'vant';
import { Sticky } from 'vant';
import { Tab, Tabs } from 'vant';
import { Dialog } from 'vant';
import { Search, DropdownMenu, DropdownItem } from 'vant'
import { Toast } from 'vant';
import { Empty } from 'vant'
import { TreeSelect } from 'vant'
import { Popup } from 'vant'
import { Icon } from 'vant'
import { Skeleton } from 'vant'

export default function (app: App<Element>) {
    // 完整
    // app.use(Vant)

    // 按需引入
    app.use(Button)
    app.use(List)
    app.use(Sticky)
    app.use(Sticky)
    app.use(Tab)
    app.use(Tabs)
    app.use(Dialog)
    app.use(Search)
    app.use(DropdownMenu)
    app.use(DropdownItem)
    app.use(Toast)
    app.use(Empty)
    app.use(TreeSelect)
    app.use(Popup)
    app.use(Icon)
    app.use(Skeleton)
}