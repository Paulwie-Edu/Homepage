const platforms = ["Bilibili", "YouTube", "闲鱼", "小红书", "抖音", "微信"];

export function SocialStrip() {
  return (
    <section className="px-4 pb-20 pt-6">
      <div className="glass mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 rounded-2xl px-4 py-4">
        <span className="text-sm text-white/80">全平台检索：</span>
        {platforms.map((platform) => (
          <span key={platform} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/85">
            {platform} · Paulwie
          </span>
        ))}
      </div>
    </section>
  );
}
