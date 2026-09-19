import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion() {
  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const curtain = document.querySelector('.opening-curtain');

    if (reducedMotion) {
      if (curtain) curtain.style.display = 'none';
      return undefined;
    }

    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const context = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } });

      gsap.set('.opening-progress i', { scaleX: 0 });
      gsap.set('.opening-mark > *', { y: 24, opacity: 0 });
      gsap.set('.site-header', { y: -34, opacity: 0 });
      gsap.set('.hero-video', { scale: 1.12, opacity: 0.42 });
      gsap.set('.hero-eyebrow', { y: 32, opacity: 0 });
      gsap.set('.hero-title-line > span', { yPercent: 118, scaleX: 0.7, transformOrigin: 'left center' });
      gsap.set('.hero-description > *, .hero-link', { y: 42, opacity: 0 });
      gsap.set('.hero-bottom > *', { y: 28, opacity: 0 });

      opening
        .to('.opening-mark > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, 0.08)
        .to('.opening-progress i', { scaleX: 1, duration: 1.05, ease: 'power3.inOut' }, 0.12)
        .to('.opening-mark', { y: -18, opacity: 0, duration: 0.55, ease: 'power3.in' }, 0.88)
        .to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: 1.35, ease: 'power4.inOut' }, 0.92)
        .to('.hero-video', { scale: 1, opacity: 0.76, duration: 1.9, ease: 'power3.out' }, 0.78)
        .to('.site-header', { y: 0, opacity: 1, duration: 1.05 }, 1.12)
        .to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.9 }, 1.28)
        .to('.hero-title-line > span', { yPercent: 0, scaleX: 1, duration: 1.55, stagger: 0.14, ease: 'expo.out' }, 1.18)
        .to('.hero-description > *', { y: 0, opacity: 1, duration: 0.95, stagger: 0.1 }, 1.66)
        .to('.hero-link', { y: 0, opacity: 1, duration: 0.85 }, 1.82)
        .to('.hero-bottom > *', { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 1.92)
        .set(curtain, { display: 'none' });

      document.querySelectorAll('.motion-section').forEach(section => {
        const title = section.querySelector('.section-motion-title');
        const intro = [
          section.querySelector(':scope > .section-label, :scope > .contact-inner > .section-label'),
          ...section.querySelectorAll(':scope > .section-heading > *, :scope > .contact-inner > .contact-main > .eyebrow, :scope > .contact-inner > .contact-main > h2'),
        ].filter(Boolean);

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 82%', once: true },
        });

        if (title) {
          timeline.from(title, {
            xPercent: -34,
            scaleX: 0.58,
            opacity: 0,
            duration: 1.65,
            transformOrigin: 'left center',
            ease: 'expo.out',
          });
        }
        timeline.from(intro, { y: isMobile ? 48 : 72, opacity: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out' }, title ? '<0.16' : 0);
      });

      const aboutTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.about-grid', start: 'top 82%', once: true },
      });
      aboutTimeline
        .from('.portrait-panel', { x: isMobile ? 0 : -70, y: isMobile ? 55 : 0, opacity: 0, duration: 1.2, ease: 'power3.out' })
        .from('.portrait-frame', { clipPath: 'inset(0 0 100% 0)', duration: 1.25, ease: 'power4.inOut' }, '<0.08')
        .from('.portrait-frame img', { scale: 1.12, duration: 1.55, ease: 'power3.out', clearProps: 'transform' }, '<')
        .from('.bio > *', { y: 58, opacity: 0, duration: 1.05, stagger: 0.12, ease: 'power3.out' }, '<0.28')
        .from('.stats > div', { y: 70, opacity: 0, duration: 1.05, stagger: 0.13, ease: 'power3.out' }, '-=0.45');

      document.querySelectorAll('.work-group').forEach(group => {
        const cards = [...group.querySelectorAll('.project-card')].slice(0, isMobile ? 2 : 4);
        const images = cards.map(card => card.querySelector('.project-image')).filter(Boolean);
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 80%', once: true },
        });

        timeline
          .from(group.querySelector('.work-group-header'), { y: 58, opacity: 0, duration: 1, ease: 'power3.out' })
          .from(group.querySelector('.swipe-status'), { y: 24, opacity: 0, duration: 0.7 }, '<0.2')
          .from(cards, { y: isMobile ? 64 : 100, opacity: 0, scale: 0.975, duration: 1.15, stagger: isMobile ? 0.07 : 0.1, ease: 'power3.out' }, '<0.18')
          .from(images, { clipPath: 'inset(0 0 100% 0)', duration: 1.35, stagger: isMobile ? 0.06 : 0.09, ease: 'power4.inOut', clearProps: 'clipPath' }, '<0.05');
      });

      gsap.from('.work-shortcuts a', {
        scrollTrigger: { trigger: '.work-shortcuts', start: 'top 86%', once: true },
        y: 52,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
      });

      gsap.from('.skill-card', {
        scrollTrigger: { trigger: '.skill-grid', start: 'top 84%', once: true },
        y: isMobile ? 62 : 95,
        opacity: 0,
        scale: 0.965,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power3.out',
      });

      const contactTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.contact-main', start: 'top 80%', once: true },
      });
      contactTimeline
        .from('.contact-details > *', { y: 46, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
        .from('.contact-note', { y: 30, opacity: 0, duration: 0.75 }, '<0.2')
        .from('.contact footer > *', { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.3');

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, []);
}
