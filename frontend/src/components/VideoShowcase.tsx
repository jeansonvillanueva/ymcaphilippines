type VideoItem = {
  id: string;
  title: string;
  description?: string;
  embedUrl?: string;
  videoUrl?: string;
};

const getVideoEmbedUrl = (url?: string) => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

type VideoShowcaseProps = {
  id: string;
  heading: string;
  videos: VideoItem[];
};

function VideoShowcase({ heading, videos }: VideoShowcaseProps) {
  return (
    <section className="home-videos page-section page-section--white">
      <div className="page-section__inner">
        <div className="section-header reveal">
          <h2 className="section-header__title">{heading}</h2>
          <div className="section-header__line" aria-hidden />
        </div>
        <div className="home-videos__grid reveal reveal-delay-1">
          {videos.map((video) => (
            <article key={video.id} className="home-videos__card">
              <div className="home-videos__media">
                {video.embedUrl ? (
                  <iframe
                    src={getVideoEmbedUrl(video.embedUrl)}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={video.videoUrl} controls preload="metadata" />
                )}
              </div>
              <div className="home-videos__body">
                <h3>{video.title}</h3>
                {video.description ? <p>{video.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { VideoItem };
export default VideoShowcase;
