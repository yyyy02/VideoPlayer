/**
 * 包含了一个按钮，导入本地视频资源
 * /main
 */
import React from "react";
import styles from "../style/main.module.css";
import { Popover, Modal, Empty } from "antd";
import "./show.css";
import { FolderOpenTwoTone } from "@ant-design/icons";
/**
 * 状态管理
 * 主要是保存一个键值（文件名->文件数组）
 */
import { useRecoilState } from "recoil";
import { fileState } from "../store/files";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [saveFileName, filesCount] = useRecoilState(fileState);
  console.log(saveFileName);

  let history = useNavigate();

  function saveFiles(e) {
    var pop = document.getElementById("pop");
    pop.visible = false;

    //files  获取选中的文件信息
    //浏览器为了安全性的考虑，把files对象的内容设置为不可更改，只能手动置空，不能修改内容
    var files = e.target.files;
    /**
     * 考虑新增一个map，保存想要的FileList对象的文件内容，之后的操作则通过这个可更改的map进行
     * 考虑到可能存在同名，因此对数据进行一个保存操作
     */
    var curFiles = new Map();
    // curFiles = saveFileName;
    // 显示上传了多少文件
    let fileNumber = 0;
    if (files)
      if (files.length === 0) {
        //遍历判断文件类型，将mp4格式的文件复制到新的map中
        alert("您当前并未选择任何文件！");
      } else if (files.length == 1 && files[0].type != "video/mp4") {
        alert("请重新选择mp4文件上传!");
      } else {
        for (var i = 0; i < files.length; i++) {
          if (files[i].type == "video/mp4") {
            fileNumber++;
            // 文件状态管理中存在同名文件
            if (curFiles.has(files[i].name)) {
              //判断新添加的文件与已存在的同名文件路径一致
              const sameNameFile = curFiles.get(files[i].name);
              let j;
              for (j = 0; j < sameNameFile.length; j++) {
                if (
                  sameNameFile[j].webkitRelativePath ==
                  files[i].webkitRelativePath
                ) {
                  break;
                }
              }
              if (j == sameNameFile.length) {
                sameNameFile.push(files[i]);
                curFiles.set(files[i].name, sameNameFile);
              } else {
                console.log("存在同一个文件，不保存");
                console.log(files[i].webkitRelativePath);
              }
            } else {
              curFiles.set(files[i].name, [files[i]]);
            }
          }
        }
        if (fileNumber < 1) {
          alert("文件夹中不存在mp4格式文件！");
        } else {
          console.log(curFiles);

          filesCount(curFiles);
          var mess = document.getElementById("mess");
          mess.innerHTML = "成功解析" + fileNumber + "份mp4格式文件";
          mess.style.display = "block";
          //数据解析结束，跳转到视频展示页面
          showJump(fileNumber);
        }
      }
  }

  function showJump(fileNumber) {
    let secondsToGo = 4;

    const modal = Modal.confirm({
      title: "成功解析" + fileNumber + "份mp4格式文件",
      content: "页面将在5s后跳转至视频显示页面.",
      okText: `直接跳转`,
      cancelText: `取消`,
      centered: `true`,
      width: `600px`,
      onOk: () => {
        // 点击'是',立即跳转
        clearInterval(timer);
        history("/show");
        modal.destroy();
      },
      onCancel: () => {
        // 点击 ‘否’，取消跳转
        clearInterval(timer);
        modal.destroy();
      },
    });
    const timer = setInterval(() => {
      if (secondsToGo == 0) {
        clearInterval(timer);
        history("/show");
        modal.destroy();
      }
      modal.update({
        content: `页面将在 ${secondsToGo} s后跳转至视频显示页面.`,
      });
      secondsToGo -= 1;
    }, 1000);
  }

  const content = (
    <ul>
      <button className={styles.loadTypeItem} id="file">
        选择文件
        <input type="file" onChange={saveFiles} />
      </button>

      <button className={styles.loadTypeItem} id="folder">
        选择文件夹
        <input
          type="file"
          webkitdirectory="true"
          accept="*.mp4"
          onChange={saveFiles}
        />
      </button>
    </ul>
  );

  return (
    <div className={styles.main}>
      <div className={styles.box} id="file">
        <Empty description="" id="empty"></Empty>
        {/* <div className={styles.loader} id="load"></div> */}
        <Popover
          placement="bottomRight"
          content={content}
          trigger="hover"
          id="pop"
        >
          <div className={styles.file} id="box">
            <FolderOpenTwoTone />
            <span className={styles.fileText}>文件</span>
          </div>
        </Popover>
        <p id="mess" className={styles.mess}></p>
      </div>
    </div>
  );
}
