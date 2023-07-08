import React, { useState } from "react";
import styles from "../style/preView.module.css";

/**
 * 预览功能
 * 需要传入所需的file，对应的时长
 * 参数形式：
 * {
 *      file:value,
 *      time:value,
 *  }
 * 返回的组件仅是img,宽高会填满父组件
 */
export default function PreView(props) {
  const [src, setSrc] = useState();
  // let src = undefined
  //文件、对应时长
  const file = props["data-prop"].get("file");
  // console.log(file)
  //对应的时长
  const time = props["data-prop"].get("time");
  //对应的宽、高
  const width = props["data-prop"].get("width");
  const height = props["data-prop"].get("height");

  let promise = Promise.resolve(file);
  promise.then(
    (file) =>
      new Promise((resolve) => {
        window.webCapture.capture(file, time, (dataURL, imageInfo) => {
          setSrc(dataURL);
        });
      })
  );

  return (
    <img
      src={src}
      style={{ width: width + "px", height: height + "px" }}
      alt=""
      className={styles.preImage}
    />
  );
}
