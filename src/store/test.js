import { atom, selector } from "recoil";

export const textState = atom({
  key: "textState",
  default: new Map(),
});

export const charCountState = selector({
  key: "charCountState",
  get: ({ get }) => {
    const map = get(textState);
    if (map.keys().lenth === 0) {
      map.set("a1", "asds");
    }
    console.log(map);
    return Array.from(map.keys()).join("");
  },
});

export function test() {
  console.log("success!");
}
