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

import React, { memo, useCallback } from 'react'
import moment from 'moment'
import UrlClipboard from './UrlClipboard'
import { Form, Row, Col, DatePicker, Button, Input ,message} from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { TCopyType } from '../types'
import { DEFAULT_DATETIME_FORMAT } from 'app/globalConstants'
import styles from '../SharePanel.less'
import axios from 'axios'
const FormItem = Form.Item
const TextArea = Input.TextArea

interface IBaseFormProps {
  type: any
  form: WrappedFormUtils
  shareUrl: string
  password?: string
  loading: boolean
  onCopy: (copytype: TCopyType) => () => void
  onGetToken: () => void
  onCancel: () => void
}

const BaseForm: React.FC<IBaseFormProps> = ({
  type,
  form,
  shareUrl,
  password,
  loading,
  onCopy,
  onGetToken,
  onCancel
}) => {
  const { getFieldDecorator } = form
  const itemStyle = { labelCol: { span: 6 }, wrapperCol: { span: 17 } }

  const disabledDate = useCallback(
    (current) => current && current < moment().subtract(1, 'day').endOf('day'),
    []
  )
  const commonFormItemStyle = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 }
  }


  const onClickPublish = useCallback((val) => {
  
    let lx=window.location.href.indexOf('dashboard')>-1?'dashboard':'display'
    let des=form.getFieldValue('description')
    let reportId=location.href.split(type==="display"?"display":"dashboard")[1].split('/')[1]
    let userId=JSON.parse(localStorage.loginUser).id
    let userName=JSON.parse(localStorage.loginUser).username
    console.log(1,type,reportId)
    let url=window.location.origin+"/share.html?shareToken="+""+"#share/"+type
    console.log(des)
    let data={
      "reportCO": {
        "des": des,
        "extValues": {},
        "id": 0,
        // "reportName": document.querySelector(".ant-modal-title").textContent.split('-')[1],
        "reportName": "string",
        "reportRelationId": reportId,
        "reportType": type,
        // "token": shareUrl
        "publishUserId": userId,
        "publishUserName": userName,

      }
    };
    try {
      axios.post(`http://192.168.7.233:8883/api/zhjd/bi/manageReport/report/publish`,data) .then(res=>{ 
      
        console.log('res=>',res); 
        if(res.data.success){
          // alert('发布成功')
          message.success('发布成功')
        }else{
          // alert('发布失败')
          message.success('发布失败')
        }
        onCancel()
        

      })
    } catch (error) {
      alert(error)
      onCancel()
    }

  }, [type])

  


  return (
    <>
      {/* <Row gutter={8}>
        <Col span={24}>
          <FormItem label="有效期" {...itemStyle}>
            {getFieldDecorator('expired', {
              rules: [{ required: true, message: '有效期不能为空' }]
            })(
              <DatePicker
                // defaultValue={moment('2115-01-01 00:00:00', DEFAULT_DATETIME_FORMAT)} 
                // showTime={{ defaultValue: moment('2120-11-28 00:00:00', DEFAULT_DATETIME_FORMAT) }}
                showTime
                format={DEFAULT_DATETIME_FORMAT}
                disabledDate={disabledDate}
              />
            )}
          </FormItem>
        </Col>
      </Row> */}
       <Row gutter={8} >
        <Col span={24}>
            <FormItem label="描述" {...commonFormItemStyle}>
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea
                  placeholder="描述"
                  autoSize ={{minRows: 2, maxRows: 6}}
                />
              )}
            </FormItem>
        </Col>
      </Row>
      <Row gutter={8} type="flex" justify="center">
        <Col>
          <Button
            className={styles.generate}
            disabled={loading}
            loading={loading}
            type="link"
            onClick={onClickPublish}
          >
            发布
          </Button>
        </Col>
      </Row>
      {/* <Row gutter={8} type="flex" justify="center">
        <Col>
          <Button
            className={styles.generate}
            disabled={loading}
            loading={loading}
            type="link"
            onClick={onGetToken}
          >
            点击生成链接
          </Button>
        </Col>
      </Row> */}
      <UrlClipboard shareUrl={shareUrl} password={password} onCopy={onCopy} />
    </>
  )
}

export default memo(BaseForm)
