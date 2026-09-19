import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import DeferredGrainient from './DeferredGrainient';
import usePortfolioMotion from './usePortfolioMotion';
import './styles.css';

const media = (file) => `${import.meta.env.BASE_URL}media/${file}`;
const videoProjects = [
  { id: 'history', kind: 'video', number: '01', title: '宏业三十载·中国建设监理之路', category: '企业影像', format: '品牌叙事 / 01:43', cover: 'history.jpg', video: 'history.mp4', featured: true, orientation: 'landscape', description: '以企业三十年的发展为线索，串联历史记忆、工程建设与行业发展，让品牌故事拥有可观看的时间脉络。', role: '视频制作' },
  { id: 'annual', kind: 'video', number: '02', title: '2024年年会开场', category: '活动制作', format: '年会开场 / 03:05', cover: 'annual.jpg', video: 'annual.mp4', orientation: 'landscape', description: '将日常工作的片段与同事的面孔编织在一起，完成2024年年会的开场表达。', role: '视频制作 / 活动执行', fact: '2024年年会整体项目：37个分公司及项目视频，16个节目背景与音乐，现场约200人。' },
  { id: 'song', kind: 'video', number: '03', title: '宏业之歌 MV', category: '音乐影像', format: '企业文化 / 03:06', cover: 'song.jpg', video: 'song.mp4', orientation: 'landscape', description: '围绕企业歌曲组织影像，让音乐节奏、工作场景与品牌表达相互呼应，呈现企业文化中的共同记忆。', role: '视频制作' },
  { id: 'book-film', kind: 'video', number: '04', title: '《宏业故事》发布影像', category: '发布影像', format: '书籍发布 / 01:21', cover: 'book-film.jpg', video: 'book-film.mp4', orientation: 'landscape', description: '围绕《宏业故事》发布与成品展示组织影像，呈现书籍从内容到实物的落地成果。', role: '视频制作' },
  { id: 'tibet', kind: 'video', number: '05', title: '西藏分公司宣传影像', category: '分公司宣传', format: '地域叙事 / 03:02', cover: 'tibet.jpg', video: 'tibet.mp4', orientation: 'landscape', description: '以地域风貌和企业内容展开宣传表达，通过画面编排与节奏变化，将不同素材组织成连贯的观看体验。首页动态背景节选自本片。', role: '视频制作' },
  { id: 'celebration', kind: 'video', number: '06', title: '1月17日活动记录', category: '活动记录', format: '现场记录 / 03:05', cover: 'celebration.jpg', video: 'celebration.mp4', orientation: 'landscape', description: '记录1月17日活动现场，以人物、仪式和现场细节组成完整活动回顾。', role: '视频制作' },
  { id: 'birthday', kind: 'video', number: '07', title: '2024年11月生日会', category: '活动记录', format: '员工活动 / 00:48', cover: 'birthday.jpg', video: 'birthday.mp4', orientation: 'landscape', description: '记录2024年11月员工生日会，通过互动环节和现场片段呈现活动氛围。', role: '视频制作' },
  { id: 'father', kind: 'video', number: '08', title: '父亲节特别视频', category: '节日策划', format: '竖屏专题 / 04:56', cover: 'father.jpg', video: 'father.mp4', orientation: 'portrait', description: '围绕父亲节主题组织人物表达与节日内容，形成竖屏专题视频。', role: '视频制作' },
  { id: 'xian', kind: 'video', number: '09', title: '西安分公司宣传视频', category: '分公司宣传', format: '竖屏影像 / 01:17', cover: 'xian.jpg', video: 'xian.mp4', orientation: 'portrait', description: '围绕分公司项目现场与团队内容制作的竖屏宣传视频。', role: '视频制作' },
  { id: 'wuhan', kind: 'video', number: '10', title: '武汉分公司宣传视频', category: '分公司宣传', format: '竖屏影像 / 03:04', cover: 'wuhan.jpg', video: 'wuhan.mp4', orientation: 'portrait', description: '围绕分公司项目现场与团队内容制作的竖屏宣传视频。', role: '视频制作' },
  { id: 'ningxia', kind: 'video', number: '11', title: '宁夏分公司宣传视频', category: '分公司宣传', format: '竖屏影像 / 02:07', cover: 'ningxia.jpg', video: 'ningxia.mp4', orientation: 'portrait', description: '围绕分公司项目现场与团队内容制作的竖屏宣传视频。', role: '视频制作' },
  { id: 'sep1', kind: 'video', number: '12', title: '9月1日项目短视频', category: '项目短视频', format: '竖屏短视频 / 00:59', cover: 'sep1.jpg', video: 'sep1.mp4', orientation: 'portrait', description: '以竖屏形式呈现项目现场与品牌信息的短视频。', role: '视频制作' },
];

