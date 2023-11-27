import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FreeMode } from 'swiper/modules';
import styles from './index.module.css';

export default function Videos({ className }: { className?: string }) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [muted, setMuted] = useState(true);
  const videos = [
    '/videos/7.mp4',
    '/videos/8.mp4',
    '/videos/9.mp4',
    '/videos/10.mp4',
    '/videos/6.mp4',
    '/videos/1.mp4',
    '/videos/2.mp4',
    '/videos/3.mp4',
    '/videos/4.mp4',
    '/videos/5.mp4',
  ];
  let swiperClassName = styles.swiper;
  if (className) {
    swiperClassName = `${styles.swiper} ${className}`;
  }

  useEffect(() => {
    const playVideo = async () => {
      if (swiper && swiper.wrapperEl) {
        const videosArr = swiper.wrapperEl.querySelectorAll('video');
        const isPlaying =
          videosArr[0].currentTime > 0 &&
          !videosArr[0].ended &&
          videosArr[0].readyState > 2;
        if (!isPlaying) {
          await videosArr[0].play();
        }
      }
    };
    playVideo();
  }, [swiper]);

  const onActiveIndexChange = async (swiperAlt: SwiperClass) => {
    const videosElem = swiperAlt.el.querySelectorAll('video');
    for (let i = 0; i < videosElem.length; i += 1) {
      if (videosElem[i].src === videosElem[swiperAlt.activeIndex].src) {
        // eslint-disable-next-line no-await-in-loop
        await videosElem[i].play();
      } else {
        videosElem[i].pause();
      }
    }
  };
  const onVideoEnded = (_: SyntheticEvent<HTMLVideoElement>, index: number) => {
    if (swiper?.realIndex === index) {
      swiper.slideNext();
    }
  };

  return (
    <Swiper
      onSwiper={setSwiper}
      className={swiperClassName}
      slideActiveClass={styles.active}
      slidesPerView={1}
      modules={[FreeMode]}
      pagination
      loop
      spaceBetween={0}
      onRealIndexChange={onActiveIndexChange}
    >
      {videos &&
        videos.map((src, i) => {
          return (
            <SwiperSlide
              key={src}
              className={styles.slide}
              onClick={async (event) => {
                const target = event.currentTarget;
                const video = target?.querySelector('video');
                if (video) {
                  if (video.paused || video.ended) {
                    await video.play();
                  } else {
                    video.pause();
                  }
                }
              }}
            >
              <video
                onEnded={(e) => onVideoEnded(e, i)}
                className={styles.video}
                src={src}
                muted={muted}
                onVolumeChange={(event) => {
                  if (event.currentTarget.muted !== muted) {
                    setMuted(event.currentTarget.muted);
                  }
                }}
                controls
              >
                <track kind="captions" />
              </video>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
