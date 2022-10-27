import React, { useState, useEffect } from 'react';
import { fetchData } from '../TabTable';
import { Button, Modal } from 'antd';
import SimpleTable from '../SimpleTable';
import { Scrollbars } from 'react-custom-scrollbars';
import VTable from '@/components/Table';

// 在线清数面板
export default function OnlineCounter({ cart }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData({ api: 'getQmRectifyMaster', params: cart }).then(setData);
  }, [cart]);

  const [params, setParams] = useState({
    proc: '',
    year: '',
    rectifym_id: 0,
  });

  const [rectify, setRectify] = useState(null);

  useEffect(() => {
    setRectify(null);
    if (params.rectifym_id == 0) {
      return;
    }
    fetchData({ api: 'getQmRectifySlave', params }).then(res => {
      setRectify(res);
      setShow(true);
    });
  }, [params.rectifym_id]);

  const [show, setShow] = useState(false);

  return (
    data && (
      <Scrollbars
        autoHide
        style={{
          height: 300,
          marginBottom: 10,
        }}
      >
        <Modal
          title={`${cart} ${params.proc}工序 在线清数识码详情`}
          visible={show}
          footer={null}
          onCancel={() => setShow(false)}
          onOk={() => setShow(false)}
          width={1000}
          bodyStyle={{ padding: '12px 5px' }}
        >
          {rectify && <VTable isAntd simple dataSrc={rectify} formatNumber={false} pagesize={15} />}
        </Modal>
        <SimpleTable
          getTd={(item, i, row) => {
            if (i == data.header.length - 1) {
              return (
                <>
                  <Button
                    type="default"
                    size="small"
                    onClick={() => {
                      let year = row[1].slice(0, 4);

                      setParams({
                        proc: row[0],
                        year: String(year),
                        rectifym_id: item,
                      });
                    }}
                  >
                    识码详情
                  </Button>
                  {row[0] == '涂布' && (
                    <Button
                      type="default"
                      size="small"
                      onClick={() => {
                        let year = row[1].slice(0, 4) - 1;
                        setParams({
                          proc: row[0],
                          year: String(year),
                          rectifym_id: item,
                        });
                      }}
                    >
                      识码详情 {row[1].slice(0, 4) - 1}
                    </Button>
                  )}
                </>
              );
            }
            return item;
          }}
          data={data}
          loading={data.loading}
        />
      </Scrollbars>
    )
  );
}
