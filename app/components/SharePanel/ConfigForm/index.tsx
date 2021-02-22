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

import React, { useCallback, forwardRef, useImperativeHandle } from 'react'
import { Form, message } from 'antd'
import BaseForm from './BaseForm'
import AuthForm from './AuthForm'
import { copyTextToClipboard } from '../utils'
import { TCopyType, Tmode } from '../types'
import { IProjectRoles } from 'containers/Organizations/component/ProjectRole'
import { IOrganizationMember } from 'containers/Organizations/types'
import { FormComponentProps } from 'antd/lib/form'
import styles from '../SharePanel.less'

import axios from 'axios'
import request from 'utils/request'

interface IConfigFormProps extends FormComponentProps {
  mode: Tmode
  type: any
  shareUrl: string
  password: string
  loading: boolean
  projectRoles: IProjectRoles[]
  organizationMembers: IOrganizationMember[]
  onSetRoles: (roles: number[]) => void
  onSetViewers: (viewers: number[]) => void
  onGetToken: () => void
  onCancel: () => void

}

const ConfigForm: React.FC<IConfigFormProps> = (
  {
    form,
    mode,
    type,
    shareUrl,
    loading,
    password,
    projectRoles,
    organizationMembers,
    onSetRoles,
    onSetViewers,
    onGetToken,
    onCancel
  },
  ref
) => {
  useImperativeHandle(ref, () => ({ form }))

  const copy = useCallback(
    (copytype: TCopyType) => () => {
      const text =
        copytype === 'link' ? shareUrl : `链接：${shareUrl} 口令：${password}`
        // alert(1)
        //调接口
        console.log(shareUrl)
        localStorage.TOKEN
        location.href
        var type=location.href.indexOf('dashboard')>-1?'dashboard':'display'
        var des=form.getFieldValue('description')
        // let data = {"page":"1","pageSize":"10"}; 
        // let data={
        //   "reportCO": {
        //     "des": des,
        //     "extValues": {},
        //     "id": 0,
        //     // "reportName": document.querySelector(".ant-modal-title").textContent.split('-')[1],
        //     "reportName": "string",
        //     "reportRelationId": location.href.split(type)[1].split('/')[1],
        //     "reportType": type,
        //     "token": shareUrl
        //   }
        // };
        // try {
        //   axios.post(`http://30.29.2.6:8882/api/zhjd/bi/manageReport/report/publish`,data) .then(res=>{ 
          
        //     console.log('res=>',res); 
        //     if(res.data.success){
        //       // alert('发布成功')
        //       message.success('发布成功')
        //     }else{
        //       // alert('发布失败')
        //       message.success('发布失败')
        //     }
            
  
        //   })
        // } catch (error) {
        //   alert(error)
        // }
        // axios.get('http://192.168.7.235:7200/modelService/getModelServiceListByPage', {
        //   　　params: { 'page': '1' ,"pageSize":"10"}
        //   }).then(function (response) {
        //   　　alert('cg');
        //   }).catch(function (error) {
        //   　　alert(error);
        //   });
        //调接口


      // copyTextToClipboard(
      //   text,
      //   () => message.success('复制链接成功'),
      //   () => message.warning('复制链接失败，请稍后重试')
      // )
    },
    [shareUrl, password]
  )

  let content

  switch (mode) {
    case 'NORMAL':
      content = (
        <BaseForm
          form={form}
          type={type}
          shareUrl={shareUrl}
          loading={loading}
          onCopy={copy}
          onCancel={onCancel}
          onGetToken={onGetToken}
        />
      )
      break
    case 'PASSWORD':
      content = (
        <BaseForm
          form={form}
          type={type}
          shareUrl={shareUrl}
          password={password}
          loading={loading}
          onCopy={copy}
          onCancel={onCancel}
          onGetToken={onGetToken}
        />
      )
      break
    case 'AUTH':
      content = (
        <AuthForm
          form={form}
          projectRoles={projectRoles}
          organizationMembers={organizationMembers}
          shareUrl={shareUrl}
          loading={loading}
          onSetRoles={onSetRoles}
          onSetViewers={onSetViewers}
          onGetToken={onGetToken}
          onCopy={copy}
        />
      )
      break
  }

  return <Form className={styles.panelContent}>{content}</Form>
}

export default Form.create<IConfigFormProps>()(forwardRef(ConfigForm))
