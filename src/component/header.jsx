import React from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { textState, charCountState } from "../store/test";
import styles from "../style/header.module.css";
// import '../style/header.module.css';
import imgURL from "../images/log.png";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Main from "./main";
import App from "../App";
export default class Header extends React.Component {
  render() {
    return (
      <div>
        {/*<Textarea></Textarea>*/}
        {document.location.pathname === "/" ? (
          <Mainbutton></Mainbutton>
        ) : document.location.pathname === "/show" ? (
          <Showbutton></Showbutton>
        ) : (
          <Playbutton></Playbutton>
        )}
      </div>
    );
  }
}

function Textarea() {
  return (
    <div className={styles.nav}>

    </div>
  );
}
function Mainbutton() {
  return (
    <div>
      <div className={styles.nav}>
        {/*<button onClick={onchange}>123</button>*/}
        <div className={styles.navleft}>
          <img src={imgURL} className={styles.logo} />
          {/*ZIUT-001*/}
          <span className={styles.zjut}>VideoPlayer</span>
        </div>
        <div className={styles.navmiddle}>
          <h1>在线视频播放器</h1>
        </div>
        <div className={styles.navright}></div>
      </div>
    </div>
  );
}
function Showbutton() {
  return (
    <div>
      <div className={styles.nav}>
        {/*<button onClick={onchange}>123</button>*/}
        <div className={styles.navleft}>
          <Link to={`/`}>
            <button className={styles.tomain}>首页</button>
          </Link>
          <img src={imgURL} className={styles.logo} />
          <span className={styles.zjut}>VideoPlayer</span>
        </div>
        <div className={styles.navmiddle}>
          <h1>视频列表</h1>
        </div>
        <div className={styles.navright}>
        </div>
      </div>
    </div>
  );
}
function Playbutton() {
  return (
    <div>
      <div className={styles.nav}>
        {/*<button onClick={onchange}>123</button>*/}
        <div className={styles.navleft}>


          <Link to={`/`}>
            <button className={styles.tomain}>首页</button>
          </Link>
          <span> </span>
          <Link to={`/show`}>
            <button className={styles.toshow}>视频列表</button>
          </Link>
          <img src={imgURL} className={styles.logo} />
          <span className={styles.zjut}>VideoPlayer</span>
        </div>
        <div className={styles.navmiddle}>
          <h1>视频播放</h1>
        </div>
        <div className={styles.navright}></div>
      </div>
    </div>
  );
}
// export default header;
