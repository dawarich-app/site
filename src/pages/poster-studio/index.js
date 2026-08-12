import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {
  PitchPage,
  PitchHero,
  ProofStrip,
  ValueRows,
  WideBlock,
  Objections,
  CloseCTA,
} from '@site/src/components/pitch';
import {
  PosterThemes,
  PosterStudioShot,
  ExportFormats,
} from '@site/src/components/pitch/Artifacts';
import PosterGallery from '@site/src/components/pitch/PosterGallery';

const rows = [
  {
    title: 'A poster is only one of the twenty-two',
    body: 'Print is the obvious one — A5 through A0, 30 × 40, 50 × 70 and 70 × 100 cm, US Letter, portrait or landscape. But the same map also exports as a phone or desktop wallpaper, up to 4K and ultrawide, and as an Instagram post, a story, an X header or a YouTube thumbnail. Print layouts are sized in real paper and DPI; screen layouts are pixel-exact.',
    note: 'Same composition, twenty-two ways out',
    media: <ExportFormats />,
  },
  {
    title: 'The frame you see is the frame you get',
    body: 'Pick a layout before you compose and the preview reshapes to it, so a story crop is never a surprise. The studio shows the finished dimensions as you work — an A3 portrait at 300 DPI exports 3508 × 4961 pixels — and warns you when a view is too wide for the largest poster area instead of silently zooming in.',
    media: <PosterStudioShot />,
  },
];

const objections = [
  {
    q: 'How is this different from the map posters everyone sells?',
    a: 'Those are a city outline anyone can buy with a name printed underneath. This is the actual line you walked, cycled or drove, drawn from the GPS points in your own account.',
  },
  {
    q: 'Will the printed poster match what I designed?',
    a: 'The frame you compose is the frame that prints — the studio uses the same framing as the renderer, and warns you if a view is too wide for the largest poster size rather than silently zooming in.',
  },
  {
    q: 'What is the print quality?',
    a: '200 gsm premium matte, which has no glare, so the route line stays crisp under room lighting. Shipping within the EU is included in the price, and checkout runs through Stripe so your card details never touch Dawarich.',
  },
  {
    q: 'Do I have to order a print to use the studio?',
    a: 'No. Download the PNG or PDF and take it to any printer you like, keep the file, or never go near paper at all — plenty of people export a 4K desktop wallpaper or a phone background and stop there. Ordering is one option, not the point of the feature.',
  },
  {
    q: 'Can I do this on a self-hosted instance?',
    a: 'Yes, the studio is part of the open-source application. Print ordering is on by default and can be switched off entirely on your own instance.',
  },
];

export default function PosterStudioPage() {
  return (
    <Layout
      title="Map Poster Studio — Turn Your GPS Routes Into Posters and Wallpapers"
      description="Turn a route from your own location history into a map poster, a 4K desktop wallpaper, a phone background or a social post. 17 themes, 22 layouts, per-layer colour control, PNG and PDF export at 300 DPI, and prints on 200 gsm matte with free EU shipping.">
      <Head>
        <meta
          property="og:title"
          content="Poster Studio — Turn Your Own GPS Routes Into Posters and Wallpapers"
        />
        <meta
          property="og:description"
          content="Compose a map from the routes you actually travelled, then export it 22 ways: print sizes A5 to A0, 4K and ultrawide wallpapers, phone backgrounds and social formats."
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/poster-studio" />
      </Head>

      <PitchPage>
        <PitchHero
          campaign="poster-studio"
          title={
            <>
              Anyone can buy a map of Berlin.
              <br />
              <em>Only you have this route.</em>
            </>
          }
          sub="The ride you trained for, the year you walked everywhere, the road trip you still talk about — already sitting in your location history as a line nobody else has. Poster Studio turns it into something you can frame, or set as your wallpaper, or post."
          artifact={<PosterThemes />}
        />

        <ProofStrip />

        <WideBlock
          title="Seventeen themes, then every colour underneath them"
          body="Every poster below is the same two years of Berlin — 15 July 2024 to 15 July 2026 — exported from the studio with nothing changed but the theme. When none of the seventeen is quite right, open the colour editor and set the water, parks, railways, boundaries, buildings and each road class yourself — and give the track its own colour, opacity and width, anywhere from 50% to 300%, so the line still reads at A0 or on a phone screen.">
          <PosterGallery />
        </WideBlock>

        <ValueRows
          title="A design tool, not a generate button"
          sub="Full-screen studio. Drag to pan, scroll to zoom, compose the frame, then export it at whatever size you actually need."
          rows={rows}
        />

        <Objections title="Before you export it" items={objections} />

        <CloseCTA
          campaign="poster-studio"
          title="Put your own route on the wall — or the lock screen"
          sub="Import a route you already have or track a new one, then open the studio and start composing."
        />
      </PitchPage>
    </Layout>
  );
}
