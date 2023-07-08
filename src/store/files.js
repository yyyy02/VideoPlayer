import { atom, constSelector, selector } from "recoil";

/*
 *   保存对应文件键值对
 *   key: 文件名
 *   value: File数组
 *   调用方式
 *   import { useRecoilState } from 'recoil'
 *   const [files, filesCount] = useRecoilState(fileState)
 */
export const fileState = atom({
  key: "fileState",
  default: new Map(),
});

/**
 * 记录点击的视频名字和视频
 */
export const chooseFile = atom({
  key: "chooseFile",
  default: { name: undefined, file: undefined },
});

/**
 * 未完成！
 * 保存图片信息
 * 调用方式同上
 * 如果图片很大， 需要压缩？
 */
export const imageState = atom({
  key: "imageState",
  default: new Map(),
});

/**
 * 暂无此功能！
 * 获取所有名字
 * 调用方式
 * import { useRecoilValue } from 'recoil'
 * const name = useRecoilValue(getName)
 */
// export const getName = selector({
//     key: 'getName',
//     get: ({get})=>{
//         const files = get(fileState)
//         console.log('getName', files)
//         return Array.from(files.keys())
//     }
// })

//
// export const charCountState = selector({
//     key: 'charCountState',
//     get: ({get})=>{
//         const files = get(fileState)
//         constSelector.log('charCountState',files)
//         return Array.from(files.keys()).join(' ')
//     }
// })

/**
 * name:
 */
// function setFile(name, files) {
//     // const file = get(fileState)
//     // console.log(file)
// }

export async function getImage() {}
