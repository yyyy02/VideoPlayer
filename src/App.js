import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./component/main";
import Show from "./component/show";
import Play from "./component/play";
import Header from "./component/header";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainConponent />}></Route>
            <Route path="/show" element={<ShowComponent />}></Route>
            <Route path="/Play" element={<PlayComponent />}></Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

function MainConponent() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}

function ShowComponent() {
  return (
    <div>
      <Header />
      <Show />
    </div>
  );
}

function PlayComponent() {
  return (
    <div>
      <Header />
      <Play />
    </div>
  );
}

export default App;
