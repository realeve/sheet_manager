import React, { useState, useEffect } from 'react';
import styles from '../Image.less';
import 'animate.css';
import copy from 'copy-to-clipboard';
import { message, Modal } from 'antd';
import * as R from 'ramda';

const prefix = 'data:image/jpg;base64,';
// todo 增加点击复制url链接功能.

const ImageTitle = ({ data: { camera, macro_id, pos, code, sheet_num }, ...props }) => (
  <div {...props}>
    <p style={{ marginBottom: 0 }}>
      相机：{camera} / 宏区{macro_id} / 第{pos}开
    </p>
    <p style={{ marginBottom: 0 }}>印码号：{code}</p>
    {sheet_num && sheet_num.length > 0 && (
      <p style={{ marginBottom: 0 }}>大张喷码号：{sheet_num}</p>
    )}
  </div>
);

function ImageItem({ data, type, visible, gutter }) {
  const [show, setShow] = useState(false);

  const [id, setId] = useState(-1)
  const copyImg = (img, idx) => {
    setShow(true);
    setId(idx);
    copy(img);
    message.success('图像拷贝成功');
  };

  const [codeData, setCodeData] = useState({})
  useEffect(() => {
    if (data.length == 0) {
      setCodeData({})
      return;
    }
    let item = data[0]
    if (!item.code) {
      setCodeData({ '无号码': data })
      return;
    }

    let nextData = R.clone(data).map((item, idx) => ({ ...item, idx }))
    nextData = R.groupBy(item => item.code[6], nextData)

    setCodeData(nextData)
  }, [data])

  const ImageRows = ({ data }) => data.map((item, idx) => (
    <li
      key={type + idx}
      // className="animated zoomIn"
      onClick={() => copyImg(`${prefix}${item.image}`, item.idx)}
      style={{ marginRight: gutter }}
    >
      <div className={styles.wrap}>
        <img src={`${prefix}${item.image}`} alt={item.code} />
      </div>
      <div className={styles.desc}>
        <ImageTitle data={item} key={idx} />
      </div>
    </li>
  ))

  return (
    <>
      <Modal title="图片详情" visible={show} onCancel={() => setShow(false)} footer={null}>
        {id > -1 && <>
          <img style={{ width: '100%' }} src={`${prefix}${data[id].image}`} alt="图片详情" />
          <ImageTitle data={data[id]} style={{ marginTop: 5 }} />
        </>}
      </Modal>

      {visible && R.keys(codeData).map(key => <div key={key} className={styles.mainContent} style={{ marginBottom: 20, borderBottom: '1px solid #ddd' }}>
        <div style={{ fontWeight: 'bold', borderLeft: '3px solid #e23', paddingLeft: 12 }}>第 {key} 千</div>
        <ul className={styles.content}>  {codeData[key] && <ImageRows data={codeData[key]} />} </ul>
      </div>)
      }
    </>
  );
}

export default ImageItem

// export default React.memo(ImageItem, (prevProps, nextProps) => {
//   return (
//     prevProps.gutter === nextProps.gutter &&
//     prevProps.visible === nextProps.visible &&
//     R.equals(prevProps.data, nextProps.data)
//   );
// });
