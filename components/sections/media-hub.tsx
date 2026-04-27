export function MediaHub() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold md:text-4xl">信任与媒体沉浸区</h2>
        <div className="glass mt-8 overflow-hidden rounded-3xl p-3 shadow-glow">
          <div className="aspect-video w-full overflow-hidden rounded-2xl">
            <iframe
              className="h-full w-full"
              src="https://player.bilibili.com/player.html?bvid=BV1ec7YzkEp2&page=1"
              title="Paulwie Studio 教学视频"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
