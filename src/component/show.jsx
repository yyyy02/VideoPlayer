/**
 * 显示每个视频第一帧的内容，调用js中的showImage实现
 * /show
 */
import React, { useState, useEffect, createRef } from "react";
import { useRecoilState } from "recoil";
import { fileState, chooseFile } from "../store/files";
import { Link } from "react-router-dom";
import style from "../style/show.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// import useThrottle from './hook/throttle';

export default function Show() {
  // 数据在这里面， 类型是map
  // files 里面的值是数组！
  const [files] = useRecoilState(fileState);

  /* 保存视频列表, 每个列表项为一个对象{name: 文件名, imgSrc: 视频封面图} */
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    showImage(); // 显示视频列表
  }, []);

  let promise = Promise.resolve(); // 链式Promise的初始Promise, 用来截图

  // 绑定window的滚动事件(节流) <已弃用>
  // window.onscroll = useThrottle(loadOnDemand, 500);

  // 根据videoList生成列表
  const videoImgList = videoList.map((v) => (
    //将路径作为li的key
    <li key={v.path}>
      <VideoImg {...v}></VideoImg>
    </li>
  ));

  return (
    <div>
      {/* <button onClick={testOberserver}>Test</button> */}
      <ul className={style.videoList}>{videoImgList}</ul>
    </div>
  );

  /**
   * 初始化videoCard, 结束后, 页面出现封面正在加载的视频
   */
  function showImage() {
    // 首先读取files中的文件, 根据文件名构建videoObj对象, 存入currVideoList数组
    const currVideoList = [];
    for (let videoName of files.keys()) {
      files.get(videoName).forEach(function (video) {
        // 为了避免同名文件, 将path作为每个视频的key
        const videoObj = {
          path: video.webkitRelativePath,
          name: video.name,
          imgRef: createRef(), // 用来获取视频封面对应的img DOM元素
          videoFile: video, // 保存文件对象
        }; // videoObj对象
        currVideoList.push(videoObj);
      });
    }
    // setVideoList(videoList => currVideoList);

    // 更新videoList, 当更新完成, 页面出现正在加载的视频
    new Promise((resolve) => {
      setVideoList(() => {
        resolve(currVideoList);
        return currVideoList;
      });
    }).then((res) => {
      initObserver(res); // 更新videoList之后, observe对应的图片封面img DOM元素
    });

    //  通过Promise链对视频截图, 当一个视频截图成功后, 生成新的Promise对下一个视频截图 <已弃用>
    // let promise = Promise.resolve(currVideoList);
    // for (let videoName of files.keys()) {
    //     files.get(videoName).forEach(function (video) {
    //         promise = promise.then((videoList) => {
    //             return new Promise(resolve => {
    //                 window.webCapture.capture(video, 8000, (dataURL, imageInfo) => {
    //                     // 将当前截图放入对应的videoObj对象的imgSrc属性中
    //                     // 注意需要根据webkitRelativePath寻找对应的videoObj
    //                     let updatedVideoList = videoList.map(videoObj => {
    //                         if (videoObj.path === video.webkitRelativePath) {
    //                             videoObj.imgSrc = dataURL;
    //                         }
    //                         return videoObj;
    //                     });
    //                     setVideoList(updatedVideoList);  // 更新videoList, 当更新完成, 对应的视频封面加载完毕
    //                     resolve(updatedVideoList);  // 结束Promise
    //                 });

    //                 // 0.5s后还没有成功截图, 则认为加载失败, 结束Promise
    //                 setTimeout(() => resolve(videoList), 500);
    //             });
    //         });
    //     });

    // }
  }

  /**
   * 初始化IntersectionObserver对象, 并observe所有用来显示封面的img DOM元素
   * @param {Array} resList 视频列表 (此时videoList可能还未更新)
   */
  function initObserver(resList) {
    // Observer的回调函数
    const callback = (entries) => {
      entries.forEach((entry) => {
        // 当有img显示在用户视线内时, 加载图片
        if (entry.isIntersecting) {
          // 找出被看到的DOM元素在videoList中对应的videoObj对象
          let updatedVideoList = resList.map((video) => {
            if (video.imgRef.current === entry.target) {
              captureImg(video.videoFile, resList); // 截图
            }
            return video;
          });
          setVideoList((videoList) => updatedVideoList);
          observer.unobserve(entry.target); // 显示图片之后, 取消观察
        }
      });
    };
    const observer = new IntersectionObserver(callback);
    // 对每个视频封面的img进行观察
    resList.forEach((video) => {
      observer.observe(video.imgRef.current);
    });
  }

  /**
   * 对指定的videoFile文件截取封面, 将截图更新在videoList中对应videoObj对象的imgSrc属性
   * @param {File} videoFile 需要截图的视频文件
   * @param {Array} resList 文件列表 (此时videoList可能还未更新)
   */
  function captureImg(videoFile, resList) {
    promise = promise.then(() => {
      return new Promise((resolve) => {
        window.webCapture.capture(videoFile, 8000, (dataURL, imageInfo) => {
          // 将当前截图放入对应的videoObj对象的imgSrc属性中
          // 注意需要根据webkitRelativePath寻找对应的videoObj
          let updatedVideoList = resList.map((videoObj) => {
            if (videoObj.path === videoFile.webkitRelativePath) {
              videoObj.imgSrc = dataURL;
            }
            return videoObj;
          });
          setVideoList(() => updatedVideoList); // 更新videoList, 当更新完成, 对应的视频封面加载完毕
          resolve(); // 结束Promise
        });

        // 0.5s后还没有成功截图, 则认为加载失败, 结束Promise
        setTimeout(() => resolve(), 500);
      });
    });
  }
}

/**
 * VideoImg组件
 * 一个视频卡片, 包括视频封面显示和视频文件名, 另外还包括视频未加载时显示的loading样式
 */
function VideoImg(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const [files] = useRecoilState(fileState);
  const [changeFile, change] = useRecoilState(chooseFile);

  // 点击视频, 跳转到视频播放
  const playVideo = () => {
    // 根据当前视频的webkitRelativePath属性获取文件对象
    let fileToplay;
    files.get(props.name).forEach((file) => {
      if (file.webkitRelativePath === props.path) {
        fileToplay = file;
      }
    });
    const file = { name: props.name, file: fileToplay };

    change(file); // 更新recoilState
  };

  return (
    <Link to={`/play`} onClick={playVideo}>
      <div className={style.videoCard}>
        {/* 视频封面未加载时, 显示loading样式 */}
        <div
          className={`${style.videoLoadingMask} ${style.videoSize}`}
          style={{ display: props.imgSrc ? "none" : "block" }}
        >
          <Spin className={style.loadingIcon} indicator={antIcon}></Spin>
        </div>

        {/* 鼠标放置在视频封面时, 显示遮罩层 */}
        <div className={`${style.videoHoverMask} ${style.videoSize}`}></div>

        {/* 视频封面 */}
        <div className={`${style.videoImgBox} ${style.videoSize}`}>
          <img
            ref={props.imgRef}
            src={props.imgSrc ? props.imgSrc : ""}
            style={{ opacity: props.imgSrc ? 1 : 0 }}
            alt="图片加载错误"
            onClick={playVideo}
          />
        </div>
        {/* 文件名 */}
        <h3>{props.name}</h3>
      </div>
    </Link>
  );
}
