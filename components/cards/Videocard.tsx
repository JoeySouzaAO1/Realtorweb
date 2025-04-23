'use client';

interface VideoCardProps {
    src: string;
    title?: string;
    className?: string;
  }
  
  const VideoCard: React.FC<VideoCardProps> = ({ src, title, className }) => {
    // Approximate height of video controls
    const controlsHeight = 36;
  
    return (
      <div
        className={`rounded-2xl border border-red-200/50 bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center overflow-hidden ${className || ""}`}
        style={{
          width: "320px",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {title && (
          <div className="w-full text-lg font-semibold text-gray-800 py-3 text-center bg-gradient-to-r from-pink-50 to-red-50">
            {title}
          </div>
        )}
        <div
          style={{
            width: "100%",
            aspectRatio: "9/16",
            position: "relative",
          }}
        >
          <video
            src={src}
            controls
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: `calc(100% - ${controlsHeight}px)`,
              borderRadius: "0.75rem",
              background: "#f9fafb",
              objectFit: "cover",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onDoubleClick={(e) => e.preventDefault()}
          />
        </div>
      </div>
    );
  };
  
  export default VideoCard;