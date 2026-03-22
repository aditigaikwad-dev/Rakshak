import clsx from 'clsx';

export default function Card({ className, children, hover = false }) {
  return (
    <article
      className={clsx(
        'rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] [box-shadow:var(--surface-shadow)] backdrop-blur',
        hover &&
          'transition duration-300 hover:-translate-y-0.5 hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-2)]',
        className
      )}
    >
      {children}
    </article>
  );
}
