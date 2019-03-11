import React from 'react';
import { Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne, { TweenOneGroup } from 'rc-tween-one';
import BannerAnim, { Element } from 'rc-banner-anim';
import 'rc-banner-anim/assets/index.css';
// const BgElement = Element.BgElement;

class Banner extends React.PureComponent {
  render() {
    const { ...props } = this.props;
    const { dataSource, isMobile } = props;
    delete props.dataSource;
    delete props.isMobile;
    const childrenToRender = dataSource.BannerAnim.children.map((item, i) => {
      const elem = item.BannerElement;
      const elemClassName = elem.className;
      delete elem.className;
      const textWrapper = item.textWrapper;
      const title = item.title;
      const content = item.content;
      const button = item.button;
      const page = item.page;
      // const bg = item.bg;

      const follow = !isMobile
        ? {
            delay: 1000,
            minMove: 0.1,
            data: [
              {
                id: `bg${i}`,
                value: 15,
                type: 'x',
              },
              { id: `wrapperBlock${i}`, value: -15, type: 'x' },
            ],
          }
        : null;
      return (
        <Element key={i.toString()} followParallax={follow} {...elem} prefixCls={elemClassName}>
          {/* <BgElement key="bg" {...bg} id={`bg${i}`} /> */}
          <div className="banner2-video-container">
            <video
              src="/img/home.mp4"
              width="100%"
              autoPlay="autoPlay"
              loop="loop"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
            <div className="banner2-overlay">
              <div {...page}>
                <QueueAnim
                  type={['bottom', 'top']}
                  delay={200}
                  key="text"
                  {...textWrapper}
                  id={`wrapperBlock${i}`}
                >
                  <div key="logo" {...title}>
                    {typeof title.children === 'string' &&
                    title.children.match(/\.(svg|gif|jpg|jpeg|png|JPG|PNG|GIF|JPEG)$/) ? (
                      <img src={title.children} width="100%" alt="img" />
                    ) : (
                      title.children
                    )}
                  </div>
                  <div key="content" {...content}>
                    {content.children}
                  </div>
                  <a href="/login">
                    <button className="button-more">{button.children}</button>
                  </a>
                  {/* <Button
                    type="ghost"
                    key="button"
                    {...button}
                    onClick={() => {
                      router.push('/login');
                    }}
                  >
                    {button.children}
                  </Button> */}
                </QueueAnim>
              </div>
            </div>
          </div>
        </Element>
      );
    });
    return (
      <div {...props} {...dataSource.wrapper}>
        <TweenOneGroup
          key="bannerGroup"
          enter={{ opacity: 0, type: 'from' }}
          leave={{ opacity: 0 }}
          component=""
        >
          <BannerAnim key="BannerAnim" {...dataSource.BannerAnim}>
            {childrenToRender}
          </BannerAnim>
        </TweenOneGroup>
        <TweenOne
          animation={{
            y: '-=20',
            yoyo: true,
            repeat: -1,
            duration: 1000,
          }}
          className="banner2-icon"
          style={{ bottom: 40 }}
          key="icon"
        >
          <Icon type="down" />
        </TweenOne>
      </div>
    );
  }
}

export default Banner;
