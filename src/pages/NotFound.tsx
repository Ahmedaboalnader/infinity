import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Infinity</title>
      </Helmet>
      <section className="grid min-h-[60vh] place-items-center px-5 text-center">
        <div>
          <div className="text-shimmer text-8xl font-bold">404</div>
          <p className="mt-4 text-text-muted">This page wandered beyond Infinity.</p>
          <Link to="/" className="mt-7 inline-block rounded-full bg-text px-6 py-3 text-sm font-bold text-bg">
            Back home
          </Link>
        </div>
      </section>
    </>
  );
}