const designProjects = [
  { id: 'book', kind: 'design', number: '01', title: '《宏业故事》书籍设计', category: '书籍设计', format: '封面 / 内页 / 3份素材', cover: 'book-cover.jpg', description: '从封皮、内页到印刷成品，参与《宏业故事》的设计与制作。负责内容整理、版面设计和文字校对，并参与印刷厂调研与制作对接。', role: '封面与内页设计 / 校对 / 制作对接', gallery: [{ src: 'book-cover.jpg', label: '正式采用的封面设计' }, { src: 'book-interior.jpg', label: '内页设计' }, { src: 'book-alternate.jpg', label: '封面探索稿 · 未选用' }] },
  { id: 'annual-board', kind: 'design', number: '02', title: '年会主题展板设计', category: '活动视觉', format: '主题展板 / 1份素材', cover: 'annual-board.jpg', description: '围绕年会主题制作现场展板视觉，用于活动空间中的主题呈现。', role: '视觉设计', gallery: [{ src: 'annual-board.jpg', label: '年会主题展板设计' }] },
  { id: 'culture-wall', kind: 'design', number: '03', title: '企业文化上墙图', category: '文化视觉', format: '使命 / 愿景 / 价值观 / 精神', cover: 'brand-values.jpg', description: '围绕企业使命、愿景、价值观和企业精神制作系列文化墙视觉，让办公空间保持统一的品牌表达。', role: '视觉设计 / 版式设计', gallery: [{ src: 'brand-values.jpg', label: '企业价值观' }, { src: 'brand-mission.jpg', label: '企业使命' }, { src: 'brand-vision.jpg', label: '企业愿景' }, { src: 'brand-spirit.jpg', label: '企业精神' }] },
  { id: 'cards', kind: 'design', number: '04', title: '牌盒与牌背设计', category: '品牌物料', format: '牌盒 / 牌背 / 2份素材', cover: 'brand-box.jpg', description: '把企业视觉延伸到日常纪念物料，完成牌盒展开稿与牌背图形设计。', role: '视觉设计 / 版式设计', gallery: [{ src: 'brand-box.jpg', label: '牌盒展开设计' }, { src: 'brand-card.jpg', label: '牌背设计' }] },
];

function Arrow({ diagonal = false }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function PlayIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z" fill="currentColor" /></svg>; }
function SectionLabel({ number, children }) { return <div className="section-label"><span>{number}</span><span>{children}</span></div>; }

function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!project) return;
    setActive(0);
    const el = dialog.current;
    el.showModal();
    document.dispatchEvent(new Event('portfolio:media-open'));
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { el.close(); document.body.style.overflow = before; document.dispatchEvent(new Event('portfolio:media-close')); };
  }, [project]);
  if (!project) return null;
  const gallery = project.gallery || [];
  return <dialog ref={dialog} className="project-dialog" onClose={onClose} onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }} aria-labelledby="project-title">
    <div className="dialog-inner">
      <header className="dialog-header"><span className="eyebrow">PROJECT {project.number} / {project.category}</span><button className="close-button" onClick={() => dialog.current.close()} aria-label="关闭项目">关闭 <span aria-hidden="true">×</span></button></header>
      <div className={`dialog-media ${project.kind} ${project.orientation || ''}`}>
        {project.kind === 'video' ? <video key={project.video} src={media(project.video)} poster={media(project.cover)} controls playsInline preload="metadata" aria-label={project.title} /> : <img src={media(gallery[active]?.src || project.cover)} alt={gallery[active]?.label || project.title} decoding="async" />}
      </div>
      {project.kind === 'design' && gallery.length > 1 && <div className="gallery-controls" aria-label="切换设计稿">
        {gallery.map((item, index) => <button key={item.src} className={active === index ? 'selected' : ''} onClick={() => setActive(index)}>{item.label}</button>)}
      </div>}
      <div className="dialog-copy"><div><p className="eyebrow">{project.format}</p><h2 id="project-title">{project.title}</h2><p className="project-role">个人职责：{project.role}</p></div><div><p>{project.description}</p>{project.fact && <p className="project-fact">{project.fact}</p>}</div></div>
    </div>
  </dialog>;
}

