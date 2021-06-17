import React from 'react'
import "./index.less"
import "./index.css"
import yumao from "@/assets/img/yumao.jpg";
import zz from "@/assets/img/zz.jpg";

export default class Home extends React.Component {
  render() {
    return (
        <div className="test test2">
          <p>hello world</p>
          <img src={yumao} alt="" />
          <img src={zz} alt="" style={{width:360,height:60}}/>
      </div>
    )
  }
}