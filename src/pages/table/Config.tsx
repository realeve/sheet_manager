import React from 'react';
import { Card } from 'antd';
import styles from '@/pages/chart/config.less';

export default function tableConfig() {
  return (
    <Card title="报表设置">
      <div className={styles.container}>
        <ul>
          <li>
            <div className={styles.tip}>通用参数1：数据缓存</div>
            <div className={styles.desc}>cache </div>
            <div>
              默认值：5,该参数同样适用于图表模块，默认缓存数据时长为5分钟，如果无需缓存请加入参数
              &cache=0
            </div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=0&cache=0"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=0&cache=0
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数2：日期范围</div>
            <div className={styles.desc}>daterange </div>
            <div>
              默认值：13。该参数同样适用于图表模块，有效范围0-14，分别表示日期选择器中的快捷日期选择项（去年、今年、上半年、下半年、上季、本季、去年同期、过去一月、上月、本月、7天前、上周、本周、昨天、今天）
            </div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&daterange=12"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&daterange=12
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>专用参数1.表头合并</div>
            <div className={styles.desc}>merge </div>
            <div>默认值：不设置，此时不合并表头</div>

            <div>设置为 0-1 或 0-2 时，分别合并第1-2，1-3列表头。需要合并的列之间用横线(-)隔开</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-1&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-1&mergetext=合并后的新表头
              </a>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-2&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-2&mergetext=合并后的新表头
              </a>
            </div>

            <div>设置为 0时，分别合并第1-2列表头</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>2.表头合并文字</div>
            <div className={styles.desc}>mergetext </div>
            <div>默认值：不设置，此时不合并表头</div>

            <div>依次设置文字，合并后的表头使用该文字</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-1&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0-1&mergetext=合并后的新表头
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>3.合并列大小</div>
            <div className={styles.desc}>mergesize </div>
            <div>默认值：2，不设置时按2列合并。如设置merge为0时，相当于0-1</div>
            <a
              href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头"
              target="_blank"
            >
              /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头
            </a>

            <div>设置为其它值时，系统按此值合并列</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergesize=3&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergesize=3&mergetext=合并后的新表头
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>4.导出报表间隔背景</div>
            <div className={styles.desc}>interval </div>
            <div>默认值：5，不设置时每5列显示一行加深背景</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=1&interval=5"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=1&interval=5
              </a>
            </div>
            <div>也可推荐设置为2，此时隔行间隔背景</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=1&interval=2"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=1&interval=2
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>5.导出报表是否自动添加序号</div>
            <div className={styles.desc}>autoid </div>
            <div>默认值：true，仅当autoid=0时，导出的数据才不添加序列列，与原数据保持一致</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=0"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&autoid=0
              </a>
            </div>
            <div>也可推荐设置为2，此时隔行间隔背景</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>6.使用其它系统的接口</div>
            <div className={styles.desc}>id </div>
            <div>默认值：默认使用系统配置的接口管理id做索引，</div>
            <div className={styles.demoLink}>
              <a href="/table#id=76/dd3cf2e48e&data_type=score&data_type=sex" target="_blank">
                /table#id=76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
            <div>当id中包含http字样时，载入外部数据。</div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
            <div>
              地址请求中id为数组时,如id=76/dd3cf2e48e&data_type=sex&id=6/8d5b63370c，
              <strong>系统将依次渲染多张表格</strong>
            </div>
            <div className={styles.demoLink}>
              <a
                href="/table#id=76/dd3cf2e48e&data_type=sex&id=6/8d5b63370c&data_type=score"
                target="_blank"
              >
                /table#id=76/dd3cf2e48e&data_type=sex&id=6/8d5b63370c&data_type=score
              </a>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
}