function ProjectCard({ project, onOpen }) {
  const design = project.kind === 'design';
  const preview = design ? project.gallery.slice(0, 4) : [];
  return <button className={`project-card ${project.featured ? 'featured' : ''} ${design ? 'design' : 'video'} ${project.orientation || ''}`} onClick={() => onOpen(project)} aria-label={`查看${project.title}`}>
    <div className="project-image">
      {design && preview.length > 1 ? <div className={`design-preview items-${preview.length}`}>{preview.map(item => <img key={item.src} src={media(item.src)} alt={item.label} loading="lazy" decoding="async" />)}</div> : <img src={media(project.cover)} alt={`${project.title}${design ? '设计稿' : '视频封面'}`} loading="lazy" decoding="async" />}
      <span className="project-category">{project.category}</span>
      <span className="project-open">{design ? <Arrow diagonal /> : <PlayIcon />}</span>
      {project.featured && <div className="featured-caption"><span>FEATURED FILM</span><h3>宏业三十载<span>中国建设监理之路</span></h3></div>}
    </div>
    <div className="project-caption"><span className="project-number mono">/{project.number}</span><div><h3>{project.title}</h3><p>{project.format}</p></div><Arrow diagonal /></div>
  </button>;
}

function ProjectCarousel({ projects, className, label, onOpen }) {
  const [active, setActive] = useState(0);
  const scrollFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);
  const handleScroll = event => {
    const scroller = event.currentTarget;
    if (scrollFrame.current) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = 0;
      const firstCard = scroller.firstElementChild;
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
      const next = Math.min(projects.length - 1, Math.max(0, Math.round(scroller.scrollLeft / (firstCard.getBoundingClientRect().width + gap))));
      setActive(current => current === next ? current : next);
    });
  };
  return <>
    <div className="swipe-status" aria-hidden="true"><span>左右滑动浏览</span><strong>{String(active + 1).padStart(2, '0')} <i>/</i> {String(projects.length).padStart(2, '0')}</strong></div>
    <div className={className} role="region" aria-label={label} tabIndex="0" onScroll={handleScroll}>{projects.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
  </>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navPinned, setNavPinned] = useState(false);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const heroVideo = useRef(null);
  const heroSection = useRef(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  usePortfolioMotion();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduced.matches) heroVideo.current?.play().catch(() => {});
    const handle = () => { if (reduced.matches) heroVideo.current?.pause(); };
    reduced.addEventListener('change', handle);
    return () => { reduced.removeEventListener('change', handle); clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  useEffect(() => {
    const hero = heroSection.current;
    if (!hero) return;
    let threshold = hero.offsetHeight * 0.68;
    let frame = 0;
    const updatePinned = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY >= threshold;
        setNavPinned(current => current === next ? current : next);
      });
    };
    const handleResize = () => { threshold = hero.offsetHeight * 0.68; updatePinned(); };
    updatePinned();
    window.addEventListener('scroll', updatePinned, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', updatePinned); window.removeEventListener('resize', handleResize); };
  }, []);
  async function copyEmail() {
    try { await navigator.clipboard.writeText('1320738583@qq.com'); setCopied(true); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 2500); }
    catch { window.location.href = 'mailto:1320738583@qq.com'; }
  }
  const openProject = project => { heroVideo.current?.pause(); setSelected(project); };
  return <>
    <a className="skip-link" href="#about">跳到主要内容</a>
    <div className="opening-curtain" aria-hidden="true"><div className="opening-mark"><span>ZK</span><small>VISUAL PORTFOLIO / 2026</small></div><div className="opening-progress"><i /></div></div>
    <header className={`site-header ${navPinned ? 'is-pinned' : ''}`}>
      <div className="header-inner shell">
        <a className="wordmark" href="#home" aria-label="张坤作品集首页" onClick={() => setMenuOpen(false)}>ZK<span>张坤<br /><small>VISUAL PORTFOLIO</small></span></a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} id="main-nav" aria-label="主导航">
          <a href="#about" onClick={() => setMenuOpen(false)}>关于我</a>
          <div className="nav-work"><a href="#work" onClick={() => setMenuOpen(false)}>精选作品</a><div className="nav-submenu"><a href="#video-work" onClick={() => setMenuOpen(false)}>视频剪辑</a><a href="#design-work" onClick={() => setMenuOpen(false)}>视觉设计</a></div></div>
          <a href="#skills" onClick={() => setMenuOpen(false)}>个人优势</a>
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>联系我 <Arrow diagonal /></a>
        </nav>
        <button className="menu-button" aria-label={menuOpen ? '收起导航' : '展开导航'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '关闭' : '菜单'}<span>{menuOpen ? '−' : '+'}</span></button>
      </div>
    </header>
    <main>
      <section className="hero" id="home" ref={heroSection} aria-labelledby="hero-title">
        <video className="hero-video" ref={heroVideo} src={media('hero.mp4')} poster={media('hero-poster.jpg')} muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-content shell">
          <div className="hero-eyebrow eyebrow"><span>ZHANG KUN — PORTFOLIO</span><span>影像 / 品牌 / 创意</span></div>
          <h1 id="hero-title"><span className="hero-title-line"><span>让故事，</span></span><span className="hero-title-line accent"><span>被看见。</span></span></h1>
          <div className="hero-description"><p>剪辑师 <i>/</i> 企宣专员 <i>/</i> AI设计师</p><p>从一个想法，到一段影像，再到一次完整的品牌表达。</p></div>
          <a className="hero-link" href="#work">探索我的作品 <Arrow diagonal /></a>
        </div>
        <div className="hero-bottom shell">
          <a href="#about" className="scroll-link"><span className="scroll-line" />向下探索 <span className="mono">SCROLL TO DISCOVER</span></a>
          <div className="hero-film"><button className="film-open" onClick={() => openProject(videoProjects.find(project => project.id === 'tibet'))}><span className="film-thumb"><img src={media('tibet.jpg')} alt="" /><PlayIcon /></span><span><small>当前放映 / SELECTED FILM</small>西藏分公司宣传影像</span></button><button className="play-toggle" onClick={() => { const video = heroVideo.current; if (video.paused) video.play().catch(() => {}); else video.pause(); }} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? 'Ⅱ' : '▷'}</button></div>
        </div>
      </section>

      <div className="content-stage">
        <div className="grainient-backdrop"><DeferredGrainient color1="#424a55" color2="#000000" color3="#313842" timeSpeed={0.42} warpStrength={1} warpFrequency={5} warpSpeed={1.1} warpAmplitude={51} rotationAmount={500} noiseScale={1.4} grainAmount={0.04} grainScale={2.1} contrast={1.5} saturation={1} zoom={0.9} /></div>
      <section className="about section shell motion-section" id="about" aria-labelledby="about-title">
        <div className="section-motion-title" aria-hidden="true">ABOUT</div>
        <SectionLabel number="01">ABOUT ME / 关于我</SectionLabel>
        <div className="section-heading about-heading"><h2 id="about-title">理解品牌，<br />也懂得如何<span className="muted">讲好故事。</span></h2><p>在镜头、文字与设计之间，<br />让每一个想法，成为值得被看见的作品。</p></div>
        <div className="about-grid">
          <div className="portrait-panel"><div className="portrait-frame"><img src={media('portrait.jpg')} alt="张坤个人照片" loading="lazy" decoding="async" width="300" height="413" /></div><div className="portrait-caption"><strong>张坤 <span>ZHANG KUN</span></strong><span>求职意向城市 · 郑州</span></div><a href="mailto:1320738583@qq.com">1320738583@qq.com <Arrow diagonal /></a><a href="tel:15824686675">158 2468 6675 <Arrow diagonal /></a></div>
          <div className="bio"><p className="bio-intro">我是张坤，一名专注视频制作与视觉表达的内容创作者。</p><p>拥有3年以上企业宣传与视频制作经验，工作涵盖选题、文案、拍摄剪辑、视觉设计与活动组织。连续三年参与年会筹备与执行，也把 AI 工具融入日常创作与办公，持续探索新的表达方式。</p><div className="experience"><div className="experience-row"><span className="mono">2023.07 — 至今</span><div><h3>河南宏业建设管理股份有限公司</h3><p>企宣专员 · 内容运营 / 视频制作 / 品牌视觉</p></div></div><div className="experience-row"><span className="mono">2020 — 2021</span><div><h3>河南同享工程咨询有限责任公司</h3><p>工程造价实习 · 结算审核与进度款跟进</p></div></div><div className="experience-row education"><span className="mono">EDUCATION</span><div><h3>华北水利水电大学 · 本科</h3></div></div></div><div className="honors"><span>职业荣誉</span><p>2024、2025年度，连续两年获评<br />优秀员工 / 企业文化活动先进个人 / 优秀培训通讯员奖</p></div></div>
        </div>
        <div className="stats"><div><strong>3<span>+</span></strong><p>年企业宣传与视频制作经验</p></div><div><strong>5</strong><p>运营账号 · 微信公众号 / 视频号 / 抖音</p></div><div><strong>15,275</strong><p>单条视频发布后五日浏览量</p><small>《宏业建设31岁生日》· 简历所载成果</small></div></div>
      </section>

      <section className="work section shell motion-section" id="work" aria-labelledby="work-title">
        <div className="section-motion-title" aria-hidden="true">SELECTED WORK</div>
        <SectionLabel number="02">SELECTED WORK / 精选作品</SectionLabel>
        <div className="section-heading"><h2 id="work-title">作品，是我的<span className="muted">另一种自我介绍。</span></h2><p>企业影像、活动记录与品牌设计。<br />每一种媒介，都服务于清晰的表达。</p></div>
        <nav className="work-shortcuts" aria-label="作品分类快捷入口"><a href="#video-work"><span>01</span><strong>视频剪辑</strong><small>12条作品</small><Arrow diagonal /></a><a href="#design-work"><span>02</span><strong>视觉设计</strong><small>4组设计 · 10份素材</small><Arrow diagonal /></a></nav>
        <section className="work-group" id="video-work" aria-labelledby="video-work-title">
          <header className="work-group-header"><div><p className="eyebrow">VIDEO EDITING</p><h3 id="video-work-title">视频剪辑</h3></div><strong>12<span>条</span></strong></header>
          <ProjectCarousel projects={videoProjects} className="video-grid" label="视频剪辑作品，可左右滑动浏览" onOpen={openProject} />
        </section>
        <section className="work-group design-work" id="design-work" aria-labelledby="design-work-title">
          <header className="work-group-header"><div><p className="eyebrow">VISUAL DESIGN</p><h3 id="design-work-title">视觉设计</h3></div><strong>4<span>组 · 10份素材</span></strong></header>
          <ProjectCarousel projects={designProjects} className="design-grid" label="视觉设计作品，可左右滑动浏览" onOpen={openProject} />
        </section>
      </section>

      <section className="skills section shell motion-section" id="skills" aria-labelledby="skills-title">
        <div className="section-motion-title" aria-hidden="true">CAPABILITIES</div>
        <SectionLabel number="03">WHAT I BRING / 个人优势</SectionLabel>
        <div className="section-heading"><h2 id="skills-title">不止剪好一条片子。<br /><span className="muted">让创意完整落地。</span></h2><p>从前期策划，到画面、声音和现场，<br />把每个环节连接起来。</p></div>
        <div className="skill-grid">
          {[['01','影像叙事','VIDEO EDITING','从素材整理到剪辑与声音处理，围绕内容目标组织画面，兼顾信息、情绪与节奏。','剪映 / Premiere Pro / Audition'],['02','品牌内容','BRAND COMMUNICATION','熟悉企业宣传的表达方式，能够衔接选题、文案、图文排版与多平台发布，维护内容数据台账。','公众号 / 视频号 / 抖音'],['03','视觉与 AI','VISUAL & AI','将视觉设计用于书籍、海报与活动物料；使用 AI 工具辅助构思、内容整理与日常工作。','Photoshop / 稿定 / Codex / DeepSeek'],['04','现场执行','LIVE & PRODUCTION','具备拍摄、活动筹备与直播中控经验，让前期策划、现场呈现和后续宣传形成完整交付。','索尼 ZV-E10 / 活动策划 / 直播中控']].map(([n,title,en,description,tools]) => <article className="skill-card" key={n}><div className="skill-top"><span className="mono">/{n}</span><span className="skill-mark" aria-hidden="true">{['◫','≡','✳','⌁'][Number(n)-1]}</span></div><p className="eyebrow">{en}</p><h3>{title}</h3><p className="skill-description">{description}</p><div className="skill-tools">{tools}</div></article>)}
        </div>
      </section>
      </div>

      <section className="contact motion-section" id="contact" aria-labelledby="contact-title"><div className="contact-inner shell"><div className="section-motion-title contact-motion-title" aria-hidden="true">CONNECT</div><SectionLabel number="04">LET’S CONNECT / 联系我</SectionLabel><div className="contact-main"><p className="eyebrow">下一段故事，期待与你一起完成。</p><h2 id="contact-title">让我们，<br /><span>开始对话。</span><a href="mailto:1320738583@qq.com" className="contact-arrow" aria-label="发送邮件给张坤"><Arrow diagonal /></a></h2><div className="contact-details"><a className="email-link" href="mailto:1320738583@qq.com">1320738583@qq.com</a><button className="copy-button" onClick={copyEmail} aria-live="polite">{copied ? '已复制邮箱 ✓' : '复制邮箱'}<span aria-hidden="true">{copied ? '' : '⧉'}</span></button><a className="phone-link" href="tel:15824686675">158 2468 6675</a></div><p className="contact-note">求职意向：视频剪辑 / 新媒体运营 / 品牌宣传 · 郑州</p></div><footer><a className="footer-name" href="#home">ZK <span>张坤</span></a><p>© {new Date().getFullYear()} ZHANG KUN</p><a href="#home">回到顶部 <span aria-hidden="true">↑</span></a></footer></div></section>
    </main>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
