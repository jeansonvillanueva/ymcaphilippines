type VideoItem = {
  id: string;
  title: string;
  description?: string;
  embedUrl?: string;
  videoUrl?: string;
};

type VideoShowcaseProps = {
  heading: string;
  videos: VideoItem[];
};

function VideoShowcase({ heading, videos }: VideoShowcaseProps) {
  return (
    <section className="home-videos page-section page-section--white">
      <div className="page-section__inner">
        <h2 className="home-videos__title reveal">{heading}</h2>
        <div className="home-videos__grid reveal reveal-delay-1">
          {videos.map((video) => (
            <article key={video.id} className="home-videos__card">
              <div className="home-videos__media">
                {video.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
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
