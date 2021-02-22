/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React, { ChangeEvent, FormEvent } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { RouteComponentProps } from 'react-router-dom'

import LoginForm from './LoginForm'

import { compose } from 'redux'

import { login, logged } from '../App/actions'
import {
  makeSelectLoginLoading,
  makeSelectOauth2Enabled
} from '../App/selectors'
import checkLogin from 'utils/checkLogin'
import { setToken } from 'utils/request'
import { statistic } from 'utils/statistic/statistic.dv'
import ExternalLogin from '../ExternalLogin'

import axios from 'axios'
import { Form, message } from 'antd'

const styles = require('./Login.less')

type MappedStates = ReturnType<typeof mapStateToProps>
type MappedDispatches = ReturnType<typeof mapDispatchToProps>
type ILoginProps = MappedStates & MappedDispatches

interface ILoginStates {
  username: string
  password: string
  userid: string
  // username: string
  // organization: string
  token: string

}

export class Login extends React.PureComponent<
  ILoginProps & RouteComponentProps,
  ILoginStates
> {
  constructor(props) {
    super(props)
    this.state = {
      // username: '',
      password: '',
      // username: 'admin',
      // password: 'admin123456',
      // username: this.getQueryVariable("yh") ,
      // password: this.getQueryVariable("psd") ,
      userid: this.getQueryVariable("id") ,
      username: this.getQueryVariable("name"),
      token : this.getQueryVariable("token") ,//aWQ9MjIyJm5hbWU9Y3My


    }
    // if(this.state.token!=''){
    //   // const cs=window.atob(this.state.token)//id=222&name=cs2
    //   // let cs2="id="+cs.split('&')[0].split('=')[1]+"&name="+cs.split('&')[1].split('=')[1]
    //   // let  encodeData = window.btoa(cs2)//编码aWQ9MjIyJm5hbWU9Y3My  aWQ9MMk4jIyJm5hbWU9Y3My
    //   // let token=encodeData .slice(0,5)+'Mk4'+encodeData .slice(5)
    //   // console.log(token)
    //   //解码
    //   // let  decodeData = window.atob(token .slice(0,5)+token.slice(8))//解码。
    //   // console.log(decodeData)
       
    //   //方法一  传id name ,考虑安全可自行加密解密
    //   // 解码aWQ9MjIyJm5hbWU9Y3My
    //   let  decodeData =''
    //   let  isHave=this.state.token.indexOf("Mk4")>-1
    //   if(isHave){
    //      decodeData = window.atob(this.state.token.slice(0,5)+this.state.token.slice(8))//解码。//aWQ9MjIyJm5hbWU9Y3My  id=222&name=cs2
    //   }
    //   this.state = {
    //     password: '',
    //     userid: decodeData&&decodeData.split('&')[0].split('=')[1] ,
    //     username: decodeData&&decodeData.split('&')[1].split('=')[1],
    //     token : this.getQueryVariable("token") ,//aWQ9MjIyJm5hbWU9Y3My 
    //   }
      
    // }
    
    
  }

  public componentWillMount() {
    this.checkNormalLogin()
  }

  private getQueryVariable = (variable) => {
    if(window.location.href.indexOf('?')>-1){
      var query = window.location.href.split('?');
      var vars = query[query.length-1].split("&");
      for (var i=0;i<vars.length;i++) {
              var pair = vars[i].split("=");
              if(pair[0] == variable){
                return pair[1];
              }
      }
      return('');
    }else{
      return('');
    }
    
  }

  

  private checkNormalLogin = () => {
    if (checkLogin()) {
      const token = localStorage.getItem('TOKEN')
      const loginUser = localStorage.getItem('loginUser')
      setToken(token)
      this.props.onLogged(JSON.parse(loginUser))
      this.props.history.replace('/')
    }
  }

  private findPassword = () => {
    const { history } = this.props
    history.push('/findPassword')
  }

  private changeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: e.target.value.trim()
    })
  }

  private changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value
    })
  }

  private toSignUp = () => {
    const { history } = this.props
    history.replace('/register')
  }

  // private doLogin = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  private doLogin = () => {
    const { onLogin, history } = this.props
    const { username, password } = this.state

    if (username && password) {
      onLogin(username, password, () => {
        history.replace('/')
        statistic.whenSendTerminal()
        statistic.setOperations(
          {
            create_time: statistic.getCurrentDateTime()
          },
          (data) => {
            const loginRecord = {
              ...data,
              action: 'login'
            }
            statistic.sendOperation(loginRecord)
          }
        )
      })
    }
  }
  public componentDidMount () {
    console.log(12222)
    console.log(this.state.token)
    if(this.state.token.trim()!=''){
      // setTimeout(() => {
      //   this.doLogin()
      // }, 2000);
      //根据url上的username id 等调用接口注册用户，然后返回用户密码 进行登录
       setTimeout(() => {
        this.doLogin()
        let data={
          "token": this.state.token,
          "userId": this.state.userid,
          "userName": this.state.username,
          "organization": this.state.username,
        };
        try {
          axios.post(`http://192.168.7.233:8883/api/zhjd/bi/manageReport/user/regist`,data) .then(res=>{ 
            
            console.log('res=>',res); 
            if(res.data.success){
              // alert('发布成功')
              this.setState({
                username: res.data.data.username
              })
              this.setState({
                password: res.data.data.password
              })
              this.doLogin()
            }else{
              // alert('发布失败')
              message.success('注册用户失败！')
            }
            
  
          })
        } catch (error) {
          alert("注册用户失败")
        }
      }, 1000);
    }
    
  }

  public render() {
    const { loginLoading, oauth2Enabled } = this.props
    const { username, password } = this.state
    // return (
    //   <div className={styles.window}>
    //     <Helmet title="Login" />
    //     <LoginForm
    //       username={username}
    //       password={password}
    //       loading={loginLoading}
    //       onChangeUsername={this.changeUsername}
    //       onChangePassword={this.changePassword}
    //       onLogin={this.doLogin}
    //     />
    //     {/* <p className={styles.tips}>
    //       <a
    //         href="javascript:;"
    //         className={styles.register}
    //         onClick={this.toSignUp}
    //       >
    //         注册新账户
    //       </a>
    //       <a
    //         href="javascript:;"
    //         className={styles.forgetPassword}
    //         onClick={this.findPassword}
    //       >
    //         忘记密码？
    //       </a>
    //     </p> */}
    //     {/* {oauth2Enabled && <ExternalLogin />} */}
    //   </div>
    // )

    return this.state.token==''?(
      <div className={styles.window}>
        <Helmet title="Login" />
        <LoginForm
          username={username}
          password={password}
          loading={loginLoading}
          onChangeUsername={this.changeUsername}
          onChangePassword={this.changePassword}
          onLogin={this.doLogin}
        />
       
      </div>
    ):(
      // <div className={styles.window}>
      <div>
        
      
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loginLoading: makeSelectLoginLoading(),
  oauth2Enabled: makeSelectOauth2Enabled()
})

export function mapDispatchToProps(dispatch) {
  return {
    onLogin: (username: string, password: string, resolve: () => void) =>
      dispatch(login(username, password, resolve)),
    onLogged: (user) => dispatch(logged(user))
  }
}

const withConnect = connect<{}, {}, ILoginProps>(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(Login)
