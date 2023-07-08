/**
 * 播放视频
 * /play
 */
import React, { useState, useEffect } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { useRecoilState } from "recoil";
import { fileState, chooseFile, imageState } from "../store/files";
import style from "../style/play.module.css";
import {
  Player,
  BigPlayButton,
  ControlBar,
  PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
  ReplayControl, // 后退按钮
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton, // 倍速播放选项
  VolumeMenuButton,
} from "video-react";
import "video-react/dist/video-react.css"; // import css
import PreView from "./preView";

export default function Play() {
  // files 里面的值是数组！
  const [files] = useRecoilState(fileState);
  /**
   * 使用demo， 可以删除
   * files.keys()  键名的可递归对象
   * files.get(name)  获取键值数组！
   */
  // 这里是保存播放的文件名和文件
  const [changeFile, change] = useRecoilState(chooseFile);
  /**
   * 使用demo， 可以删除
   * file = {name: A.mp4, file: chooseFile}
   * change(file) 这样就可以修改了
   */

  const [videoList, setVideoList] = useState([]);

  const [pre, setPre] = useState(new Map());

  useEffect(() => {
    showList();
  }, []);

  // 设置播放器的相关属性
  const [player, setPlayer] = useState();
  let preView = { file: undefined, time: undefined };
  function showList() {
    const currVideoList = [];
    for (let videoName of files.keys()) {
      files.get(videoName).forEach(function (video) {
        const videoObj = {
          path: video.webkitRelativePath,
          name: video.name,
          totalFile: video,
        }; // videoObj对象
        currVideoList.push(videoObj);
      });
    }

    setVideoList(currVideoList);
  }
  // function VideoImg(props) {
  //     const changeVideo = () => {
  //         const file = {name: props.name, file: files.get(props.name)[0]}
  //         console.log(file)
  //         change(file);
  //         console.log(changeFile['file'])
  //         // let player = document.querySelector('#playChatVideo')
  //         // player.src = URL.createObjectURL(changeFile['file'])
  //         // player.play()
  //     }

  //     return (
  //         <h3 onClick={changeVideo}>{props.name}</h3>
  //     );
  // }

  // 主要设置鼠标在播放进度条上时候的显示缩略图功能
  useEffect(() => {
    const parent = document.querySelector(".video-react-progress-holder");
    let dalay = Date.now();
    // 用于控制显示更新的一个幅度
    let lastPlace = -5;
    // 控制销毁
    let controller;
    parent.addEventListener("mousemove", (e) => {
      if (Date.now() - dalay > 100) {
        const totalTime = player?.getState()?.player?.duration;
        const timer = (e.layerX / parent.clientWidth) * totalTime;
        if (!Number.isNaN(timer)) {
          if (controller) {
            clearTimeout(controller);
          }
          const infile = changeFile["file"];
          const intime = Math.round(timer);
          // // 在鼠标上方创建一个div
          let time = Math.round(timer) * 1000;
          if (Math.abs(lastPlace - Date.now()) < 3) {
            return;
          }
          lastPlace = Date.now();
          const video = document.querySelector(".video-react-video");
          const width = video.clientWidth * 0.1;
          const height = video.clientHeight * 0.1;
          const posX = e.clientX - width * 0.5;
          const posY = e.clientY - 1 * height - 20;

          /**
           * 参数包括
           * width：宽度
           * height：高度
           * posX: 距离top x位置
           * posY：距离top y位置
           * fileName：文件名
           * fileTime: 事件
           */
          // 现在是1.5s后消失
          render(
            <ShowPlace
              width={width}
              height={height}
              posX={posX}
              posY={posY}
              time={time}
              file={changeFile["file"]}
            ></ShowPlace>,
            document.getElementById("showToast")
          );
          controller = setTimeout(() => {
            unmountComponentAtNode(document.getElementById("showToast"));
          }, 1500);
        }
        dalay = Date.now();
      }
    });
  });

  function destroy(id) {
    setTimeout(() => {
      const ids = document.getElementById(id);
      ids.parentNode.removeChild(ids);
    }, 3000);
  }

  return (
    <div className={style.container}>
      <div className={style.play}>
        <div id="showToast"></div>
        <Player
          src={URL.createObjectURL(changeFile["file"])}
          ref={(player) => {
            setPlayer(player);
          }}
          playsInline
          fluid={false}
          width="100%"
          height="100%"
        >
          <BigPlayButton position="center" />
          <ControlBar autoHide={false} disableDefaultControls={false}>
            <ReplayControl seconds={10} order={1.1} />
            <PlayToggle />
            <CurrentTimeDisplay order={4.1} />
            <TimeDivider order={4.2} />
            <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
            <VolumeMenuButton />
          </ControlBar>
        </Player>
        {/* <TestPlace data={pre}></TestPlace> */}
      </div>
      <ul className={style.list}>
        <h2 className={style.list_header}>播放列表</h2>
        <div className={style.list_inner}>
          {videoList.map((v) => (
            <li key={v.path} className={style.mylist_li}>
              <VideoImg {...v}></VideoImg>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
function setTimer() {
  let timer;
  return (width, height, posX, posY, fileTime, fileName, clear) => {
    if (clear) {
      clearInterval(timer);
      return;
    }
    if (timer) {
      clearInterval(timer);
    }
    render(
      <ShowPlace
        width={width}
        height={height}
        posX={posX}
        posY={posY}
        time={(fileTime += 3000)}
        file={fileName}
      ></ShowPlace>,
      document.getElementById("showToast")
    );
    timer = setInterval(() => {
      //   unmountComponentAtNode(document.getElementById("showToast"));
      render(
        <ShowPlace
          width={width}
          height={height}
          posX={posX}
          posY={posY}
          time={(fileTime += 3000)}
          file={fileName}
        ></ShowPlace>,
        document.getElementById("showToast")
      );
    }, 2000);
  };
}
const renderRecord = setTimer();
function VideoImg(props) {
  const [files] = useRecoilState(fileState);
  const [changeFile, change] = useRecoilState(chooseFile);
  const changeVideo = () => {
    let fileplay;
    //比较两个视频的路径来确定选择的视频
    files.get(props.name).forEach(function (video) {
      if (video.webkitRelativePath === props.path) {
        fileplay = video;
      }
    });
    const file = { name: props.name, file: fileplay };
    change(file);
    // let player = document.querySelector('#playChatVideo')
    // player.src = URL.createObjectURL(changeFile['file'])
    // player.play()
  };

  function addImage(e) {
    // 主要是显示组件具体的位置
    /**
     * 参数包括
     * width：宽度
     * height：高度
     * posX: 距离top x位置
     * posY：距离top y位置
     * fileName：文件名
     * fileTime: 时间
     */
    const width = "200";
    const height = "110";
    const posX = e.clientX - 1.3 * width;
    const posY = e.clientY - 0.5 * height;
    const fileName = props.totalFile;
    let fileTime = 1000;
    renderRecord(width, height, posX, posY, fileTime, fileName, false);
  }
  function removeImage() {
    renderRecord(null, null, null, null, null, null, true);
    unmountComponentAtNode(document.getElementById("showToast"));
  }
  return (
    <a
      className={
        props.path === changeFile["file"].webkitRelativePath
          ? style.mylist_a2
          : style.mylist_a
      }
      onClick={changeVideo}
      onMouseOver={addImage}
      onMouseOut={removeImage}
      id="list_li"
    >
      {props.name}
    </a>
  );
}

function ShowPlace(props) {
  const showPlaceDisplay = {
    width: props.width,
    height: props.height,
    position: "absolute",
    top: props.posY,
    left: props.posX,
    zIndex: 2147483647,
  };
  // 主要是显示组件具体的位置
  /**
   * 参数包括
   * width：宽度
   * height：高度
   * posX: 距离top x位置
   * posY：距离top y位置
   * fileName：文件名
   * fileTime: 事件
   */
  const data = new Map();
  data.set("file", props.file);
  data.set("time", props.time);
  data.set("width", props.width);
  data.set("height", props.height);
  return (
    <div className={style.showBref} tabIndex="1" style={showPlaceDisplay}>
      <PreView data-prop={data}></PreView>
    </div>
  );
}
