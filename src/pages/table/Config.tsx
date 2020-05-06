import React from 'react';
import { Card, Tag } from 'antd';
import styles from '../chart/config.less';
import classnames from 'classnames';

export default function tableConfig() {
  return (
    <Card title="报表设置">
      <div className={styles.container}>
        <ul>
          <li>
            <div className={styles.tip}>通用参数0：菜单隐藏</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>hidemenu</div>
            <div>默认值：0,该参数同样适用于图表模块，当设置&hidemenu=1时菜单将会隐藏</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&hidemenu=1"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&hidemenu=1
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数1：数据缓存</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>cache </div>
            <div>
              默认值：5,该参数同样适用于图表模块，默认缓存数据时长为5分钟，如果无需缓存请加入参数
              &cache=0
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&cache=0"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&cache=0
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数2：日期范围</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>daterange </div>
            <div>
              默认值：13。该参数同样适用于图表模块，有效范围0-14，分别表示日期选择器中的快捷日期选择项（去年、今年、上半年、下半年、上季、本季、去年同期、过去一月、上月、本月、7天前、上周、本周、昨天、今天）
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&daterange=12"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&daterange=12
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数3：查询条件接口id</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>select , selectkey </div>
            <div>
              select设置为条件的接口id，查询字段为name:value的形式;
              <br />
              selectkey为对应的查询条件参数，该参数与值将作为查询请求[selectkey]:value同原参数一并向服务端请求
              <br />
              可以设置为多个查询条件，每个条件对应一个key值
              <br />
              参数间可用逗号或分号隔开，系统将自动分割为数组
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074&selectkey=prod&select=77/51bbce6074&selectkey=prod2"
                target="_blank"
              >
                /table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074&selectkey=prod
              </a>
              <a
                href="/table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074,77/51bbce6074&selectkey=prod,prod2"
                target="_blank"
              >
                /table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074,77/51bbce6074&selectkey=prod,prod2
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数4：级联查询</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>cascade </div>
            <div>
              适用于有条件查询的情况下，下一级选择项依赖于上一级选择项。
              <br />
              默认为0或不设置时，直接渲染出所有选择条件
              <br />
              设置为1时，从第2个select之后的选择项，都依赖于上一级的参数，如：
              <br />
              &select=api1,api2,api3,api4&selectkey=key1,key2,key3,key4&cascade=1
              <br />
              此时api2的选择项渲染参数为 www.example.com/api/api2?key1=值,api3的选择项渲染参数为
              www.example.com/api/api3?key2=值,以此类推
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074&selectkey=prod&select=77/51bbce6074&selectkey=prod2"
                target="_blank"
              >
                /table#id=6/8d5b63370c&data_type=score&select=77/51bbce6074&selectkey=prod
              </a>
              <a
                href="/table#id=400/239115b144&select=401/f14b661ec8,401/f14b661ec8,401/f14b661ec8&selectkey=prod,prod2,prod3&cascade=1"
                target="_blank"
              >
                /table#id=400/239115b144&select=401/f14b661ec8,401/f14b661ec8,401/f14b661ec8&selectkey=prod,prod2,prod3&cascade=1
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>
              <Tag color="#e23">新功能</Tag> 通用参数5：跨数据库联接查询
            </div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>
              innerjoin 及 innerjoinkey{' '}
            </div>
            <div>
              以下列接口配置为例，数据请求流程如下：
              <br />
              <ul>
                <li>
                  1.<i>select字段</i>:请求接口869/7173a7b6b0得到select列表，字段名mid
                </li>
                <li>2.用户选择select内容后，选择数据请求日期(此处没有 datetype=none 标记)</li>
                <li>
                  3.<i>id字段</i>以id号：870/1d0d927821
                  请求第一个接口返回的数据，自动获取数据列第一列的值。注：在该次请求中会忽略掉blob及blob_type(服务端会处理blob字段逻辑，如果指定字段不是blob类型会抛错)
                </li>
                <li>
                  4.<i>innerjoin字段</i>
                  :以innerjoin字段指定的接口为id，以innerjoinkey指定的值作为参数名，向服务端发起post操作（上一次请求中可能存在多个数据）
                </li>
              </ul>
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=870/1d0d927821&select=869/7173a7b6b0&selectkey=mid&innerjoin=527/3dc3d3d2da&innerjoinkey=carts&blob=4&blob_type=jpg"
                target="_blank"
              >
                /table#id=870/1d0d927821&select=869/7173a7b6b0&selectkey=mid&innerjoin=527/3dc3d3d2da&innerjoinkey=carts&blob=4&blob_type=jpg
              </a>
            </div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>
              该业务类似于以下逻辑：
              <br />
              select innerjoin.* from 业务数据库 as innerjoin where innerjoin.innerjoinkey in
              (select 车号列表 from 生产数据库)
              <br />
              <br />
              适用场景：
              <br />
              从生产系统中获取一组满足特定条件的产品车号列表，查询业务数据库中该车号列表对应的业务数据。
            </div>
          </li>

          <li>
            <div className={styles.tip}>通用参数6:菜单折叠</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>menufold </div>
            <div>默认值：0,设为1时折叠菜单，适用于报表内容较多，需要显示更多内容</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&menufold=1"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&menufold=1
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数7:日期类型</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>datetype </div>
            <div>
              默认值：date,可选项为 year|month|date ，设定后默认向后台发起YYYY | YYYYMM | YYYYMMDD
              的日期请求
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a href="/table#id=http://localhost:90/76/dd3cf2e48e&datetype=month" target="_blank">
                /table#id=http://localhost:90/76/dd3cf2e48e&datetype=month
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数8:文本查询条件——标题</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>textarea </div>
            <div>
              默认值：设置该参数后，条件查询中将渲染textarea，设置多个时用逗号或分号分开，每个textarea对应一个参数值(textareakey)
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=76/dd3cf2e48e&data_type=score&textarea=冠字信息&textareakey=gzinfo"
                target="_blank"
              >
                /table#id=76/dd3cf2e48e&data_type=score&textarea=冠字信息&textareakey=gzinfo
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>通用参数9:文本查询条件——参数值</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>textareakey </div>
            <div>
              默认值：设置后将textarea中的内容作为值，以当前key为参数发起查询请求，设置多个参数时以逗号或分号分开。内容中如果含逗号、分号或换行符(从Excel中直接复制)时，系统将自动分割为数组发起请求，否则以字符串发起请求。
              <br />
              <br />
              如：参数值 param1 对应的textarea内容为 1820A011,1820A012 时，对应ajax请求参数将转换为
              &param1[]=1820A011&param1[]=1820A012
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=76/dd3cf2e48e&data_type=score&textarea=冠字信息&textareakey=gzinfo"
                target="_blank"
              >
                /table#id=76/dd3cf2e48e&data_type=score&textarea=冠字信息&textareakey=gzinfo
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>
              <Tag color="#e23">新功能</Tag> 通用参数10:文件导出后，小数有效位数
            </div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>decimal </div>
            <div>
              默认值：2
              <br />
              <br />
              默认导出的数据由于js浮点数精度的原因，默认将以小数点后2位显示，如果业务中有需要可调整为指定数值
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=608/4e00407442&merge=1-2&mergetext=投入&merge=2-15&mergetext=在制品库存数&merge=3-5&mergetext=付出数&select=546/db53f036f0&selectkey=product&cache=0&daterange=9&menufold=1&extra=614/142956c77b"
                target="_blank"
              >
                /table#id=608/4e00407442&merge=1-2&mergetext=投入&merge=2-15&mergetext=在制品库存数&merge=3-5&mergetext=付出数&select=546/db53f036f0&selectkey=product&cache=0&daterange=9&menufold=1&extra=614/142956c77b&decimal=3
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>
              <Tag color="#e23">新功能</Tag> 通用参数11:文件导出后，增加数据按列汇总功能
            </div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>stat_sum,stat_avg </div>
            <div>
              <br />
              导出的数据分别增加2行（汇总：求和，汇总：平均值），用法同参数【mergev】,【merge】。
              <br />
              <br />
              <div className={classnames(styles.desc, 'configDemoDesc')}>
                注：受Excel的安全性设置，下载的文件将会显示【受保护视图】并导致公式区域的内容无法显示，关闭方法如下：【文件】——【选项】——【信任中心】-【信任中心设置】-【受保护的视图】中，关闭【为来自Internet的文件启用受保护的视图】
                <img src="/img/desc.jpg" />
              </div>
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=963/a8fa87f276&daterange=9&merge=6-7&mergetext=准确&merge=7-8&mergetext=修改准确&merge=8-9&mergetext=干预准确&merge=9-10&mergetext=不准确&merge=10-11&mergetext=不数&merge=11-12&mergetext=抽数&merge=12-13&mergetext=必数&merge=6-9&mergetext=清数情况&merge=7-9&mergetext=过数情况&mergev=0&stat_sum=2,6,8,10,12,14,16,18&stat_avg=3,4,5,7,9,11,13,15,17,19"
                target="_blank"
              >
                /table#id=963/a8fa87f276&daterange=9&merge=6-7&mergetext=准确&merge=7-8&mergetext=修改准确&merge=8-9&mergetext=干预准确&merge=9-10&mergetext=不准确&merge=10-11&mergetext=不数&merge=11-12&mergetext=抽数&merge=12-13&mergetext=必数&merge=6-9&mergetext=清数情况&merge=7-9&mergetext=过数情况&mergev=0&stat_sum=2,6,8,10,12,14,16,18&stat_avg=3,4,5,7,9,11,13,15,17,19
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>专用参数1.表头合并</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>merge </div>
            <div>默认值：不设置，此时不合并表头</div>

            <div>设置为 0-1 或 0-2 时，分别合并第1-2，1-3列表头。需要合并的列之间用横线(-)隔开</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
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
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头
              </a>
            </div>

            <div>表头合并支持不限层数的表头嵌套，就参考下方 extra 参数中的链接。</div>
          </li>
          <li>
            <div className={styles.tip}>2.表头合并文字</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>mergetext </div>
            <div>默认值：不设置，此时不合并表头</div>

            <div>依次设置文字，合并后的表头使用该文字</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
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
            <div className={classnames(styles.desc, 'configDemoDesc')}>mergesize </div>
            <div>默认值：2，不设置时按2列合并。如设置merge为0时，相当于0-1</div>
            <a
              href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头"
              target="_blank"
            >
              /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergetext=合并后的新表头
            </a>

            <div>
              设置为其它值时，系统按此值合并列
              <br />
              当合并列的长度大于给定数据的表头宽度时，超出部分所在的设置将放弃表头合并
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergesize=3&mergetext=合并后的新表头"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&merge=0&mergesize=3&mergetext=合并后的新表头
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>3.excel报表列合并</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>mergev </div>
            <div>默认值：不设置时不做合并。如设置mergev为0,1,2时，相当于合并第1至3列</div>
            <div>
              excel报表导出时需要纵向合并的列，系统将根据上下列自动运算
              <br />
              可设置格式为： 1,3,4,5代表[1,3,4,5] 1,3-5 代表[1,3,4,5] 1-5代表[1,2,3,4,5]
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=400/239115b144&select=401/f14b661ec8&selectkey=prod&cascade=1&mergev=1,3,4,5"
                target="_blank"
              >
                /table#id=400/239115b144&select=401/f14b661ec8&selectkey=prod&cascade=1&mergev=1,3,4,5
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>5.导出报表间隔背景</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>interval </div>
            <div>默认值：5，不设置时每5列显示一行加深背景</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&interval=5"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&interval=5
              </a>
            </div>
            <div>也可推荐设置为2，此时隔行间隔背景</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&interval=2"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex&interval=2
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>6.导出的报表添加额外表头</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>extra </div>
            <div>
              默认值：false，仅支持接口id,可参考参考链接的设置。需注意的是，extra接口对应的标题用于最终报表标题的输出，这样在报表接口的名称不用添加类似“XXX有限公司”这样的抬头，而在不需要显示的extra对应的id中显示
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=608/4e00407442&merge=0-1&mergetext=投入&merge=1-15&mergetext=在制品库存数&merge=2-4&mergetext=付出数&select=546/db53f036f0&selectkey=product&cache=0&daterange=9&menufold=1&extra=610/99d1ed4c79"
                target="_blank"
              >
                /table#id=608/4e00407442&merge=0-1&mergetext=投入&merge=1-15&mergetext=在制品库存数&merge=2-4&mergetext=付出数&select=546/db53f036f0&selectkey=product&cache=0&daterange=9&menufold=1&extra=610/99d1ed4c79
              </a>
            </div>
          </li>

          {/* 
          <li>
            <div className={styles.tip}>6.导出报表是否自动添加序号</div>
            <div className={classnames(styles.desc,"configDemoDesc")}>autoid </div>
            <div>默认值：true，仅当autoid=0时，导出的数据才不添加序列列，与原数据保持一致</div>
            <div className={classnames(styles.demoLink,"configDemoLink")}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
            <div>也可推荐设置为2，此时隔行间隔背景</div>
            <div className={classnames(styles.demoLink,"configDemoLink")}>
              <a
                href="/table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex"
                target="_blank"
              >
                /table#id=http://localhost:90/76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
          </li> */}

          <li>
            <div className={styles.tip}>7.列冻结</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>freeze</div>
            <div>前面几列冻结，默认0代表首列冻结。如：设置为3时代表第0，1，2三列冻结</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a href="/table#id=81/a22afbf675&daterange=10&freeze=3" target="_blank">
                /table#id=81/a22afbf675&daterange=10&freeze=3
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>8.车号搜索链接</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>link</div>
            <div>报表中有字段为车号/轴号时，设置搜索前缀，默认为车号搜索，可配置为搜索缺陷图片</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=81/a22afbf675&daterange=10&link=http://10.8.2.133:8000/search/image#"
                target="_blank"
              >
                /table#id=81/a22afbf675&daterange=10&link=http://10.8.2.133:8000/search/image#
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>9.文件外链</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>host</div>
            <div>如果配置中含有 image/ 或 /file/ 时，设置该字段将自动添加前缀，方便外链</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=81/a22afbf675&daterange=10&host=http://10.8.2.133/upload/"
                target="_blank"
              >
                /table#id=81/a22afbf675&daterange=10&host=http://10.8.2.133/upload/
              </a>
            </div>
          </li>

          <li>
            <div className={styles.tip}>10.使用其它系统的接口</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>id </div>
            <div>默认值：默认使用系统配置的接口管理id做索引，</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a href="/table#id=76/dd3cf2e48e&data_type=score&data_type=sex" target="_blank">
                /table#id=76/dd3cf2e48e&data_type=score&data_type=sex
              </a>
            </div>
            <div>
              当id中包含http字样时，载入外部数据，如果请求的外部数据包含了merge,mergesize,mergetext相关设置时系统沿用外部数据源的设置替换当前配置。
            </div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
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
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a
                href="/table#id=76/dd3cf2e48e&data_type=sex&id=6/8d5b63370c&data_type=score"
                target="_blank"
              >
                /table#id=76/dd3cf2e48e&data_type=sex&id=6/8d5b63370c&data_type=score
              </a>
            </div>
          </li>
          <li>
            <div className={styles.tip}>11.报表样式</div>
            <div className={classnames(styles.desc, 'configDemoDesc')}>theme</div>
            <div>可选值 antd sheet，设为antd时使用ant design的报表组件，推荐不设置该属性</div>
            <div className={classnames(styles.demoLink, 'configDemoLink')}>
              <a href="/table#id=7/d0e509c803&daterange=6&theme=antd" target="_blank">
                /table#id=7/d0e509c803&daterange=6&theme=antd
              </a>
              <a href="/table#id=7/d0e509c803&daterange=6" target="_blank">
                /table#id=7/d0e509c803&daterange=6
              </a>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
}
